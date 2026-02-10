'use client';

import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  Search,
  MoreVertical,
  Eye,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  TrendingUp,
} from 'lucide-react';
import toast from 'react-hot-toast';

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

type SortField = 'name' | 'status' | 'manager' | 'tasks' | 'members';
type SortDirection = 'asc' | 'desc' | null;

export default function ProjectsList() {
  const { data: session } = useSession();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<{ id: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Sorting state
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Animation refs
  const headerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const role = (session?.user as any)?.role;
  const isAdmin = role === 'ADMIN';

  useEffect(() => {
    fetchProjects();
  }, []);

  // Simple animations - only for cards
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

      // Hover effects for stats cards - only lift, no scale
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

  async function fetchProjects() {
    try {
      const res = await fetch('/api/projects');
      if (!res.ok) throw new Error('Failed to fetch projects');
      const data = await res.json();
      setProjects(data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      toast.error('Failed to load projects');
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
    const loadingToast = toast.loading('Deleting project...');

    try {
      const res = await fetch(`/api/projects/${projectToDelete.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete project');
      }

      setProjects(projects.filter((p) => p.id !== projectToDelete.id));
      toast.success('Project deleted successfully!', { id: loadingToast });
      setDeleteDialogOpen(false);
    } catch (error) {
      toast.error('Failed to delete project', { id: loadingToast });
    } finally {
      setDeleting(false);
      setProjectToDelete(null);
    }
  }

  // Sorting function
  function handleSort(field: SortField) {
    if (sortField === field) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection(null);
        setSortField(null);
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
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
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  // Sort icon component
  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-2 h-4 w-4 text-gray-400" />;
    }
    if (sortDirection === 'asc') {
      return <ArrowUp className="ml-2 h-4 w-4 text-blue-600" />;
    }
    return <ArrowDown className="ml-2 h-4 w-4 text-blue-600" />;
  };

  // Filter and search
  let filteredProjects = projects
    .filter((p) => (filter === 'all' ? true : p.status === filter))
    .filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.manager?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // Apply sorting
  if (sortField && sortDirection) {
    filteredProjects = [...filteredProjects].sort((a, b) => {
      let compareValue = 0;

      switch (sortField) {
        case 'name':
          compareValue = a.name.localeCompare(b.name);
          break;
        case 'status':
          const statusOrder = { ACTIVE: 1, ON_HOLD: 2, COMPLETED: 3 };
          compareValue = statusOrder[a.status] - statusOrder[b.status];
          break;
        case 'manager':
          const managerA = a.manager?.name || '';
          const managerB = b.manager?.name || '';
          compareValue = managerA.localeCompare(managerB);
          break;
        case 'tasks':
          compareValue = a._count.tasks - b._count.tasks;
          break;
        case 'members':
          compareValue = a._count.memberships - b._count.memberships;
          break;
      }

      return sortDirection === 'asc' ? compareValue : -compareValue;
    });
  }

  // Calculate stats
  const totalProjects = projects.length;
  const activeProjects = projects.filter((p) => p.status === 'ACTIVE').length;
  const onHoldProjects = projects.filter((p) => p.status === 'ON_HOLD').length;
  const completedProjects = projects.filter((p) => p.status === 'COMPLETED').length;
  const totalTasks = projects.reduce((sum, p) => sum + p._count.tasks, 0);
  const totalMembers = projects.reduce((sum, p) => sum + p._count.memberships, 0);

  // Pagination
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProjects = filteredProjects.slice(startIndex, endIndex);

  // Reset to page 1 when filter, search, or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchQuery, sortField, sortDirection]);

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
      <div ref={headerRef} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
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

      {/* Stats Cards */}
      <div ref={statsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Projects */}
        <Card className="stat-card-animate border-blue-200 dark:border-blue-800 hover:shadow-xs transition-shadow overflow-hidden relative cursor-pointer">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full -mr-12 -mt-12 animate-pulse" />
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-blue-500/5 rounded-full -ml-8 -mb-8 animate-pulse animation-delay-1000" />
          <CardContent className="px-6 relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <FolderKanban className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Projects</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white stat-number">{totalProjects}</p>
          </CardContent>
        </Card>

        {/* Active Projects */}
        <Card className="stat-card-animate border-green-200 dark:border-green-800 hover:shadow-xs transition-shadow overflow-hidden relative cursor-pointer">
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full -mr-12 -mt-12 animate-pulse" />
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-green-500/5 rounded-full -ml-8 -mb-8 animate-pulse animation-delay-1000" />
          <CardContent className="px-6 relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <Badge className="bg-green-500 text-white text-xs animate-pulse">Active</Badge>
            </div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Active</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white stat-number">{activeProjects}</p>
          </CardContent>
        </Card>

        {/* Total Tasks */}
        <Card className="stat-card-animate border-purple-200 dark:border-purple-800 hover:shadow-xs transition-shadow overflow-hidden relative cursor-pointer">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full -mr-12 -mt-12 animate-pulse" />
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-purple-500/5 rounded-full -ml-8 -mb-8 animate-pulse animation-delay-1000" />
          <CardContent className="px-6 relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <ListChecks className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Tasks</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white stat-number">{totalTasks}</p>
          </CardContent>
        </Card>

        {/* Total Members */}
        <Card className="stat-card-animate border-orange-200 dark:border-orange-800 hover:shadow-xs transition-shadow overflow-hidden relative cursor-pointer">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full -mr-12 -mt-12 animate-pulse" />
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-orange-500/5 rounded-full -ml-8 -mb-8 animate-pulse animation-delay-1000" />
          <CardContent className="px-6 relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <Users className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Team Members</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white stat-number">{totalMembers}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            {/* Search */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2">
              <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <div className="flex items-center gap-2">
                      <FolderKanban className="w-4 h-4" />
                      All Projects
                    </div>
                  </SelectItem>
                  <SelectItem value="ACTIVE">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Active
                    </div>
                  </SelectItem>
                  <SelectItem value="ON_HOLD">
                    <div className="flex items-center gap-2">
                      <Pause className="w-4 h-4 text-yellow-600" />
                      On Hold
                    </div>
                  </SelectItem>
                  <SelectItem value="COMPLETED">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                      Completed
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {filteredProjects.length === 0 ? (
            <div className="p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="flex flex-col items-center gap-3 mb-6">
                  <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-800">
                    <FolderKanban className="w-12 h-12 text-gray-400 dark:text-gray-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No projects found</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {searchQuery
                      ? 'Try adjusting your search or filters'
                      : isAdmin
                        ? 'Get started by creating your first project'
                        : 'No projects assigned to you yet'}
                  </p>
                </div>
                {isAdmin && !searchQuery && (
                  <Link href="/projects/new">
                    <Button size="lg" className="gap-2">
                      <Plus className="w-4 h-4" />
                      Create Project
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Table */}
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
                          Project Name
                          <SortIcon field="name" />
                        </Button>
                      </TableHead>

                      <TableHead className="min-w-50">Description</TableHead>

                      <TableHead className="w-32">
                        <Button
                          variant="ghost"
                          onClick={() => handleSort('status')}
                          className="h-8 px-2 hover:bg-transparent font-semibold"
                        >
                          Status
                          <SortIcon field="status" />
                        </Button>
                      </TableHead>

                      <TableHead className="min-w-45">
                        <Button
                          variant="ghost"
                          onClick={() => handleSort('manager')}
                          className="h-8 px-2 hover:bg-transparent font-semibold"
                        >
                          Project Manager
                          <SortIcon field="manager" />
                        </Button>
                      </TableHead>

                      <TableHead className="w-24 text-center">
                        <Button
                          variant="ghost"
                          onClick={() => handleSort('tasks')}
                          className="h-8 px-2 hover:bg-transparent font-semibold mx-auto"
                        >
                          Tasks
                          <SortIcon field="tasks" />
                        </Button>
                      </TableHead>

                      <TableHead className="w-24 text-center">
                        <Button
                          variant="ghost"
                          onClick={() => handleSort('members')}
                          className="h-8 px-2 hover:bg-transparent font-semibold mx-auto"
                        >
                          Members
                          <SortIcon field="members" />
                        </Button>
                      </TableHead>

                      <TableHead className="w-32 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedProjects.map((project, index) => (
                      <TableRow key={project.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <TableCell className="font-medium text-gray-500 dark:text-gray-400">
                          {startIndex + index + 1}
                        </TableCell>

                        <TableCell>
                          <Link href={`/projects/${project.id}`} className="group">
                            <div className="flex items-center gap-2">
                              <FolderKanban className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                              <span className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {project.name}
                              </span>
                            </div>
                          </Link>
                        </TableCell>

                        <TableCell>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                            {project.description || 'No description'}
                          </p>
                        </TableCell>

                        <TableCell>
                          <Badge className={`flex items-center gap-1 w-fit text-xs ${getStatusColor(project.status)}`}>
                            {getStatusIcon(project.status)}
                            <span>{project.status.replace('_', ' ')}</span>
                          </Badge>
                        </TableCell>

                        <TableCell>
                          {project.manager ? (
                            <div className="flex items-center gap-2">
                              <Briefcase className="w-4 h-4 text-gray-400 shrink-0" />
                              <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                                {project.manager.name}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400 dark:text-gray-600 italic">Not assigned</span>
                          )}
                        </TableCell>

                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <ListChecks className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {project._count.tasks}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {project._count.memberships}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                              <DropdownMenuItem asChild>
                                <Link href={`/projects/${project.id}`} className="cursor-pointer">
                                  <Eye className="mr-2 h-4 w-4" />
                                  View
                                </Link>
                              </DropdownMenuItem>
                              {isAdmin && (
                                <>
                                  <DropdownMenuItem asChild>
                                    <Link href={`/projects/${project.id}/edit`} className="cursor-pointer">
                                      <Edit className="mr-2 h-4 w-4" />
                                      Edit
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => openDeleteDialog(project.id, project.name)}
                                    className="text-red-600 dark:text-red-400 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20 cursor-pointer"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {filteredProjects.length > 0 && (
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
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredProjects.length)} of{' '}
                    {filteredProjects.length} projects
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
