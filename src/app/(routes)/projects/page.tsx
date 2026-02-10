import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import ProjectsList from '@/components/projects/projects-list';

export default async function ProjectsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  return <ProjectsList />;
}
