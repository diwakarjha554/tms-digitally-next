import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { z } from 'zod';

const updateTaskSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().optional().nullable(),
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
    console.error('Get task error:', error);
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

    let updateData: any = {};

    // Members can only update status and description
    if (role === 'MEMBER') {
      const allowedFields = ['status', 'description'];
      const requestedFields = Object.keys(validated);
      const hasDisallowedFields = requestedFields.some((field) => !allowedFields.includes(field));

      if (hasDisallowedFields) {
        return NextResponse.json({ error: 'Members can only update status and description' }, { status: 403 });
      }

      // Only add allowed fields
      if (validated.status !== undefined) updateData.status = validated.status;
      if (validated.description !== undefined) updateData.description = validated.description;
    } else {
      // Admin and PM can update all fields
      if (validated.title !== undefined) updateData.title = validated.title;
      if (validated.description !== undefined) updateData.description = validated.description;
      if (validated.priority !== undefined) updateData.priority = validated.priority;
      if (validated.status !== undefined) updateData.status = validated.status;
      if (validated.assigneeId !== undefined) updateData.assigneeId = validated.assigneeId;
      if (validated.order !== undefined) updateData.order = validated.order;

      if (validated.dueDate !== undefined) {
        if (validated.dueDate === null || validated.dueDate === '') {
          updateData.dueDate = null;
        } else {
          try {
            // Parse date string (expected format: YYYY-MM-DD)
            const [year, month, day] = validated.dueDate.split('-').map(Number);
            // Create date at noon UTC to avoid timezone conversion issues
            updateData.dueDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
          } catch (error) {
            console.error('Date parsing error:', error);
            // Fallback to direct parsing if split fails
            updateData.dueDate = new Date(validated.dueDate);
          }
        }
      }
    }

    // Track if status changed to DONE
    const isCompleted = validated.status === 'DONE' && task.status !== 'DONE';
    if (isCompleted) {
      updateData.completedAt = new Date();
    }

    // Track if status changed from DONE to something else
    const isReopened = task.status === 'DONE' && validated.status && validated.status !== 'DONE';
    if (isReopened) {
      updateData.completedAt = null;
    }

    const updated = await prisma.task.update({
      where: { id },
      data: updateData,
      include: {
        project: { select: { id: true, name: true } },
        assignee: { select: { id: true, name: true, email: true } },
        createdBy: { select: { id: true, name: true, email: true } },
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: isCompleted ? 'completed' : isReopened ? 'reopened' : 'updated',
        entity: 'task',
        entityId: id,
        details: JSON.stringify({
          taskTitle: updated.title,
          changes: updateData,
          updatedBy: user.id,
        }),
        userId: user.id,
        projectId: updated.projectId,
        taskId: id,
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('Update task error:', error);
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
        details: JSON.stringify({
          taskTitle: task.title,
          deletedBy: user.id,
        }),
        userId: user.id,
        projectId: task.projectId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete task error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
