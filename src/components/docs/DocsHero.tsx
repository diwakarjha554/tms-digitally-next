'use client';

import { Book } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DocsHero() {
  const scrollToSetup = () => {
    const element = document.getElementById('setup');
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="docs-hero mb-16">
      <div className="flex items-center gap-3 mb-4">
        <Book className="w-10 h-10 text-blue-600" />
        <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-gray-900 via-blue-800 to-purple-900 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
          Documentation
        </h1>
      </div>
      <p className="text-xl text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
        Complete guide to understanding, setting up, and deploying TaskFlow - A modern task management system built with
        Next.js 16, TypeScript, and Prisma.
      </p>
      <div className="flex flex-wrap gap-3">
        <Button onClick={scrollToSetup}>Quick Start Guide</Button>
        <Button variant="outline" asChild>
          <a href="https://github.com/diwakarjha554/tms-digitally-next" target="_blank">
            View on GitHub
          </a>
        </Button>
      </div>
    </div>
  );
}
