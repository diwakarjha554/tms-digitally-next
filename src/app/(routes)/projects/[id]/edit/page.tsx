import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import EditProjectForm from '@/components/projects/edit-project-form';

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const role = (session.user as any).role;

  if (role !== 'ADMIN') {
    redirect('/projects');
  }

  const { id } = await params;

  return <EditProjectForm projectId={id} />;
}
