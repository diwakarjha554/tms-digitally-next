'use client';

import { useState, useEffect, SyntheticEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  FolderKanban,
  Loader2,
  CheckCircle2,
  Users,
  FileText,
  Briefcase,
  Activity,
  Save,
  XCircle,
  Search,
  X,
  ArrowLeft,
  AlertCircle,
} from 'lucide-react';

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
}

interface Project {
  id: string;
  name: string;
  description: string | null;
  status: string;
  managerId: string | null;
  memberships: Array<{
    userId: string;
  }>;
}

export default function EditProjectForm({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [project, setProject] = useState<Project | null>(null);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [projectStatus, setProjectStatus] = useState('ACTIVE');
  const [managerId, setManagerId] = useState<string>('no-manager');

  // Search states
  const [pmSearchQuery, setPmSearchQuery] = useState('');
  const [memberSearchQuery, setMemberSearchQuery] = useState('');

  // Form states
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');

  useEffect(() => {
    fetchData();
  }, [projectId]);

  async function fetchData() {
    try {
      const [usersRes, projectRes] = await Promise.all([fetch('/api/users'), fetch(`/api/projects/${projectId}`)]);

      if (!usersRes.ok || !projectRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const usersData = await usersRes.json();
      const projectData = await projectRes.json();

      setUsers(usersData);
      setProject(projectData);
      setProjectName(projectData.name);
      setProjectDescription(projectData.description || '');
      setProjectStatus(projectData.status);
      setManagerId(projectData.managerId || 'no-manager');
      setSelectedMembers(projectData.memberships.map((m: any) => m.userId));
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast.error('Failed to load project data');
    } finally {
      setFetchLoading(false);
    }
  }

  async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const data = {
      name: projectName,
      description: projectDescription,
      status: projectStatus,
      managerId: managerId === 'no-manager' ? null : managerId,
      memberIds: selectedMembers,
    };

    const loadingToast = toast.loading('Updating project...');

    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to update project');
      }

      toast.success('Project updated successfully!', { id: loadingToast });
      router.push(`/projects/${projectId}`);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update project', { id: loadingToast });
      setLoading(false);
    }
  }

  const projectManagers = users.filter((u) => u.role === 'PROJECT_MANAGER');
  const members = users.filter((u) => u.role === 'MEMBER');

  // Filter project managers based on search
  const filteredProjectManagers = projectManagers.filter((pm) => {
    const searchLower = pmSearchQuery.toLowerCase();
    const name = pm.name?.toLowerCase() || '';
    const email = pm.email.toLowerCase();
    return name.includes(searchLower) || email.includes(searchLower);
  });

  // Filter members based on search
  const filteredMembers = members.filter((member) => {
    const searchLower = memberSearchQuery.toLowerCase();
    const name = member.name?.toLowerCase() || '';
    const email = member.email.toLowerCase();
    return name.includes(searchLower) || email.includes(searchLower);
  });

  // Loading skeleton
  if (fetchLoading) {
    return (
      <>
        <Toaster position="top-right" />
        <div className="mx-auto px-4 lg:px-8 py-8">
          <div className="mb-8">
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent className="space-y-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  // Project not found
  if (!project) {
    return (
      <>
        <Toaster position="top-right" />
        <div className="mx-auto px-4 lg:px-8 py-8">
          <Card>
            <CardContent className="py-12">
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30">
                  <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">Project Not Found</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  The project you're looking for doesn't exist or has been deleted.
                </p>
                <Link href="/projects" className="mt-4">
                  <Button variant="outline">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Projects
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />

      <div className="mx-auto px-4 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/projects/${projectId}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Project
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FolderKanban className="w-8 h-8" />
            Edit Project
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Update project details and team members</p>
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">Project Details</CardTitle>
            <CardDescription>Modify the information below to update the project</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Project Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <FolderKanban className="w-4 h-4" />
                  Project Name *
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  minLength={3}
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g., E-commerce Platform"
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">Minimum 3 characters</p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Description *
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  required
                  rows={4}
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  placeholder="Describe the project goals and objectives"
                  disabled={loading}
                  className="resize-none"
                />
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status" className="flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Status *
                </Label>
                <Select value={projectStatus} onValueChange={setProjectStatus} disabled={loading}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        Active
                      </div>
                    </SelectItem>
                    <SelectItem value="ON_HOLD">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-yellow-600" />
                        On Hold
                      </div>
                    </SelectItem>
                    <SelectItem value="COMPLETED">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-gray-600" />
                        Completed
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Project Manager with Search */}
              <div className="space-y-2">
                <Label htmlFor="manager" className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Project Manager
                </Label>

                {/* Search Input for PM */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search project managers..."
                    value={pmSearchQuery}
                    onChange={(e) => setPmSearchQuery(e.target.value)}
                    disabled={loading}
                    className="pl-9 pr-9"
                  />
                  {pmSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setPmSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <Select value={managerId} onValueChange={setManagerId} disabled={loading}>
                  <SelectTrigger id="manager">
                    <SelectValue placeholder="Select project manager (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no-manager">
                      <div className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-gray-400" />
                        No Manager
                      </div>
                    </SelectItem>
                    {filteredProjectManagers.length === 0 && pmSearchQuery ? (
                      <div className="p-4 text-center text-sm text-gray-500">
                        No managers found matching "{pmSearchQuery}"
                      </div>
                    ) : (
                      filteredProjectManagers.map((pm) => (
                        <SelectItem key={pm.id} value={pm.id}>
                          <div className="flex items-center gap-2">
                            <Avatar className="w-5 h-5">
                              <AvatarFallback className="bg-linear-to-br from-blue-500 to-indigo-600 text-white text-[10px] font-semibold">
                                {pm.name?.[0]?.toUpperCase() || pm.email[0]?.toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="font-medium">{pm.name || pm.email}</span>
                              {pm.name && <span className="text-xs text-gray-500">{pm.email}</span>}
                            </div>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {filteredProjectManagers.length} manager{filteredProjectManagers.length !== 1 ? 's' : ''} available
                </p>
              </div>

              {/* Team Members with Search */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Team Members
                </Label>

                {/* Search Input for Members */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search team members..."
                    value={memberSearchQuery}
                    onChange={(e) => setMemberSearchQuery(e.target.value)}
                    disabled={loading}
                    className="pl-9 pr-9"
                  />
                  {memberSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setMemberSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <Card>
                  <CardContent className="p-0">
                    {members.length === 0 ? (
                      <div className="p-8 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-800">
                            <Users className="w-8 h-8 text-gray-400 dark:text-gray-600" />
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">No members available</p>
                        </div>
                      </div>
                    ) : filteredMembers.length === 0 ? (
                      <div className="p-8 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <Search className="w-8 h-8 text-gray-400 dark:text-gray-600" />
                          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                            No members found matching "{memberSearchQuery}"
                          </p>
                          <Button type="button" variant="outline" size="sm" onClick={() => setMemberSearchQuery('')}>
                            Clear Search
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="max-h-60 overflow-y-auto divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredMembers.map((member) => (
                          <label
                            key={member.id}
                            className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                          >
                            <Checkbox
                              checked={selectedMembers.includes(member.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedMembers([...selectedMembers, member.id]);
                                } else {
                                  setSelectedMembers(selectedMembers.filter((id) => id !== member.id));
                                }
                              }}
                              disabled={loading}
                            />
                            <Avatar className="w-8 h-8 ring-2 ring-gray-100 dark:ring-gray-700">
                              <AvatarFallback className="bg-linear-to-br from-blue-500 to-indigo-600 text-white text-xs font-semibold">
                                {member.name?.[0]?.toUpperCase() || member.email[0]?.toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {member.name || 'No name'}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{member.email}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {filteredMembers.length} member{filteredMembers.length !== 1 ? 's' : ''} available
                  {selectedMembers.length > 0 && ` • ${selectedMembers.length} selected`}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <Link href={`/projects/${projectId}`} className="flex-1">
                  <Button type="button" variant="outline" className="w-full" size="lg" disabled={loading}>
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" disabled={loading} className="flex-1" size="lg">
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Update Project
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
