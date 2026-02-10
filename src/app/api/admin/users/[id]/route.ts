import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { z } from 'zod';

const updateUserSchema = z.object({
  role: z.enum(['ADMIN', 'PROJECT_MANAGER', 'MEMBER']).optional(),
  isActive: z.boolean().optional(),
  name: z.string().min(2).optional(),
});

// PATCH update user
export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const currentUser = await requireAdmin();
    const { id } = await context.params;
    const body = await req.json();
    const validated = updateUserSchema.parse(body);

    // Prevent self-deletion/demotion
    if (id === currentUser.id) {
      return NextResponse.json({ error: 'Cannot modify your own account' }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id },
      data: validated,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    return NextResponse.json(user);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE user
export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const currentUser = await requireAdmin();
    const { id } = await context.params;

    // Prevent self-deletion
    if (id === currentUser.id) {
      return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
    }

    // Check if user is admin
    const userToDelete = await prisma.user.findUnique({
      where: { id },
      select: { role: true },
    });

    if (!userToDelete) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // If deleting an admin, check if at least 1 admin will remain
    if (userToDelete.role === 'ADMIN') {
      const adminCount = await prisma.user.count({
        where: { role: 'ADMIN' },
      });

      if (adminCount <= 1) {
        return NextResponse.json(
          { error: 'Cannot delete the last admin. At least one admin must exist.' },
          { status: 400 }
        );
      }
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
