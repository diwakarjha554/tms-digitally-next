import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import ProfileSettings from '@/components/profile/profile-settings';

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  return <ProfileSettings />;
}
