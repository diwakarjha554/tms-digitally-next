import { auth } from '@/auth';

export async function getCurrentUser() {
  const session = await auth();
  return session?.user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}

export async function requireAdmin() {
  const user = await requireAuth();
  if ((user as any).role !== 'ADMIN') {
    throw new Error('Forbidden - Admin access required');
  }
  return user;
}

export async function requireAdminOrPM() {
  const user = await requireAuth();
  const role = (user as any).role;
  if (role !== 'ADMIN' && role !== 'PROJECT_MANAGER') {
    throw new Error('Forbidden - Admin or Project Manager access required');
  }
  return user;
}

export function canManageProject(user: any, project: any): boolean {
  return user.role === 'ADMIN' || (user.role === 'PROJECT_MANAGER' && project.managerId === user.id);
}

export function canManageTasks(user: any, project: any): boolean {
  return canManageProject(user, project);
}
