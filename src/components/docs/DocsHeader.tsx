'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, Sparkles, X } from 'lucide-react';

interface DocsHeaderProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

export default function DocsHeader({ isSidebarOpen, setIsSidebarOpen }: DocsHeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
      <div className="mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden">
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>

            {/* Logo */}
            <Link href="/docs" className="flex items-center gap-2 group">
              <div className="relative">
                {/* Logo Container */}
                <div className="relative w-10 h-10 md:w-12 md:h-12 rounded bg-linear-to-br from-blue-600 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <span className="text-xl md:text-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TaskFlow
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" asChild className="hidden md:flex">
              <a href="https://github.com/diwakarjha554/tms-digitally-next" target="_blank">
                GitHub
              </a>
            </Button>
            <Button size="sm" asChild>
              <Link href="/login">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
