'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '@/components/landing/navbar';
import HeroSection from '@/components/landing/hero-section';
import FeaturesSection from '@/components/landing/features-section';
import HowItWorks from '@/components/landing/how-it-works';
import BenefitsSection from '@/components/landing/benefits-section';
import Footer from '@/components/landing/footer';
import { SmoothScrollProvider } from '@/components/providers/smooth-scroll-provider';

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
  useEffect(() => {
    // Smooth scroll setup
    const lenis = {
      smooth: true,
      duration: 1.2,
    };

    // Smooth scroll to anchor links
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLAnchorElement;
      if (target.tagName === 'A' && target.hash) {
        e.preventDefault();
        const element = document.querySelector(target.hash);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <SmoothScrollProvider>
      <main className="relative w-full overflow-x-hidden bg-linear-to-b from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <Navbar />
        <HeroSection />
        <div id="features">
          <FeaturesSection />
        </div>
        <div id="how-it-works">
          <HowItWorks />
        </div>
        <div id="benefits">
          <BenefitsSection />
        </div>
        <Footer />
      </main>
    </SmoothScrollProvider>
  );
}
