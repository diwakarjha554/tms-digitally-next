import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { z } from 'zod';

const addMemberSchema = z.object({
  userId: z.string().uuid(),
});

// POST add member (Admin only)
export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth();
    const { id: projectId } = await context.params;
    const body = await req.json();
    const validated = addMemberSchema.parse(body);

    if ((user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Only admins can assign members' }, { status: 403 });
    }

    // Check if already assigned
    const existing = await prisma.projectMembership.findUnique({
      where: {
        userId_projectId: {
          userId: validated.userId,
          projectId,
        },
      },
    });

    if (existing) {
      return NextResponse.json({ error: 'User already assigned to this project' }, { status: 400 });
    }

    const membership = await prisma.projectMembership.create({
      data: {
        userId: validated.userId,
        projectId,
      },
      include: {
        user: { select: { id: true, name: true, email: true, role: true } },
      },
    });

    return NextResponse.json(membership, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE remove member (Admin only)
export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth();
    const { id: projectId } = await context.params;
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    if ((user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Only admins can remove members' }, { status: 403 });
    }

    await prisma.projectMembership.delete({
      where: {
        userId_projectId: {
          userId,
          projectId,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
