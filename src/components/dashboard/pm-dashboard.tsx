'use client';

import { useLayoutEffect, useState, useRef, memo } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  LayoutDashboard,
  FolderKanban,
  ListTodo,
  Clock,
  PlayCircle,
  CheckCircle2,
  TrendingUp,
  BarChart3,
  Users,
  Activity,
  ArrowRight,
  Loader2,
  AlertCircle,
  Target,
} from 'lucide-react';

interface PMDashboardStats {
  overview: {
    managedProjects: number;
    totalTasks: number;
    completedTasks: number;
    todoTasks: number;
    inProgressTasks: number;
    completionRate: number;
  };
  projects: any[];
  memberPerformance: any[];
  recentActivities: any[];
}

function PMDashboard() {
  const [stats, setStats] = useState<PMDashboardStats | null>(null);
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

  // Use useLayoutEffect for GSAP to prevent flash [web:6][web:9]
  useLayoutEffect(() => {
    if (loading || !stats || hasAnimated.current || !containerRef.current) return;

    hasAnimated.current = true;

    // Create GSAP context for automatic cleanup [web:6][web:9]
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Header animation
      tl.from('.header-animate', {
        y: -30,
        opacity: 0,
        duration: 0.8,
      });

      // Stats cards stagger
      tl.from(
        '.stat-card-animate',
        {
          y: 50,
          opacity: 0,
          duration: 0.6,
          stagger: 0.08,
        },
        '-=0.6'
      );

      // Counter animation with GSAP
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

      // Other sections
      tl.from('.completion-card-animate', { y: 30, opacity: 0, duration: 0.6 }, '-=1.2')
        .from('.projects-section-animate', { y: 30, opacity: 0, duration: 0.6 }, '-=0.4')
        .from('.project-card-animate', { y: 30, opacity: 0, duration: 0.5, stagger: 0.1 }, '-=0.3')
        .from('.team-section-animate', { y: 30, opacity: 0, duration: 0.6 }, '-=0.5')
        .from('.activities-section-animate', { y: 30, opacity: 0, duration: 0.6 }, '-=0.5');

      // Hover effects using GSAP [web:1]
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

    // Cleanup function [web:6][web:9]
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
          Project Manager Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your projects and team</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <StatCard
          icon={<FolderKanban className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
          title="My Projects"
          value={stats.overview.managedProjects}
          subtitle="Managed by me"
          color="blue"
        />
        <StatCard
          icon={<ListTodo className="w-6 h-6 text-purple-600 dark:text-purple-400" />}
          title="Total Tasks"
          value={stats.overview.totalTasks}
          subtitle={`${stats.overview.completedTasks} completed`}
          color="purple"
        />
        <StatCard
          icon={<Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />}
          title="To Do"
          value={stats.overview.todoTasks}
          subtitle="Pending tasks"
          color="yellow"
        />
        <StatCard
          icon={<PlayCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
          title="In Progress"
          value={stats.overview.inProgressTasks}
          subtitle="Active tasks"
          color="blue"
        />
        <StatCard
          icon={<CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />}
          title="Completed"
          value={stats.overview.completedTasks}
          subtitle="Finished tasks"
          color="green"
        />
      </div>

      {/* Completion Rate Card */}
      <Card className="completion-card-animate bg-linear-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 border-0 text-white mb-8 hover:shadow-xs transition-shadow duration-300 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
        <CardContent className="px-6 py-6 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-5 h-5" />
                <p className="text-sm font-medium opacity-90">Overall Completion Rate</p>
              </div>
              <p className="text-5xl font-bold mt-2 mb-3 stat-number">{stats.overview.completionRate}%</p>
              <p className="text-sm opacity-90 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Team performance tracking
              </p>
            </div>
            <div className="hidden sm:block">
              <TrendingUp className="w-24 h-24 opacity-20" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* My Projects */}
      <Card className="projects-section-animate mb-8 hover:shadow-xs transition-shadow duration-300">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FolderKanban className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              My Projects
            </CardTitle>
            <Link href="/projects">
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {stats.projects.length === 0 ? (
            <div className="p-8 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-800">
                  <FolderKanban className="w-8 h-8 text-gray-400 dark:text-gray-600" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 font-medium">No projects assigned yet</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">Create your first project to get started</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.projects.map((project) => (
                <Link key={project.id} href={`/projects/${project.id}`}>
                  <Card className="project-card-animate hover:shadow-md transition-shadow cursor-pointer h-full border-gray-200 dark:border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-2 mb-3">
                        <FolderKanban className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">{project.name}</h3>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                        {project.description || 'No description'}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <ListTodo className="w-3.5 h-3.5" />
                          <span>{project._count.tasks} tasks</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          <span>{project._count.memberships} members</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Team Performance */}
      {stats.memberPerformance.length > 0 && (
        <Card className="team-section-animate mb-8 hover:shadow-xs transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              Team Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Member
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Completed Tasks
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {stats.memberPerformance.map((perf) => (
                    <tr key={perf.member?.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8 ring-2 ring-gray-100 dark:ring-gray-700">
                            <AvatarFallback className="bg-linear-to-br from-blue-500 to-indigo-600 text-white text-xs font-semibold">
                              {perf.member?.name?.[0]?.toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{perf.member?.name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{perf.member?.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-base px-3 py-1">
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          {perf.completedTasks}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activities */}
      {stats.recentActivities.length > 0 && (
        <Card className="activities-section-animate hover:shadow-xs transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {stats.recentActivities.slice(0, 10).map((activity) => (
                <div key={activity.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 dark:text-white mb-1">
                        <span className="font-semibold">{activity.user.name}</span>{' '}
                        <span className="text-gray-600 dark:text-gray-400">{activity.action}</span>{' '}
                        <span className="font-medium">{activity.entity}</span>
                      </p>
                      {activity.project && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                          <FolderKanban className="w-3 h-3" />
                          <span className="truncate">Project: {activity.project.name}</span>
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {new Date(activity.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Memoized StatCard component to prevent unnecessary re-renders [web:7]
const StatCard = memo(
  ({
    icon,
    title,
    value,
    subtitle,
    color,
  }: {
    icon: React.ReactNode;
    title: string;
    value: number;
    subtitle: string;
    color: string;
  }) => {
    const colorClasses = {
      blue: 'border-blue-200 dark:border-blue-800 bg-blue-100 dark:bg-blue-900/30',
      purple: 'border-purple-200 dark:border-purple-800 bg-purple-100 dark:bg-purple-900/30',
      yellow: 'border-yellow-200 dark:border-yellow-800 bg-yellow-100 dark:bg-yellow-900/30',
      green: 'border-green-200 dark:border-green-800 bg-green-100 dark:bg-green-900/30',
    };

    return (
      <div className="stat-card-animate">
        <Card
          className={`${
            colorClasses[color as keyof typeof colorClasses]
          } hover:shadow-xs transition-shadow duration-300 overflow-hidden relative cursor-pointer`}
          style={{ willChange: 'transform' }}
        >
          <div className={`absolute top-0 right-0 w-24 h-24 bg-${color}-500/10 rounded-full -mr-12 -mt-12`} />
          <CardContent className="px-6 relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 ${colorClasses[color as keyof typeof colorClasses]} rounded-lg`}>{icon}</div>
            </div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white stat-number">{value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{subtitle}</p>
          </CardContent>
        </Card>
      </div>
    );
  }
);

StatCard.displayName = 'StatCard';

export default memo(PMDashboard);
