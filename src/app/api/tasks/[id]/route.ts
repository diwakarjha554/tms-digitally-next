import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { z } from 'zod';

const updateTaskSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).optional(),
  assigneeId: z.uuid().optional().nullable(),
  dueDate: z.string().optional().nullable(),
  order: z.number().optional(),
});

// GET single task
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
    const { id } = await context.params;

    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            managerId: true,
            ownerId: true,
          },
        },
        assignee: { select: { id: true, name: true, email: true } },
        createdBy: { select: { id: true, name: true, email: true } },
      },
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH update task
export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth();
    const { id } = await context.params;
    const body = await req.json();
    const validated = updateTaskSchema.parse(body);
    const role = (user as any).role;

    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            managerId: true,
            ownerId: true,
          },
        },
      },
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Permission check
    const canUpdate =
      role === 'ADMIN' ||
      (role === 'PROJECT_MANAGER' && task.project.managerId === user.id) ||
      (role === 'MEMBER' && task.assigneeId === user.id);

    if (!canUpdate) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Members can only update status and description
    if (role === 'MEMBER') {
      const allowedFields = ['status', 'description'];
      const requestedFields = Object.keys(validated);
      const hasDisallowedFields = requestedFields.some((field) => !allowedFields.includes(field));

      if (hasDisallowedFields) {
        return NextResponse.json({ error: 'Members can only update status and description' }, { status: 403 });
      }
    }

    // Track if status changed to DONE
    const isCompleted = validated.status === 'DONE' && task.status !== 'DONE';

    const updated = await prisma.task.update({
      where: { id },
      data: {
        ...validated,
        ...(validated.dueDate ? { dueDate: new Date(validated.dueDate) } : {}),
        ...(isCompleted ? { completedAt: new Date() } : {}),
      },
      include: {
        project: { select: { id: true, name: true } },
        assignee: { select: { id: true, name: true } },
        createdBy: { select: { id: true, name: true } },
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: isCompleted ? 'completed' : 'updated',
        entity: 'task',
        entityId: id,
        details: JSON.stringify({
          taskTitle: updated.title,
          changes: validated,
        }),
        userId: user.id,
        projectId: updated.projectId,
        taskId: id,
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE task (Admin or PM only)
export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth();
    const { id } = await context.params;
    const role = (user as any).role;

    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        project: {
          select: { managerId: true, ownerId: true },
        },
      },
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Only Admin or PM can delete
    const canDelete = role === 'ADMIN' || (role === 'PROJECT_MANAGER' && task.project.managerId === user.id);

    if (!canDelete) {
      return NextResponse.json({ error: 'Only Admin or Project Manager can delete tasks' }, { status: 403 });
    }

    await prisma.task.delete({
      where: { id },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: 'deleted',
        entity: 'task',
        entityId: id,
        details: JSON.stringify({ taskTitle: task.title }),
        userId: user.id,
        projectId: task.projectId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
