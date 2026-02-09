import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import ProjectDetailPage from '@/components/project-detail';

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/login');
  }

  const { id } = await params;

  return <ProjectDetailPage projectId={id} />;
}
