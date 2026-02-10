import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import NextTopLoader from 'nextjs-toploader';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '@/components/theme-provider';
import { SmoothScrollProvider } from '@/components/providers/smooth-scroll-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TaskMS - Task Management System',
  description:
    'A powerful task management system with role-based access control, kanban boards, and real-time collaboration.',
  keywords: ['task management', 'project management', 'kanban', 'team collaboration'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <NextTopLoader color="#98FF98" height={2} showSpinner={false} />
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SessionProvider>
            <SmoothScrollProvider>{children}</SmoothScrollProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
