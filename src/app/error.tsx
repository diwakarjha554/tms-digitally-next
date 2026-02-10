'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-linear-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">⚠️</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Something went wrong!</h1>
        <p className="text-gray-600 mb-8">
          An unexpected error occurred. Please try again or contact support if the problem persists.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded hover:from-blue-700 hover:to-indigo-700 transition-all shadow-xs hover:shadow-xs font-semibold"
          >
            Try Again
          </button>
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-white text-gray-700 rounded hover:bg-gray-50 transition-colors border-2 border-gray-200 font-semibold"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
