import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, requireAdmin } from '@/lib/auth';
import { z } from 'zod';

const projectSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  status: z.enum(['ACTIVE', 'ON_HOLD', 'COMPLETED']),
  managerId: z.string().uuid().optional().nullable(),
  memberIds: z.array(z.string().uuid()).optional(),
});

// GET all projects (role-based filtering)
export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth();
    const role = (user as any).role;

    let projects;

    if (role === 'ADMIN') {
      // Admin sees all projects
      projects = await prisma.project.findMany({
        include: {
          owner: { select: { id: true, name: true, email: true, role: true } },
          manager: { select: { id: true, name: true, email: true, role: true } },
          _count: { select: { tasks: true, memberships: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
    } else if (role === 'PROJECT_MANAGER') {
      // PM sees projects they manage
      projects = await prisma.project.findMany({
        where: { managerId: user.id },
        include: {
          owner: { select: { id: true, name: true, email: true, role: true } },
          manager: { select: { id: true, name: true, email: true, role: true } },
          _count: { select: { tasks: true, memberships: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
    } else {
      // Member sees projects they're assigned to
      projects = await prisma.project.findMany({
        where: {
          memberships: { some: { userId: user.id } },
        },
        include: {
          owner: { select: { id: true, name: true, email: true, role: true } },
          manager: { select: { id: true, name: true, email: true, role: true } },
          _count: { select: { tasks: true, memberships: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(projects);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST create project (Admin only)
export async function POST(req: NextRequest) {
  try {
    const user = await requireAdmin();
    const body = await req.json();
    const validated = projectSchema.parse(body);

    const { memberIds, ...projectData } = validated;

    const project = await prisma.project.create({
      data: {
        ...projectData,
        ownerId: user.id,
      },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        manager: { select: { id: true, name: true, email: true } },
        _count: { select: { tasks: true, memberships: true } },
      },
    });

    // Assign members if provided
    if (memberIds && memberIds.length > 0) {
      await prisma.projectMembership.createMany({
        data: memberIds.map((memberId) => ({
          userId: memberId,
          projectId: project.id,
        })),
      });
    }

    // Create activity log
    await prisma.activityLog.create({
      data: {
        action: 'created',
        entity: 'project',
        entityId: project.id,
        details: JSON.stringify({ projectName: project.name }),
        userId: user.id,
        projectId: project.id,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
}
