'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Crown,
  Briefcase,
  User,
  Users,
  ArrowLeft,
  Trash2,
  Loader2,
  Shield,
  UserCog,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

interface User {
  id: string;
  name: string | null;
  email: string;
  role: 'ADMIN' | 'PROJECT_MANAGER' | 'MEMBER';
  createdAt: string;
  _count?: {
    ownedProjects?: number;
    managedProjects?: number;
    assignedTasks?: number;
  };
}

type SortColumn = 'name' | 'role' | 'projects' | 'tasks' | 'joined';
type SortDirection = 'asc' | 'desc' | null;

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'ADMIN' | 'PROJECT_MANAGER' | 'MEMBER'>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{ id: string; name: string | null; email: string } | null>(null);
  const [sortColumn, setSortColumn] = useState<SortColumn | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

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
    } finally {
      setLoading(false);
    }
  }

  async function handleRoleChange(userId: string, newRole: string) {
    const loadingToast = toast.loading('Updating role...');

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });

      if (!res.ok) throw new Error('Failed to update role');

      const updatedUser = await res.json();
      setUsers(users.map((u) => (u.id === userId ? updatedUser : u)));

      toast.success('Role updated successfully', { id: loadingToast });
    } catch (error) {
      toast.error('Failed to update user role', { id: loadingToast });
    }
  }

  function openDeleteDialog(userId: string, userName: string | null, email: string) {
    setUserToDelete({ id: userId, name: userName, email });
    setDeleteDialogOpen(true);
  }

  async function confirmDelete() {
    if (!userToDelete) return;

    const loadingToast = toast.loading('Deleting user...');

    try {
      const res = await fetch(`/api/admin/users/${userToDelete.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete user');

      setUsers(users.filter((u) => u.id !== userToDelete.id));
      toast.success('User deleted successfully', { id: loadingToast });
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    } catch (error) {
      toast.error('Failed to delete user', { id: loadingToast });
    }
  }

  function handleSort(column: SortColumn) {
    if (sortColumn === column) {
      // Cycle through: asc -> desc -> null
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection(null);
        setSortColumn(null);
      }
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  }

  const getSortIcon = (column: SortColumn) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="w-4 h-4 ml-2" />;
    }
    if (sortDirection === 'asc') {
      return <ArrowUp className="w-4 h-4 ml-2" />;
    }
    return <ArrowDown className="w-4 h-4 ml-2" />;
  };

  const filteredAndSortedUsers = useMemo(() => {
    let filtered = filter === 'all' ? users : users.filter((u) => u.role === filter);

    if (sortColumn && sortDirection) {
      filtered = [...filtered].sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (sortColumn) {
          case 'name':
            aValue = (a.name || a.email).toLowerCase();
            bValue = (b.name || b.email).toLowerCase();
            break;
          case 'role':
            aValue = a.role;
            bValue = b.role;
            break;
          case 'projects':
            aValue =
              a.role === 'ADMIN'
                ? a._count?.ownedProjects || 0
                : a.role === 'PROJECT_MANAGER'
                  ? a._count?.managedProjects || 0
                  : 0;
            bValue =
              b.role === 'ADMIN'
                ? b._count?.ownedProjects || 0
                : b.role === 'PROJECT_MANAGER'
                  ? b._count?.managedProjects || 0
                  : 0;
            break;
          case 'tasks':
            aValue = a._count?.assignedTasks || 0;
            bValue = b._count?.assignedTasks || 0;
            break;
          case 'joined':
            aValue = new Date(a.createdAt).getTime();
            bValue = new Date(b.createdAt).getTime();
            break;
        }

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [users, filter, sortColumn, sortDirection]);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <Crown className="w-4 h-4" />;
      case 'PROJECT_MANAGER':
        return <Briefcase className="w-4 h-4" />;
      case 'MEMBER':
        return <User className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 dark:text-blue-400" />
            <p className="text-gray-600 dark:text-gray-400 font-medium">Loading users...</p>
          </div>
        </div>
      </div>
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <UserCog className="w-8 h-8" />
              User Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage users and roles</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                <Users className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{users.length}</p>
            </CardContent>
          </Card>

          <Card className="border-purple-300 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-purple-700 dark:text-purple-400">Admins</p>
                <Crown className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <p className="text-3xl font-bold text-purple-900 dark:text-purple-200">
                {users.filter((u) => u.role === 'ADMIN').length}
              </p>
            </CardContent>
          </Card>

          <Card className="border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-blue-700 dark:text-blue-400">Project Managers</p>
                <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-3xl font-bold text-blue-900 dark:text-blue-200">
                {users.filter((u) => u.role === 'PROJECT_MANAGER').length}
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-green-700 dark:text-green-400">Members</p>
                <User className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-3xl font-bold text-green-900 dark:text-green-200">
                {users.filter((u) => u.role === 'MEMBER').length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            className="whitespace-nowrap"
          >
            <Users className="w-4 h-4 mr-2" />
            All Users
          </Button>
          <Button
            variant={filter === 'ADMIN' ? 'default' : 'outline'}
            onClick={() => setFilter('ADMIN')}
            className="whitespace-nowrap"
          >
            <Crown className="w-4 h-4 mr-2" />
            Admins
          </Button>
          <Button
            variant={filter === 'PROJECT_MANAGER' ? 'default' : 'outline'}
            onClick={() => setFilter('PROJECT_MANAGER')}
            className="whitespace-nowrap"
          >
            <Briefcase className="w-4 h-4 mr-2" />
            Project Managers
          </Button>
          <Button
            variant={filter === 'MEMBER' ? 'default' : 'outline'}
            onClick={() => setFilter('MEMBER')}
            className="whitespace-nowrap"
          >
            <User className="w-4 h-4 mr-2" />
            Members
          </Button>
        </div>

        {/* Users Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort('name')}
                        className="h-auto p-0 font-bold hover:bg-transparent"
                      >
                        User
                        {getSortIcon('name')}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort('role')}
                        className="h-auto p-0 font-bold hover:bg-transparent"
                      >
                        Role
                        {getSortIcon('role')}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort('projects')}
                        className="h-auto p-0 font-bold hover:bg-transparent"
                      >
                        Projects
                        {getSortIcon('projects')}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort('tasks')}
                        className="h-auto p-0 font-bold hover:bg-transparent"
                      >
                        Tasks
                        {getSortIcon('tasks')}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort('joined')}
                        className="h-auto p-0 font-bold hover:bg-transparent"
                      >
                        Joined
                        {getSortIcon('joined')}
                      </Button>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-64 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <Users className="w-16 h-16 text-gray-400 dark:text-gray-600 mb-4" />
                          <p className="text-gray-500 dark:text-gray-400 font-medium">No users found</p>
                          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Try adjusting your filters</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAndSortedUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                              {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900 dark:text-white">
                                {user.name || 'No name'}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">{user.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Select value={user.role} onValueChange={(value) => handleRoleChange(user.id, value)}>
                            <SelectTrigger className="w-45">
                              <SelectValue>
                                <div className="flex items-center gap-2">
                                  {getRoleIcon(user.role)}
                                  <span>
                                    {user.role === 'PROJECT_MANAGER'
                                      ? 'Project Manager'
                                      : user.role === 'ADMIN'
                                        ? 'Admin'
                                        : 'Member'}
                                  </span>
                                </div>
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ADMIN">
                                <div className="flex items-center gap-2">
                                  <Crown className="w-4 h-4" />
                                  <span>Admin</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="PROJECT_MANAGER">
                                <div className="flex items-center gap-2">
                                  <Briefcase className="w-4 h-4" />
                                  <span>Project Manager</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="MEMBER">
                                <div className="flex items-center gap-2">
                                  <User className="w-4 h-4" />
                                  <span>Member</span>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">
                            {user.role === 'ADMIN'
                              ? user._count?.ownedProjects || 0
                              : user.role === 'PROJECT_MANAGER'
                                ? user._count?.managedProjects || 0
                                : '-'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{user._count?.assignedTasks || 0}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(user.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => openDeleteDialog(user.id, user.name, user.email)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-600" />
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the user{' '}
              <span className="font-semibold text-gray-900 dark:text-white">
                "{userToDelete?.name || userToDelete?.email}"
              </span>
              . This action cannot be undone and will remove all their data including projects, tasks, and activity
              logs.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
