import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { z } from 'zod';

const taskSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']),
  projectId: z.string().uuid(),
  assigneeId: z.string().uuid().optional().nullable(),
  dueDate: z.string().optional().nullable(),
});

// GET tasks (role-based filtering)
export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');
    const status = searchParams.get('status');
    const role = (user as any).role;

    let where: any = {};

    // Filter by project if provided
    if (projectId) {
      where.projectId = projectId;
    }

    // Filter by status if provided
    if (status && status !== 'all') {
      where.status = status;
    }

    // Role-based filtering
    if (role === 'ADMIN') {
      // Admin sees all tasks
    } else if (role === 'PROJECT_MANAGER') {
      // PM sees tasks in projects they manage
      where.project = {
        managerId: user.id,
      };
    } else {
      // Member sees only their assigned tasks
      where.assigneeId = user.id;
    }

    const tasks = await prisma.task.findMany({
      where,
      include: {
        project: { select: { id: true, name: true } },
        assignee: { select: { id: true, name: true, email: true } },
        createdBy: { select: { id: true, name: true } },
      },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json(tasks);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST create task (Admin or PM only)
export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await req.json();
    const validated = taskSchema.parse(body);
    const role = (user as any).role;

    // Get project to check permissions
    const project = await prisma.project.findUnique({
      where: { id: validated.projectId },
      select: { id: true, managerId: true, ownerId: true },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Check if user can create tasks
    const canCreate = role === 'ADMIN' || (role === 'PROJECT_MANAGER' && project.managerId === user.id);

    if (!canCreate) {
      return NextResponse.json({ error: 'Only Admin or Project Manager can create tasks' }, { status: 403 });
    }

    // Get max order for this project and status
    const maxOrder = await prisma.task.findFirst({
      where: { projectId: validated.projectId, status: validated.status },
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    const task = await prisma.task.create({
      data: {
        ...validated,
        createdById: user.id,
        order: (maxOrder?.order || 0) + 1,
        ...(validated.dueDate ? { dueDate: new Date(validated.dueDate) } : {}),
      },
      include: {
        project: { select: { id: true, name: true } },
        assignee: { select: { id: true, name: true, email: true } },
        createdBy: { select: { id: true, name: true } },
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: 'created',
        entity: 'task',
        entityId: task.id,
        details: JSON.stringify({
          taskTitle: task.title,
          projectName: task.project.name,
          assigneeName: task.assignee?.name,
        }),
        userId: user.id,
        projectId: validated.projectId,
        taskId: task.id,
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
