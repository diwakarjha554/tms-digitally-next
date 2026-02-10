'use client';

import { Workflow } from 'lucide-react';

export default function ArchitectureSection() {
  return (
    <section id="architecture" className="docs-section scroll-mt-24">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-gray-900 dark:text-white">
        <Workflow className="w-8 h-8 text-indigo-600" />
        Architecture
      </h2>

      <div className="space-y-6">
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            TaskFlow follows a modern <strong>monolithic architecture</strong> with clear separation of concerns using
            Next.js App Router structure.
          </p>
        </div>

        {/* Architecture Diagram */}
        <div className="bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-8 rounded border border-gray-200 dark:border-gray-700">
          <div className="space-y-4">
            {/* Layer 1: Client */}
            <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded border-2 border-blue-300 dark:border-blue-700">
              <h4 className="font-bold text-blue-900 dark:text-blue-200 mb-2">1. Client Layer (Browser)</h4>
              <p className="text-sm text-blue-800 dark:text-blue-300">
                React Components • GSAP Animations • Three.js • Tailwind CSS
              </p>
            </div>

            <div className="flex justify-center">
              <div className="w-1 h-8 bg-linear-to-b from-blue-300 to-purple-300" />
            </div>

            {/* Layer 2: Next.js */}
            <div className="bg-purple-100 dark:bg-purple-900/30 p-4 rounded border-2 border-purple-300 dark:border-purple-700">
              <h4 className="font-bold text-purple-900 dark:text-purple-200 mb-2">2. Next.js App Router</h4>
              <p className="text-sm text-purple-800 dark:text-purple-300">
                Server Components • API Routes • Middleware (Auth)
              </p>
            </div>

            <div className="flex justify-center">
              <div className="w-1 h-8 bg-linear-to-b from-purple-300 to-green-300" />
            </div>

            {/* Layer 3: Business Logic */}
            <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded border-2 border-green-300 dark:border-green-700">
              <h4 className="font-bold text-green-900 dark:text-green-200 mb-2">3. Business Logic Layer</h4>
              <p className="text-sm text-green-800 dark:text-green-300">
                Auth Service • Project Service • Task Service • User Service
              </p>
            </div>

            <div className="flex justify-center">
              <div className="w-1 h-8 bg-linear-to-b from-green-300 to-orange-300" />
            </div>

            {/* Layer 4: Data Access */}
            <div className="bg-orange-100 dark:bg-orange-900/30 p-4 rounded border-2 border-orange-300 dark:border-orange-700">
              <h4 className="font-bold text-orange-900 dark:text-orange-200 mb-2">4. Data Access Layer</h4>
              <p className="text-sm text-orange-800 dark:text-orange-300">Prisma ORM • Type-safe queries</p>
            </div>

            <div className="flex justify-center">
              <div className="w-1 h-8 bg-linear-to-b from-orange-300 to-red-300" />
            </div>

            {/* Layer 5: Database */}
            <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded border-2 border-red-300 dark:border-red-700">
              <h4 className="font-bold text-red-900 dark:text-red-200 mb-2">5. Database Layer</h4>
              <p className="text-sm text-red-800 dark:text-red-300">PostgreSQL Database</p>
            </div>
          </div>
        </div>

        {/* Folder Structure */}
        <div className="mt-8">
          <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Folder Structure</h3>
          <div className="bg-gray-900 text-gray-100 p-6 rounded overflow-x-auto">
            <pre className="text-sm">
              {`
taskflow/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   │
│   ├── (app)/                # protected app routes
│   │   ├── activity/
│   │   ├── admin/
│   │   ├── dashboard/
│   │   ├── profile/
│   │   ├── projects/
│   │   └── tasks/
│   │
│   ├── docs/
│   │   └── page.tsx
│   │
│   ├── api/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── projects/
│   │   ├── tasks/
│   │   └── admin/
│   │
│   ├── error.tsx
│   ├── loading.tsx
│   ├── not-found.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
│
├── components/
|   ├── activity/
|   ├── admin/
|   ├── dashboard/
|   ├── docs/
|   ├── landing/
|   ├── layout/
|   ├── profile/
|   ├── projects/
|   ├── providers/
|   ├── tasks/
|   ├── ui/
|   ├── theme-provider.tsx
|   ├── theme-toggle.tsx
|   └── three-background.tsx
│
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   └── utils.ts
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── types/
│   └── next-auth.d.ts
│
├── config/
│   ├── auth.config.ts
│   └── prisma.config.ts
│
├── public/
│
├── .env
├── middleware.ts
├── next.config.ts
├── tsconfig.json
├── eslint.config.mjs
├── components.json
├── package.json
└── pnpm-lock.yaml
              `}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
