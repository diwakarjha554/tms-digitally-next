'use client';

import { useLayoutEffect, useState, useRef, memo } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import RecentProjects from './recent-projects';
import RecentTasks from './recent-tasks';
import {
  LayoutDashboard,
  FolderKanban,
  CheckCircle2,
  TrendingUp,
  Users,
  Loader2,
  AlertCircle,
  Plus,
  UserCog,
  Folders,
  Activity,
  ListTodo,
  Clock,
  PlayCircle,
  CheckCircle,
  BarChart3,
} from 'lucide-react';

interface DashboardStats {
  overview: {
    totalProjects: number;
    activeProjects: number;
    totalTasks: number;
    completedTasks: number;
    completionRate: number;
    totalUsers: number;
    activeUsers: number;
  };
  projectsByStatus: Record<string, number>;
  tasksByPriority: Record<string, number>;
  tasksByStatus: Record<string, number>;
  projectTaskDistribution: Array<{
    projectId: string;
    projectName: string;
    totalTasks: number;
    todoTasks: number;
    inProgressTasks: number;
    completedTasks: number;
    completionRate: number;
  }>;
  recentProjects: any[];
  recentTasks: any[];
}

function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useLayoutEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/dashboard/stats');
        if (!res.ok) throw new Error('Failed to fetch stats');
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  useLayoutEffect(() => {
    if (loading || !stats || hasAnimated.current || !containerRef.current) return;

    hasAnimated.current = true;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from('.header-animate', {
        y: -30,
        opacity: 0,
        duration: 0.8,
      });

      tl.from(
        '.stat-card-animate',
        {
          y: 50,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
        },
        '-=0.6'
      );

      const statNumbers = containerRef.current?.querySelectorAll('.stat-number');
      statNumbers?.forEach((element) => {
        const textContent = element.textContent || '0';
        const finalValue = parseInt(textContent.replace(/[^0-9]/g, '')) || 0;
        const hasPercent = textContent.includes('%');

        if (finalValue === 0) return;

        gsap.from(element, {
          textContent: 0,
          duration: 1.5,
          ease: 'power2.out',
          snap: { textContent: 1 },
          onUpdate: function () {
            const currentValue = Math.ceil(gsap.getProperty(this.targets()[0], 'textContent') as number);
            element.textContent = hasPercent ? `${currentValue}%` : currentValue.toString();
          },
        });
      });

      tl.from('.middle-card-animate', { y: 30, opacity: 0, duration: 0.6, stagger: 0.15 }, '-=1.2');
      tl.from('.bottom-section-animate', { y: 30, opacity: 0, duration: 0.6, stagger: 0.2 }, '-=0.5');

      const statCards = containerRef.current?.querySelectorAll('.stat-card-animate');
      statCards?.forEach((card) => {
        card.addEventListener('mouseenter', () => {
          gsap.to(card, { y: -8, duration: 0.3, ease: 'power2.out' });
        });
        card.addEventListener('mouseleave', () => {
          gsap.to(card, { y: 0, duration: 0.3, ease: 'power2.out' });
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [loading, stats]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 dark:text-blue-400" />
            <p className="text-gray-600 dark:text-gray-400 font-medium">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="max-w-md w-full">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center gap-4">
                <AlertCircle className="w-12 h-12 text-red-500" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Failed to Load Dashboard</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Unable to fetch dashboard statistics. Please try again.
                  </p>
                </div>
                <Button onClick={() => window.location.reload()} variant="outline">
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="mx-auto px-4 lg:px-8 py-8">
      {/* Header */}
      <div className="header-animate mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <LayoutDashboard className="w-8 h-8" />
          Admin Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Overview of all projects and users</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<FolderKanban className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
          title="Total Projects"
          value={stats.overview.totalProjects}
          subtitle={`${stats.overview.activeProjects} active`}
          color="blue"
        />
        <StatCard
          icon={<CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />}
          title="Total Tasks"
          value={stats.overview.totalTasks}
          subtitle={`${stats.overview.completedTasks} completed`}
          color="green"
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />}
          title="Completion Rate"
          value={stats.overview.completionRate}
          subtitle="Overall progress"
          color="purple"
          isPercentage
        />
        <StatCard
          icon={<Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />}
          title="Total Users"
          value={stats.overview.totalUsers}
          subtitle={`${stats.overview.activeUsers} active`}
          color="indigo"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        {/* Projects by Status */}
        <Card className="middle-card-animate hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              Projects by Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <StatusItem
                color="bg-green-500"
                label="Active"
                count={stats.projectsByStatus.ACTIVE || 0}
                bgClass="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              />
              <StatusItem
                color="bg-yellow-500"
                label="On Hold"
                count={stats.projectsByStatus.ON_HOLD || 0}
                bgClass="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
              />
              <StatusItem
                color="bg-gray-500"
                label="Completed"
                count={stats.projectsByStatus.COMPLETED || 0}
                bgClass="bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="middle-card-animate hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ListTodo className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              Tasks by Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <StatusItem
                icon={<Clock className="w-3.5 h-3.5" />}
                color="bg-yellow-500"
                label="To Do"
                count={stats.tasksByStatus?.TODO || 0}
                bgClass="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
              />
              <StatusItem
                icon={<PlayCircle className="w-3.5 h-3.5" />}
                color="bg-blue-500"
                label="In Progress"
                count={stats.tasksByStatus?.IN_PROGRESS || 0}
                bgClass="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
              />
              <StatusItem
                icon={<CheckCircle className="w-3.5 h-3.5" />}
                color="bg-green-500"
                label="Done"
                count={stats.tasksByStatus?.DONE || 0}
                bgClass="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              />
            </div>
          </CardContent>
        </Card>

        {/* Tasks by Priority */}
        <Card className="middle-card-animate hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              Tasks by Priority
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <StatusItem
                color="bg-red-500"
                label="High Priority"
                count={stats.tasksByPriority.HIGH || 0}
                bgClass="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              />
              <StatusItem
                color="bg-yellow-500"
                label="Medium Priority"
                count={stats.tasksByPriority.MEDIUM || 0}
                bgClass="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
              />
              <StatusItem
                color="bg-green-500"
                label="Low Priority"
                count={stats.tasksByPriority.LOW || 0}
                bgClass="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              />
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="middle-card-animate bg-linear-to-br from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 border-0 text-white hover:shadow-lg transition-shadow duration-300 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
          <CardHeader className="relative z-10">
            <CardTitle className="text-white flex items-center gap-2 text-base">
              <Activity className="w-5 h-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="flex flex-col gap-3">
              <Link href="/projects/new">
                <Button
                  variant="secondary"
                  className="w-full justify-start bg-white/20 hover:bg-white/30 text-white border-0 transition-all duration-200"
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Project
                </Button>
              </Link>
              <Link href="/admin/users">
                <Button
                  variant="secondary"
                  className="w-full justify-start bg-white/20 hover:bg-white/30 text-white border-0 transition-all duration-200"
                  size="sm"
                >
                  <UserCog className="w-4 h-4 mr-2" />
                  Manage Users
                </Button>
              </Link>
              <Link href="/projects">
                <Button
                  variant="secondary"
                  className="w-full justify-start bg-white/20 hover:bg-white/30 text-white border-0 transition-all duration-200"
                  size="sm"
                >
                  <Folders className="w-4 h-4 mr-2" />
                  View All Projects
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {stats.projectTaskDistribution && stats.projectTaskDistribution.length > 0 && (
        <Card className="bottom-section-animate mb-8 hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              Project-wise Task Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Project
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      To Do
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      In Progress
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Completed
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Progress
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {stats.projectTaskDistribution.map((project) => (
                    <tr
                      key={project.projectId}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          href={`/projects/${project.projectId}`}
                          className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          <FolderKanban className="w-4 h-4" />
                          {project.projectName}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <Badge className="bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400">
                          {project.totalTasks}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                          {project.todoTasks}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                          {project.inProgressTasks}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          {project.completedTasks}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-green-600 dark:bg-green-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${project.completionRate}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-400 w-10">
                            {project.completionRate}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Projects & Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bottom-section-animate">
          <RecentProjects projects={stats.recentProjects} />
        </div>
        <div className="bottom-section-animate">
          <RecentTasks tasks={stats.recentTasks} />
        </div>
      </div>
    </div>
  );
}

const StatusItem = memo(
  ({
    icon,
    color,
    label,
    count,
    bgClass,
  }: {
    icon?: React.ReactNode;
    color: string;
    label: string;
    count: number;
    bgClass: string;
  }) => (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200">
      <div className="flex items-center gap-2">
        {icon ? (
          <div className={`${bgClass} rounded p-1`}>{icon}</div>
        ) : (
          <div className={`w-2 h-2 rounded-full ${color}`} />
        )}
        <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
      </div>
      <Badge className={bgClass}>{count}</Badge>
    </div>
  )
);

StatusItem.displayName = 'StatusItem';

// Memoized StatCard component
const StatCard = memo(
  ({
    icon,
    title,
    value,
    subtitle,
    color,
    isPercentage = false,
  }: {
    icon: React.ReactNode;
    title: string;
    value: number;
    subtitle: string;
    color: string;
    isPercentage?: boolean;
  }) => {
    const colorClasses = {
      blue: 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20',
      green: 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20',
      purple: 'border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20',
      indigo: 'border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/20',
      yellow: 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20',
    };

    return (
      <div className="stat-card-animate">
        <Card
          className={`${
            colorClasses[color as keyof typeof colorClasses]
          } hover:shadow-lg transition-shadow duration-300 overflow-hidden relative cursor-pointer border-2`}
          style={{ willChange: 'transform' }}
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12" />
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full -ml-8 -mb-8" />
          <CardContent className="px-6 relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg`}>{icon}</div>
            </div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white stat-number">
              {value}
              {isPercentage && '%'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{subtitle}</p>
          </CardContent>
        </Card>
      </div>
    );
  }
);

StatCard.displayName = 'StatCard';

export default memo(AdminDashboard);
