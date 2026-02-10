'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Book, Code, Database, Workflow, Shield, Server, Palette, Terminal, GitBranch, Zap, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DocsSidebarProps {
  activeSection: string;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

const sections = [
  { id: 'overview', label: 'Overview', icon: Book },
  { id: 'features', label: 'Core Features', icon: Zap },
  { id: 'tech-stack', label: 'Tech Stack', icon: Code },
  { id: 'architecture', label: 'Architecture', icon: Workflow },
  { id: 'database', label: 'Database Schema', icon: Database },
  { id: 'auth-flow', label: 'Authentication', icon: Shield },
  { id: 'api-structure', label: 'API Structure', icon: Server },
  { id: 'ui-strategy', label: 'UI Strategy', icon: Palette },
  { id: 'setup', label: 'Local Setup', icon: Terminal },
  { id: 'deployment', label: 'Deployment', icon: GitBranch },
];

export default function DocsSidebar({ activeSection, isSidebarOpen, setIsSidebarOpen }: DocsSidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sidebarRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.sidebar-item', {
        x: -20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: 'power2.out',
      });
    }, sidebarRef);

    return () => ctx.revert();
  }, []);

  const handleLinkClick = (sectionId: string) => {
    setIsSidebarOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80; // Header height
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] w-80 transform transition-transform duration-300 ease-in-out bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 overflow-y-auto ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Navigation</h2>
            <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <nav className="space-y-1">
            {sections.map((section) => {
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => handleLinkClick(section.id)}
                  className={`sidebar-item w-full flex items-center gap-3 px-4 py-3 rounded transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <section.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-blue-600 dark:text-blue-400' : ''}`} />
                  <span className="text-sm">{section.label}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>

          <div className="mt-8 p-4 rounded bg-linear-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
              Need help? Check out our GitHub repository or contact support.
            </p>
            <Button size="sm" variant="outline" className="w-full" asChild>
              <a href="https://github.com/diwakarjha554/tms-digitally-next" target="_blank">
                View on GitHub
              </a>
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
