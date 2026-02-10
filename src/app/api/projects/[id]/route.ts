import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, canManageProject } from '@/lib/auth';
import { z } from 'zod';

const updateProjectSchema = z.object({
  name: z.string().min(3).optional(),
  description: z.string().optional(),
  status: z.enum(['ACTIVE', 'ON_HOLD', 'COMPLETED']).optional(),
  managerId: z.uuid().optional().nullable(),
});

// GET project details
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

// PATCH update project (Admin only)
export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth();
    const { id } = await context.params;
    const body = await req.json();
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

    const updated = await prisma.project.update({
      where: { id },
      data: validated,
      include: {
        owner: { select: { id: true, name: true, email: true } },
        manager: { select: { id: true, name: true, email: true } },
        _count: { select: { tasks: true, memberships: true } },
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: 'updated',
        entity: 'project',
        entityId: id,
        details: JSON.stringify(validated),
        userId: user.id,
        projectId: id,
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE project (Admin only)
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
