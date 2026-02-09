import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function DashboardPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/login');
  }

  const [projects, recentTasks, stats] = await Promise.all([
    prisma.project.findMany({
      where: {
        OR: [
          { ownerId: session.user.id },
          { memberships: { some: { userId: session.user.id } } },
        ],
      },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        owner: { select: { name: true } },
        _count: { select: { tasks: true } },
      },
    }),
    prisma.task.findMany({
      where: {
        OR: [
          { assigneeId: session.user.id },
          { createdById: session.user.id },
        ],
      },
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        project: { select: { name: true } },
        assignee: { select: { name: true } },
      },
    }),
    Promise.all([
      prisma.project.count({
        where: {
          OR: [
            { ownerId: session.user.id },
            { memberships: { some: { userId: session.user.id } } },
          ],
        },
      }),
      prisma.task.count(),
      prisma.task.count({ where: { status: 'TODO' } }),
      prisma.task.count({ where: { status: 'IN_PROGRESS' } }),
      prisma.task.count({ where: { status: 'DONE' } }),
    ]),
  ]);

  const [projectCount, taskCount, todoCount, inProgressCount, doneCount] = stats;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {session.user.name}!</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm font-medium text-gray-600">Projects</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{projectCount}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm font-medium text-gray-600">Total Tasks</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{taskCount}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm font-medium text-gray-600">Todo</p>
            <p className="text-3xl font-bold text-yellow-600 mt-2">{todoCount}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm font-medium text-gray-600">In Progress</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{inProgressCount}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm font-medium text-gray-600">Done</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{doneCount}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Projects */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Recent Projects</h2>
              <Link
                href="/projects"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View all →
              </Link>
            </div>
            <div className="divide-y divide-gray-200">
              {projects.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No projects yet. Create your first project!
                </div>
              ) : (
                projects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className="block p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{project.name}</h3>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                          {project.description}
                        </p>
                      </div>
                      <div className="ml-4 text-right">
                        <span
                          className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                            project.status === 'ACTIVE'
                              ? 'bg-green-100 text-green-800'
                              : project.status === 'ON_HOLD'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {project.status}
                        </span>
                        <p className="text-sm text-gray-500 mt-1">
                          {project._count.tasks} tasks
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Recent Tasks */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">My Recent Tasks</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {recentTasks.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No tasks assigned yet.
                </div>
              ) : (
                recentTasks.map((task) => (
                  <div key={task.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{task.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{task.project.name}</p>
                      </div>
                      <span
                        className={`ml-4 px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
                          task.status === 'TODO'
                            ? 'bg-yellow-100 text-yellow-800'
                            : task.status === 'IN_PROGRESS'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {task.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
