'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  CheckCircle2,
  Clock,
  PlayCircle,
  AlertCircle,
  AlertTriangle,
  User,
  FolderKanban,
  ListTodo,
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  project: {
    name: string;
  };
  assignee: {
    name: string | null;
    email?: string;
  } | null;
}

export default function RecentTasks({ tasks }: { tasks: Task[] }) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'TODO':
        return <Clock className="w-4 h-4" />;
      case 'IN_PROGRESS':
        return <PlayCircle className="w-4 h-4" />;
      case 'DONE':
        return <CheckCircle2 className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusVariant = (status: string): 'default' | 'secondary' | 'outline' => {
    switch (status) {
      case 'TODO':
        return 'secondary';
      case 'IN_PROGRESS':
        return 'default';
      case 'DONE':
        return 'outline';
      default:
        return 'secondary';
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ListTodo className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          Recent Tasks
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {tasks.length === 0 ? (
            <div className="p-8 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-800">
                  <ListTodo className="w-8 h-8 text-gray-400 dark:text-gray-600" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 font-medium">No tasks yet</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">Tasks will appear here once created</p>
              </div>
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Left side - Task info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">{task.title}</h3>

                    {/* Project name */}
                    <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <FolderKanban className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{task.project.name}</span>
                    </div>

                    {/* Assignee */}
                    {task.assignee && (
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6 ring-2 ring-gray-100 dark:ring-gray-700">
                          <AvatarFallback className="bg-linear-to-br from-blue-500 to-indigo-600 text-white text-xs font-semibold">
                            {task.assignee.name?.[0]?.toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {task.assignee.name || 'Unassigned'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Right side - Status and Priority badges */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <Badge
                      variant={getStatusVariant(task.status)}
                      className="flex items-center gap-1 whitespace-nowrap"
                    >
                      {getStatusIcon(task.status)}
                      <span className="text-xs">{formatStatus(task.status)}</span>
                    </Badge>

                    <Badge className={`flex items-center gap-1 text-xs ${getPriorityColor(task.priority)}`}>
                      {getPriorityIcon(task.priority)}
                      <span>{task.priority}</span>
                    </Badge>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
