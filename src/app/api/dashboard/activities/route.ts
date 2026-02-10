import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const projectId = searchParams.get('projectId');
    const role = (user as any).role;

    let where: any = {};

    // Role-based filtering
    if (role === 'ADMIN') {
      // Admin sees all activities
      if (projectId) {
        where.projectId = projectId;
      }
    } else if (role === 'PROJECT_MANAGER') {
      // PM sees activities in their projects
      where.project = { managerId: user.id };
      if (projectId) {
        where.projectId = projectId;
      }
    } else {
      // Member sees activities related to their tasks
      where.OR = [{ userId: user.id }, { task: { assigneeId: user.id } }];
      if (projectId) {
        where.projectId = projectId;
      }
    }

    const activities = await prisma.activityLog.findMany({
      where,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        task: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return NextResponse.json(activities);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
