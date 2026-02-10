'use client';

import { Zap, Shield, FolderKanban, CheckCircle2, LayoutDashboard, Palette } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: '1. Authentication & User Management',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    borderColor: 'border-blue-200 dark:border-blue-800',
    items: [
      'Secure JWT-based authentication',
      'Password hashing with bcrypt-ts',
      'Role-based access control (RBAC)',
      'Three roles: Admin, Project Manager, Member',
      'Protected routes with middleware',
      'Session management',
    ],
  },
  {
    icon: FolderKanban,
    title: '2. Project Management',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    borderColor: 'border-purple-200 dark:border-purple-800',
    items: [
      'Create, edit, and delete projects',
      'Assign project managers and team members',
      'Project fields: Name, Description, Status',
      'Status types: ACTIVE, ON_HOLD, COMPLETED',
      'Team member management per project',
      'Project filtering and search',
    ],
  },
  {
    icon: CheckCircle2,
    title: '3. Task Management',
    color: 'text-green-600',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    borderColor: 'border-green-200 dark:border-green-800',
    items: [
      'Create, update, and delete tasks',
      'Assign tasks to team members',
      'Task fields: Title, Description, Priority, Status, Due Date',
      'Priority levels: LOW, MEDIUM, HIGH',
      'Status workflow: TODO → IN_PROGRESS → DONE',
      'Drag-and-drop Kanban board',
      'Task filtering by status, priority, assignee',
      'Task sorting by date, priority',
    ],
  },
  {
    icon: LayoutDashboard,
    title: '4. Dashboard & Analytics',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    borderColor: 'border-orange-200 dark:border-orange-800',
    items: [
      'Role-specific dashboards (Admin, PM, Member)',
      'Real-time statistics and metrics',
      'Assigned tasks overview',
      'Tasks by status breakdown',
      'Project-wise task distribution',
      'Recent activities and tasks',
      'Completion rate tracking',
      'Animated counters with GSAP',
    ],
  },
  {
    icon: Palette,
    title: '5. UX/UI Excellence',
    color: 'text-pink-600',
    bgColor: 'bg-pink-50 dark:bg-pink-900/20',
    borderColor: 'border-pink-200 dark:border-pink-800',
    items: [
      'Fully responsive design (mobile, tablet, desktop)',
      'Dark mode support with next-themes',
      'Clean typography and spacing',
      'Loading states with skeletons',
      'Error handling with toast notifications',
      'Empty states with helpful messages',
      'GSAP scroll animations',
      'Three.js particle background on hero',
      'Smooth page transitions',
    ],
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="docs-section scroll-mt-24">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-gray-900 dark:text-white">
        <Zap className="w-8 h-8 text-yellow-600" />
        Core Features
      </h2>

      <div className="space-y-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`bg-white dark:bg-gray-800 rounded p-6 border ${feature.borderColor} hover:shadow-lg transition-all`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 rounded ${feature.bgColor} flex items-center justify-center`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{feature.title}</h3>
            </div>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300 ml-15">
              {feature.items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
