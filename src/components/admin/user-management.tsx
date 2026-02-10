'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import toast, { Toaster } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Crown,
  Briefcase,
  User,
  Users,
  Trash2,
  Loader2,
  Shield,
  UserCog,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  MoreVertical,
  Edit,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  TrendingUp,
} from 'lucide-react';

interface UserData {
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

type SortColumn = 'name' | 'email' | 'role' | 'projects' | 'tasks' | 'joined';
type SortDirection = 'asc' | 'desc' | null;

export default function UserManagement() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'ADMIN' | 'PROJECT_MANAGER' | 'MEMBER'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{ id: string; name: string | null; email: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [sortColumn, setSortColumn] = useState<SortColumn | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Animation refs
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Animations
  useEffect(() => {
    if (loading) return;

    const ctx = gsap.context(() => {
      // Header animation
      gsap.from(headerRef.current, {
        y: -30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      });

      // Stats cards stagger animation
      gsap.from('.stat-card-animate', {
        y: 50,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.2,
      });

      // Animate stat numbers counter
      const statNumbers = document.querySelectorAll('.stat-number');
      statNumbers.forEach((element, index) => {
        const finalValue = parseInt(element.textContent || '0');
        gsap.from(element, {
          innerText: 0,
          duration: 1.5,
          ease: 'power2.out',
          delay: 0.4 + index * 0.1,
          snap: { innerText: 1 },
          onUpdate: function () {
            element.textContent = Math.ceil(parseFloat(element.textContent || '0')).toString();
          },
        });
      });

      // Hover effects - only lift
      const statCards = document.querySelectorAll('.stat-card-animate');
      statCards.forEach((card) => {
        card.addEventListener('mouseenter', () => {
          gsap.to(card, {
            y: -8,
            duration: 0.3,
            ease: 'power2.out',
          });
        });

        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            y: 0,
            duration: 0.3,
            ease: 'power2.out',
          });
        });
      });
    });

    return () => ctx.revert();
  }, [loading]);

  async function fetchUsers() {
    try {
      const res = await fetch('/api/admin/users');
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

    setDeleting(true);
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
    } finally {
      setDeleting(false);
    }
  }

  function handleSort(column: SortColumn) {
    if (sortColumn === column) {
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
      return <ArrowUpDown className="w-4 h-4 ml-2 text-gray-400" />;
    }
    if (sortDirection === 'asc') {
      return <ArrowUp className="w-4 h-4 ml-2 text-blue-600" />;
    }
    return <ArrowDown className="w-4 h-4 ml-2 text-blue-600" />;
  };

  // Filter, search, and sort
  let filteredUsers = users
    .filter((u) => (filter === 'all' ? true : u.role === filter))
    .filter(
      (u) =>
        u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

  if (sortColumn && sortDirection) {
    filteredUsers = [...filteredUsers].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortColumn) {
        case 'name':
          aValue = (a.name || a.email).toLowerCase();
          bValue = (b.name || b.email).toLowerCase();
          break;
        case 'email':
          aValue = a.email.toLowerCase();
          bValue = b.email.toLowerCase();
          break;
        case 'role':
          const roleOrder = { ADMIN: 1, PROJECT_MANAGER: 2, MEMBER: 3 };
          aValue = roleOrder[a.role];
          bValue = roleOrder[b.role];
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

  // Calculate stats
  const totalUsers = users.length;
  const admins = users.filter((u) => u.role === 'ADMIN').length;
  const projectManagers = users.filter((u) => u.role === 'PROJECT_MANAGER').length;
  const members = users.filter((u) => u.role === 'MEMBER').length;

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  // Reset to page 1 when filter, search, or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchQuery, sortColumn, sortDirection]);

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

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'PROJECT_MANAGER':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'MEMBER':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
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
      <Toaster position="top-right" />

      <div className="mx-auto px-4 lg:px-8 py-8">
        {/* Header */}
        <div
          ref={headerRef}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <UserCog className="w-8 h-8" />
              User Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage users and roles</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users */}
          <div className="stat-card-animate">
            <Card className="border-gray-200 dark:border-gray-800 hover:shadow-xs transition-shadow duration-300 overflow-hidden relative cursor-pointer">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gray-500/10 rounded-full -mr-12 -mt-12 animate-pulse" />
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-gray-500/5 rounded-full -ml-8 -mb-8 animate-pulse delay-1000" />
              <CardContent className="px-6 relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded">
                    <Users className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                  </div>
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white stat-number">{totalUsers}</p>
              </CardContent>
            </Card>
          </div>

          {/* Admins */}
          <div className="stat-card-animate">
            <Card className="border-purple-200 dark:border-purple-800 hover:shadow-xs transition-shadow duration-300 overflow-hidden relative cursor-pointer">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full -mr-12 -mt-12 animate-pulse" />
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-purple-500/5 rounded-full -ml-8 -mb-8 animate-pulse delay-1000" />
              <CardContent className="px-6 relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded">
                    <Crown className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <Badge className="bg-purple-500 text-white text-xs animate-pulse">Admin</Badge>
                </div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Admins</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white stat-number">{admins}</p>
              </CardContent>
            </Card>
          </div>

          {/* Project Managers */}
          <div className="stat-card-animate">
            <Card className="border-blue-200 dark:border-blue-800 hover:shadow-xs transition-shadow duration-300 overflow-hidden relative cursor-pointer">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full -mr-12 -mt-12 animate-pulse" />
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-blue-500/5 rounded-full -ml-8 -mb-8 animate-pulse delay-1000" />
              <CardContent className="px-6 relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded">
                    <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Project Managers</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white stat-number">{projectManagers}</p>
              </CardContent>
            </Card>
          </div>

          {/* Members */}
          <div className="stat-card-animate">
            <Card className="border-green-200 dark:border-green-800 hover:shadow-xs transition-shadow duration-300 overflow-hidden relative cursor-pointer">
              <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full -mr-12 -mt-12 animate-pulse" />
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-green-500/5 rounded-full -ml-8 -mb-8 animate-pulse delay-1000" />
              <CardContent className="px-6 relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded">
                    <User className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Members</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white stat-number">{members}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card>
          <CardHeader className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              {/* Search */}
              <div className="relative w-full lg:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filter */}
              <div className="flex items-center gap-2">
                <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        All Users
                      </div>
                    </SelectItem>
                    <SelectItem value="ADMIN">
                      <div className="flex items-center gap-2">
                        <Crown className="w-4 h-4 text-purple-600" />
                        Admins
                      </div>
                    </SelectItem>
                    <SelectItem value="PROJECT_MANAGER">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-blue-600" />
                        Managers
                      </div>
                    </SelectItem>
                    <SelectItem value="MEMBER">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-green-600" />
                        Members
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {filteredUsers.length === 0 ? (
              <div className="p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="flex flex-col items-center gap-3 mb-6">
                    <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-800">
                      <Users className="w-12 h-12 text-gray-400 dark:text-gray-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No users found</h3>
                    <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filters</p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">S.No</TableHead>

                        <TableHead className="min-w-62.5">
                          <Button
                            variant="ghost"
                            onClick={() => handleSort('name')}
                            className="h-8 px-2 hover:bg-transparent font-semibold"
                          >
                            User
                            {getSortIcon('name')}
                          </Button>
                        </TableHead>

                        <TableHead className="min-w-50">
                          <Button
                            variant="ghost"
                            onClick={() => handleSort('email')}
                            className="h-8 px-2 hover:bg-transparent font-semibold"
                          >
                            Email
                            {getSortIcon('email')}
                          </Button>
                        </TableHead>

                        <TableHead className="w-48">
                          <Button
                            variant="ghost"
                            onClick={() => handleSort('role')}
                            className="h-8 px-2 hover:bg-transparent font-semibold"
                          >
                            Role
                            {getSortIcon('role')}
                          </Button>
                        </TableHead>

                        <TableHead className="w-32 text-center">
                          <Button
                            variant="ghost"
                            onClick={() => handleSort('projects')}
                            className="h-8 px-2 hover:bg-transparent font-semibold mx-auto"
                          >
                            Projects
                            {getSortIcon('projects')}
                          </Button>
                        </TableHead>

                        <TableHead className="w-32 text-center">
                          <Button
                            variant="ghost"
                            onClick={() => handleSort('tasks')}
                            className="h-8 px-2 hover:bg-transparent font-semibold mx-auto"
                          >
                            Tasks
                            {getSortIcon('tasks')}
                          </Button>
                        </TableHead>

                        <TableHead className="w-40">
                          <Button
                            variant="ghost"
                            onClick={() => handleSort('joined')}
                            className="h-8 px-2 hover:bg-transparent font-semibold"
                          >
                            Joined
                            {getSortIcon('joined')}
                          </Button>
                        </TableHead>

                        <TableHead className="w-32 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedUsers.map((user, index) => (
                        <TableRow key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                          <TableCell className="font-medium text-gray-500 dark:text-gray-400">
                            {startIndex + index + 1}
                          </TableCell>

                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                                {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900 dark:text-white">
                                  {user.name || 'No name'}
                                </div>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell>
                            <span className="text-sm text-gray-600 dark:text-gray-400">{user.email}</span>
                          </TableCell>

                          <TableCell>
                            <Badge className={`flex items-center gap-1.5 w-fit ${getRoleBadgeColor(user.role)}`}>
                              {getRoleIcon(user.role)}
                              <span>
                                {user.role === 'PROJECT_MANAGER' ? 'PM' : user.role === 'ADMIN' ? 'Admin' : 'Member'}
                              </span>
                            </Badge>
                          </TableCell>

                          <TableCell className="text-center">
                            <span className="font-medium text-gray-700 dark:text-gray-300">
                              {user.role === 'ADMIN'
                                ? user._count?.ownedProjects || 0
                                : user.role === 'PROJECT_MANAGER'
                                  ? user._count?.managedProjects || 0
                                  : '-'}
                            </span>
                          </TableCell>

                          <TableCell className="text-center">
                            <span className="font-medium text-gray-700 dark:text-gray-300">
                              {user._count?.assignedTasks || 0}
                            </span>
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
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'ADMIN')}>
                                  <Crown className="mr-2 h-4 w-4" />
                                  Make Admin
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'PROJECT_MANAGER')}>
                                  <Briefcase className="mr-2 h-4 w-4" />
                                  Make PM
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'MEMBER')}>
                                  <User className="mr-2 h-4 w-4" />
                                  Make Member
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => openDeleteDialog(user.id, user.name, user.email)}
                                  className="text-red-600 dark:text-red-400 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {filteredUsers.length > 0 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Rows per page:</span>
                      <Select
                        value={itemsPerPage.toString()}
                        onValueChange={(value) => {
                          setItemsPerPage(Number(value));
                          setCurrentPage(1);
                        }}
                      >
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5</SelectItem>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="20">20</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Showing {startIndex + 1} to {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length}{' '}
                      users
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                        className="h-8 w-8 p-0"
                      >
                        <ChevronsLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="h-8 w-8 p-0"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>

                      <div className="flex items-center gap-1">
                        {[...Array(totalPages)].map((_, i) => {
                          const pageNum = i + 1;
                          if (
                            pageNum === 1 ||
                            pageNum === totalPages ||
                            (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                          ) {
                            return (
                              <Button
                                key={pageNum}
                                variant={currentPage === pageNum ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setCurrentPage(pageNum)}
                                className="h-8 w-8 p-0"
                              >
                                {pageNum}
                              </Button>
                            );
                          } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                            return (
                              <span key={pageNum} className="px-1 text-gray-400">
                                ...
                              </span>
                            );
                          }
                          return null;
                        })}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="h-8 w-8 p-0"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                        className="h-8 w-8 p-0"
                      >
                        <ChevronsRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-600" />
              Delete User
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{' '}
              <span className="font-semibold text-gray-900 dark:text-white">
                "{userToDelete?.name || userToDelete?.email}"
              </span>
              ?
              <br />
              <span className="text-red-600 dark:text-red-400 font-medium">
                This will permanently delete all their data and cannot be undone.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
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
                  Delete User
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
