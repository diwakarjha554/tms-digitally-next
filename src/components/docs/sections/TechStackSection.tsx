'use client';

import { Code } from 'lucide-react';

const techStacks = [
  {
    title: 'Frontend',
    gradient: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
    border: 'border-blue-200 dark:border-blue-800',
    items: [
      'Next.js 16 (App Router)',
      'React 19',
      'TypeScript',
      'Tailwind CSS',
      'Shadcn/ui components',
      'GSAP animations',
      'Three.js',
      'next-themes (dark mode)',
      'React Hook Form',
      'Zod validation',
    ],
  },
  {
    title: 'Backend',
    gradient: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
    border: 'border-purple-200 dark:border-purple-800',
    items: ['Next.js API Routes', 'Prisma ORM', 'PostgreSQL', 'JWT Authentication', 'bcrypt-ts', 'Middleware'],
  },
  {
    title: 'DevOps & Deployment',
    gradient: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
    border: 'border-green-200 dark:border-green-800',
    items: [
      'Vercel (recommended)',
      'Railway (PostgreSQL)',
      'Supabase (alternative DB)',
      'Git version control',
      'ESLint + Prettier',
      'Environment variables',
    ],
  },
  {
    title: 'Development Tools',
    gradient: 'from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20',
    border: 'border-orange-200 dark:border-orange-800',
    items: ['pnpm (package manager)', 'Prisma Studio', 'VS Code', 'PostgreSQL 15+', 'Node.js 18+', 'Git'],
  },
];

export default function TechStackSection() {
  return (
    <section id="tech-stack" className="docs-section scroll-mt-24">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-gray-900 dark:text-white">
        <Code className="w-8 h-8 text-green-600" />
        Tech Stack
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {techStacks.map((stack, index) => (
          <div
            key={index}
            className={`bg-linear-to-br ${stack.gradient} p-6 rounded border ${stack.border} transition-transform`}
          >
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{stack.title}</h3>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              {stack.items.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">Why This Stack?</h3>
        <ul className="space-y-2 text-gray-700 dark:text-gray-300">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-1">→</span>
            <span>
              <strong>Next.js 16:</strong> Best-in-class React framework with Server Components and optimized routing
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-1">→</span>
            <span>
              <strong>TypeScript:</strong> Type safety reduces bugs and improves developer experience
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-1">→</span>
            <span>
              <strong>Prisma:</strong> Type-safe database access with excellent DX and migration support
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-1">→</span>
            <span>
              <strong>PostgreSQL:</strong> Robust, scalable, and widely supported relational database
            </span>
          </li>
        </ul>
      </div>
    </section>
  );
}
