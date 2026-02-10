'use client';

import { Book, Users, FolderKanban, CheckCircle2, ChevronRight } from 'lucide-react';

export default function OverviewSection() {
  return (
    <section id="overview" className="docs-section scroll-mt-24">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-gray-900 dark:text-white">
        <Book className="w-8 h-8 text-blue-600" />
        Project Overview
      </h2>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
          TaskFlow is a modern, full-stack task management system built with <strong>Next.js 16</strong>,{' '}
          <strong>TypeScript</strong>, and <strong>Prisma ORM</strong>. It provides enterprise-grade features for
          managing projects, tasks, and teams with role-based access control.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
          <div className="duration-300 bg-linear-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 rounded border border-blue-200 dark:border-blue-800 transition">
            <Users className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">User Management</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Role-based access with Admin, Project Manager, and Member roles
            </p>
          </div>

          <div className="duration-300 bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded border border-purple-200 dark:border-purple-800  transition">
            <FolderKanban className="w-8 h-8 text-purple-600 mb-3" />
            <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Project Management</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Create and manage projects with team assignments</p>
          </div>

          <div className="duration-300 bg-linear-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded border border-green-200 dark:border-green-800 transition">
            <CheckCircle2 className="w-8 h-8 text-green-600 mb-3" />
            <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Task Tracking</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Kanban boards with drag-and-drop task management</p>
          </div>
        </div>

        <h3 className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">Key Highlights</h3>
        <ul className="space-y-3 text-gray-700 dark:text-gray-300">
          <li className="flex items-start gap-2">
            <ChevronRight className="w-5 h-5 text-blue-600 mt-1 shrink-0" />
            <span>
              <strong>Type-Safe:</strong> Full TypeScript implementation with end-to-end type safety
            </span>
          </li>
          <li className="flex items-start gap-2">
            <ChevronRight className="w-5 h-5 text-blue-600 mt-1 shrink-0" />
            <span>
              <strong>Modern Stack:</strong> Next.js 16, React 19, Prisma, PostgreSQL
            </span>
          </li>
          <li className="flex items-start gap-2">
            <ChevronRight className="w-5 h-5 text-blue-600 mt-1 shrink-0" />
            <span>
              <strong>Responsive Design:</strong> Mobile-first approach with Tailwind CSS
            </span>
          </li>
          <li className="flex items-start gap-2">
            <ChevronRight className="w-5 h-5 text-blue-600 mt-1 shrink-0" />
            <span>
              <strong>Smooth Animations:</strong> GSAP-powered transitions and Three.js backgrounds
            </span>
          </li>
          <li className="flex items-start gap-2">
            <ChevronRight className="w-5 h-5 text-blue-600 mt-1 shrink-0" />
            <span>
              <strong>Production Ready:</strong> Optimized for deployment on Vercel / Render / Railway / Neon / Supabase
              (Postgres only) / AWS / Any Cloud VPS
            </span>
          </li>
        </ul>
      </div>
    </section>
  );
}
