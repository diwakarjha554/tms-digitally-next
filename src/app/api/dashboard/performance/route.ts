import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get('days') || '30');
    const role = (user as any).role;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    let performance: any = {};

    if (role === 'ADMIN') {
      // Admin Performance Overview
      const [taskCompletionTrend, projectProgress, userProductivity] = await Promise.all([
        // Task completion over time
        prisma.$queryRaw`
          SELECT 
            DATE(completed_at) as date,
            COUNT(*) as completed
          FROM tasks
          WHERE completed_at >= ${startDate}
          AND status = 'DONE'
          GROUP BY DATE(completed_at)
          ORDER BY date ASC
        `,

        // Project progress
        prisma.project.findMany({
          include: {
            _count: {
              select: {
                tasks: true,
              },
            },
            tasks: {
              where: { status: 'DONE' },
              select: { id: true },
            },
          },
        }),

        // User productivity
        prisma.user.findMany({
          where: {
            role: { in: ['PROJECT_MANAGER', 'MEMBER'] },
          },
          select: {
            id: true,
            name: true,
            role: true,
            assignedTasks: {
              where: {
                completedAt: { gte: startDate },
                status: 'DONE',
              },
              select: { id: true },
            },
          },
        }),
      ]);

      performance = {
        taskCompletionTrend,
        projectProgress: projectProgress.map((p) => ({
          id: p.id,
          name: p.name,
          totalTasks: p._count.tasks,
          completedTasks: p.tasks.length,
          progress: p._count.tasks > 0 ? Math.round((p.tasks.length / p._count.tasks) * 100) : 0,
        })),
        userProductivity: userProductivity.map((u) => ({
          id: u.id,
          name: u.name,
          role: u.role,
          completedTasks: u.assignedTasks.length,
        })),
      };
    } else if (role === 'PROJECT_MANAGER') {
      // PM Performance
      const [taskCompletionTrend, projectProgress, teamProductivity] = await Promise.all([
        // Tasks completed in managed projects
        prisma.$queryRaw`
          SELECT 
            DATE(t.completed_at) as date,
            COUNT(*) as completed
          FROM tasks t
          JOIN projects p ON t.project_id = p.id
          WHERE t.completed_at >= ${startDate}
          AND t.status = 'DONE'
          AND p.manager_id = ${user.id}
          GROUP BY DATE(t.completed_at)
          ORDER BY date ASC
        `,

        // Managed projects progress
        prisma.project.findMany({
          where: { managerId: user.id },
          include: {
            _count: { select: { tasks: true } },
            tasks: {
              where: { status: 'DONE' },
              select: { id: true },
            },
          },
        }),

        // Team member productivity
        prisma.user.findMany({
          where: {
            projectMemberships: {
              some: {
                project: { managerId: user.id },
              },
            },
          },
          select: {
            id: true,
            name: true,
            assignedTasks: {
              where: {
                project: { managerId: user.id },
                completedAt: { gte: startDate },
                status: 'DONE',
              },
              select: { id: true },
            },
          },
        }),
      ]);

      performance = {
        taskCompletionTrend,
        projectProgress: projectProgress.map((p) => ({
          id: p.id,
          name: p.name,
          totalTasks: p._count.tasks,
          completedTasks: p.tasks.length,
          progress: p._count.tasks > 0 ? Math.round((p.tasks.length / p._count.tasks) * 100) : 0,
        })),
        teamProductivity: teamProductivity.map((u) => ({
          id: u.id,
          name: u.name,
          completedTasks: u.assignedTasks.length,
        })),
      };
    } else {
      // Member Performance
      const [taskCompletionTrend, tasksByStatus, tasksByPriority] = await Promise.all([
        // Personal completion trend
        prisma.$queryRaw`
          SELECT 
            DATE(completed_at) as date,
            COUNT(*) as completed
          FROM tasks
          WHERE completed_at >= ${startDate}
          AND status = 'DONE'
          AND assignee_id = ${user.id}
          GROUP BY DATE(completed_at)
          ORDER BY date ASC
        `,

        // Tasks by status
        prisma.task.groupBy({
          by: ['status'],
          where: { assigneeId: user.id },
          _count: { id: true },
        }),

        // Tasks by priority
        prisma.task.groupBy({
          by: ['priority'],
          where: { assigneeId: user.id },
          _count: { id: true },
        }),
      ]);

      performance = {
        taskCompletionTrend,
        tasksByStatus: tasksByStatus.reduce(
          (acc, item) => {
            acc[item.status] = item._count.id;
            return acc;
          },
          {} as Record<string, number>
        ),
        tasksByPriority: tasksByPriority.reduce(
          (acc, item) => {
            acc[item.priority] = item._count.id;
            return acc;
          },
          {} as Record<string, number>
        ),
      };
    }

    return NextResponse.json(performance);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
