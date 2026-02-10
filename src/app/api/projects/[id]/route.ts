import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, canManageProject } from '@/lib/auth';
import { z } from 'zod';

const updateProjectSchema = z.object({
  name: z.string().min(3).optional(),
  description: z.string().optional(),
  status: z.enum(['ACTIVE', 'ON_HOLD', 'COMPLETED']).optional(),
  managerId: z.uuid().optional().nullable(),
  memberIds: z.array(z.string().uuid()).optional(), // ADD THIS LINE
});

// GET project details (keep same)
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth();
    const { id } = await context.params;

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        owner: { select: { id: true, name: true, email: true, role: true } },
        manager: { select: { id: true, name: true, email: true, role: true } },
        memberships: {
          include: {
            user: { select: { id: true, name: true, email: true, role: true } },
          },
        },
        tasks: {
          include: {
            assignee: { select: { id: true, name: true } },
            createdBy: { select: { id: true, name: true } },
          },
          orderBy: { order: 'asc' },
        },
        _count: { select: { tasks: true, memberships: true } },
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Check access
    const role = (user as any).role;
    const hasAccess =
      role === 'ADMIN' || project.managerId === user.id || project.memberships.some((m) => m.userId === user.id);

    if (!hasAccess) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    return NextResponse.json(project);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH update project (Admin only) - UPDATED
export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth();
    const { id } = await context.params;
    const body = await req.json();

    // Validate input
    const validated = updateProjectSchema.parse(body);

    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Only admin can update projects
    if ((user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Only admins can update projects' }, { status: 403 });
    }

    // Extract memberIds from validated data
    const { memberIds, ...projectData } = validated;

    // Use transaction to update project and members atomically
    const updated = await prisma.$transaction(async (tx) => {
      // 1. Update project basic info
      const updatedProject = await tx.project.update({
        where: { id },
        data: projectData,
      });

      // 2. Handle member updates if memberIds provided
      if (memberIds !== undefined) {
        // Get current members
        const currentMemberships = await tx.projectMembership.findMany({
          where: { projectId: id },
          select: { userId: true },
        });

        const currentMemberIds = currentMemberships.map((m) => m.userId);

        // Find members to add (in new list but not in current)
        const membersToAdd = memberIds.filter((userId) => !currentMemberIds.includes(userId));

        // Find members to remove (in current but not in new list)
        const membersToRemove = currentMemberIds.filter((userId) => !memberIds.includes(userId));

        // Add new members
        if (membersToAdd.length > 0) {
          await tx.projectMembership.createMany({
            data: membersToAdd.map((userId) => ({
              userId,
              projectId: id,
            })),
            skipDuplicates: true,
          });
        }

        // Remove members
        if (membersToRemove.length > 0) {
          await tx.projectMembership.deleteMany({
            where: {
              projectId: id,
              userId: { in: membersToRemove },
            },
          });
        }
      }

      // 3. Fetch updated project with all relations
      return await tx.project.findUnique({
        where: { id },
        include: {
          owner: { select: { id: true, name: true, email: true } },
          manager: { select: { id: true, name: true, email: true } },
          memberships: {
            include: {
              user: { select: { id: true, name: true, email: true, role: true } },
            },
          },
          _count: { select: { tasks: true, memberships: true } },
        },
      });
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: 'updated',
        entity: 'project',
        entityId: id,
        details: JSON.stringify({ ...projectData, membersUpdated: memberIds?.length || 0 }),
        userId: user.id,
        projectId: id,
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('Update project error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE project (Admin only) - keep same
export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth();
    const { id } = await context.params;

    if ((user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Only admins can delete projects' }, { status: 403 });
    }

    await prisma.project.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
