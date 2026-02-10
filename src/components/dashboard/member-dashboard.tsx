'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import StatsCard from './stats-card';
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

export default function MemberDashboard() {
  const [stats, setStats] = useState<MemberDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
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
    <div className="mx-auto px-4 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <LayoutDashboard className="w-8 h-8" />
          My Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Track your tasks and progress</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <StatsCard
          title="My Projects"
          value={stats.overview.assignedProjects}
          subtitle="Assigned to me"
          icon={FolderKanban}
          color="blue"
        />
        <StatsCard
          title="Total Tasks"
          value={stats.overview.totalTasks}
          subtitle={`${stats.overview.completedTasks} completed`}
          icon={ListTodo}
          color="purple"
        />
        <StatsCard
          title="To Do"
          value={stats.overview.todoTasks}
          subtitle="Pending tasks"
          icon={Clock}
          color="yellow"
        />
        <StatsCard
          title="In Progress"
          value={stats.overview.inProgressTasks}
          subtitle="Active tasks"
          icon={PlayCircle}
          color="blue"
        />
        <StatsCard
          title="Completed"
          value={stats.overview.completedTasks}
          subtitle="Finished tasks"
          icon={CheckCircle2}
          color="green"
        />
      </div>

      {/* Completion Rate Card */}
      <Card className="bg-linear-to-r from-green-600 to-emerald-600 dark:from-green-700 dark:to-emerald-700 border-0 text-white mb-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5" />
                <p className="text-sm font-medium opacity-90">Your Completion Rate</p>
              </div>
              <p className="text-5xl font-bold mt-2 mb-3">{stats.overview.completionRate}%</p>
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
        <Card>
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
                  <div key={task.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white flex-1 line-clamp-1">{task.title}</h3>
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
        <Card>
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
                {stats.upcomingDeadlines.map((task) => (
                  <div key={task.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">{task.title}</h3>

                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <FolderKanban className="w-3.5 h-3.5" />
                      <span className="truncate">{task.project.name}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge className={`flex items-center gap-1 text-xs ${getPriorityColor(task.priority)}`}>
                        {getPriorityIcon(task.priority)}
                        <span>{task.priority}</span>
                      </Badge>
                      <div className="flex items-center gap-1.5 text-sm font-medium text-red-600 dark:text-red-400">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>
                          Due:{' '}
                          {new Date(task.dueDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
