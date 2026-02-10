'use client';

import { useState, SyntheticEvent } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff, Loader2, ArrowLeft, Mail, Lock, User, UserPlus, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    // Validate fields
    if (!name || !email || !password || !confirmPassword) {
      toast.error('Please fill in all fields', {
        icon: '⚠️',
        duration: 3000,
        style: {
          background: '#FEF3C7',
          color: '#92400E',
        },
      });
      setLoading(false);
      return;
    }

    // Validate name length
    if (name.length < 2) {
      toast.error('Name must be at least 2 characters', {
        icon: '⚠️',
        duration: 3000,
      });
      setLoading(false);
      return;
    }

    // Validate password length
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters', {
        icon: '⚠️',
        duration: 3000,
      });
      setLoading(false);
      return;
    }

    // Validate passwords match
    if (password !== confirmPassword) {
      toast.error('Passwords do not match', {
        icon: '🔒',
        duration: 3000,
        style: {
          background: '#FEE2E2',
          color: '#991B1B',
        },
      });
      setLoading(false);
      return;
    }

    const data = {
      name,
      email,
      password,
    };

    try {
      // Register user
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        // Handle specific error messages
        if (result.error && result.error.includes('email')) {
          toast.error('Email already exists. Please use a different email.', {
            icon: '📧',
            duration: 4000,
            style: {
              background: '#FEE2E2',
              color: '#991B1B',
            },
          });
        } else {
          toast.error(result.error || 'Registration failed. Please try again.', {
            icon: '❌',
            duration: 4000,
            style: {
              background: '#FEE2E2',
              color: '#991B1B',
            },
          });
        }
        setLoading(false);
        return;
      }

      // Show success message
      toast.success('Account created successfully! 🎉', {
        duration: 2000,
        style: {
          background: '#D1FAE5',
          color: '#065F46',
        },
      });

      // Auto-login after success
      setTimeout(async () => {
        toast.loading('Signing you in...', {
          duration: 1000,
        });

        const signInResult = await signIn('credentials', {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        if (signInResult?.error) {
          toast.error('Auto-login failed. Please sign in manually.', {
            icon: '⚠️',
            duration: 3000,
          });
          router.push('/login');
        } else {
          toast.success('Welcome to TaskFlow! 👋', {
            duration: 2000,
            style: {
              background: '#D1FAE5',
              color: '#065F46',
            },
          });
          router.push('/dashboard');
          router.refresh();
        }
      }, 1000);
    } catch (err: any) {
      console.error('Registration error:', err);
      toast.error(err.message || 'Something went wrong. Please try again.', {
        icon: '❌',
        duration: 4000,
        style: {
          background: '#FEE2E2',
          color: '#991B1B',
        },
      });
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="w-full max-w-md">
        {/* Back to Home Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-6 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <Card className="border-gray-200 dark:border-gray-700 shadow-xl">
          <CardHeader className="space-y-1 text-center pb-6">
            {/* Logo */}
            <Link href="/" className="flex items-center justify-center gap-2 group">
              <div className="relative">
                {/* Logo Container */}
                <div className="relative w-10 h-10 md:w-12 md:h-12 rounded bg-linear-to-br from-blue-600 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-white" strokeWidth={2.5} />
                </div>
              </div>
            </Link>

            <CardTitle className="text-3xl font-bold">Create Account</CardTitle>
            <CardDescription className="text-base">Join TaskFlow and start managing tasks</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    minLength={2}
                    placeholder="John Doe"
                    className="pl-10 h-11"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="pl-10 h-11"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    placeholder="••••••••"
                    className="pl-10 pr-10 h-11"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-semibold">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    placeholder="••••••••"
                    className="pl-10 pr-10 h-11"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5 mr-2" />
                    Create Account
                  </>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-gray-800 px-2 text-gray-500">or</span>
              </div>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <Link
                  href="/login"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold hover:underline"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
