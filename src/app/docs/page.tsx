'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import DocsHeader from '@/components/docs/DocsHeader';
import DocsSidebar from '@/components/docs/DocsSidebar';
import DocsHero from '@/components/docs/DocsHero';
import TechStackSection from '@/components/docs/sections/TechStackSection';
import ArchitectureSection from '@/components/docs/sections/ArchitectureSection';
import DatabaseSection from '@/components/docs/sections/DatabaseSection';
import AuthFlowSection from '@/components/docs/sections/AuthFlowSection';
import ApiStructureSection from '@/components/docs/sections/ApiStructureSection';
import UiStrategySection from '@/components/docs/sections/UiStrategySection';
import SetupSection from '@/components/docs/sections/SetupSection';
import DeploymentSection from '@/components/docs/sections/DeploymentSection';
import OverviewSection from '@/components/docs/OverviewSection';
import FeaturesSection from '@/components/docs/FeaturesSection';

gsap.registerPlugin(ScrollTrigger);

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Hero animation
      gsap.from('.docs-hero', {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      });

      // Sections stagger animation
      gsap.from('.docs-section', {
        scrollTrigger: {
          trigger: '.docs-content',
          start: 'top 80%',
        },
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
      });
    }, containerRef);

    const observerOptions = {
      root: null,
      rootMargin: '-80px 0px -80% 0px', // Top offset for header, bottom keeps only top visible
      threshold: [0, 0.25, 0.5, 0.75, 1], // Multiple thresholds for better detection
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      // Find the entry with highest intersection ratio that's actually visible
      const visibleEntries = entries.filter((entry) => entry.isIntersecting);

      if (visibleEntries.length > 0) {
        // Sort by intersection ratio and position
        const topEntry = visibleEntries.reduce((prev, current) => {
          const prevTop = prev.boundingClientRect.top;
          const currentTop = current.boundingClientRect.top;

          // Prefer the section closest to the top of viewport
          if (Math.abs(currentTop) < Math.abs(prevTop)) {
            return current;
          }
          return prev;
        });

        if (topEntry.target.id) {
          setActiveSection(topEntry.target.id);
        }
      }
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all sections
    const sectionIds = [
      'overview',
      'features',
      'tech-stack',
      'architecture',
      'database',
      'auth-flow',
      'api-structure',
      'ui-strategy',
      'setup',
      'deployment',
    ];

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      ctx.revert();
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-linear-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900"
    >
      <DocsHeader isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      <div className="flex">
        <DocsSidebar activeSection={activeSection} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

        <main className="flex-1 lg:ml-80">
          <div className="container mx-auto px-4 lg:px-8 py-8">
            <div className="mx-auto">
              <DocsHero />

              <div className="docs-content space-y-20">
                <OverviewSection />
                <FeaturesSection />
                <TechStackSection />
                <ArchitectureSection />
                <DatabaseSection />
                <AuthFlowSection />
                <ApiStructureSection />
                <UiStrategySection />
                <SetupSection />
                <DeploymentSection />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
