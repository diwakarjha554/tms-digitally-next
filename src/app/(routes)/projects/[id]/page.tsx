import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import ProjectDetail from '@/components/projects/project-detail';

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const { id } = await params;

  return <ProjectDetail projectId={id} />;
}
