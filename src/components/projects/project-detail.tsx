'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import TaskBoard from '@/components/tasks/task-board';
import {
  FolderKanban,
  ArrowLeft,
  Edit,
  CheckCircle2,
  Pause,
  Users,
  ListChecks,
  Briefcase,
  Shield,
  User,
  Loader2,
  AlertCircle,
  UserCircle,
} from 'lucide-react';

interface ProjectData {
  id: string;
  name: string;
  description: string | null;
  status: 'ACTIVE' | 'ON_HOLD' | 'COMPLETED';
  owner: {
    id: string;
    name: string | null;
    email: string;
    role: string;
  };
  manager: {
    id: string;
    name: string | null;
    email: string;
    role: string;
  } | null;
  memberships: Array<{
    user: {
      id: string;
      name: string | null;
      email: string;
      role: string;
    };
  }>;
  tasks: any[];
  _count: {
    tasks: number;
    memberships: number;
  };
}

export default function ProjectDetail({ projectId }: { projectId: string }) {
  const { data: session } = useSession();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const role = (session?.user as any)?.role;
  const userId = (session?.user as any)?.id;

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  async function fetchProject() {
    try {
      const res = await fetch(`/api/projects/${projectId}`);

      if (!res.ok) {
        throw new Error('Project not found');
      }

      const data = await res.json();
      setProject(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'ON_HOLD':
        return <Pause className="w-4 h-4" />;
      case 'COMPLETED':
        return <CheckCircle2 className="w-4 h-4" />;
      default:
        return <CheckCircle2 className="w-4 h-4" />;
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

  const getRoleIcon = (userRole: string) => {
    switch (userRole) {
      case 'Admin':
        return <Shield className="w-4 h-4" />;
      case 'Manager':
        return <Briefcase className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 dark:text-blue-400" />
            <p className="text-gray-600 dark:text-gray-400 font-medium">Loading project...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 rounded-full bg-red-100 dark:bg-red-900/20">
                <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Project Not Found</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {error || "This project does not exist or you don't have access."}
                </p>
              </div>
              <Link href="/projects">
                <Button size="lg" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Projects
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isAdmin = role === 'ADMIN';
  const isManager = project.manager?.id === userId;
  const canManageTasks = isAdmin || isManager;

  // Build allMembers array
  const allMembers = [
    project.owner,
    ...(project.manager ? [project.manager] : []),
    ...project.memberships.map((m) => m.user),
  ];

  const userRoleText = isAdmin ? 'Admin' : isManager ? 'Manager' : 'Member';

  return (
    <div className="mx-auto px-4 lg:px-8 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/projects">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Button>
        </Link>
      </div>

      {/* Project Header Card */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex-1 space-y-3">
              {/* Title and Status */}
              <div className="flex items-start gap-3 flex-wrap">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <FolderKanban className="w-7 h-7 text-blue-600 dark:text-blue-400 shrink-0" />
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white wrap-break-words">{project.name}</h1>
                </div>
                <Badge className={`flex items-center gap-1 text-sm ${getStatusColor(project.status)}`}>
                  {getStatusIcon(project.status)}
                  <span>{project.status.replace('_', ' ')}</span>
                </Badge>
              </div>

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-400 text-base">
                {project.description || 'No description provided'}
              </p>
            </div>

            {/* Edit Button */}
            {isAdmin && (
              <Link href={`/projects/${project.id}/edit`}>
                <Button className="gap-2 shrink-0">
                  <Edit className="w-4 h-4" />
                  Edit Project
                </Button>
              </Link>
            )}
          </div>
        </CardHeader>

        <Separator />

        {/* Project Stats */}
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Project Manager */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Briefcase className="w-4 h-4" />
                <span>Project Manager</span>
              </div>
              {project.manager ? (
                <div className="flex items-center gap-2">
                  <Avatar className="w-8 h-8 ring-2 ring-gray-100 dark:ring-gray-700">
                    <AvatarFallback className="bg-linear-to-br from-blue-500 to-indigo-600 text-white text-xs font-semibold">
                      {project.manager.name?.[0]?.toUpperCase() || project.manager.email[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white truncate">
                      {project.manager.name || project.manager.email}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="font-semibold text-gray-500 dark:text-gray-400">Not assigned</p>
              )}
            </div>

            {/* Team Members */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Users className="w-4 h-4" />
                <span>Team Members</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {project.memberships.slice(0, 3).map((membership, idx) => (
                    <Avatar key={membership.user.id} className="w-8 h-8 ring-2 ring-white dark:ring-gray-800">
                      <AvatarFallback className="bg-linear-to-br from-purple-500 to-pink-600 text-white text-xs font-semibold">
                        {membership.user.name?.[0]?.toUpperCase() || membership.user.email[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {project._count.memberships > 3 && (
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 ring-2 ring-white dark:ring-gray-800 flex items-center justify-center">
                      <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                        +{project._count.memberships - 3}
                      </span>
                    </div>
                  )}
                </div>
                <p className="font-semibold text-gray-900 dark:text-white">{project._count.memberships}</p>
              </div>
            </div>

            {/* Total Tasks */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <ListChecks className="w-4 h-4" />
                <span>Total Tasks</span>
              </div>
              <p className="font-semibold text-gray-900 dark:text-white text-2xl">{project._count.tasks}</p>
            </div>

            {/* Your Role */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <UserCircle className="w-4 h-4" />
                <span>Your Role</span>
              </div>
              <Badge variant="outline" className="gap-2 text-sm font-semibold">
                {getRoleIcon(userRoleText)}
                {userRoleText}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task Board */}
      <TaskBoard
        projectId={project.id}
        initialTasks={project.tasks}
        members={allMembers}
        canManageTasks={canManageTasks}
      />
    </div>
  );
}
