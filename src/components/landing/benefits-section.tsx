'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TrendingUp, DollarSign, Clock, Shield, Users, Zap } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const benefits = [
  {
    icon: TrendingUp,
    stat: '3x',
    label: 'Faster Delivery',
    description: 'Complete projects 3 times faster with streamlined workflows',
    iconColor: 'text-blue-500',
    gradientColor: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
  },
  {
    icon: DollarSign,
    stat: '40%',
    label: 'Cost Reduction',
    description: 'Save up to 40% on project management costs',
    iconColor: 'text-green-500',
    gradientColor: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
  },
  {
    icon: Clock,
    stat: '10hrs',
    label: 'Time Saved Weekly',
    description: 'Average time saved per team member every week',
    iconColor: 'text-purple-500',
    gradientColor: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
  },
  {
    icon: Shield,
    stat: '99.9%',
    label: 'Security Score',
    description: 'Industry-leading security and compliance standards',
    iconColor: 'text-indigo-500',
    gradientColor: 'from-indigo-500 to-purple-500',
    bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
  },
  {
    icon: Users,
    stat: '95%',
    label: 'Team Satisfaction',
    description: 'Teams love our intuitive interface and features',
    iconColor: 'text-orange-500',
    gradientColor: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
  },
  {
    icon: Zap,
    stat: '<1s',
    label: 'Response Time',
    description: 'Lightning-fast real-time updates and sync',
    iconColor: 'text-yellow-500',
    gradientColor: 'from-yellow-500 to-orange-500',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
  },
];

export default function BenefitsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Title animation
      gsap.from('.benefits-title', {
        scrollTrigger: {
          trigger: '.benefits-title',
          start: 'top 80%',
        },
        y: 50,
        opacity: 0,
        duration: 1,
      });

      // Cards animation
      gsap.from('.benefit-card', {
        scrollTrigger: {
          trigger: '.benefits-grid',
          start: 'top 80%',
        },
        y: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
      });

      // Stats fade in
      gsap.from('.stat-number', {
        scrollTrigger: {
          trigger: '.benefits-grid',
          start: 'top 80%',
        },
        scale: 0.5,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'back.out(1.7)',
      });

      // Stars animation
      gsap.from('.star-rating', {
        scrollTrigger: {
          trigger: '.cta-box',
          start: 'top 85%',
        },
        scale: 0,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'back.out(1.7)',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-32 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-purple-500/5 to-transparent pointer-events-none" />
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <h2 className="benefits-title text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-linear-to-r from-gray-900 via-blue-800 to-purple-900 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
              Why Choose Us
            </span>
          </h2>
          <p className="benefits-title text-xl text-gray-600 dark:text-gray-400">
            Trusted by thousands of teams worldwide for their mission-critical projects
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="benefits-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="benefit-card group relative p-8 rounded bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 overflow-hidden"
            >
              {/* Gradient Overlay */}
              <div
                className={`absolute inset-0 bg-linear-to-br ${benefit.gradientColor} opacity-0 group-hover:opacity-5 rounded transition-opacity pointer-events-none`}
              />

              {/* Content */}
              <div className="relative">
                {/* Icon Container */}
                <div
                  className={`w-16 h-16 rounded ${benefit.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm`}
                >
                  <benefit.icon
                    className={`w-8 h-8 ${benefit.iconColor} group-hover:scale-110 transition-transform`}
                    strokeWidth={2}
                  />
                </div>

                {/* Stat */}
                <div
                  className={`stat-number text-5xl md:text-6xl font-bold bg-linear-to-br ${benefit.gradientColor} bg-clip-text text-transparent mb-3 leading-tight`}
                >
                  {benefit.stat}
                </div>

                {/* Label */}
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {benefit.label}
                </h3>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{benefit.description}</p>
              </div>

              {/* Decorative Glow */}
              <div
                className={`absolute -top-10 -right-10 w-40 h-40 bg-linear-to-br ${benefit.gradientColor} rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Fade Effect */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-white dark:from-gray-950 to-transparent pointer-events-none" />
    </section>
  );
}
