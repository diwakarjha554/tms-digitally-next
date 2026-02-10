'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  LayoutDashboard,
  Users,
  CheckCircle2,
  BarChart3,
  Lock,
  Zap,
  Bell,
  GitBranch,
  Calendar,
  FileText,
  Activity,
  Globe,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: LayoutDashboard,
    title: 'Intuitive Dashboard',
    description: 'Powerful analytics and insights at your fingertips with real-time data visualization.',
    iconColor: 'text-blue-500',
    linearColor: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Seamlessly work together with role-based access control and real-time updates.',
    iconColor: 'text-purple-500',
    linearColor: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
  },
  {
    icon: CheckCircle2,
    title: 'Task Management',
    description: 'Organize, prioritize, and track tasks with drag-and-drop Kanban boards.',
    iconColor: 'text-green-500',
    linearColor: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Get deep insights into team performance and project progress with detailed reports.',
    iconColor: 'text-orange-500',
    linearColor: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
  },
  {
    icon: Lock,
    title: 'Enterprise Security',
    description: 'Bank-level encryption and security with SOC 2 compliance and data protection.',
    iconColor: 'text-indigo-500',
    linearColor: 'from-indigo-500 to-blue-500',
    bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
  },
  {
    icon: Zap,
    title: 'Real-time Sync',
    description: 'Instant updates across all devices with WebSocket technology.',
    iconColor: 'text-yellow-500',
    linearColor: 'from-yellow-500 to-orange-500',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
  },
  {
    icon: Bell,
    title: 'Smart Notifications',
    description: 'Stay informed with intelligent alerts and customizable notification preferences.',
    iconColor: 'text-pink-500',
    linearColor: 'from-pink-500 to-rose-500',
    bgColor: 'bg-pink-50 dark:bg-pink-900/20',
  },
  {
    icon: GitBranch,
    title: 'Version Control',
    description: 'Track changes and maintain complete audit trails for compliance.',
    iconColor: 'text-teal-500',
    linearColor: 'from-teal-500 to-green-500',
    bgColor: 'bg-teal-50 dark:bg-teal-900/20',
  },
  {
    icon: Calendar,
    title: 'Smart Scheduling',
    description: 'AI-powered deadline management and automated reminders.',
    iconColor: 'text-violet-500',
    linearColor: 'from-violet-500 to-purple-500',
    bgColor: 'bg-violet-50 dark:bg-violet-900/20',
  },
  {
    icon: FileText,
    title: 'Rich Documentation',
    description: 'Built-in docs and knowledge base for seamless onboarding.',
    iconColor: 'text-cyan-500',
    linearColor: 'from-cyan-500 to-blue-500',
    bgColor: 'bg-cyan-50 dark:bg-cyan-900/20',
  },
  {
    icon: Activity,
    title: 'Activity Logs',
    description: 'Complete visibility into all actions with detailed activity tracking.',
    iconColor: 'text-emerald-500',
    linearColor: 'from-emerald-500 to-teal-500',
    bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
  },
  {
    icon: Globe,
    title: 'Global Accessibility',
    description: 'Access from anywhere with responsive design and PWA support.',
    iconColor: 'text-blue-600',
    linearColor: 'from-blue-500 to-indigo-500',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
  },
];

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Title animation
      gsap.from('.features-title', {
        scrollTrigger: {
          trigger: '.features-title',
          start: 'top 80%',
        },
        y: 50,
        opacity: 0,
        duration: 1,
      });

      // Feature cards stagger animation
      gsap.from('.feature-card', {
        scrollTrigger: {
          trigger: '.features-grid',
          start: 'top 80%',
        },
        y: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-32 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-blue-500/5 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <h2 className="features-title text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-linear-to-r from-gray-900 via-blue-800 to-purple-900 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
              Everything You Need
            </span>
          </h2>
          <p className="features-title text-xl text-gray-600 dark:text-gray-400">
            Powerful features designed for modern teams. Built with cutting-edge technology for maximum productivity.
          </p>
        </div>

        {/* Features Grid */}
        <div className="features-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card group relative p-8 rounded bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
            >
              {/* linear Overlay */}
              <div
                className={`absolute inset-0 bg-linear-to-br ${feature.linearColor} opacity-0 group-hover:opacity-5 rounded transition-opacity pointer-events-none`}
              />

              {/* Content */}
              <div className="relative">
                {/* Icon Container */}
                <div
                  className={`w-16 h-16 rounded ${feature.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm`}
                >
                  <feature.icon
                    className={`w-8 h-8 ${feature.iconColor} group-hover:scale-110 transition-transform`}
                    strokeWidth={2}
                  />
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
              </div>

              {/* Decorative Glow */}
              <div
                className={`absolute -top-10 -right-10 w-40 h-40 bg-linear-to-br ${feature.linearColor} rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
