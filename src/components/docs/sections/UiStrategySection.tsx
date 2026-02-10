'use client';

import { Palette } from 'lucide-react';

export default function UiStrategySection() {
  return (
    <section id="ui-strategy" className="docs-section scroll-mt-24">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-gray-900 dark:text-white">
        <Palette className="w-8 h-8 text-pink-600" />
        UI Strategy
      </h2>

      <div className="space-y-6">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          TaskFlow follows a <strong>component-driven architecture</strong> with reusable UI components, consistent
          design tokens, and smooth animations.
        </p>

        {/* Component Structure */}
        <div className="bg-white dark:bg-gray-800 rounded p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Component Architecture</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-blue-600 mb-2">1. Atomic Design Pattern</h4>
              <ul className="ml-6 space-y-1 text-gray-700 dark:text-gray-300">
                <li>
                  <strong>Atoms:</strong> Button, Input, Badge, Avatar (from shadcn/ui)
                </li>
                <li>
                  <strong>Molecules:</strong> TaskCard, ProjectCard, UserDropdown
                </li>
                <li>
                  <strong>Organisms:</strong> KanbanBoard, ProjectList, TaskFilters
                </li>
                <li>
                  <strong>Templates:</strong> DashboardLayout, AuthLayout
                </li>
                <li>
                  <strong>Pages:</strong> Dashboard, Projects, Tasks pages
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-purple-600 mb-2">2. Component Organization</h4>
            </div>
          </div>
        </div>

        {/* Design System */}
        <div className="bg-white dark:bg-gray-800 rounded p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Design System</h3>

          {/* Colors */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Color Palette</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="space-y-2">
                <div className="h-16 rounded bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
                  Primary
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">#3B82F6</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 rounded bg-purple-600 flex items-center justify-center text-white text-sm font-medium">
                  Secondary
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">#9333EA</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 rounded bg-green-600 flex items-center justify-center text-white text-sm font-medium">
                  Success
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">#16A34A</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 rounded bg-red-600 flex items-center justify-center text-white text-sm font-medium">
                  Danger
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">#DC2626</p>
              </div>
            </div>
          </div>

          {/* Typography */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Typography</h4>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li className="flex items-center gap-3">
                <span className="text-4xl font-bold">Aa</span>
                <div>
                  <p className="font-semibold">Inter (Primary Font)</p>
                  <p className="text-sm text-gray-500">Headings, body text</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-2xl font-mono">Aa</span>
                <div>
                  <p className="font-semibold">JetBrains Mono</p>
                  <p className="text-sm text-gray-500">Code blocks</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Spacing */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Spacing Scale</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">0.5rem (8px) - Tight spacing</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-blue-600 rounded"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">1rem (16px) - Normal spacing</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-blue-600 rounded"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">1.5rem (24px) - Comfortable spacing</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">2rem (32px) - Loose spacing</span>
              </div>
            </div>
          </div>
        </div>

        {/* Animations */}
        <div className="bg-white dark:bg-gray-800 rounded p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Animation Strategy</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-blue-600 mb-2">GSAP Animations</h4>
              <ul className="ml-6 space-y-1 text-gray-700 dark:text-gray-300">
                <li>
                  • <strong>Scroll Triggers:</strong> Fade-in sections on scroll
                </li>
                <li>
                  • <strong>Stagger Effects:</strong> Cards appearing one by one
                </li>
                <li>
                  • <strong>Counter Animations:</strong> Numbers counting up on dashboard
                </li>
                <li>
                  • <strong>Page Transitions:</strong> Smooth route changes
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-purple-600 mb-2">Three.js Background</h4>
              <ul className="ml-6 space-y-1 text-gray-700 dark:text-gray-300">
                <li>
                  • <strong>Particle System:</strong> Animated dots on hero section
                </li>
                <li>
                  • <strong>Interactive:</strong> Responds to mouse movement
                </li>
                <li>
                  • <strong>Performance:</strong> Optimized for 60fps
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-green-600 mb-2">CSS Transitions</h4>
              <ul className="ml-6 space-y-1 text-gray-700 dark:text-gray-300">
                <li>
                  • <strong>Hover Effects:</strong> Scale, shadow, color changes
                </li>
                <li>
                  • <strong>Loading States:</strong> Skeleton screens
                </li>
                <li>
                  • <strong>Micro-interactions:</strong> Button clicks, toggles
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Responsive Design */}
        <div className="bg-linear-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded border border-blue-200 dark:border-blue-800">
          <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Responsive Breakpoints</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Mobile</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">0px - 768px</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Tablet</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">768px - 1024px</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Desktop</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">1024px - 1280px</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Large Desktop</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">1280px+</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
