import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import LandingPageClient from '@/components/landing/landing-page-client';

export default async function LandingPage() {
  const session = await auth();
  if (session?.user) {
    redirect('/dashboard');
  }

  return <LandingPageClient />;
}
