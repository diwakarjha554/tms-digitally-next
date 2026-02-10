import type { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcrypt-ts';
import { prisma } from '@/lib/prisma';

// Public routes - no auth needed
const publicRoutes = ['/login', '/'];

// Protected routes - auth required
const protectedRoutes = ['/dashboard', '/projects'];

// Admin only routes
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

        if (!user) {
          return null;
        }

        const isValid = await compare(String(credentials.password), user.password);

        if (!isValid) {
          return null;
        }

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

      // Helper to match routes
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
} satisfies NextAuthConfig;
