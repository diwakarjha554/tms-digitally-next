'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import StatsCard from './stats-card';
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
  recentProjects: any[];
  recentTasks: any[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
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
          Admin Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Overview of all projects and users</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Projects"
          value={stats.overview.totalProjects}
          subtitle={`${stats.overview.activeProjects} active`}
          icon={FolderKanban}
          color="blue"
        />
        <StatsCard
          title="Total Tasks"
          value={stats.overview.totalTasks}
          subtitle={`${stats.overview.completedTasks} completed`}
          icon={CheckCircle2}
          color="green"
        />
        <StatsCard
          title="Completion Rate"
          value={`${stats.overview.completionRate}%`}
          subtitle="Overall progress"
          icon={TrendingUp}
          color="purple"
        />
        <StatsCard
          title="Total Users"
          value={stats.overview.totalUsers}
          subtitle={`${stats.overview.activeUsers} active`}
          icon={Users}
          color="indigo"
        />
      </div>

      {/* Projects by Status, Tasks by Priority, Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Projects by Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              Projects by Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Active</span>
                </div>
                <Badge
                  variant="default"
                  className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                >
                  {stats.projectsByStatus.ACTIVE || 0}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">On Hold</span>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                >
                  {stats.projectsByStatus.ON_HOLD || 0}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Completed</span>
                </div>
                <Badge variant="outline">{stats.projectsByStatus.COMPLETED || 0}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tasks by Priority */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              Tasks by Priority
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">High Priority</span>
                </div>
                <Badge variant="destructive" className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                  {stats.tasksByPriority.HIGH || 0}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Medium Priority</span>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                >
                  {stats.tasksByPriority.MEDIUM || 0}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Low Priority</span>
                </div>
                <Badge
                  variant="default"
                  className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                >
                  {stats.tasksByPriority.LOW || 0}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-linear-to-br from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 border-0 text-white">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <Link href="/projects/new">
                <Button
                  variant="secondary"
                  className="w-full justify-start bg-white/20 hover:bg-white/30 text-white border-0"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Project
                </Button>
              </Link>
              <Link href="/admin/users">
                <Button
                  variant="secondary"
                  className="w-full justify-start bg-white/20 hover:bg-white/30 text-white border-0"
                >
                  <UserCog className="w-4 h-4 mr-2" />
                  Manage Users
                </Button>
              </Link>
              <Link href="/projects">
                <Button
                  variant="secondary"
                  className="w-full justify-start bg-white/20 hover:bg-white/30 text-white border-0"
                >
                  <Folders className="w-4 h-4 mr-2" />
                  View All Projects
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Projects & Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecentProjects projects={stats.recentProjects} />
        <RecentTasks tasks={stats.recentTasks} />
      </div>
    </div>
  );
}
