'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Zap, Shield } from 'lucide-react';
import ThreeBackground from '@/components/three-background';

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current || !heroRef.current) return;
    hasAnimated.current = true;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Hero text animations
      tl.from('.hero-badge', {
        y: 30,
        opacity: 0,
        duration: 0.8,
      })
        .from(
          '.hero-title',
          {
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.1,
          },
          '-=0.4'
        )
        .from(
          '.hero-description',
          {
            y: 30,
            opacity: 0,
            duration: 0.8,
          },
          '-=0.6'
        )
        .from(
          '.hero-buttons',
          {
            y: 30,
            opacity: 0,
            duration: 0.8,
          },
          '-=0.4'
        )
        .from(
          '.hero-stats',
          {
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
          },
          '-=0.4'
        )
        .from(
          '.hero-feature-card',
          {
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
          },
          '-=0.6'
        );

      // Floating animation for feature cards
      gsap.to('.hero-feature-card', {
        y: -10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
        stagger: 0.3,
      });

      // Sparkle animation
      gsap.to('.sparkle-icon', {
        scale: 1.2,
        rotation: 180,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-32"
    >
      {/* Three.js Background */}
      <ThreeBackground />

      {/* linear Overlays */}
      <div className="absolute inset-0 bg-linear-to-b from-blue-500/5 via-purple-500/5 to-transparent pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="hero-badge inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 backdrop-blur-sm mb-8">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 sparkle-icon" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Next-Generation Task Management
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="hero-title block bg-linear-to-r from-gray-900 via-blue-800 to-purple-900 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
              Transform Your
            </span>
            <span className="hero-title block bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              Project Management
            </span>
          </h1>

          {/* Description */}
          <p className="hero-description text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed">
            Enterprise-grade task management system built with cutting-edge technology. Streamline workflows, boost
            productivity, and deliver projects faster.
          </p>

          {/* CTA Buttons */}
          <div className="hero-buttons flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/register">
              <Button
                size="lg"
                className="group relative px-8 py-6 text-lg bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/docs">
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-6 text-lg border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
              >
                View Documentation
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-gray-400 dark:border-gray-600 flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-gray-400 dark:bg-gray-600 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}
