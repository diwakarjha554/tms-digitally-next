import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import CreateProjectForm from '@/components/projects/create-project-form';

export default async function NewProjectPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const role = (session.user as any).role;

  if (role !== 'ADMIN') {
    redirect('/projects');
  }

  return <CreateProjectForm />;
}
