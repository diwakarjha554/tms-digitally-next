import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { taskSchema } from '@/lib/validations';

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth();
    
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');
    const status = searchParams.get('status');

    const tasks = await prisma.task.findMany({
      where: {
        ...(projectId ? { projectId } : {}),
        ...(status && status !== 'all' ? { status: status as any } : {}),
        project: {
          OR: [
            { ownerId: user.id },
            { memberships: { some: { userId: user.id } } },
          ],
        },
      },
      include: {
        project: { select: { id: true, name: true } },
        assignee: { select: { id: true, name: true } },
        createdBy: { select: { id: true, name: true } },
      },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json(tasks);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await req.json();
    
    const validated = taskSchema.parse(body);

    // Verify user has access to project
    const project = await prisma.project.findFirst({
      where: {
        id: validated.projectId,
        OR: [
          { ownerId: user.id },
          { memberships: { some: { userId: user.id } } },
        ],
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found or access denied' },
        { status: 403 }
      );
    }

    // Get max order for new task
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
        assignee: { select: { id: true, name: true } },
        createdBy: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message || 'Failed to create task' },
      { status: 500 }
    );
  }
}
