'use client';

import Link from 'next/link';
import { Github, Mail, Phone, Linkedin, Twitter, Sparkles } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group mb-4">
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
            <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              Enterprise-grade task management system built for modern teams. Streamline workflows and boost
              productivity.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/diwakarjha554"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded bg-gray-200 dark:bg-gray-800 flex items-center justify-center hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white transition-all duration-300 group"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com/diwakarjha554"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded bg-gray-200 dark:bg-gray-800 flex items-center justify-center hover:bg-blue-400 dark:hover:bg-blue-400 hover:text-white transition-all duration-300"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com/in/diwakarjha554"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded bg-gray-200 dark:bg-gray-800 flex items-center justify-center hover:bg-blue-700 dark:hover:bg-blue-700 hover:text-white transition-all duration-300"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Product</h3>
            <ul className="space-y-3">
              {['Features', 'Pricing', 'Documentation', 'API Reference', 'Changelog'].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase().replace(' ', '-')}`}
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Company</h3>
            <ul className="space-y-3">
              {['About Us', 'Blog', 'Careers', 'Press Kit', 'Partners'].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase().replace(' ', '-')}`}
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Contact</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:diwakarjha554@gmail.com"
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
                >
                  <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>diwakarjha554@gmail.com</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+918882617743"
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
                >
                  <Phone className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>+91 8882617743</span>
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/diwakarjha554"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
                >
                  <Github className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>@diwakarjha554</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {currentYear} TaskFlow. All rights reserved. Built with ❤️ by{' '}
              <a
                href="https://github.com/diwakarjha554"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Diwakar Jha
              </a>
            </p>
            <div className="flex items-center gap-6">
              <Link
                href="/privacy"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/cookies"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Bottom linear */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600" />
    </footer>
  );
}
