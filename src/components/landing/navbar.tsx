'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Menu, X, Sparkles } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Benefits', href: '#benefits' },
    { name: 'Docs', href: '/docs' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-lg border-b border-gray-200/50 dark:border-gray-800/50'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              {/* Logo Container */}
              <div className="relative w-10 h-10 md:w-12 md:h-12 rounded bg-linear-to-br from-blue-600 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-white" strokeWidth={2.5} />
              </div>
            </div>
            <span className="text-xl md:text-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TaskFlow
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          {/* Right Side - Theme Toggle + Sign In */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="relative w-10 h-10 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 group"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-yellow-500 group-hover:rotate-180 transition-all duration-300" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-blue-500 group-hover:-rotate-12 transition-all duration-300" />
                )}
              </Button>
            )}

            {/* Sign In Button - Desktop */}
            <Link href="/login" className="hidden md:block">
              <Button
                variant="outline"
                className="border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
              >
                Sign In
              </Button>
            </Link>

            <Link href="/register" className="hidden md:block">
              <Button className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                Get Started
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-10 h-10 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              ) : (
                <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-xl">
          <div className="container mx-auto px-4 py-6 space-y-4">
            {/* Mobile Navigation Links */}
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {link.name}
              </a>
            ))}

            {/* Mobile Buttons */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-800 space-y-3">
              <Link href="/login" className="block" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full border-2">
                  Sign In
                </Button>
              </Link>
              <Link href="/register" className="block" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
