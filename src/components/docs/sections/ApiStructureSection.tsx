'use client';

import { Server, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function ApiStructureSection() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const CodeBlock = ({ code, id }: { code: string; id: string }) => (
    <div className="relative group">
      <div className="absolute top-3 right-3 z-10">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => copyToClipboard(code, id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 hover:bg-gray-700 text-white"
        >
          {copiedCode === id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </Button>
      </div>
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto border border-gray-800">
        <code className="text-sm">{code}</code>
      </pre>
    </div>
  );

  return (
    <section id="api-structure" className="docs-section scroll-mt-24">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-gray-900 dark:text-white">
        <Server className="w-8 h-8 text-purple-600" />
        API Structure
      </h2>

      <div className="space-y-6">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          TaskFlow uses <strong>Next.js 16 App Router API Routes</strong> with role-based access control and Zod
          validation.
        </p>

        {/* API Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">15+</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">API Endpoints</div>
          </div>
          <div className="bg-linear-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">3</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">User Roles</div>
          </div>
          <div className="bg-linear-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">Zod</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Schema Validation</div>
          </div>
        </div>

        {/* API Routes */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">API Endpoints</h3>
          <div className="space-y-6">
            {/* Authentication */}
            <div>
              <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                Authentication
              </h4>
              <div className="space-y-2 ml-4">
                <div className="flex items-center gap-3 text-sm flex-wrap">
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded font-mono text-xs">
                    POST
                  </span>
                  <code className="text-gray-700 dark:text-gray-300">/api/register</code>
                  <span className="text-gray-500 text-xs">→ Create new account</span>
                </div>
                <div className="flex items-center gap-3 text-sm flex-wrap">
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded font-mono text-xs">
                    GET
                  </span>
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded font-mono text-xs">
                    POST
                  </span>
                  <code className="text-gray-700 dark:text-gray-300">/api/auth/[...nextauth]</code>
                  <span className="text-gray-500 text-xs">→ Auth.js handlers</span>
                </div>
                <div className="flex items-center gap-3 text-sm flex-wrap">
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded font-mono text-xs">
                    POST
                  </span>
                  <code className="text-gray-700 dark:text-gray-300">/api/change-password</code>
                  <span className="text-gray-500 text-xs">→ Change user password</span>
                </div>
              </div>
            </div>

            {/* Admin - User Management */}
            <div>
              <h4 className="font-semibold text-red-600 dark:text-red-400 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-600"></span>
                Admin - User Management
              </h4>
              <div className="space-y-2 ml-4">
                <div className="flex items-center gap-3 text-sm flex-wrap">
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded font-mono text-xs">
                    GET
                  </span>
                  <code className="text-gray-700 dark:text-gray-300">/api/admin/users</code>
                  <span className="text-gray-500 text-xs">→ List all users (Admin)</span>
                </div>
                <div className="flex items-center gap-3 text-sm flex-wrap">
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded font-mono text-xs">
                    POST
                  </span>
                  <code className="text-gray-700 dark:text-gray-300">/api/admin/users</code>
                  <span className="text-gray-500 text-xs">→ Create user (Admin)</span>
                </div>
                <div className="flex items-center gap-3 text-sm flex-wrap">
                  <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded font-mono text-xs">
                    PATCH
                  </span>
                  <code className="text-gray-700 dark:text-gray-300">/api/admin/users/[id]</code>
                  <span className="text-gray-500 text-xs">→ Update user role (Admin)</span>
                </div>
                <div className="flex items-center gap-3 text-sm flex-wrap">
                  <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded font-mono text-xs">
                    DELETE
                  </span>
                  <code className="text-gray-700 dark:text-gray-300">/api/admin/users/[id]</code>
                  <span className="text-gray-500 text-xs">→ Delete user (Admin)</span>
                </div>
              </div>
            </div>

            {/* Projects */}
            <div>
              <h4 className="font-semibold text-purple-600 dark:text-purple-400 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                Projects
              </h4>
              <div className="space-y-2 ml-4">
                <div className="flex items-center gap-3 text-sm flex-wrap">
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded font-mono text-xs">
                    GET
                  </span>
                  <code className="text-gray-700 dark:text-gray-300">/api/projects</code>
                  <span className="text-gray-500 text-xs">→ List projects (role-based)</span>
                </div>
                <div className="flex items-center gap-3 text-sm flex-wrap">
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded font-mono text-xs">
                    POST
                  </span>
                  <code className="text-gray-700 dark:text-gray-300">/api/projects</code>
                  <span className="text-gray-500 text-xs">→ Create project (Admin)</span>
                </div>
                <div className="flex items-center gap-3 text-sm flex-wrap">
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded font-mono text-xs">
                    GET
                  </span>
                  <code className="text-gray-700 dark:text-gray-300">/api/projects/[id]</code>
                  <span className="text-gray-500 text-xs">→ Project details</span>
                </div>
                <div className="flex items-center gap-3 text-sm flex-wrap">
                  <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded font-mono text-xs">
                    PATCH
                  </span>
                  <code className="text-gray-700 dark:text-gray-300">/api/projects/[id]</code>
                  <span className="text-gray-500 text-xs">→ Update project (Admin)</span>
                </div>
                <div className="flex items-center gap-3 text-sm flex-wrap">
                  <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded font-mono text-xs">
                    DELETE
                  </span>
                  <code className="text-gray-700 dark:text-gray-300">/api/projects/[id]</code>
                  <span className="text-gray-500 text-xs">→ Delete project (Admin)</span>
                </div>
                <div className="flex items-center gap-3 text-sm flex-wrap">
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded font-mono text-xs">
                    POST
                  </span>
                  <code className="text-gray-700 dark:text-gray-300">/api/projects/[id]/members</code>
                  <span className="text-gray-500 text-xs">→ Add member (Admin)</span>
                </div>
                <div className="flex items-center gap-3 text-sm flex-wrap">
                  <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded font-mono text-xs">
                    DELETE
                  </span>
                  <code className="text-gray-700 dark:text-gray-300">/api/projects/[id]/members</code>
                  <span className="text-gray-500 text-xs">→ Remove member (Admin)</span>
                </div>
              </div>
            </div>

            {/* Tasks */}
            <div>
              <h4 className="font-semibold text-green-600 dark:text-green-400 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-600"></span>
                Tasks
              </h4>
              <div className="space-y-2 ml-4">
                <div className="flex items-center gap-3 text-sm flex-wrap">
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded font-mono text-xs">
                    GET
                  </span>
                  <code className="text-gray-700 dark:text-gray-300">/api/tasks</code>
                  <span className="text-gray-500 text-xs">→ List tasks (role-based filtering)</span>
                </div>
                <div className="flex items-center gap-3 text-sm flex-wrap">
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded font-mono text-xs">
                    POST
                  </span>
                  <code className="text-gray-700 dark:text-gray-300">/api/tasks</code>
                  <span className="text-gray-500 text-xs">→ Create task (Admin/PM)</span>
                </div>
                <div className="flex items-center gap-3 text-sm flex-wrap">
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded font-mono text-xs">
                    GET
                  </span>
                  <code className="text-gray-700 dark:text-gray-300">/api/tasks/[id]</code>
                  <span className="text-gray-500 text-xs">→ Task details</span>
                </div>
                <div className="flex items-center gap-3 text-sm flex-wrap">
                  <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded font-mono text-xs">
                    PATCH
                  </span>
                  <code className="text-gray-700 dark:text-gray-300">/api/tasks/[id]</code>
                  <span className="text-gray-500 text-xs">→ Update task (role-dependent)</span>
                </div>
                <div className="flex items-center gap-3 text-sm flex-wrap">
                  <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded font-mono text-xs">
                    DELETE
                  </span>
                  <code className="text-gray-700 dark:text-gray-300">/api/tasks/[id]</code>
                  <span className="text-gray-500 text-xs">→ Delete task (Admin/PM)</span>
                </div>
              </div>
            </div>

            {/* Dashboard & Analytics */}
            <div>
              <h4 className="font-semibold text-orange-600 dark:text-orange-400 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-600"></span>
                Dashboard & Analytics
              </h4>
              <div className="space-y-2 ml-4">
                <div className="flex items-center gap-3 text-sm flex-wrap">
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded font-mono text-xs">
                    GET
                  </span>
                  <code className="text-gray-700 dark:text-gray-300">/api/stats</code>
                  <span className="text-gray-500 text-xs">→ Dashboard statistics (role-based)</span>
                </div>
                <div className="flex items-center gap-3 text-sm flex-wrap">
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded font-mono text-xs">
                    GET
                  </span>
                  <code className="text-gray-700 dark:text-gray-300">/api/performance</code>
                  <span className="text-gray-500 text-xs">→ Performance metrics (role-based)</span>
                </div>
                <div className="flex items-center gap-3 text-sm flex-wrap">
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded font-mono text-xs">
                    GET
                  </span>
                  <code className="text-gray-700 dark:text-gray-300">/api/activities</code>
                  <span className="text-gray-500 text-xs">→ Activity logs (role-based)</span>
                </div>
              </div>
            </div>

            {/* Users */}
            <div>
              <h4 className="font-semibold text-indigo-600 dark:text-indigo-400 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                Users
              </h4>
              <div className="space-y-2 ml-4">
                <div className="flex items-center gap-3 text-sm flex-wrap">
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded font-mono text-xs">
                    GET
                  </span>
                  <code className="text-gray-700 dark:text-gray-300">/api/users</code>
                  <span className="text-gray-500 text-xs">→ List users (filtered)</span>
                </div>
                <div className="flex items-center gap-3 text-sm flex-wrap">
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded font-mono text-xs">
                    GET
                  </span>
                  <code className="text-gray-700 dark:text-gray-300">/api/users/[id]</code>
                  <span className="text-gray-500 text-xs">→ User profile</span>
                </div>
                <div className="flex items-center gap-3 text-sm flex-wrap">
                  <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded font-mono text-xs">
                    PATCH
                  </span>
                  <code className="text-gray-700 dark:text-gray-300">/api/users/[id]</code>
                  <span className="text-gray-500 text-xs">→ Update profile</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Role-Based Access */}
        <div className="bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-xl border border-purple-200 dark:border-purple-800">
          <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Role-Based Access Control</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-red-200 dark:border-red-800">
              <h4 className="font-semibold text-red-600 mb-2">ADMIN</h4>
              <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                <li>• Full CRUD on all resources</li>
                <li>• User management</li>
                <li>• Project creation & deletion</li>
                <li>• Member assignment</li>
              </ul>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold text-blue-600 mb-2">PROJECT_MANAGER</h4>
              <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                <li>• View managed projects</li>
                <li>• Create/update/delete tasks</li>
                <li>• Assign tasks to members</li>
                <li>• View team performance</li>
              </ul>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="font-semibold text-green-600 mb-2">MEMBER</h4>
              <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                <li>• View assigned projects</li>
                <li>• View & update own tasks</li>
                <li>• Update task status</li>
                <li>• Limited dashboard view</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Example: Task API */}
        <div>
          <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Example: Create Task (Admin/PM Only)</h3>
          <CodeBlock
            id="create-task"
            code={`// app/api/tasks/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { z } from 'zod';

const taskSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']),
  projectId: z.string().uuid(),
  assigneeId: z.string().uuid().optional().nullable(),
  dueDate: z.string().optional().nullable(),
});

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await req.json();
    const validated = taskSchema.parse(body);
    const role = (user as any).role;

    // Get project to check permissions
    const project = await prisma.project.findUnique({
      where: { id: validated.projectId },
      select: { id: true, managerId: true },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Check if user can create tasks
    const canCreate =
      role === 'ADMIN' ||
      (role === 'PROJECT_MANAGER' && project.managerId === user.id);

    if (!canCreate) {
      return NextResponse.json(
        { error: 'Only Admin or Project Manager can create tasks' },
        { status: 403 }
      );
    }

    // Create task
    const task = await prisma.task.create({
      data: {
        ...validated,
        createdById: user.id,
        ...(validated.dueDate ? { dueDate: new Date(validated.dueDate) } : {}),
      },
      include: {
        project: { select: { name: true } },
        assignee: { select: { name: true } },
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
      { error: error.message },
      { status: 500 }
    );
  }
}`}
          />
        </div>

        {/* Auth Helper */}
        <div>
          <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Auth Helper Functions</h3>
          <CodeBlock
            id="auth-helpers"
            code={`// lib/auth.ts
import { auth } from '@/auth';

export async function getCurrentUser() {
  const session = await auth();
  return session?.user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}

export async function requireAdmin() {
  const user = await requireAuth();
  if ((user as any).role !== 'ADMIN') {
    throw new Error('Forbidden - Admin access required');
  }
  return user;
}

export async function requireAdminOrPM() {
  const user = await requireAuth();
  const role = (user as any).role;
  if (role !== 'ADMIN' && role !== 'PROJECT_MANAGER') {
    throw new Error('Forbidden - Admin or Project Manager access required');
  }
  return user;
}

export function canManageProject(user: any, project: any): boolean {
  return user.role === 'ADMIN' || (user.role === 'PROJECT_MANAGER' && project.managerId === user.id);
}

export function canManageTasks(user: any, project: any): boolean {
  return canManageProject(user, project);
}
`}
          />
        </div>

        {/* Error Responses */}
        <div className="bg-linear-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 p-6 rounded-xl border border-red-200 dark:border-red-800">
          <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">HTTP Status Codes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-start gap-2">
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded font-mono text-xs">
                200
              </span>
              <span className="text-gray-700 dark:text-gray-300">Success (GET, PATCH)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded font-mono text-xs">
                201
              </span>
              <span className="text-gray-700 dark:text-gray-300">Created (POST)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded font-mono text-xs">
                400
              </span>
              <span className="text-gray-700 dark:text-gray-300">Bad Request (validation)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded font-mono text-xs">
                401
              </span>
              <span className="text-gray-700 dark:text-gray-300">Unauthorized (no auth)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded font-mono text-xs">
                403
              </span>
              <span className="text-gray-700 dark:text-gray-300">Forbidden (no permission)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded font-mono text-xs">
                404
              </span>
              <span className="text-gray-700 dark:text-gray-300">Not Found</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded font-mono text-xs">
                409
              </span>
              <span className="text-gray-700 dark:text-gray-300">Conflict (duplicate email)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded font-mono text-xs">
                500
              </span>
              <span className="text-gray-700 dark:text-gray-300">Internal Server Error</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
