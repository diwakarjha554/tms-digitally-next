'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import { Sheet, SheetContent } from '@/components/ui/sheet';
import {
  LayoutDashboard,
  FolderKanban,
  Activity,
  Users,
  Settings,
  LogOut,
  Menu,
  Crown,
  Briefcase,
  User,
  AlertCircle,
  Loader2,
  Sparkles,
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [signOutDialogOpen, setSignOutDialogOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const user = session?.user as any;
  const role = user?.role;

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      roles: ['ADMIN', 'PROJECT_MANAGER', 'MEMBER'],
    },
    {
      name: 'Projects',
      href: '/projects',
      icon: FolderKanban,
      roles: ['ADMIN', 'PROJECT_MANAGER', 'MEMBER'],
    },
    {
      name: 'Activity',
      href: '/activity',
      icon: Activity,
      roles: ['ADMIN', 'PROJECT_MANAGER', 'MEMBER'],
    },
    {
      name: 'User Management',
      href: '/admin/users',
      icon: Users,
      roles: ['ADMIN'],
    },
  ];

  const filteredNavigation = navigation.filter((item) => item.roles.includes(role));

  function isActive(href: string) {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  }

  // Open sign out confirmation dialog
  function openSignOutDialog() {
    setSignOutDialogOpen(true);
  }

  // Actual sign out function
  async function confirmSignOut() {
    setSigningOut(true);
    const loadingToast = toast.loading('Signing out...');

    try {
      await signOut({ callbackUrl: '/login' });
      toast.success('Signed out successfully', { id: loadingToast });
    } catch (error) {
      toast.error('Failed to sign out', { id: loadingToast });
      setSigningOut(false);
      setSignOutDialogOpen(false);
    }
  }

  const getRoleIcon = () => {
    switch (role) {
      case 'ADMIN':
        return <Crown className="w-3 h-3" />;
      case 'PROJECT_MANAGER':
        return <Briefcase className="w-3 h-3" />;
      default:
        return <User className="w-3 h-3" />;
    }
  };

  const getRoleBadgeVariant = () => {
    switch (role) {
      case 'ADMIN':
        return 'default' as const;
      case 'PROJECT_MANAGER':
        return 'secondary' as const;
      default:
        return 'outline' as const;
    }
  };

  const getRoleLabel = () => {
    switch (role) {
      case 'ADMIN':
        return 'Admin';
      case 'PROJECT_MANAGER':
        return 'Project Manager';
      default:
        return 'Member';
    }
  };

  const getPageTitle = () => {
    if (pathname === '/dashboard') return 'Dashboard';
    if (pathname.startsWith('/projects')) return 'Projects';
    if (pathname.startsWith('/activity')) return 'Activity Logs';
    if (pathname.startsWith('/admin/users')) return 'User Management';
    if (pathname.startsWith('/profile')) return 'Profile';
    return 'Task Management System';
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-white dark:bg-gray-800">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center px-4 border-b border-gray-200 dark:border-gray-700">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative">
            {/* Logo Container */}
            <div className="relative w-10 h-10 md:w-12 md:h-12 rounded bg-linear-to-br from-blue-600 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-white" strokeWidth={2.5} />
            </div>
          </div>
          <span className="text-xl md:text-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            TaskFlow
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
        {filteredNavigation.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link key={item.name} href={item.href} onClick={() => setSidebarOpen(false)}>
              <div
                className={`group flex items-center gap-3 rounded px-3 py-2.5 text-sm font-medium transition-all ${
                  active
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-3">
        {/* User Info */}
        <div className="flex items-center gap-3 mb-3 px-1">
          <Avatar className="h-9 w-9 ring-2 ring-gray-100 dark:ring-gray-700">
            <AvatarFallback className="bg-linear-to-br from-blue-500 to-indigo-600 text-white font-semibold text-sm">
              {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>

        {/* Action Buttons - Side by Side */}
        <div className="flex gap-2">
          <Link href="/profile" onClick={() => setSidebarOpen(false)} className="flex-1">
            <Button variant="outline" size="sm" className="w-full justify-center gap-2 text-xs font-medium">
              <Settings className="h-3.5 w-3.5" />
              <span>Profile</span>
            </Button>
          </Link>
          <Button
            size="sm"
            onClick={openSignOutDialog}
            className="flex-1 justify-center gap-2 text-xs font-medium bg-red-500 hover:bg-red-500/90 text-white"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </Button>
        </div>
      </div>
    </div>
  );

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

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Desktop Sidebar - Only visible on lg and above */}
        <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 lg:block">
          <SidebarContent />
        </aside>

        {/* Mobile Sidebar */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen} modal={false}>
          <SheetContent side="left" className="w-64 p-0 lg:hidden border-r shadow-xs" showCloseButton={true}>
            <SidebarContent />
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <div className="lg:pl-64">
          {/* Top Header */}
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-gray-200 bg-white px-2 shadow-xs dark:border-gray-700 dark:bg-gray-800 lg:px-8">
            {/* Mobile menu button - Only visible below lg */}
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open sidebar</span>
            </Button>

            {/* Page Title */}
            <div className="flex flex-1 items-center">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{getPageTitle()}</h2>
            </div>

            {/* Right side items */}
            <div className="flex items-center gap-4">
              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Role Badge - Hidden on mobile */}
              <Badge
                variant={getRoleBadgeVariant()}
                className="rounded h-9 px-4 text-sm hidden items-center gap-1.5 sm:inline-flex"
              >
                <span className="font-medium">{getRoleLabel()}</span>
              </Badge>

              {/* User Dropdown - Mobile only */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="lg:hidden">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-linear-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white">
                        {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name || 'User'}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex cursor-pointer items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={openSignOutDialog}
                    className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Page Content */}
          <main className="min-h-[calc(100vh-4rem)]">{children}</main>
        </div>
      </div>

      {/* Sign Out Confirmation Dialog */}
      <AlertDialog open={signOutDialogOpen} onOpenChange={setSignOutDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              Sign Out Confirmation
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to sign out?
              <br />
              <span className="text-gray-700 dark:text-gray-300 font-medium mt-2 block">
                You'll need to sign in again to access your account.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={signingOut}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmSignOut}
              disabled={signingOut}
              className="bg-red-500 hover:bg-red-500/90 text-white"
            >
              {signingOut ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing Out...
                </>
              ) : (
                <>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
