import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { projectSchema } from '@/lib/validations';

export async function GET(req: NextRequest) {
    try {
        const user = await requireAuth();

        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status');

        const projects = await prisma.project.findMany({
            where: {
                ...(status && status !== 'all' ? { status: status as any } : {}),
                OR: [
                    { ownerId: user.id },
                    { memberships: { some: { userId: user.id } } },
                ],
            },
            include: {
                owner: { select: { id: true, name: true, email: true } },
                _count: { select: { tasks: true, memberships: true } },
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(projects);
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Failed to fetch projects' },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const user = await requireAuth();
        const body = await req.json();

        const validated = projectSchema.parse(body);

        const project = await prisma.project.create({
            data: {
                ...validated,
                ownerId: user.id,
            },
            include: {
                owner: { select: { id: true, name: true, email: true } },
                _count: { select: { tasks: true, memberships: true } },
            },
        });

        return NextResponse.json(project, { status: 201 });
    } catch (error: any) {
        if (error.name === 'ZodError') {
            return NextResponse.json(
                { error: 'Validation failed', details: error.errors },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { error: error.message || 'Failed to create project' },
            { status: 500 }
        );
    }
}
