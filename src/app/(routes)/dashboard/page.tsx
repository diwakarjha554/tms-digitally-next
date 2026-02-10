import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import AdminDashboard from '@/components/dashboard/admin-dashboard';
import PMDashboard from '@/components/dashboard/pm-dashboard';
import MemberDashboard from '@/components/dashboard/member-dashboard';

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const role = (session.user as any).role;

  // Render dashboard based on role
  if (role === 'ADMIN') {
    return <AdminDashboard />;
  } else if (role === 'PROJECT_MANAGER') {
    return <PMDashboard />;
  } else {
    return <MemberDashboard />;
  }
}
