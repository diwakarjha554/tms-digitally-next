'use client';

import { useLayoutEffect, useState, useRef, memo } from 'react';
import { gsap } from 'gsap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  FolderKanban,
  ListTodo,
  Clock,
  PlayCircle,
  CheckCircle2,
  TrendingUp,
  Target,
  Calendar,
  AlertCircle,
  AlertTriangle,
  Loader2,
  CalendarClock,
} from 'lucide-react';

interface MemberDashboardStats {
  overview: {
    assignedProjects: number;
    totalTasks: number;
    completedTasks: number;
    todoTasks: number;
    inProgressTasks: number;
    completionRate: number;
  };
  recentTasks: any[];
  upcomingDeadlines: any[];
}

function MemberDashboard() {
  const [stats, setStats] = useState<MemberDashboardStats | null>(null);
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

      // Counter animation
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
        .from('.tasks-section-animate', { y: 30, opacity: 0, duration: 0.6 }, '-=0.4')
        .from('.deadlines-section-animate', { y: 30, opacity: 0, duration: 0.6 }, '-=0.5')
        .from('.task-item', { x: -30, opacity: 0, duration: 0.5, stagger: 0.08 }, '-=0.3')
        .from('.deadline-item', { x: 30, opacity: 0, duration: 0.5, stagger: 0.08 }, '-=0.8');

      // Hover effects
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'TODO':
        return <Clock className="w-3.5 h-3.5" />;
      case 'IN_PROGRESS':
        return <PlayCircle className="w-3.5 h-3.5" />;
      case 'DONE':
        return <CheckCircle2 className="w-3.5 h-3.5" />;
      default:
        return <Clock className="w-3.5 h-3.5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'TODO':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'DONE':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return <AlertCircle className="w-3 h-3" />;
      case 'MEDIUM':
        return <AlertTriangle className="w-3 h-3" />;
      case 'LOW':
        return <Clock className="w-3 h-3" />;
      default:
        return <Clock className="w-3 h-3" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'LOW':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const formatStatus = (status: string) => {
    return status
      .replace('_', ' ')
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const isUrgent = (dueDate: string) => {
    if (!dueDate) return false;

    const due = new Date(dueDate);
    const today = new Date();

    // Set both to start of day for accurate comparison
    due.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Urgent if due within 2 days (0, 1, or 2 days remaining)
    return diffDays >= 0 && diffDays <= 2;
  };

  const formatDueDate = (dueDate: string) => {
    if (!dueDate) return 'No date';

    const due = new Date(dueDate);
    const today = new Date();

    // Set both to start of day
    due.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Handle different cases
    if (diffDays < 0) {
      const overdueDays = Math.abs(diffDays);
      return `Overdue by ${overdueDays} day${overdueDays > 1 ? 's' : ''}`;
    } else if (diffDays === 0) {
      return 'Due Today';
    } else if (diffDays === 1) {
      return 'Due Tomorrow';
    } else {
      return due.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  if (loading) {
    return (
      <div className="mx-auto px-4 lg:px-8 py-8">
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
      <div className="mx-auto px-4 lg:px-8 py-8">
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
          My Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Track your tasks and progress</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <StatCard
          icon={<FolderKanban className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
          title="My Projects"
          value={stats.overview.assignedProjects}
          subtitle="Assigned to me"
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
      <Card className="completion-card-animate bg-linear-to-r from-green-600 to-emerald-600 dark:from-green-700 dark:to-emerald-700 border-0 text-white mb-8 overflow-hidden relative hover:shadow-lg transition-shadow duration-300">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5" />
                <p className="text-sm font-medium opacity-90">Your Completion Rate</p>
              </div>
              <p className="text-5xl font-bold mt-2 mb-3 stat-number">{stats.overview.completionRate}%</p>
              <p className="text-sm opacity-90 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Keep up the great work!
              </p>
            </div>
            <div className="hidden sm:block">
              <Target className="w-24 h-24 opacity-20" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Tasks */}
        <Card className="tasks-section-animate hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListTodo className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              Recent Tasks
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {stats.recentTasks.length === 0 ? (
              <div className="p-8 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-800">
                    <ListTodo className="w-8 h-8 text-gray-400 dark:text-gray-600" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 font-medium">No tasks assigned yet</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">Your assigned tasks will appear here</p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {stats.recentTasks.map((task) => (
                  <div
                    key={task.id}
                    className="task-item p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer border-l-4 border-transparent hover:border-blue-500"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white flex-1 line-clamp-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        {task.title}
                      </h3>
                      <Badge className={`flex items-center gap-1 text-xs ${getStatusColor(task.status)}`}>
                        {getStatusIcon(task.status)}
                        <span>{formatStatus(task.status)}</span>
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <FolderKanban className="w-3.5 h-3.5" />
                      <span className="truncate">{task.project.name}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge className={`flex items-center gap-1 text-xs ${getPriorityColor(task.priority)}`}>
                        {getPriorityIcon(task.priority)}
                        <span>{task.priority}</span>
                      </Badge>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(task.updatedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card className="deadlines-section-animate hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarClock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              Upcoming Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {stats.upcomingDeadlines.length === 0 ? (
              <div className="p-8 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-800">
                    <Calendar className="w-8 h-8 text-gray-400 dark:text-gray-600" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 font-medium">No upcoming deadlines</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">You're all caught up!</p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {stats.upcomingDeadlines.map((task) => {
                  const urgent = task.dueDate ? isUrgent(task.dueDate) : false;
                  const dueText = task.dueDate ? formatDueDate(task.dueDate) : 'No date';

                  return (
                    <div
                      key={task.id}
                      className={`deadline-item p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer border-r-4 ${
                        urgent
                          ? 'border-red-500 bg-red-50/50 dark:bg-red-900/10'
                          : 'border-transparent hover:border-orange-500'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1 flex-1 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                          {task.title}
                        </h3>
                        {urgent && <Badge className="bg-red-500 text-white text-xs shrink-0">Urgent!</Badge>}
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                        <FolderKanban className="w-3.5 h-3.5" />
                        <span className="truncate">{task.project.name}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <Badge className={`flex items-center gap-1 text-xs ${getPriorityColor(task.priority)}`}>
                          {getPriorityIcon(task.priority)}
                          <span>{task.priority}</span>
                        </Badge>
                        <div
                          className={`flex items-center gap-1.5 text-sm font-medium ${
                            urgent ? 'text-red-600 dark:text-red-400' : 'text-orange-600 dark:text-orange-400'
                          }`}
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{dueText}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Memoized StatCard component
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
      blue: 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20',
      purple: 'border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20',
      yellow: 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20',
      green: 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20',
    };

    return (
      <div className="stat-card-animate">
        <Card
          className={`${
            colorClasses[color as keyof typeof colorClasses]
          } hover:shadow-lg transition-all duration-300 overflow-hidden relative cursor-pointer border`}
          style={{ willChange: 'transform' }}
        >
          <div className={`absolute top-0 right-0 w-24 h-24 bg-${color}-500/10 rounded-full -mr-12 -mt-12`} />
          <CardContent className="p-6 relative z-10">
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

export default memo(MemberDashboard);
