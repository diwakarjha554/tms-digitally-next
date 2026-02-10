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
import {
  FolderKanban,
  Loader2,
  CheckCircle2,
  Users,
  FileText,
  Briefcase,
  Activity,
  Plus,
  XCircle,
  Search,
  X,
} from 'lucide-react';

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
}

export default function CreateProjectForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [projectStatus, setProjectStatus] = useState('ACTIVE');
  const [managerId, setManagerId] = useState<string>('no-manager');

  // Search states
  const [pmSearchQuery, setPmSearchQuery] = useState('');
  const [memberSearchQuery, setMemberSearchQuery] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const res = await fetch('/api/users');
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('Failed to load users');
    }
  }

  async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      description: formData.get('description'),
      status: projectStatus,
      managerId: managerId === 'no-manager' ? null : managerId,
      memberIds: selectedMembers,
    };

    const loadingToast = toast.loading('Creating project...');

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to create project');
      }

      const project = await res.json();
      toast.success('Project created successfully!', { id: loadingToast });
      router.push(`/projects/${project.id}`);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || 'Failed to create project', { id: loadingToast });
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FolderKanban className="w-8 h-8" />
            Create New Project
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Set up a new project and assign team members</p>
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">Project Details</CardTitle>
            <CardDescription>Fill in the information below to create a new project</CardDescription>
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
                <Link href="/projects" className="flex-1">
                  <Button type="button" variant="outline" className="w-full" size="lg" disabled={loading}>
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" disabled={loading} className="flex-1" size="lg">
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Project
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
