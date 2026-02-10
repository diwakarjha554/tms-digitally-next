'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Activity,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  UserPlus,
  FileText,
  Loader2,
  AlertCircle,
  FolderKanban,
  Clock,
  Crown,
  Briefcase,
  User,
} from 'lucide-react';

interface ActivityLog {
  id: string;
  action: string;
  entity: string;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    role: string;
  };
  project: {
    id: string;
    name: string;
  } | null;
}

export default function ActivityLogs() {
  const { data: session } = useSession();
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(false);

  const role = (session?.user as any)?.role;
  const isAdmin = role === 'ADMIN';

  useEffect(() => {
    fetchActivities();
  }, [page]);

  async function fetchActivities() {
    try {
      if (page > 1) setLoadingMore(true);

      const res = await fetch(`/api/dashboard/activities?page=${page}&limit=20`);
      if (!res.ok) throw new Error('Failed to fetch activities');

      const data = await res.json();

      if (data.length < 20) {
        setHasMore(false);
      }

      setActivities((prev) => [...prev, ...data]);
    } catch (error) {
      console.error('Failed to fetch activities:', error);
      setError(true);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  function getActionIcon(action: string) {
    const actionLower = action.toLowerCase();
    if (actionLower.includes('created')) return <Plus className="w-5 h-5" />;
    if (actionLower.includes('updated') || actionLower.includes('changed')) return <Edit className="w-5 h-5" />;
    if (actionLower.includes('deleted')) return <Trash2 className="w-5 h-5" />;
    if (actionLower.includes('completed')) return <CheckCircle2 className="w-5 h-5" />;
    if (actionLower.includes('assigned')) return <UserPlus className="w-5 h-5" />;
    return <FileText className="w-5 h-5" />;
  }

  function getActionColor(action: string) {
    const actionLower = action.toLowerCase();
    if (actionLower.includes('created')) return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
    if (actionLower.includes('updated') || actionLower.includes('changed'))
      return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20';
    if (actionLower.includes('deleted')) return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
    if (actionLower.includes('completed'))
      return 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20';
    if (actionLower.includes('assigned'))
      return 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20';
    return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20';
  }

  function getRoleIcon(role: string) {
    switch (role) {
      case 'ADMIN':
        return <Crown className="w-3 h-3" />;
      case 'PROJECT_MANAGER':
        return <Briefcase className="w-3 h-3" />;
      default:
        return <User className="w-3 h-3" />;
    }
  }

  function getRoleBadgeVariant(role: string): 'default' | 'secondary' | 'outline' {
    switch (role) {
      case 'ADMIN':
        return 'default';
      case 'PROJECT_MANAGER':
        return 'secondary';
      default:
        return 'outline';
    }
  }

  function formatTimeAgo(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  if (loading && activities.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 dark:text-blue-400" />
            <p className="text-gray-600 dark:text-gray-400 font-medium">Loading activities...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="max-w-md w-full">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center gap-4">
                <AlertCircle className="w-12 h-12 text-red-500" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Failed to Load Activities
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Unable to fetch activity logs. Please try again.
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
          <Activity className="w-8 h-8" />
          Activity Logs
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {isAdmin ? 'All system activities' : 'Your recent activities'}
        </p>
      </div>

      {/* Activity Feed */}
      <Card>
        <CardContent className="p-0">
          {activities.length === 0 ? (
            <div className="p-12 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-800">
                  <Activity className="w-12 h-12 text-gray-400 dark:text-gray-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No activities yet</h3>
                <p className="text-gray-600 dark:text-gray-400">Activities will appear here as you use the system</p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {activities.map((activity, index) => (
                <div
                  key={`${activity.id}-${index}`}
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    {/* Action Icon */}
                    <div className={`p-2 rounded-lg shrink-0 ${getActionColor(activity.action)}`}>
                      {getActionIcon(activity.action)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          {/* User Avatar and Info */}
                          <div className="flex items-center gap-2 mb-2">
                            <Avatar className="w-6 h-6 ring-2 ring-gray-100 dark:ring-gray-700">
                              <AvatarFallback className="bg-linear-to-br from-blue-500 to-indigo-600 text-white text-xs font-semibold">
                                {activity.user.name?.[0]?.toUpperCase() || activity.user.email[0]?.toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-semibold text-gray-900 dark:text-white text-sm">
                              {activity.user.name || activity.user.email}
                            </span>
                            {isAdmin && (
                              <Badge
                                variant={getRoleBadgeVariant(activity.user.role)}
                                className="flex items-center gap-1 text-xs"
                              >
                                {getRoleIcon(activity.user.role)}
                                <span>{activity.user.role}</span>
                              </Badge>
                            )}
                          </div>

                          {/* Action Description */}
                          <p className="text-sm text-gray-900 dark:text-white mb-2">
                            <span className="text-gray-600 dark:text-gray-400">{activity.action}</span>{' '}
                            <span className="font-semibold">{activity.entity}</span>
                          </p>

                          {/* Project Info */}
                          {activity.project && (
                            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                              <FolderKanban className="w-3 h-3" />
                              <span className="truncate">Project: {activity.project.name}</span>
                            </div>
                          )}
                        </div>

                        {/* Timestamp */}
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                          <Clock className="w-3 h-3" />
                          <span>{formatTimeAgo(activity.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Load More Button */}
          {hasMore && activities.length > 0 && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-center">
              <Button
                onClick={() => setPage(page + 1)}
                disabled={loadingMore}
                variant="outline"
                className="w-full sm:w-auto"
              >
                {loadingMore ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Load More'
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
