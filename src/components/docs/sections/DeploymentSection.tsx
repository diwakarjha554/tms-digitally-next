'use client';

import { GitBranch, Copy, Check, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function DeploymentSection() {
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
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto border border-gray-800">
        <code className="text-sm">{code}</code>
      </pre>
    </div>
  );

  return (
    <section id="deployment" className="docs-section scroll-mt-24">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-gray-900 dark:text-white">
        <GitBranch className="w-8 h-8 text-indigo-600" />
        Deployment Guide
      </h2>

      <div className="space-y-6">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Deploy TaskFlow to production using modern cloud platforms. Multiple deployment options are available based on
          your infrastructure requirements.
        </p>

        {/* Deployment Options Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="text-2xl mb-2">⚡</div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-1">Serverless</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Vercel + Railway/Supabase</p>
          </div>
          <div className="bg-linear-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
            <div className="text-2xl mb-2">☁️</div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-1">AWS Cloud</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">EC2, RDS, S3 (Production)</p>
          </div>
          <div className="bg-linear-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="text-2xl mb-2">🐳</div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-1">Containerized</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Docker + Any Cloud</p>
          </div>
        </div>

        {/* Option 1: Vercel + Railway */}
        <div className="bg-linear-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-xl border-2 border-blue-300 dark:border-blue-700">
          <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
            <span>🚀</span> Option 1: Vercel + Railway (Recommended - Quick Start)
          </h3>

          <div className="space-y-6">
            {/* Railway Setup */}
            <div>
              <h4 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                A. Setup PostgreSQL on Railway
              </h4>
              <ol className="space-y-3 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center font-bold">
                    1
                  </span>
                  <div>
                    <p>
                      Go to{' '}
                      <a
                        href="https://railway.app"
                        target="_blank"
                        className="text-blue-600 hover:underline inline-flex items-center gap-1"
                      >
                        Railway.app <ExternalLink className="w-3 h-3" />
                      </a>{' '}
                      and sign up
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center font-bold">
                    2
                  </span>
                  <div>
                    <p>Create a new project → Add PostgreSQL database</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center font-bold">
                    3
                  </span>
                  <div>
                    <p>
                      Copy the <strong>DATABASE_URL</strong> from Railway dashboard
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center font-bold">
                    4
                  </span>
                  <div>
                    <p>Run migrations on Railway database:</p>
                    <div className="mt-2">
                      <CodeBlock
                        id="railway-migrate"
                        code={`DATABASE_URL="your-railway-url" pnpm prisma migrate deploy`}
                      />
                    </div>
                  </div>
                </li>
              </ol>
            </div>

            {/* Vercel Setup */}
            <div>
              <h4 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">B. Deploy to Vercel</h4>
              <ol className="space-y-3 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-purple-600 text-white text-sm flex items-center justify-center font-bold">
                    1
                  </span>
                  <div>
                    <p>Push your code to GitHub</p>
                    <div className="mt-2">
                      <CodeBlock
                        id="git-push"
                        code={`git add .
git commit -m "Ready for deployment"
git push origin main`}
                      />
                    </div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-purple-600 text-white text-sm flex items-center justify-center font-bold">
                    2
                  </span>
                  <div>
                    <p>
                      Go to{' '}
                      <a
                        href="https://vercel.com"
                        target="_blank"
                        className="text-purple-600 hover:underline inline-flex items-center gap-1"
                      >
                        Vercel.com <ExternalLink className="w-3 h-3" />
                      </a>{' '}
                      and import your GitHub repository
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-purple-600 text-white text-sm flex items-center justify-center font-bold">
                    3
                  </span>
                  <div>
                    <p>Add environment variables in Vercel dashboard:</p>
                    <div className="mt-2 bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                      <ul className="space-y-2 text-sm">
                        <li>
                          <code className="text-blue-600">DATABASE_URL</code> - Railway PostgreSQL URL
                        </li>
                        <li>
                          <code className="text-blue-600">AUTH_SECRET</code> - Your Auth.js secret key
                        </li>
                        <li>
                          <code className="text-blue-600">NEXT_PUBLIC_APP_URL</code> - Your Vercel URL
                        </li>
                      </ul>
                    </div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-purple-600 text-white text-sm flex items-center justify-center font-bold">
                    4
                  </span>
                  <div>
                    <p>
                      Click <strong>Deploy</strong> and wait for build to complete
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-green-600 text-white text-sm flex items-center justify-center font-bold">
                    ✓
                  </span>
                  <div>
                    <p className="font-semibold text-green-600">Your app is live! 🎉</p>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </div>

        {/* Option 2: Vercel + Supabase */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
            <span>🔷</span> Option 2: Vercel + Supabase
          </h3>
          <ol className="space-y-3 text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-green-600 text-white text-sm flex items-center justify-center font-bold">
                1
              </span>
              <div>
                <p>
                  Go to{' '}
                  <a
                    href="https://supabase.com"
                    target="_blank"
                    className="text-green-600 hover:underline inline-flex items-center gap-1"
                  >
                    Supabase.com <ExternalLink className="w-3 h-3" />
                  </a>{' '}
                  and create a new project
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-green-600 text-white text-sm flex items-center justify-center font-bold">
                2
              </span>
              <div>
                <p>
                  Copy the <strong>Connection String</strong> from Settings → Database
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-green-600 text-white text-sm flex items-center justify-center font-bold">
                3
              </span>
              <div>
                <p>Follow the same Vercel deployment steps above, using Supabase URL as DATABASE_URL</p>
              </div>
            </li>
          </ol>
        </div>

        {/* Option 3: AWS Deployment */}
        <div className="bg-linear-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-6 rounded-xl border-2 border-orange-300 dark:border-orange-700">
          <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
            <span>☁️</span> Option 3: AWS Cloud Deployment (Production-Grade)
          </h3>

          <p className="text-gray-700 dark:text-gray-300 mb-4">
            For enterprise-level deployments, TaskFlow can be hosted on AWS using multiple services for high
            availability, scalability, and security.
          </p>

          {/* AWS Architecture */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-orange-200 dark:border-orange-800 mb-4">
            <h4 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">AWS Infrastructure Overview</h4>
            <div className="space-y-4">
              {/* EC2 */}
              <div className="bg-linear-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-4 rounded-lg border border-orange-200 dark:border-orange-700">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-600 text-white flex items-center justify-center shrink-0 font-bold">
                    EC2
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900 dark:text-white mb-1">Amazon EC2 (Elastic Compute Cloud)</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <strong>Purpose:</strong> Host the Next.js application
                    </p>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>• Virtual server to run Node.js application</li>
                      <li>• Auto-scaling capability for high traffic</li>
                      <li>• Multiple instance types (t3.micro for dev, t3.medium+ for production)</li>
                      <li>• Supports PM2 for process management</li>
                    </ul>
                    <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-900 rounded text-xs">
                      <strong>Setup:</strong> Launch Ubuntu instance → Install Node.js → Clone repo → Configure Nginx
                      reverse proxy
                    </div>
                  </div>
                </div>
              </div>

              {/* RDS */}
              <div className="bg-linear-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 font-bold">
                    RDS
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900 dark:text-white mb-1">
                      Amazon RDS (Relational Database Service)
                    </h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <strong>Purpose:</strong> Managed PostgreSQL database
                    </p>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>• Fully managed PostgreSQL 15+</li>
                      <li>• Automated backups and point-in-time recovery</li>
                      <li>• Multi-AZ deployment for high availability</li>
                      <li>• Read replicas for scaling reads</li>
                    </ul>
                    <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-900 rounded text-xs">
                      <strong>Setup:</strong> Create PostgreSQL RDS instance → Configure security groups → Get
                      connection string → Run Prisma migrations
                    </div>
                  </div>
                </div>
              </div>

              {/* S3 */}
              <div className="bg-linear-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-lg border border-green-200 dark:border-green-700">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-600 text-white flex items-center justify-center shrink-0 font-bold">
                    S3
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900 dark:text-white mb-1">Amazon S3 (Simple Storage Service)</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <strong>Purpose:</strong> Store static assets, uploads, backups
                    </p>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>• Object storage for images, files, documents</li>
                      <li>• CDN integration with CloudFront for fast delivery</li>
                      <li>• Versioning and lifecycle policies</li>
                      <li>• Ideal for user-uploaded project files</li>
                    </ul>
                    <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-900 rounded text-xs">
                      <strong>Use Case:</strong> Store project attachments, user avatars, database backups
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional AWS Services */}
              <div className="bg-linear-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0 font-bold">
                    +
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900 dark:text-white mb-1">Supporting AWS Services</h5>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>
                        <strong>Route 53:</strong> DNS management and domain routing
                      </li>
                      <li>
                        <strong>CloudFront:</strong> CDN for faster content delivery worldwide
                      </li>
                      <li>
                        <strong>ELB (Load Balancer):</strong> Distribute traffic across multiple EC2 instances
                      </li>
                      <li>
                        <strong>ACM (Certificate Manager):</strong> Free SSL/TLS certificates
                      </li>
                      <li>
                        <strong>CloudWatch:</strong> Monitoring, logging, and alerts
                      </li>
                      <li>
                        <strong>VPC:</strong> Isolated network for security
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AWS Deployment Steps */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-orange-200 dark:border-orange-800">
            <h4 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
              AWS Deployment Steps (Conceptual)
            </h4>
            <ol className="space-y-3 text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-orange-600 text-white text-sm flex items-center justify-center font-bold">
                  1
                </span>
                <div>
                  <strong>Setup RDS PostgreSQL</strong>
                  <p className="text-sm mt-1">
                    Create RDS instance → Configure security groups (port 5432) → Note connection string
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-orange-600 text-white text-sm flex items-center justify-center font-bold">
                  2
                </span>
                <div>
                  <strong>Launch EC2 Instance</strong>
                  <p className="text-sm mt-1">
                    Select Ubuntu 22.04 → t3.medium instance → Configure security group (HTTP/HTTPS/SSH)
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-orange-600 text-white text-sm flex items-center justify-center font-bold">
                  3
                </span>
                <div>
                  <strong>Install Dependencies on EC2</strong>
                  <div className="mt-2">
                    <CodeBlock
                      id="ec2-setup"
                      code={`# SSH into EC2
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install pnpm
npm install -g pnpm

# Install Nginx
sudo apt-get install nginx -y`}
                    />
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-orange-600 text-white text-sm flex items-center justify-center font-bold">
                  4
                </span>
                <div>
                  <strong>Deploy Application</strong>
                  <div className="mt-2">
                    <CodeBlock
                      id="deploy-app"
                      code={`# Clone repository
git clone https://github.com/yourusername/taskflow.git
cd taskflow

# Install dependencies
pnpm install

# Set environment variables
nano .env.production

# Run Prisma migrations
pnpm prisma migrate deploy

# Build Next.js
pnpm build

# Start with PM2
pm2 start npm --name "taskflow" -- start
pm2 save
pm2 startup`}
                    />
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-orange-600 text-white text-sm flex items-center justify-center font-bold">
                  5
                </span>
                <div>
                  <strong>Configure Nginx Reverse Proxy</strong>
                  <div className="mt-2">
                    <CodeBlock
                      id="nginx-config"
                      code={`# /etc/nginx/sites-available/taskflow
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/taskflow /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx`}
                    />
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-orange-600 text-white text-sm flex items-center justify-center font-bold">
                  6
                </span>
                <div>
                  <strong>Setup Domain & SSL</strong>
                  <p className="text-sm mt-1">
                    Configure Route 53 DNS → Point A record to EC2 IP → Install Let's Encrypt SSL with Certbot
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-green-600 text-white text-sm flex items-center justify-center font-bold">
                  ✓
                </span>
                <div>
                  <p className="font-semibold text-green-600">AWS deployment complete! 🚀</p>
                </div>
              </li>
            </ol>
          </div>
        </div>

        {/* DNS & Domain Mapping */}
        <div className="bg-linear-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-6 rounded-xl border border-indigo-200 dark:border-indigo-800">
          <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">🌐 DNS & Domain Configuration</h3>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-indigo-600 mb-2">DNS (Domain Name System)</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                DNS translates human-readable domain names (taskflow.com) to IP addresses that computers use.
              </p>
              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1 ml-4">
                <li>
                  • <strong>A Record:</strong> Points domain to IPv4 address (e.g., taskflow.com → 54.123.45.67)
                </li>
                <li>
                  • <strong>CNAME Record:</strong> Points subdomain to another domain (www.taskflow.com → taskflow.com)
                </li>
                <li>
                  • <strong>MX Record:</strong> Mail exchange servers
                </li>
                <li>
                  • <strong>TXT Record:</strong> Verification and security records
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-purple-600 mb-2">Nameservers</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Nameservers are authoritative servers that store DNS records. When you buy a domain from a registrar
                (GoDaddy, Namecheap), you point it to your hosting provider's nameservers.
              </p>
              <div className="mt-2 p-3 bg-white dark:bg-gray-800 rounded-lg border border-indigo-200 dark:border-indigo-700 text-sm">
                <strong>Example:</strong>
                <br />
                AWS Route 53 Nameservers:
                <ul className="ml-4 mt-1 text-gray-600 dark:text-gray-400">
                  <li>• ns-123.awsdns-12.com</li>
                  <li>• ns-456.awsdns-34.net</li>
                  <li>• ns-789.awsdns-56.org</li>
                  <li>• ns-012.awsdns-78.co.uk</li>
                </ul>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-blue-600 mb-2">Domain Mapping Steps</h4>
              <ol className="text-sm text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                <li>
                  <strong>1. Purchase Domain:</strong> Buy from registrar (GoDaddy, Namecheap, Google Domains)
                </li>
                <li>
                  <strong>2. Configure Nameservers:</strong> Point to your hosting provider (Vercel, AWS Route 53)
                </li>
                <li>
                  <strong>3. Add DNS Records:</strong> Create A record pointing to server IP or CNAME to deployment URL
                </li>
                <li>
                  <strong>4. SSL Certificate:</strong> Enable HTTPS with Let's Encrypt or ACM
                </li>
                <li>
                  <strong>5. Propagation:</strong> Wait 24-48 hours for DNS changes to propagate globally
                </li>
              </ol>
            </div>
          </div>
        </div>

        {/* Environment Variables Explanation */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">🔐 Environment Variables Guide</h3>

          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
            Environment variables store sensitive configuration separately from code for security and flexibility across
            different environments.
          </p>

          <div className="space-y-3">
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold text-blue-600 mb-2">DATABASE_URL</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                <strong>Purpose:</strong> PostgreSQL connection string
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded">
                postgresql://username:password@host:5432/database_name
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Different per environment (local, staging, production)
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold text-purple-600 mb-2">AUTH_SECRET</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                <strong>Purpose:</strong> Secret key for JWT token signing and encryption
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded">
                Generate: openssl rand -base64 32
              </p>
              <p className="text-sm text-red-600 dark:text-red-400 mt-2">⚠️ Never commit to Git! Keep secret!</p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold text-green-600 mb-2">NEXT_PUBLIC_APP_URL</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                <strong>Purpose:</strong> Public URL of your application (used for redirects, callbacks)
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded">
                Development: http://localhost:3000
                <br />
                Production: https://taskflow.vercel.app
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold text-orange-600 mb-2">NODE_ENV</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                <strong>Purpose:</strong> Determines runtime environment behavior
              </p>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>
                  • <code>development</code> - Local dev with hot reload, verbose errors
                </li>
                <li>
                  • <code>production</code> - Optimized build, error hiding, caching
                </li>
                <li>
                  • <code>test</code> - For running automated tests
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Post-Deployment */}
        <div className="bg-linear-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800">
          <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Post-Deployment Checklist</h3>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span>Verify database connection is working</span>
            </li>
            <li className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span>Test user registration and login</span>
            </li>
            <li className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span>Check all API routes are functional</span>
            </li>
            <li className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span>Test creating projects and tasks</span>
            </li>
            <li className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span>Verify role-based access control</span>
            </li>
            <li className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span>Configure custom domain with SSL</span>
            </li>
            <li className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span>Set up monitoring (CloudWatch/Vercel Analytics)</span>
            </li>
            <li className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span>Configure automated backups</span>
            </li>
          </ul>
        </div>

        {/* Build Command */}
        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">⚙️ Build Configuration</h3>
          <p className="text-gray-700 dark:text-gray-300 mb-3">
            Vercel automatically detects Next.js. If needed, use these commands:
          </p>
          <div className="space-y-3">
            <div>
              <strong className="text-gray-900 dark:text-white">Build Command:</strong>
              <CodeBlock id="build-cmd" code={`pnpm prisma generate && pnpm build`} />
            </div>
            <div>
              <strong className="text-gray-900 dark:text-white">Install Command:</strong>
              <CodeBlock id="install-cmd" code={`pnpm install`} />
            </div>
            <div>
              <strong className="text-gray-900 dark:text-white">Start Command (PM2 for EC2):</strong>
              <CodeBlock id="start-cmd" code={`pm2 start npm --name "taskflow" -- start`} />
            </div>
          </div>
        </div>

        {/* Testing */}
        <div className="bg-linear-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-6 rounded-xl border border-yellow-200 dark:border-yellow-800">
          <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">🧪 Basic Testing</h3>
          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            <div>
              <h4 className="font-semibold text-yellow-700 dark:text-yellow-400 mb-2">Manual Testing Checklist</h4>
              <ul className="space-y-1 text-sm ml-4">
                <li>✓ User registration with all three roles</li>
                <li>✓ Login/logout functionality</li>
                <li>✓ Project creation (Admin only)</li>
                <li>✓ Task assignment and status updates</li>
                <li>✓ Role-based access control (try accessing admin as member)</li>
                <li>✓ Dashboard statistics loading correctly</li>
                <li>✓ Responsive design on mobile/tablet/desktop</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-orange-700 dark:text-orange-400 mb-2">Basic Unit Testing (Optional)</h4>
              <CodeBlock
                id="test-cmd"
                code={`# Install testing libraries
pnpm add -D jest @testing-library/react @testing-library/jest-dom

# Run tests
pnpm test`}
              />
            </div>
          </div>
        </div>

        {/* Support */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
          <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">❓ Need Help?</h3>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li className="flex items-center gap-2">
              <span className="text-blue-600">→</span>
              <span>
                Check{' '}
                <a
                  href="https://github.com/diwakarjha554/tms-digitally-next"
                  target="_blank"
                  className="text-blue-600 hover:underline"
                >
                  GitHub Repository
                </a>
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-blue-600">→</span>
              <span>
                Read{' '}
                <a href="https://nextjs.org/docs" target="_blank" className="text-blue-600 hover:underline">
                  Next.js Documentation
                </a>
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-blue-600">→</span>
              <span>
                AWS Guides:{' '}
                <a href="https://docs.aws.amazon.com" target="_blank" className="text-blue-600 hover:underline">
                  AWS Documentation
                </a>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
