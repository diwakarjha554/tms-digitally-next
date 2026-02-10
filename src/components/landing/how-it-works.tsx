'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { UserPlus, FolderKanban, Users, CheckCircle2, BarChart3, Rocket } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: '01',
    icon: UserPlus,
    title: 'Create Your Account',
    description: 'Sign up in seconds with email or OAuth. No credit card required for free tier.',
    iconColor: 'text-blue-500',
    gradientColor: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
  },
  {
    number: '02',
    icon: FolderKanban,
    title: 'Set Up Projects',
    description: 'Create projects, define milestones, and set up your workflow structure.',
    iconColor: 'text-purple-500',
    gradientColor: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
  },
  {
    number: '03',
    icon: Users,
    title: 'Invite Your Team',
    description: 'Add team members, assign roles, and configure permissions effortlessly.',
    iconColor: 'text-green-500',
    gradientColor: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
  },
  {
    number: '04',
    icon: CheckCircle2,
    title: 'Manage Tasks',
    description: 'Create, assign, and track tasks with our intuitive Kanban boards.',
    iconColor: 'text-orange-500',
    gradientColor: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
  },
  {
    number: '05',
    icon: BarChart3,
    title: 'Track Progress',
    description: 'Monitor team performance with real-time analytics and detailed reports.',
    iconColor: 'text-indigo-500',
    gradientColor: 'from-indigo-500 to-purple-500',
    bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
  },
  {
    number: '06',
    icon: Rocket,
    title: 'Scale & Succeed',
    description: 'Grow your team and projects with enterprise-grade features and support.',
    iconColor: 'text-pink-500',
    gradientColor: 'from-pink-500 to-rose-500',
    bgColor: 'bg-pink-50 dark:bg-pink-900/20',
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Title animation
      gsap.from('.works-title', {
        scrollTrigger: {
          trigger: '.works-title',
          start: 'top 80%',
        },
        y: 50,
        opacity: 0,
        duration: 1,
      });

      // Steps animation
      gsap.from('.work-step', {
        scrollTrigger: {
          trigger: '.works-container',
          start: 'top 70%',
        },
        y: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-32 relative overflow-hidden bg-linear-to-b from-white via-gray-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.15] dark:opacity-[0.05]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(100 100 100 / 0.15) 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <h2 className="works-title text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-linear-to-r from-gray-900 via-blue-800 to-purple-900 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
              How It Works
            </span>
          </h2>
          <p className="works-title text-xl text-gray-600 dark:text-gray-400">
            Get started in minutes with our simple and intuitive workflow
          </p>
        </div>

        {/* Steps Container */}
        <div className="works-container max-w-7xl mx-auto">
          <div className="relative">
            {/* Center Line - Desktop Only */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-linear-to-b from-blue-500 via-purple-500 to-pink-500 hidden lg:block -translate-x-1/2 rounded-full" />

            {/* Steps */}
            <div className="space-y-12 lg:space-y-32">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`work-step relative flex flex-col lg:flex-row items-center gap-6 ${
                    index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  }`}
                >
                  {/* Content Card - Increased padding */}
                  <div className="flex-1 w-full lg:px-20">
                    <div
                      className={`group relative p-8 lg:p-10 rounded bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                        index % 2 === 0 ? 'lg:text-right' : 'lg:text-left'
                      }`}
                    >
                      {/* Gradient Background on Hover */}
                      <div
                        className={`absolute inset-0 bg-linear-to-br ${step.gradientColor} opacity-0 group-hover:opacity-5 rounded transition-opacity duration-300 pointer-events-none`}
                      />

                      {/* Content */}
                      <div className="relative">
                        {/* Number Badge */}
                        <div
                          className={`inline-block text-6xl md:text-7xl font-bold bg-linear-to-br ${step.gradientColor} bg-clip-text text-transparent opacity-20 mb-4`}
                        >
                          {step.number}
                        </div>

                        {/* Title */}
                        <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {step.title}
                        </h3>

                        {/* Description */}
                        <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-md mx-auto lg:mx-0">
                          {step.description}
                        </p>
                      </div>

                      {/* Decorative Corner Glow */}
                      <div
                        className={`absolute ${
                          index % 2 === 0 ? 'top-0 right-0' : 'top-0 left-0'
                        } w-32 h-32 bg-linear-to-br ${step.gradientColor} rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10`}
                      />
                    </div>
                  </div>

                  {/* Center Icon Circle - Desktop - Bigger for more visibility */}
                  <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 z-20">
                    <div
                      className={`relative w-28 h-28 rounded-full bg-linear-to-br ${step.gradientColor} p-1.5 shadow-2xl hover:scale-110 transition-transform duration-300`}
                    >
                      {/* White/Dark Background */}
                      <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
                        {/* Icon with proper color */}
                        <step.icon className={`w-14 h-14 ${step.iconColor}`} strokeWidth={2} />
                      </div>

                      {/* Glow Effect */}
                      <div
                        className={`absolute inset-0 rounded-full bg-linear-to-br ${step.gradientColor} blur-xl opacity-50 -z-10`}
                      />
                    </div>
                  </div>

                  {/* Mobile Icon */}
                  <div className="lg:hidden order-first">
                    <div
                      className={`relative w-20 h-20 rounded-full bg-linear-to-br ${step.gradientColor} p-1 shadow-xl`}
                    >
                      <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
                        <step.icon className={`w-10 h-10 ${step.iconColor}`} strokeWidth={2} />
                      </div>
                    </div>
                  </div>

                  {/* Empty Space for Desktop Layout */}
                  <div className="hidden lg:block flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-white dark:from-gray-950 to-transparent pointer-events-none" />
    </section>
  );
}
