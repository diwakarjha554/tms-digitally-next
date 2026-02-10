// src/components/projects/edit-project-form.tsx
'use client';

import { useState, useEffect, SyntheticEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
}

interface Project {
  id: string;
  name: string;
  description: string | null;
  status: string;
  managerId: string | null;
  memberships: Array<{
    userId: string;
  }>;
}

export default function EditProjectForm({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [project, setProject] = useState<Project | null>(null);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  useEffect(() => {
    fetchData();
  }, [projectId]);

  async function fetchData() {
    try {
      const [usersRes, projectRes] = await Promise.all([fetch('/api/users'), fetch(`/api/projects/${projectId}`)]);

      const usersData = await usersRes.json();
      const projectData = await projectRes.json();

      setUsers(usersData);
      setProject(projectData);
      setSelectedMembers(projectData.memberships.map((m: any) => m.userId));
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setError('Failed to load project');
    } finally {
      setFetchLoading(false);
    }
  }

  async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      description: formData.get('description'),
      status: formData.get('status'),
      managerId: formData.get('managerId') || null,
      memberIds: selectedMembers,
    };

    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to update project');
      }

      router.push(`/projects/${projectId}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  if (fetchLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="bg-white rounded p-6">
            <div className="space-y-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded p-12 text-center">
          <p className="text-red-600">Project not found</p>
        </div>
      </div>
    );
  }

  const projectManagers = users.filter((u) => u.role === 'PROJECT_MANAGER');
  const members = users.filter((u) => u.role === 'MEMBER');

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          href={`/projects/${projectId}`}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center"
        >
          ← Back to Project
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mt-4">Edit Project</h1>
        <p className="text-gray-600 mt-1">Update project details and team members</p>
      </div>

      <div className="bg-white rounded shadow-xs border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">{error}</div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Project Name *</label>
            <input
              name="name"
              type="text"
              required
              minLength={3}
              defaultValue={project.name}
              className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="e.g., E-commerce Platform"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
            <textarea
              name="description"
              required
              rows={4}
              defaultValue={project.description || ''}
              className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
              placeholder="Describe the project goals and objectives"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Status *</label>
            <select
              name="status"
              required
              defaultValue={project.status}
              className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            >
              <option value="ACTIVE">Active</option>
              <option value="ON_HOLD">On Hold</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Project Manager</label>
            <select
              name="managerId"
              defaultValue={project.managerId || ''}
              className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            >
              <option value="">No Manager</option>
              {projectManagers.map((pm) => (
                <option key={pm.id} value={pm.id}>
                  {pm.name || pm.email}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Team Members</label>
            <div className="border border-gray-300 rounded max-h-60 overflow-y-auto">
              {members.length === 0 ? (
                <div className="p-4 text-center text-gray-500 text-sm">No members available</div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {members.map((member) => (
                    <label key={member.id} className="flex items-center p-3 hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedMembers.includes(member.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedMembers([...selectedMembers, member.id]);
                          } else {
                            setSelectedMembers(selectedMembers.filter((id) => id !== member.id));
                          }
                        }}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{member.name || 'No name'}</p>
                        <p className="text-xs text-gray-500">{member.email}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-linear-to-r from-blue-600 to-indigo-600 text-white py-3 rounded font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xs hover:shadow-xs"
            >
              {loading ? 'Updating...' : 'Update Project'}
            </button>
            <Link
              href={`/projects/${projectId}`}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded font-semibold hover:bg-gray-200 transition-colors text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
