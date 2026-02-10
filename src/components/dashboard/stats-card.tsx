'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  subtitle: string;
  icon: LucideIcon;
  color: 'blue' | 'purple' | 'yellow' | 'green' | 'orange';
}

const colorClasses = {
  blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
  yellow: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
  green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
  orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
};

export default function StatsCard({ title, value, subtitle, icon: Icon, color }: StatsCardProps) {
  const counterRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (counterRef.current) {
      gsap.from(counterRef.current, {
        innerText: 0,
        duration: 1.5,
        ease: 'power2.out',
        delay: 0.5,
        snap: { innerText: 1 },
        onUpdate: function () {
          if (counterRef.current) {
            counterRef.current.textContent = Math.ceil(
              parseFloat(counterRef.current.textContent || '0')
            ).toLocaleString();
          }
        },
      });
    }
  }, [value]);

  return (
    <Card className="hover:shadow-xs transition-all duration-300 border-2">
      <CardContent className="px-6">
        <div className="flex items-center justify-between mb-3">
          <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</p>
        <p ref={counterRef} className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
          {value}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
      </CardContent>
    </Card>
  );
}
