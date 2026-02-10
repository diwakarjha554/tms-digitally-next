import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import UserManagement from '@/components/admin/user-management';

export default async function AdminUsersPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const role = (session.user as any).role;

  if (role !== 'ADMIN') {
    redirect('/dashboard');
  }

  return <UserManagement />;
}
