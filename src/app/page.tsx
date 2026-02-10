// src/app/page.tsx
import Link from 'next/link';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { ThemeToggle } from '@/components/theme-toggle';

export default async function HomePage() {
  const session = await auth();

  // If logged in, redirect to dashboard
  if (session?.user) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <span className="font-bold text-2xl text-gray-900 dark:text-white">TaskMS</span>
            </div>
            <div className="flex items-center space-x-3">
              {/* Theme Toggle Button */}
              <ThemeToggle />

              <Link
                href="/login"
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-6 py-2 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl font-semibold"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Task Management System
            <br />
            <span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Complete Documentation
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            A modern, full-stack task management system with role-based access control, built with Next.js 15,
            TypeScript, Prisma, and PostgreSQL.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-lg font-medium text-sm">
              Next.js 15
            </span>
            <span className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-lg font-medium text-sm">
              TypeScript
            </span>
            <span className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-lg font-medium text-sm">
              Prisma ORM
            </span>
            <span className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 rounded-lg font-medium text-sm">
              PostgreSQL
            </span>
            <span className="px-4 py-2 bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300 rounded-lg font-medium text-sm">
              NextAuth.js
            </span>
            <span className="px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-lg font-medium text-sm">
              Tailwind CSS
            </span>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a
            href="#features"
            className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700 text-center group"
          >
            <div className="text-3xl mb-2">✨</div>
            <div className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              Features
            </div>
          </a>
          <a
            href="#tech-stack"
            className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700 text-center group"
          >
            <div className="text-3xl mb-2">🛠️</div>
            <div className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              Tech Stack
            </div>
          </a>
          <a
            href="#setup"
            className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700 text-center group"
          >
            <div className="text-3xl mb-2">🚀</div>
            <div className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              Setup Guide
            </div>
          </a>
          <a
            href="#deployment"
            className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700 text-center group"
          >
            <div className="text-3xl mb-2">☁️</div>
            <div className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              Deployment
            </div>
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center">
            <span className="text-4xl mr-3">✨</span>
            Key Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="p-6 bg-linear-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg border border-purple-200 dark:border-purple-700">
              <h3 className="font-bold text-lg text-purple-900 dark:text-purple-300 mb-2">
                👑 Role-Based Access Control
              </h3>
              <ul className="space-y-2 text-purple-800 dark:text-purple-200 text-sm">
                <li>
                  • <strong>Admin</strong>: Full system access, user management
                </li>
                <li>
                  • <strong>Project Manager</strong>: Manage projects and tasks
                </li>
                <li>
                  • <strong>Member</strong>: View and update assigned tasks
                </li>
              </ul>
            </div>

            <div className="p-6 bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg border border-blue-200 dark:border-blue-700">
              <h3 className="font-bold text-lg text-blue-900 dark:text-blue-300 mb-2">📋 Kanban Board</h3>
              <ul className="space-y-2 text-blue-800 dark:text-blue-200 text-sm">
                <li>• Drag-and-drop task management</li>
                <li>• Three columns: To Do, In Progress, Done</li>
                <li>• Real-time status updates</li>
              </ul>
            </div>

            <div className="p-6 bg-linear-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg border border-green-200 dark:border-green-700">
              <h3 className="font-bold text-lg text-green-900 dark:text-green-300 mb-2">🎯 Task Management</h3>
              <ul className="space-y-2 text-green-800 dark:text-green-200 text-sm">
                <li>• Priority levels (Low, Medium, High)</li>
                <li>• Due dates with overdue indicators</li>
                <li>• Task assignments and tracking</li>
              </ul>
            </div>

            <div className="p-6 bg-linear-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 rounded-lg border border-indigo-200 dark:border-indigo-700">
              <h3 className="font-bold text-lg text-indigo-900 dark:text-indigo-300 mb-2">📊 Project Management</h3>
              <ul className="space-y-2 text-indigo-800 dark:text-indigo-200 text-sm">
                <li>• Create and manage multiple projects</li>
                <li>• Team member assignments</li>
                <li>• Project status tracking</li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-3">Additional Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700 dark:text-gray-300">
              <div>✓ JWT-based authentication</div>
              <div>✓ Activity logging & audit trails</div>
              <div>✓ User profile management</div>
              <div>✓ Password change functionality</div>
              <div>✓ Responsive design (mobile-first)</div>
              <div>✓ Dark mode support 🌙</div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="tech-stack" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center">
            <span className="text-4xl mr-3">🛠️</span>
            Technology Stack
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Frontend */}
            <div>
              <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4">Frontend</h3>
              <div className="space-y-3 text-gray-700 dark:text-gray-300">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <strong className="text-gray-900 dark:text-white">Next.js 15</strong> - React framework with App
                    Router
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <strong className="text-gray-900 dark:text-white">TypeScript</strong> - Type-safe development
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <strong className="text-gray-900 dark:text-white">Tailwind CSS</strong> - Utility-first styling
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <strong className="text-gray-900 dark:text-white">NextAuth.js v5</strong> - Authentication
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <strong className="text-gray-900 dark:text-white">next-themes</strong> - Dark mode support
                  </div>
                </div>
              </div>
            </div>

            {/* Backend */}
            <div>
              <h3 className="text-xl font-bold text-green-600 dark:text-green-400 mb-4">Backend</h3>
              <div className="space-y-3 text-gray-700 dark:text-gray-300">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <strong className="text-gray-900 dark:text-white">Next.js API Routes</strong> - RESTful API
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <strong className="text-gray-900 dark:text-white">Prisma ORM</strong> - Database ORM
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <strong className="text-gray-900 dark:text-white">PostgreSQL</strong> - Relational database
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <strong className="text-gray-900 dark:text-white">bcryptjs</strong> - Password hashing
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <strong className="text-gray-900 dark:text-white">JWT</strong> - Token authentication
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Architecture Diagram */}
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">System Architecture</h3>
            <pre className="text-xs overflow-x-auto text-gray-700 dark:text-gray-300">
              {`┌─────────────────────────────────────────────┐
│           CLIENT (Browser)                  │
│  Next.js Components + Tailwind CSS          │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│        NEXT.JS APP ROUTER                   │
│  • Authentication (NextAuth.js)             │
│  • Server Components                        │
│  • Client Components                        │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│         API ROUTES (REST)                   │
│  • /api/auth/*     - Authentication         │
│  • /api/projects/* - Project management     │
│  • /api/tasks/*    - Task management        │
│  • /api/users/*    - User management        │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│         PRISMA ORM                          │
│  Type-safe database queries                 │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│       POSTGRESQL DATABASE                   │
│  • Users    • Projects  • Tasks             │
│  • ProjectMemberships   • ActivityLogs      │
└─────────────────────────────────────────────┘`}
            </pre>
          </div>
        </div>
      </section>

      {/* Setup Guide Section */}
      <section id="setup" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center">
            <span className="text-4xl mr-3">🚀</span>
            Local Setup Guide
          </h2>

          {/* Prerequisites */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">📋 Prerequisites</h3>
            <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded">
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li>• Node.js 18 or higher</li>
                <li>• PostgreSQL 14 or higher</li>
                <li>• pnpm (recommended) or npm</li>
                <li>• Git</li>
              </ul>
            </div>
          </div>

          {/* Step by Step */}
          <div className="space-y-6">
            {/* Step 1 */}
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Step 1: Clone Repository</h4>
              <div className="bg-gray-900 dark:bg-black text-gray-100 p-4 rounded-lg text-sm font-mono overflow-x-auto">
                <div>git clone https://github.com/yourusername/tms-digitally-next.git</div>
                <div>cd tms-digitally-next</div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Step 2: Install Dependencies</h4>
              <div className="bg-gray-900 dark:bg-black text-gray-100 p-4 rounded-lg text-sm font-mono overflow-x-auto">
                <div>pnpm install</div>
                <div className="text-gray-500"># or npm install</div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Step 3: Set Up PostgreSQL</h4>
              <div className="bg-gray-900 dark:bg-black text-gray-100 p-4 rounded-lg text-sm font-mono overflow-x-auto">
                <div># Using Docker (easiest)</div>
                <div>docker run --name tms-postgres \</div>
                <div className="pl-4">-e POSTGRES_PASSWORD=postgres \</div>
                <div className="pl-4">-e POSTGRES_DB=tms_db \</div>
                <div className="pl-4">-p 5432:5432 \</div>
                <div className="pl-4">-d postgres:16-alpine</div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Step 4: Configure Environment</h4>
              <div className="bg-gray-900 dark:bg-black text-gray-100 p-4 rounded-lg text-sm font-mono overflow-x-auto">
                <div>cp .env.example .env</div>
              </div>
              <div className="mt-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 p-4 rounded-lg text-sm">
                <strong className="text-gray-900 dark:text-white">Edit .env file:</strong>
                <pre className="mt-2 bg-white dark:bg-gray-900 p-3 rounded border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200">
                  {`DATABASE_URL="postgresql://postgres:postgres@localhost:5432/tms_db"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"`}
                </pre>
                <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                  Generate secret:{' '}
                  <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">openssl rand -base64 32</code>
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Step 5: Database Setup</h4>
              <div className="bg-gray-900 dark:bg-black text-gray-100 p-4 rounded-lg text-sm font-mono overflow-x-auto">
                <div># Generate Prisma Client</div>
                <div>npx prisma generate</div>
                <div className="mt-2"># Run migrations</div>
                <div>npx prisma migrate dev</div>
                <div className="mt-2"># Seed database</div>
                <div>npx prisma db seed</div>
              </div>
            </div>

            {/* Step 6 */}
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Step 6: Start Development Server</h4>
              <div className="bg-gray-900 dark:bg-black text-gray-100 p-4 rounded-lg text-sm font-mono overflow-x-auto">
                <div>pnpm dev</div>
                <div className="text-gray-500"># Opens at http://localhost:3000</div>
              </div>
            </div>

            {/* Default Credentials */}
            <div className="bg-linear-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-700 p-6 rounded-lg">
              <h4 className="font-bold text-lg text-green-900 dark:text-green-300 mb-3">
                🔑 Default Login Credentials
              </h4>
              <div className="space-y-2 text-sm text-gray-800 dark:text-gray-200">
                <div>
                  <strong>Email:</strong> diwakarjha@digitallynext.com
                </div>
                <div>
                  <strong>Password:</strong> diwakar1234
                </div>
                <div>
                  <strong>Role:</strong> Admin
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Database Schema Section */}
      <section id="database" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center">
            <span className="text-4xl mr-3">💾</span>
            Database Schema
          </h2>

          <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-lg mb-6 border border-gray-200 dark:border-gray-700">
            <pre className="text-xs overflow-x-auto text-gray-700 dark:text-gray-300 font-mono">
              {`┌─────────────────┐         ┌──────────────────┐
│      User       │         │     Project      │
├─────────────────┤         ├──────────────────┤
│ id (PK)         │◄───────┤│ id (PK)          │
│ email (unique)  │  owner  │ name             │
│ password        │         │ description      │
│ name            │         │ status           │
│ role            │         │ ownerId (FK)     │
│ isActive        │         │ managerId (FK)   │
│ createdAt       │         │ createdAt        │
│ updatedAt       │         │ updatedAt        │
└─────────────────┘         └──────────────────┘
        │                           │
        │                           │
        │                   ┌───────┴────────┐
        │                   │                 │
        │           ┌───────▼──────────┐ ┌───▼──────────┐
        │           │ ProjectMembership│ │     Task     │
        │           ├──────────────────┤ ├──────────────┤
        └──────────►│ userId (FK)      │ │ id (PK)      │
         assignee   │ projectId (FK)   │ │ title        │
                    │ createdAt        │ │ description  │
                    └──────────────────┘ │ status       │
                                         │ priority     │
                                         │ dueDate      │
                                         │ order        │
                                         │ assigneeId   │
                                         │ projectId    │
                                         │ createdById  │
                                         │ completedAt  │
                                         └──────────────┘
                                                │
                                                │
                                         ┌──────▼────────┐
                                         │ ActivityLog   │
                                         ├───────────────┤
                                         │ id (PK)       │
                                         │ action        │
                                         │ entity        │
                                         │ entityId      │
                                         │ details       │
                                         │ userId (FK)   │
                                         │ projectId (FK)│
                                         │ taskId (FK)   │
                                         │ createdAt     │
                                         └───────────────┘`}
            </pre>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
              <h4 className="font-bold text-purple-900 dark:text-purple-300 mb-2">User Roles</h4>
              <ul className="text-sm text-purple-800 dark:text-purple-200 space-y-1">
                <li>
                  • <strong>ADMIN</strong> - Full system control
                </li>
                <li>
                  • <strong>PROJECT_MANAGER</strong> - Manage projects
                </li>
                <li>
                  • <strong>MEMBER</strong> - Regular team member
                </li>
              </ul>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
              <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-2">Task Status</h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>
                  • <strong>TODO</strong> - Not started
                </li>
                <li>
                  • <strong>IN_PROGRESS</strong> - Work in progress
                </li>
                <li>
                  • <strong>DONE</strong> - Completed
                </li>
              </ul>
            </div>

            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
              <h4 className="font-bold text-green-900 dark:text-green-300 mb-2">Task Priority</h4>
              <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
                <li>
                  • <strong>LOW</strong> - Low priority
                </li>
                <li>
                  • <strong>MEDIUM</strong> - Medium priority
                </li>
                <li>
                  • <strong>HIGH</strong> - High priority
                </li>
              </ul>
            </div>

            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
              <h4 className="font-bold text-yellow-900 dark:text-yellow-300 mb-2">Project Status</h4>
              <ul className="text-sm text-yellow-800 dark:text-yellow-200 space-y-1">
                <li>
                  • <strong>ACTIVE</strong> - Ongoing project
                </li>
                <li>
                  • <strong>ON_HOLD</strong> - Temporarily paused
                </li>
                <li>
                  • <strong>COMPLETED</strong> - Finished
                </li>
              </ul>
            </div>
          </div>

          {/* Database Tables Info */}
          <div className="mt-6 bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-lg border border-indigo-200 dark:border-indigo-700">
            <h4 className="font-bold text-indigo-900 dark:text-indigo-300 mb-3">📊 Database Tables Overview</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
              <div>
                <strong className="text-gray-900 dark:text-white">User:</strong> Stores all user accounts with
                authentication
              </div>
              <div>
                <strong className="text-gray-900 dark:text-white">Project:</strong> Contains project details and
                ownership
              </div>
              <div>
                <strong className="text-gray-900 dark:text-white">ProjectMembership:</strong> Many-to-many user-project
                relation
              </div>
              <div>
                <strong className="text-gray-900 dark:text-white">Task:</strong> Individual work items within projects
              </div>
              <div>
                <strong className="text-gray-900 dark:text-white">ActivityLog:</strong> Audit trail for all system
                actions
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Deployment Section */}
      <section id="deployment" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center">
            <span className="text-4xl mr-3">☁️</span>
            Deployment Guide
          </h2>

          <div className="space-y-6">
            {/* Vercel Deployment */}
            <div className="border-2 border-blue-200 dark:border-blue-700 rounded-lg p-6 bg-blue-50 dark:bg-blue-900/20">
              <h3 className="text-xl font-bold text-blue-900 dark:text-blue-300 mb-4">
                Deploy to Vercel (Recommended)
              </h3>

              <ol className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
                <li>
                  <strong className="text-gray-900 dark:text-white">1. Create Database</strong>
                  <div className="mt-2 space-y-1">
                    <div>
                      • Supabase:{' '}
                      <a href="https://supabase.com" className="text-blue-600 dark:text-blue-400 underline">
                        supabase.com
                      </a>{' '}
                      (Free tier)
                    </div>
                    <div>
                      • Neon:{' '}
                      <a href="https://neon.tech" className="text-blue-600 dark:text-blue-400 underline">
                        neon.tech
                      </a>{' '}
                      (Free tier)
                    </div>
                    <div>
                      • Railway:{' '}
                      <a href="https://railway.app" className="text-blue-600 dark:text-blue-400 underline">
                        railway.app
                      </a>
                    </div>
                  </div>
                </li>

                <li>
                  <strong className="text-gray-900 dark:text-white">2. Push to GitHub</strong>
                  <div className="mt-2 bg-gray-900 dark:bg-black text-gray-100 p-3 rounded font-mono text-xs">
                    <div>git add .</div>
                    <div>git commit -m "Initial commit"</div>
                    <div>git push origin main</div>
                  </div>
                </li>

                <li>
                  <strong className="text-gray-900 dark:text-white">3. Deploy on Vercel</strong>
                  <div className="mt-2">
                    <div>
                      • Go to{' '}
                      <a href="https://vercel.com" className="text-blue-600 dark:text-blue-400 underline">
                        vercel.com
                      </a>
                    </div>
                    <div>• Import GitHub repository</div>
                    <div>• Add environment variables</div>
                    <div>• Click Deploy</div>
                  </div>
                </li>

                <li>
                  <strong className="text-gray-900 dark:text-white">4. Environment Variables</strong>
                  <div className="mt-2 bg-white dark:bg-gray-900 p-3 rounded border border-gray-200 dark:border-gray-700 text-xs">
                    <div className="text-gray-800 dark:text-gray-200">DATABASE_URL=your-production-database-url</div>
                    <div className="text-gray-800 dark:text-gray-200">NEXTAUTH_SECRET=your-secret-key</div>
                    <div className="text-gray-800 dark:text-gray-200">NEXTAUTH_URL=https://your-app.vercel.app</div>
                  </div>
                </li>

                <li>
                  <strong className="text-gray-900 dark:text-white">5. Run Migrations</strong>
                  <div className="mt-2 bg-gray-900 dark:bg-black text-gray-100 p-3 rounded font-mono text-xs">
                    <div>npx prisma migrate deploy</div>
                    <div>npx prisma db seed</div>
                  </div>
                </li>
              </ol>
            </div>

            {/* Docker Deployment */}
            <div className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-gray-50 dark:bg-gray-900/20">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Deploy with Docker</h3>
              <div className="bg-gray-900 dark:bg-black text-gray-100 p-4 rounded-lg text-sm font-mono overflow-x-auto">
                <div># Build image</div>
                <div>docker build -t tms-app .</div>
                <div className="mt-2"># Run container</div>
                <div>docker run -p 3000:3000 \</div>
                <div className="pl-4">-e DATABASE_URL="..." \</div>
                <div className="pl-4">-e NEXTAUTH_SECRET="..." \</div>
                <div className="pl-4">tms-app</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* API Documentation */}
      <section id="api" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center">
            <span className="text-4xl mr-3">📡</span>
            API Endpoints
          </h2>

          <div className="space-y-4">
            {/* Auth Endpoints */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900/20">
              <h3 className="font-bold text-lg mb-3 text-purple-600 dark:text-purple-400">Authentication</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-3">
                  <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 rounded font-mono text-xs">
                    POST
                  </span>
                  <code className="text-gray-800 dark:text-gray-200">/api/auth/register</code>
                  <span className="text-gray-600 dark:text-gray-400">- Register new user</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded font-mono text-xs">
                    POST
                  </span>
                  <code className="text-gray-800 dark:text-gray-200">/api/auth/signin</code>
                  <span className="text-gray-600 dark:text-gray-400">- User login</span>
                </div>
              </div>
            </div>

            {/* Project Endpoints */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900/20">
              <h3 className="font-bold text-lg mb-3 text-blue-600 dark:text-blue-400">Projects</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-3">
                  <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded font-mono text-xs">
                    GET
                  </span>
                  <code className="text-gray-800 dark:text-gray-200">/api/projects</code>
                  <span className="text-gray-600 dark:text-gray-400">- List projects</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 rounded font-mono text-xs">
                    POST
                  </span>
                  <code className="text-gray-800 dark:text-gray-200">/api/projects</code>
                  <span className="text-gray-600 dark:text-gray-400">- Create project (Admin)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 px-2 py-1 rounded font-mono text-xs">
                    PATCH
                  </span>
                  <code className="text-gray-800 dark:text-gray-200">/api/projects/[id]</code>
                  <span className="text-gray-600 dark:text-gray-400">- Update project</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 px-2 py-1 rounded font-mono text-xs">
                    DELETE
                  </span>
                  <code className="text-gray-800 dark:text-gray-200">/api/projects/[id]</code>
                  <span className="text-gray-600 dark:text-gray-400">- Delete project</span>
                </div>
              </div>
            </div>

            {/* Task Endpoints */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900/20">
              <h3 className="font-bold text-lg mb-3 text-green-600 dark:text-green-400">Tasks</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-3">
                  <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded font-mono text-xs">
                    GET
                  </span>
                  <code className="text-gray-800 dark:text-gray-200">/api/tasks</code>
                  <span className="text-gray-600 dark:text-gray-400">- List tasks</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 rounded font-mono text-xs">
                    POST
                  </span>
                  <code className="text-gray-800 dark:text-gray-200">/api/tasks</code>
                  <span className="text-gray-600 dark:text-gray-400">- Create task</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 px-2 py-1 rounded font-mono text-xs">
                    PATCH
                  </span>
                  <code className="text-gray-800 dark:text-gray-200">/api/tasks/[id]</code>
                  <span className="text-gray-600 dark:text-gray-400">- Update task</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 px-2 py-1 rounded font-mono text-xs">
                    DELETE
                  </span>
                  <code className="text-gray-800 dark:text-gray-200">/api/tasks/[id]</code>
                  <span className="text-gray-600 dark:text-gray-400">- Delete task</span>
                </div>
              </div>
            </div>

            {/* User Endpoints */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900/20">
              <h3 className="font-bold text-lg mb-3 text-indigo-600 dark:text-indigo-400">Users</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-3">
                  <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded font-mono text-xs">
                    GET
                  </span>
                  <code className="text-gray-800 dark:text-gray-200">/api/users</code>
                  <span className="text-gray-600 dark:text-gray-400">- List users (Admin)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 px-2 py-1 rounded font-mono text-xs">
                    PATCH
                  </span>
                  <code className="text-gray-800 dark:text-gray-200">/api/users/[id]</code>
                  <span className="text-gray-600 dark:text-gray-400">- Update user</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 px-2 py-1 rounded font-mono text-xs">
                    DELETE
                  </span>
                  <code className="text-gray-800 dark:text-gray-200">/api/users/[id]</code>
                  <span className="text-gray-600 dark:text-gray-400">- Delete user (Admin)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-linear-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 rounded-2xl p-12 text-center shadow-2xl text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Start?</h2>
          <p className="text-xl mb-8 opacity-90">Create your account and start managing projects efficiently</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl font-semibold text-lg"
            >
              Create Free Account
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 bg-white/20 backdrop-blur text-white rounded-lg hover:bg-white/30 transition-all font-semibold text-lg border-2 border-white/50"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-linear-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">T</span>
                </div>
                <span className="font-bold text-xl text-gray-900 dark:text-white">TaskMS</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Modern task management system for teams of all sizes.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-3">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>
                  <a href="#features" className="hover:text-blue-600 dark:hover:text-blue-400">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#tech-stack" className="hover:text-blue-600 dark:hover:text-blue-400">
                    Tech Stack
                  </a>
                </li>
                <li>
                  <a href="#setup" className="hover:text-blue-600 dark:hover:text-blue-400">
                    Setup Guide
                  </a>
                </li>
                <li>
                  <a href="#deployment" className="hover:text-blue-600 dark:hover:text-blue-400">
                    Deployment
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-3">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>
                  <a href="#database" className="hover:text-blue-600 dark:hover:text-blue-400">
                    Database Schema
                  </a>
                </li>
                <li>
                  <a href="#api" className="hover:text-blue-600 dark:hover:text-blue-400">
                    API Documentation
                  </a>
                </li>
                <li>
                  <Link href="/login" className="hover:text-blue-600 dark:hover:text-blue-400">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-blue-600 dark:hover:text-blue-400">
                    Register
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-3">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>diwakarjha@digitallynext.com</li>
                <li>GitHub: @yourusername</li>
                <li>Built with Next.js 15</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-600 dark:text-gray-400 text-sm mb-4 md:mb-0">
              © 2026 Task Management System. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm text-gray-600 dark:text-gray-400">
              <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">
                Terms of Service
              </a>
              <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">
                License: MIT
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
