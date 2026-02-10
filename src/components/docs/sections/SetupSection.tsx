'use client';

import { Terminal, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function SetupSection() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const CodeBlock = ({ code, id }: { code: string; id: string }) => (
    <div className="relative group">
      <div className="absolute top-3 right-3 z-10">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => copyToClipboard(code, id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 hover:bg-gray-700 text-white"
        >
          {copiedCode === id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </Button>
      </div>
      <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto border border-gray-800">
        <code className="text-sm">{code}</code>
      </pre>
    </div>
  );

  return (
    <section id="setup" className="docs-section scroll-mt-24">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-gray-900 dark:text-white">
        <Terminal className="w-8 h-8 text-green-600" />
        Local Setup
      </h2>

      <div className="space-y-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded border border-blue-200 dark:border-blue-800">
          <p className="text-blue-900 dark:text-blue-200 font-medium">
            ⚡ Follow these steps to run TaskFlow locally on your machine
          </p>
        </div>

        {/* Prerequisites */}
        <div>
          <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Prerequisites</h3>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Node.js 18+ installed</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>PostgreSQL 15+ installed and running</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>pnpm package manager (or npm/yarn)</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Git for version control</span>
            </li>
          </ul>
        </div>

        {/* Step 1 */}
        <div className="bg-white dark:bg-gray-800 rounded p-6 border-l-4 border-blue-600">
          <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Step 1: Clone Repository</h3>
          <CodeBlock
            id="clone"
            code={`git clone https://github.com/diwakarjha554/tms-digitally-next.git
cd tms-digitally-next`}
          />
        </div>

        {/* Step 2 */}
        <div className="bg-white dark:bg-gray-800 rounded p-6 border-l-4 border-purple-600">
          <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Step 2: Install Dependencies</h3>
          <CodeBlock
            id="install"
            code={`pnpm install
# or
npm install
# or
yarn install`}
          />
        </div>

        {/* Step 3 */}
        <div className="bg-white dark:bg-gray-800 rounded p-6 border-l-4 border-green-600">
          <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Step 3: Environment Variables</h3>
          <p className="text-gray-700 dark:text-gray-300 mb-3">
            Create a <code className="bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">.env.local</code> file in the root
            directory:
          </p>
          <CodeBlock
            id="env"
            code={`DATABASE_URL="postgresql://username:password@localhost:5432/taskflow"
NODE_ENV="development"
AUTH_SECRET="your-super-secret-key-change-this-in-production-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"`}
          />
        </div>

        {/* Step 4 */}
        <div className="bg-white dark:bg-gray-800 rounded p-6 border-l-4 border-orange-600">
          <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Step 4: Database Setup</h3>
          <p className="text-gray-700 dark:text-gray-300 mb-3">Initialize Prisma and create database tables:</p>
          <CodeBlock
            id="prisma"
            code={`# Generate Prisma Client
pnpm prisma generate

# Run database migrations
pnpm prisma migrate dev --name init

# (Optional) Seed database with sample data
pnpm prisma db seed

# (Optional) Open Prisma Studio to view data
pnpm prisma studio`}
          />
        </div>

        {/* Step 5 */}
        <div className="bg-white dark:bg-gray-800 rounded p-6 border-l-4 border-red-600">
          <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Step 5: Run Development Server</h3>
          <CodeBlock
            id="dev"
            code={`pnpm dev
# or
npm run dev
# or
yarn dev`}
          />
          <p className="text-gray-700 dark:text-gray-300 mt-3">
            Open{' '}
            <a href="http://localhost:3000" className="text-blue-600 hover:underline" target="_blank">
              http://localhost:3000
            </a>{' '}
            in your browser.
          </p>
        </div>

        {/* Troubleshooting */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded border border-yellow-200 dark:border-yellow-800">
          <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Troubleshooting</h3>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 mt-1">⚠</span>
              <span>
                <strong>Database Connection Error:</strong> Make sure PostgreSQL is running and DATABASE_URL is correct
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 mt-1">⚠</span>
              <span>
                <strong>Port 3000 already in use:</strong> Change port with{' '}
                <code className="bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">PORT=3001 pnpm dev</code>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 mt-1">⚠</span>
              <span>
                <strong>Prisma Client error:</strong> Run{' '}
                <code className="bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">pnpm prisma generate</code> again
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
