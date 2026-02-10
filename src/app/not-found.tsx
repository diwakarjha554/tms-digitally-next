// src/app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8">
          <div className="text-9xl font-bold text-transparent bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text">
            404
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded hover:from-blue-700 hover:to-indigo-700 transition-all shadow-xs hover:shadow-xs font-semibold"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/"
            className="px-6 py-3 bg-white text-gray-700 rounded hover:bg-gray-50 transition-colors border-2 border-gray-200 font-semibold"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
