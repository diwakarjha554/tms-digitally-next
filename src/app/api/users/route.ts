import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role'); // filter by role
    const projectId = searchParams.get('projectId'); // get users for specific project

    let where: any = {
      isActive: true,
    };

    // Filter by role if provided
    if (role && ['ADMIN', 'PROJECT_MANAGER', 'MEMBER'].includes(role)) {
      where.role = role;
    }

    // If projectId provided, exclude users already in project
    if (projectId) {
      const existingMembers = await prisma.projectMembership.findMany({
        where: { projectId },
        select: { userId: true },
      });

      const existingUserIds = existingMembers.map((m) => m.userId);

      where.id = {
        notIn: existingUserIds,
      };
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(users);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
