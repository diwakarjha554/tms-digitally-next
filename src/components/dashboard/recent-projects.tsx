'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  FolderKanban,
  ArrowRight,
  CheckCircle,
  Clock,
  Pause,
  Users,
  ListChecks,
  UserCircle,
  Briefcase,
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string | null;
  status: string;
  _count: {
    tasks: number;
    memberships: number;
  };
  manager?: {
    name: string | null;
  };
}

export default function RecentProjects({ projects }: { projects: Project[] }) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <CheckCircle className="w-3.5 h-3.5" />;
      case 'ON_HOLD':
        return <Pause className="w-3.5 h-3.5" />;
      case 'COMPLETED':
        return <CheckCircle className="w-3.5 h-3.5" />;
      default:
        return <Clock className="w-3.5 h-3.5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'ON_HOLD':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
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
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            Recent Projects
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {projects.length === 0 ? (
            <div className="p-8 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-800">
                  <FolderKanban className="w-8 h-8 text-gray-400 dark:text-gray-600" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 font-medium">No projects yet</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">Create your first project to get started</p>
              </div>
            </div>
          ) : (
            projects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="block p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Left side - Project info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1 flex items-center gap-2">
                      <FolderKanban className="w-4 h-4 shrink-0 text-blue-600 dark:text-blue-400" />
                      {project.name}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-1">
                      {project.description || 'No description'}
                    </p>

                    {/* Manager and members info */}
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                      {/* Project Manager */}
                      {project.manager && (
                        <div className="flex items-center gap-1.5">
                          <Avatar className="w-5 h-5 ring-2 ring-gray-100 dark:ring-gray-700">
                            <AvatarFallback className="bg-linear-to-br from-blue-500 to-indigo-600 text-white text-[10px] font-semibold">
                              {project.manager.name?.[0]?.toUpperCase() || 'P'}
                            </AvatarFallback>
                          </Avatar>
                          <span className="truncate">{project.manager.name}</span>
                        </div>
                      )}

                      {/* Members count */}
                      <div className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        <span>
                          {project._count.memberships} member{project._count.memberships !== 1 ? 's' : ''}
                        </span>
                      </div>

                      {/* Tasks count */}
                      <div className="flex items-center gap-1">
                        <ListChecks className="w-3.5 h-3.5" />
                        <span>
                          {project._count.tasks} task{project._count.tasks !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right side - Status badge */}
                  <div className="shrink-0">
                    <Badge className={`flex items-center gap-1 text-xs ${getStatusColor(project.status)}`}>
                      {getStatusIcon(project.status)}
                      <span>{formatStatus(project.status)}</span>
                    </Badge>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
