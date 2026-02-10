'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  FolderKanban,
  Plus,
  CheckCircle,
  Pause,
  Clock,
  Users,
  ListChecks,
  Edit,
  Trash2,
  Loader2,
  AlertCircle,
  Briefcase,
} from 'lucide-react';

interface Project {
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
  } | null;
  _count: {
    tasks: number;
    memberships: number;
  };
}

export default function ProjectsList() {
  const { data: session } = useSession();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED'>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<{ id: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const role = (session?.user as any)?.role;
  const isAdmin = role === 'ADMIN';

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      const res = await fetch('/api/projects');
      if (!res.ok) throw new Error('Failed to fetch projects');
      const data = await res.json();
      setProjects(data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  }

  function openDeleteDialog(projectId: string, projectName: string) {
    setProjectToDelete({ id: projectId, name: projectName });
    setDeleteDialogOpen(true);
  }

  async function handleDelete() {
    if (!projectToDelete) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/projects/${projectToDelete.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete project');
      }

      setProjects(projects.filter((p) => p.id !== projectToDelete.id));
      setDeleteDialogOpen(false);
    } catch (error) {
      alert('Failed to delete project');
    } finally {
      setDeleting(false);
      setProjectToDelete(null);
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <CheckCircle className="w-4 h-4" />;
      case 'ON_HOLD':
        return <Pause className="w-4 h-4" />;
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
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

  const filteredProjects = filter === 'all' ? projects : projects.filter((p) => p.status === filter);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 dark:text-blue-400" />
            <p className="text-gray-600 dark:text-gray-400 font-medium">Loading projects...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FolderKanban className="w-8 h-8" />
            Projects
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {role === 'ADMIN'
              ? 'Manage all projects'
              : role === 'PROJECT_MANAGER'
                ? 'Your managed projects'
                : 'Your assigned projects'}
          </p>
        </div>
        {isAdmin && (
          <Link href="/projects/new">
            <Button size="lg" className="gap-2">
              <Plus className="w-4 h-4" />
              New Project
            </Button>
          </Link>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        {[
          { value: 'all', label: 'All Projects', icon: FolderKanban },
          { value: 'ACTIVE', label: 'Active', icon: CheckCircle },
          { value: 'ON_HOLD', label: 'On Hold', icon: Pause },
          { value: 'COMPLETED', label: 'Completed', icon: CheckCircle },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.value}
              onClick={() => setFilter(item.value as any)}
              variant={filter === item.value ? 'default' : 'outline'}
              size="sm"
              className="gap-2 whitespace-nowrap"
            >
              <Icon className="w-3.5 h-3.5" />
              {item.label}
            </Button>
          );
        })}
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="flex flex-col items-center gap-3 mb-6">
                <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-800">
                  <FolderKanban className="w-12 h-12 text-gray-400 dark:text-gray-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No projects found</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {isAdmin ? 'Get started by creating your first project' : 'No projects assigned to you yet'}
                </p>
              </div>
              {isAdmin && (
                <Link href="/projects/new">
                  <Button size="lg" className="gap-2">
                    <Plus className="w-4 h-4" />
                    Create Project
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow overflow-hidden group">
              <Link href={`/projects/${project.id}`}>
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-start gap-2 flex-1 min-w-0">
                      <FolderKanban className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {project.name}
                      </h3>
                    </div>
                    <Badge className={`flex items-center gap-1 text-xs shrink-0 ${getStatusColor(project.status)}`}>
                      {getStatusIcon(project.status)}
                      <span>{project.status.replace('_', ' ')}</span>
                    </Badge>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2 h-10">
                    {project.description || 'No description'}
                  </p>

                  {/* Project Manager */}
                  {project.manager && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                      <Briefcase className="w-4 h-4 shrink-0" />
                      <span className="font-medium">PM:</span>
                      <span className="truncate">{project.manager.name}</span>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                      <ListChecks className="w-4 h-4" />
                      <span>{project._count.tasks} tasks</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                      <Users className="w-4 h-4" />
                      <span>{project._count.memberships} members</span>
                    </div>
                  </div>
                </CardContent>
              </Link>

              {/* Admin Actions */}
              {isAdmin && (
                <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-6 py-3 flex justify-end gap-3">
                  <Link href={`/projects/${project.id}/edit`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                    onClick={(e) => {
                      e.preventDefault();
                      openDeleteDialog(project.id, project.name);
                    }}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              Delete Project
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <span className="font-semibold">"{projectToDelete?.name}"</span>?
              <br />
              <span className="text-red-600 dark:text-red-400 font-medium">
                This will permanently delete all tasks and cannot be undone.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Project
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
