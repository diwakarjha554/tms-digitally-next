import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import ActivityLogs from '@/components/activity/activity-logs';

export default async function ActivityPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  return <ActivityLogs />;
}
