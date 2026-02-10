import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth();
    const role = (user as any).role;

    let stats: any = {};

    if (role === 'ADMIN') {
      // Admin Dashboard Stats
      const [
        totalProjects,
        activeProjects,
        totalTasks,
        completedTasks,
        totalUsers,
        activeUsers,
        projectsByStatus,
        tasksByPriority,
        tasksByStatus,
        recentProjects,
        recentTasks,
      ] = await Promise.all([
        prisma.project.count(),
        prisma.project.count({ where: { status: 'ACTIVE' } }),
        prisma.task.count(),
        prisma.task.count({ where: { status: 'DONE' } }),
        prisma.user.count(),
        prisma.user.count({ where: { isActive: true } }),

        prisma.project.groupBy({
          by: ['status'],
          _count: { id: true },
        }),

        prisma.task.groupBy({
          by: ['priority'],
          _count: { id: true },
        }),

        prisma.task.groupBy({
          by: ['status'],
          _count: { id: true },
        }),

        prisma.project.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            manager: { select: { name: true } },
            _count: { select: { tasks: true, memberships: true } },
          },
        }),

        prisma.task.findMany({
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            project: { select: { name: true } },
            assignee: { select: { name: true } },
          },
        }),
      ]);

      const projectTaskDistribution = await prisma.project.findMany({
        where: {
          tasks: {
            some: {},
          },
        },
        select: {
          id: true,
          name: true,
          tasks: {
            select: {
              status: true,
            },
          },
        },
        take: 10,
        orderBy: {
          createdAt: 'desc',
        },
      });

      const distribution = projectTaskDistribution.map((project) => {
        const totalTasks = project.tasks.length;
        const todoTasks = project.tasks.filter((t) => t.status === 'TODO').length;
        const inProgressTasks = project.tasks.filter((t) => t.status === 'IN_PROGRESS').length;
        const completedTasks = project.tasks.filter((t) => t.status === 'DONE').length;
        const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        return {
          projectId: project.id,
          projectName: project.name,
          totalTasks,
          todoTasks,
          inProgressTasks,
          completedTasks,
          completionRate,
        };
      });

      stats = {
        overview: {
          totalProjects,
          activeProjects,
          totalTasks,
          completedTasks,
          completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
          totalUsers,
          activeUsers,
        },
        projectsByStatus: projectsByStatus.reduce(
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
        tasksByStatus: tasksByStatus.reduce(
          (acc, item) => {
            acc[item.status] = item._count.id;
            return acc;
          },
          {} as Record<string, number>
        ),
        projectTaskDistribution: distribution,
        recentProjects,
        recentTasks,
      };
    } else if (role === 'PROJECT_MANAGER') {
      // Project Manager Dashboard Stats
      const [
        managedProjects,
        totalTasks,
        completedTasks,
        todoTasks,
        inProgressTasks,
        tasksByStatus,
        tasksByProject,
        memberPerformance,
        recentActivities,
      ] = await Promise.all([
        prisma.project.findMany({
          where: { managerId: user.id },
          include: {
            _count: { select: { tasks: true, memberships: true } },
          },
        }),

        prisma.task.count({
          where: {
            project: { managerId: user.id },
          },
        }),

        prisma.task.count({
          where: {
            project: { managerId: user.id },
            status: 'DONE',
          },
        }),

        prisma.task.count({
          where: {
            project: { managerId: user.id },
            status: 'TODO',
          },
        }),

        prisma.task.count({
          where: {
            project: { managerId: user.id },
            status: 'IN_PROGRESS',
          },
        }),

        prisma.task.groupBy({
          by: ['status'],
          where: {
            project: { managerId: user.id },
          },
          _count: { id: true },
        }),

        prisma.task.groupBy({
          by: ['projectId', 'status'],
          where: {
            project: { managerId: user.id },
          },
          _count: { id: true },
        }),

        prisma.task.groupBy({
          by: ['assigneeId'],
          where: {
            project: { managerId: user.id },
            status: 'DONE',
            assigneeId: { not: null },
          },
          _count: { id: true },
        }),

        prisma.activityLog.findMany({
          where: {
            project: { managerId: user.id },
          },
          take: 20,
          orderBy: { createdAt: 'desc' },
          include: {
            user: { select: { name: true } },
            project: { select: { name: true } },
          },
        }),
      ]);

      const memberIds = memberPerformance.map((m) => m.assigneeId).filter(Boolean) as string[];

      const members = await prisma.user.findMany({
        where: { id: { in: memberIds } },
        select: { id: true, name: true, email: true },
      });

      const memberStats = memberPerformance.map((perf) => {
        const member = members.find((m) => m.id === perf.assigneeId);
        return {
          member,
          completedTasks: perf._count.id,
        };
      });

      const projectTaskDistribution = managedProjects.map((project) => {
        const projectTasks = tasksByProject.filter((t) => t.projectId === project.id);
        const totalTasks = project._count.tasks;
        const todoTasks = projectTasks.find((t) => t.status === 'TODO')?._count.id || 0;
        const inProgressTasks = projectTasks.find((t) => t.status === 'IN_PROGRESS')?._count.id || 0;
        const completedTasks = projectTasks.find((t) => t.status === 'DONE')?._count.id || 0;
        const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        return {
          projectId: project.id,
          projectName: project.name,
          totalTasks,
          todoTasks,
          inProgressTasks,
          completedTasks,
          completionRate,
        };
      });

      stats = {
        overview: {
          managedProjects: managedProjects.length,
          totalTasks,
          completedTasks,
          todoTasks,
          inProgressTasks,
          completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
        },
        projects: managedProjects,
        tasksByStatus: tasksByStatus.reduce(
          (acc, item) => {
            acc[item.status] = item._count.id;
            return acc;
          },
          {} as Record<string, number>
        ),
        tasksByProject,
        projectTaskDistribution,
        memberPerformance: memberStats,
        recentActivities,
      };
    } else {
      const [
        assignedProjects,
        totalTasks,
        completedTasks,
        todoTasks,
        inProgressTasks,
        tasksByPriority,
        tasksByStatus,
        recentTasks,
        upcomingDeadlines,
      ] = await Promise.all([
        prisma.projectMembership.count({
          where: { userId: user.id },
        }),

        prisma.task.count({
          where: { assigneeId: user.id },
        }),

        prisma.task.count({
          where: {
            assigneeId: user.id,
            status: 'DONE',
          },
        }),

        prisma.task.count({
          where: {
            assigneeId: user.id,
            status: 'TODO',
          },
        }),

        prisma.task.count({
          where: {
            assigneeId: user.id,
            status: 'IN_PROGRESS',
          },
        }),

        prisma.task.groupBy({
          by: ['priority'],
          where: { assigneeId: user.id },
          _count: { id: true },
        }),

        prisma.task.groupBy({
          by: ['status'],
          where: { assigneeId: user.id },
          _count: { id: true },
        }),

        prisma.task.findMany({
          where: { assigneeId: user.id },
          take: 10,
          orderBy: { updatedAt: 'desc' },
          include: {
            project: { select: { name: true } },
          },
        }),

        prisma.task.findMany({
          where: {
            assigneeId: user.id,
            status: { not: 'DONE' },
            dueDate: { not: null }, // Has a due date
          },
          orderBy: { dueDate: 'asc' },
          take: 10,
          include: {
            project: { select: { name: true } },
          },
        }),
      ]);

      const memberProjects = await prisma.project.findMany({
        where: {
          OR: [{ memberships: { some: { userId: user.id } } }, { tasks: { some: { assigneeId: user.id } } }],
        },
        select: {
          id: true,
          name: true,
          tasks: {
            where: { assigneeId: user.id },
            select: { status: true },
          },
        },
        take: 10,
      });

      const projectTaskDistribution = memberProjects
        .filter((project) => project.tasks.length > 0)
        .map((project) => {
          const totalTasks = project.tasks.length;
          const todoTasks = project.tasks.filter((t) => t.status === 'TODO').length;
          const inProgressTasks = project.tasks.filter((t) => t.status === 'IN_PROGRESS').length;
          const completedTasks = project.tasks.filter((t) => t.status === 'DONE').length;
          const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

          return {
            projectId: project.id,
            projectName: project.name,
            totalTasks,
            todoTasks,
            inProgressTasks,
            completedTasks,
            completionRate,
          };
        });

      stats = {
        overview: {
          assignedProjects,
          totalTasks,
          completedTasks,
          todoTasks,
          inProgressTasks,
          completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
        },
        tasksByPriority: tasksByPriority.reduce(
          (acc, item) => {
            acc[item.priority] = item._count.id;
            return acc;
          },
          {} as Record<string, number>
        ),
        tasksByStatus: tasksByStatus.reduce(
          (acc, item) => {
            acc[item.status] = item._count.id;
            return acc;
          },
          {} as Record<string, number>
        ),
        projectTaskDistribution,
        recentTasks,
        upcomingDeadlines,
      };
    }

    return NextResponse.json(stats);
  } catch (error: any) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
