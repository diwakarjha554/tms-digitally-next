'use client';

import { Shield, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function AuthFlowSection() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const CodeBlock = ({ code, id }: { code: string; id: string }) => (
    <div className="relative group">
      <div className="absolute top-3 right-3 z-10">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => copyToClipboard(code, id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 hover:bg-gray-700 text-white"
        >
          {copiedCode === id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </Button>
      </div>
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto border border-gray-800">
        <code className="text-sm">{code}</code>
      </pre>
    </div>
  );

  return (
    <section id="auth-flow" className="docs-section scroll-mt-24">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-gray-900 dark:text-white">
        <Shield className="w-8 h-8 text-red-600" />
        Authentication Flow
      </h2>

      <div className="space-y-6">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          TaskFlow uses <strong>Auth.js v5 (NextAuth)</strong> with secure password hashing using bcrypt-ts and
          role-based access control. Sessions are managed with JWT tokens (30 days expiry).
        </p>

        {/* Auth Stack */}
        <div className="bg-linear-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
          <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Authentication Stack</h3>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <span>
                <strong>Auth.js v5:</strong> Modern authentication for Next.js
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <span>
                <strong>Credentials Provider:</strong> Email and password authentication
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <span>
                <strong>bcrypt-ts:</strong> Secure password hashing (10 salt rounds)
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <span>
                <strong>JWT Strategy:</strong> Token-based session (30 days)
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <span>
                <strong>Prisma:</strong> Direct database queries (no adapter)
              </span>
            </li>
          </ul>
        </div>

        {/* Registration Flow */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">1. Registration Flow</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-blue-600">1</span>
              </div>
              <div>
                <p className="text-gray-700 dark:text-gray-300">
                  User submits registration form (name, email, password)
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-blue-600">2</span>
              </div>
              <div>
                <p className="text-gray-700 dark:text-gray-300">Server-side validation using Zod schema</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-blue-600">3</span>
              </div>
              <div>
                <p className="text-gray-700 dark:text-gray-300">Check if email already exists in database</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-blue-600">4</span>
              </div>
              <div>
                <p className="text-gray-700 dark:text-gray-300">
                  Hash password using <code className="bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">bcrypt-ts</code>{' '}
                  (10 salt rounds)
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-blue-600">5</span>
              </div>
              <div>
                <p className="text-gray-700 dark:text-gray-300">Create user in database with default role (MEMBER)</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-green-600">✓</span>
              </div>
              <div>
                <p className="text-gray-700 dark:text-gray-300">Return success response and redirect to login page</p>
              </div>
            </div>
          </div>
        </div>

        {/* Login Flow */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">2. Login Flow (Auth.js)</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-purple-600">1</span>
              </div>
              <div>
                <p className="text-gray-700 dark:text-gray-300">User submits credentials through Auth.js SignIn form</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-purple-600">2</span>
              </div>
              <div>
                <p className="text-gray-700 dark:text-gray-300">
                  Credentials Provider triggers{' '}
                  <code className="bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">authorize()</code> callback
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-purple-600">3</span>
              </div>
              <div>
                <p className="text-gray-700 dark:text-gray-300">
                  Find user by email using Prisma and verify password with{' '}
                  <code className="bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">compare()</code>
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-purple-600">4</span>
              </div>
              <div>
                <p className="text-gray-700 dark:text-gray-300">
                  JWT token created via <code className="bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">jwt()</code>{' '}
                  callback with user data (id, email, role, createdAt)
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-purple-600">5</span>
              </div>
              <div>
                <p className="text-gray-700 dark:text-gray-300">
                  Session object populated via{' '}
                  <code className="bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">session()</code> callback
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-green-600">✓</span>
              </div>
              <div>
                <p className="text-gray-700 dark:text-gray-300">Redirect to dashboard (automatic by Auth.js)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Protected Routes */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
            3. Route Protection (<code className="text-sm">authorized</code> Callback)
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-orange-600">1</span>
              </div>
              <div>
                <p className="text-gray-700 dark:text-gray-300">
                  User navigates to any route (/, /login, /dashboard, /projects, /admin)
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-orange-600">2</span>
              </div>
              <div>
                <p className="text-gray-700 dark:text-gray-300">
                  Auth.js middleware triggers{' '}
                  <code className="bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">authorized()</code> callback
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-orange-600">3</span>
              </div>
              <div>
                <p className="text-gray-700 dark:text-gray-300">Check if route is public - allow access</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-orange-600">4</span>
              </div>
              <div>
                <p className="text-gray-700 dark:text-gray-300">
                  Check if route is admin route - verify ADMIN role or redirect to /dashboard
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-orange-600">5</span>
              </div>
              <div>
                <p className="text-gray-700 dark:text-gray-300">
                  Check if route is protected - verify authentication or redirect to /login with callbackUrl
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-green-600">✓</span>
              </div>
              <div>
                <p className="text-gray-700 dark:text-gray-300">Allow access if all checks pass</p>
              </div>
            </div>
          </div>
        </div>

        {/* Route Configuration */}
        <div className="bg-linear-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 p-6 rounded-xl border border-indigo-200 dark:border-indigo-800">
          <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Route Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-semibold text-green-600 mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-600"></span>
                Public Routes
              </h4>
              <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <code className="bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded">/</code>
                </li>
                <li className="flex items-center gap-2">
                  <code className="bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded">/login</code>
                </li>
              </ul>
              <p className="text-xs text-gray-500 mt-2">No auth required</p>
            </div>
            <div>
              <h4 className="font-semibold text-orange-600 mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-600"></span>
                Protected Routes
              </h4>
              <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <code className="bg-orange-100 dark:bg-orange-900/30 px-2 py-0.5 rounded">/dashboard</code>
                </li>
                <li className="flex items-center gap-2">
                  <code className="bg-orange-100 dark:bg-orange-900/30 px-2 py-0.5 rounded">/projects</code>
                </li>
              </ul>
              <p className="text-xs text-gray-500 mt-2">Auth required</p>
            </div>
            <div>
              <h4 className="font-semibold text-red-600 mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-600"></span>
                Admin Routes
              </h4>
              <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <code className="bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded">/admin</code>
                </li>
              </ul>
              <p className="text-xs text-gray-500 mt-2">ADMIN role only</p>
            </div>
          </div>
        </div>

        {/* File Structure */}
        <div>
          <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">File Structure</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-blue-600 mb-2">auth.ts</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Main NextAuth instance</p>
            </div>
            <div>
              <h4 className="font-semibold text-purple-600 mb-2">auth.config.ts</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Configuration & callbacks</p>
            </div>
          </div>
        </div>

        {/* Code Example: auth.ts */}
        <div>
          <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">auth.ts - Main Instance</h3>
          <CodeBlock
            id="auth-ts"
            code={`// auth.ts
import NextAuth from 'next-auth';
import { authConfig } from '@/auth.config';

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);`}
          />
        </div>

        {/* Code Example: auth.config.ts */}
        <div>
          <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">auth.config.ts - Configuration</h3>
          <CodeBlock
            id="auth-config"
            code={`// auth.config.ts
import type { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcrypt-ts';
import { prisma } from '@/lib/prisma';

// Route definitions
const publicRoutes = ['/login', '/'];
const protectedRoutes = ['/dashboard', '/projects'];
const adminRoutes = ['/admin'];

export const authConfig = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: String(credentials.email) },
        });

        if (!user) return null;

        const isValid = await compare(
          String(credentials.password),
          user.password
        );

        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          createdAt: user.createdAt.toISOString(),
        };
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.createdAt = (user as any).createdAt;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).createdAt = token.createdAt;
      }
      return session;
    },
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;

      // Helper function to match routes
      const matchesRoute = (routes: string[], path: string) => {
        return routes.some((route) => {
          if (route.endsWith('*')) {
            return path.startsWith(route.slice(0, -1));
          }
          return path === route || path.startsWith(route + '/');
        });
      };

      // Allow public routes
      if (matchesRoute(publicRoutes, pathname)) {
        // Redirect logged-in users from login to dashboard
        if (isLoggedIn && pathname === '/login') {
          return Response.redirect(new URL('/dashboard', nextUrl));
        }
        return true;
      }

      // Check admin routes
      if (matchesRoute(adminRoutes, pathname)) {
        if (!isLoggedIn) {
          const loginUrl = new URL('/login', nextUrl);
          loginUrl.searchParams.set('callbackUrl', pathname);
          return Response.redirect(loginUrl);
        }
        if ((auth?.user as any)?.role !== 'ADMIN') {
          return Response.redirect(new URL('/dashboard', nextUrl));
        }
        return true;
      }

      // Check protected routes
      if (matchesRoute(protectedRoutes, pathname)) {
        if (!isLoggedIn) {
          const loginUrl = new URL('/login', nextUrl);
          loginUrl.searchParams.set('callbackUrl', pathname);
          return Response.redirect(loginUrl);
        }
        return true;
      }

      return true;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  trustHost: true,
} satisfies NextAuthConfig;`}
          />
        </div>

        {/* Code Example: middleware.ts */}
        <div>
          <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">middleware.ts</h3>
          <CodeBlock
            id="middleware"
            code={`// middleware.ts
export { auth as middleware } from '@/auth';

export const config = {
  matcher: ['/dashboard/:path*', '/projects/:path*', '/admin/:path*', '/activity/:path*', '/profile/:path*'],
};`}
          />
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
            The <code className="bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">authorized</code> callback in
            auth.config.ts handles all route protection logic.
          </p>
        </div>

        {/* Usage in Server Components */}
        <div>
          <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Using Auth in Server Components</h3>
          <CodeBlock
            id="server-usage"
            code={`// app/activity/page.tsx
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import ActivityLogs from '@/components/activity/activity-logs';

export default async function ActivityPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  return <ActivityLogs />;
}`}
          />
        </div>

        {/* Role-Based Access */}
        <div className="bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-xl border border-purple-200 dark:border-purple-800">
          <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Role-Based Access Control</h3>
          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            <div>
              <h4 className="font-semibold text-purple-600 mb-2">ADMIN</h4>
              <ul className="ml-6 space-y-1 text-sm">
                <li>• Full access to all routes including /admin</li>
                <li>• Can manage users, projects, and system settings</li>
                <li>
                  • Checked in <code className="bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">authorized</code>{' '}
                  callback
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-600 mb-2">PROJECT_MANAGER</h4>
              <ul className="ml-6 space-y-1 text-sm">
                <li>• Can create and manage assigned projects</li>
                <li>• Can assign tasks to team members</li>
                <li>• Cannot access /admin routes (redirected to /dashboard)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-green-600 mb-2">MEMBER</h4>
              <ul className="ml-6 space-y-1 text-sm">
                <li>• Can view assigned projects and tasks</li>
                <li>• Can update own task status</li>
                <li>• Limited permissions</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Session Properties */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Session Object Properties</h3>
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <pre className="text-sm text-gray-700 dark:text-gray-300">
              {`session.user {
  id: string         // User ID
  email: string      // User email
  name: string       // User name
  role: UserRole     // ADMIN | PROJECT_MANAGER | MEMBER
  createdAt: string  // ISO timestamp
}`}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
