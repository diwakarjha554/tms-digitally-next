'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import TaskBoard from '@/components/tasks/task-board';

interface Member {
  id: string;
  name: string | null;
  email: string;
  role?: string;
}

interface Task {
  id: string;
  title: string;
  description: string | null;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  dueDate: Date | null;
  order: number;
  assignee: { id: string; name: string | null } | null;
  createdBy: { id: string; name: string | null };
}

interface ProjectDetailProps {
  projectId: string;
}

interface ProjectData {
  id: string;
  name: string;
  description: string | null;
  status: 'ACTIVE' | 'ON_HOLD' | 'COMPLETED';
  owner: {
    id: string;
    name: string | null;
    email: string;
  };
  _count: {
    tasks: number;
    memberships: number;
  };
  memberships: Array<{
    user: Member;
  }>;
  tasks: Task[];
}

export default function ProjectDetailPage({ projectId }: ProjectDetailProps) {
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchProject() {
      try {
        const res = await fetch(`/api/projects/${projectId}`);
        
        if (!res.ok) {
          throw new Error('Project not found');
        }

        const data = await res.json();
        setProject(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
  }, [projectId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading project...</div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h2>
          <Link
            href="/projects"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = project.owner.id === 'your-user-id'; // Replace with actual session.user.id
  const members = [
    project.owner,
    ...project.memberships.map((m) => m.user),
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link
            href="/projects"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            ← Back to Projects
          </Link>
        </div>

        {/* Project Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
              <p className="text-gray-600 mt-2">{project.description}</p>
            </div>
            <span
              className={`px-3 py-1 text-sm font-medium rounded-full ${
                project.status === 'ACTIVE'
                  ? 'bg-green-100 text-green-800'
                  : project.status === 'ON_HOLD'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {project.status}
            </span>
          </div>

          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <div>
              <span className="font-medium">Owner:</span> {project.owner.name}
            </div>
            <div>
              <span className="font-medium">Members:</span> {project._count.memberships + 1}
            </div>
            <div>
              <span className="font-medium">Tasks:</span> {project._count.tasks}
            </div>
          </div>
        </div>

        {/* Task Board */}
        <TaskBoard 
          projectId={project.id} 
          initialTasks={project.tasks} 
          members={members}
          isOwner={isOwner}
        />
      </div>
    </div>
  );
}
