import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// GET single user by ID
export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Only allow users to view their own profile or admins to view any profile
    if (session.user.id !== user.id && (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

// PATCH (Update) user profile
export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;

    // Only allow users to update their own profile or admins to update any profile
    if (session.user.id !== id && (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { name, email } = body;

    // Validate input
    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    // Check if email is already taken by another user
    if (email !== session.user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser && existingUser.id !== id) {
        return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
      }
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    console.error('Error updating user:', error);

    // Handle Prisma errors
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

// DELETE user (optional - for admins only)
export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admins can delete users
    if ((session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const { id } = await context.params;

    // Prevent self-deletion
    if (session.user.id === id) {
      return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
    }

    // Soft delete - set isActive to false
    await prisma.user.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting user:', error);

    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
