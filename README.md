# TaskFlow - Enterprise Task Management System

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-16.1.6-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Prisma-5.0-2D3748?style=for-the-badge&logo=prisma" alt="Prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-15-316192?style=for-the-badge&logo=postgresql" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Tailwind-4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind" />
</div>

<p align="center">
  <strong>A modern, role-based task management system built with Next.js 16 and TypeScript</strong>
</p>

<p align="center">
  <a href="#-live-demo">Live Demo</a> •
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-setup">Setup</a> •
  <a href="#-deployment">Deployment</a>
</p>

---

## 🚀 Live Demo

**🌐 Live URL:** [https://your-app.vercel.app](https://your-app.vercel.app)

### 🔑 Test Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | diwakarjha@digitallynext.com | diwakar1234 |
| **Project Manager** | manish.singh@digitallynext.com | diwakar1234 |
| **Member** | kalpana.chauhan@digitallynext.com | diwakar1234 |

---

## 📋 Project Overview

TaskFlow is a comprehensive enterprise-grade task management system designed to streamline project workflows with role-based access control. It enables teams to collaborate efficiently through projects, tasks, and real-time updates.

### Key Highlights
- 🔐 **Role-Based Access Control** (Admin, Project Manager, Member)
- 📊 **Real-time Dashboard** with statistics and analytics
- 🎯 **Project & Task Management** with status tracking
- 👥 **Team Collaboration** with assignments and comments
- 🎨 **Modern UI/UX** with dark mode support
- 📱 **Fully Responsive** design for all devices

---

## ✨ Features

### 🔐 Authentication & Authorization
- Secure authentication using NextAuth.js (Auth.js v5)
- Bcrypt password hashing
- Role-based access control (RBAC)
- Protected routes with middleware
- Session management with JWT

### 👥 Role-Based Permissions

#### Admin
- Create, update, delete projects
- Assign project managers
- Manage all users
- View complete system analytics
- Access to all projects and tasks

#### Project Manager
- Create and assign tasks
- Update task status
- Manage team members in assigned projects
- View project-specific analytics
- Cannot create projects

#### Member
- View assigned tasks
- Update own task status
- View project details
- Limited to assigned projects only

### 📊 Dashboard Features
- Real-time statistics (total projects, tasks, users)
- Task distribution charts
- Recent activity feed
- Quick action buttons
- Role-specific views

### 🎯 Project Management
- Create projects with descriptions
- Assign project managers
- Set project status (Planning, Active, Completed, On Hold)
- Track project progress
- Team member management

### ✅ Task Management
- Create tasks with priority levels (Low, Medium, High)
- Assign tasks to team members
- Track task status (To Do, In Progress, Completed)
- Set due dates
- Add descriptions and notes

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 16.1.6 (App Router)
- **Language:** TypeScript 5.x
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui
- **Icons:** Lucide React
- **Notifications:** React Hot Toast
- **Forms:** React Hook Form + Zod validation

### Backend
- **Runtime:** Node.js (via Next.js)
- **API:** Next.js App Router API Routes
- **Authentication:** NextAuth.js v5 (Auth.js)
- **Password Hashing:** bcrypt-ts

### Database
- **Database:** PostgreSQL 15+
- **ORM:** Prisma 5.x
- **Schema Management:** Prisma Migrations
- **Type Safety:** Prisma Client

### DevOps & Deployment
- **Hosting:** Vercel (Serverless)
- **Database Hosting:** Supabase
- **Version Control:** Git + GitHub
- **CI/CD:** Vercel Auto Deploy
- **Cloud Alternative:** AWS (EC2, RDS, S3)

---

## 🏗️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Client (Browser)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Next.js    │  │   React 19   │  │  TypeScript  │      │
│  │  App Router  │  │  Components  │  │  Type Safe   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTP/HTTPS
┌─────────────────────────────────────────────────────────────┐
│                   Next.js Server (Vercel)                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Middleware (Auth Check)                    │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  API Routes  │  │   NextAuth   │  │    Server    │      │
│  │   /api/*     │  │    (Auth)    │  │  Components  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                         ↕ Prisma Client
┌─────────────────────────────────────────────────────────────┐
│              PostgreSQL Database (Railway)                   │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐        │
│  │  Users  │  │ Projects│  │  Tasks  │  │ Members │        │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘        │
└─────────────────────────────────────────────────────────────┘
```

### Application Flow

1. **User Authentication Flow**
   ```
   Login → NextAuth.js → Prisma → PostgreSQL → JWT Token → Session
   ```

2. **Request Flow**
   ```
   Client → Middleware (Auth) → API Route → Prisma → Database → Response
   ```

3. **Authorization Flow**
   ```
   Request → Session Check → Role Verification → Action Allowed/Denied
   ```

---

## 🗄️ Database Schema

### ER Diagram

```
┌─────────────────────┐
│        User         │
│─────────────────────│
│ id (PK)             │
│ email (unique)      │
│ password (hashed)   │
│ name                │
│ role (enum)         │◄──┐
│ createdAt           │   │
└─────────────────────┘   │
        │                 │
        │ 1               │
        │                 │
        │ N               │
        ▼                 │
┌─────────────────────┐   │
│      Project        │   │
│─────────────────────│   │
│ id (PK)             │   │
│ name                │   │
│ description         │   │
│ status (enum)       │   │
│ managerId (FK) ─────┼───┘
│ createdAt           │
└─────────────────────┘
        │
        │ 1
        │
        │ N
        ▼
┌─────────────────────┐     ┌─────────────────────┐
│        Task         │  N  │   ProjectMember     │
│─────────────────────│ ◄───┤─────────────────────│
│ id (PK)             │     │ id (PK)             │
│ title               │     │ projectId (FK)      │
│ description         │     │ userId (FK)         │
│ status (enum)       │     │ joinedAt            │
│ priority (enum)     │     └─────────────────────┘
│ dueDate             │
│ projectId (FK)      │
│ assigneeId (FK)     │
│ createdAt           │
└─────────────────────┘
```

### Database Tables

#### 1. **User Table**
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String
  role      Role     @default(MEMBER)
  createdAt DateTime @default(now())
}

enum Role {
  ADMIN
  PROJECT_MANAGER
  MEMBER
}
```

**Purpose:** Store user credentials and role information for authentication and authorization.

#### 2. **Project Table**
```prisma
model Project {
  id          String        @id @default(cuid())
  name        String
  description String?
  status      ProjectStatus @default(PLANNING)
  managerId   String
  manager     User          @relation(fields: [managerId])
  createdAt   DateTime      @default(now())
}

enum ProjectStatus {
  PLANNING
  ACTIVE
  COMPLETED
  ON_HOLD
}
```

**Purpose:** Store project information with assigned project manager.

#### 3. **Task Table**
```prisma
model Task {
  id          String       @id @default(cuid())
  title       String
  description String?
  status      TaskStatus   @default(TODO)
  priority    TaskPriority @default(MEDIUM)
  dueDate     DateTime?
  projectId   String
  assigneeId  String?
  createdAt   DateTime     @default(now())
}

enum TaskStatus {
  TODO
  IN_PROGRESS
  COMPLETED
}

enum TaskPriority {
  LOW
  MEDIUM
  HIGH
}
```

**Purpose:** Store task details with status tracking and assignments.

#### 4. **ProjectMember Table** (Many-to-Many)
```prisma
model ProjectMember {
  id        String   @id @default(cuid())
  projectId String
  userId    String
  joinedAt  DateTime @default(now())
  
  @@unique([projectId, userId])
}
```

**Purpose:** Manage team members in projects (many-to-many relationship).

---

## 🔧 Setup Instructions

### Prerequisites
- Node.js 18+ installed
- PostgreSQL 15+ installed (or Railway/Supabase account)
- pnpm/npm/yarn package manager
- Git installed

### 1️⃣ Clone Repository
```bash
git clone https://github.com/yourusername/taskflow.git
cd taskflow
```

### 2️⃣ Install Dependencies
```bash
# Using pnpm (recommended)
pnpm install

# OR using npm
npm install

# OR using yarn
yarn install
```

### 3️⃣ Environment Variables
Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/taskflow"

NODE_ENV="development"

AUTH_SECRET="your-super-secret-key-change-this-in-production-min-32-chars"

NEXTAUTH_URL="http://localhost:3000"
```

#### Environment Variables Explained

| Variable | Description | Example |
|----------|-------------|---------|
| DATABASE_URL | PostgreSQL connection string | postgresql://user:pass@localhost:5432/db |
| AUTH_SECRET | Secret key for JWT signing | Generate with `openssl rand -base64 32` |
| NEXTAUTH_URL | Base URL of your application | http://localhost:3000 |
| NODE_ENV | Environment mode | development / production |

### 4️⃣ Database Setup

```bash
# Generate Prisma Client
pnpm prisma generate

# Run database migrations
pnpm prisma migrate dev --name init

# Seed database with initial data (optional)
pnpm prisma db seed
```

### 5️⃣ Run Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6️⃣ Access Prisma Studio (Optional)
```bash
pnpm prisma studio
```
Browse your database at [http://localhost:5555](http://localhost:5555)

---

## 🚀 Deployment

### Option 1: Vercel + Railway (Recommended)

#### Step 1: Deploy Database to Railway
1. Go to [Railway.app](https://railway.app) and sign up
2. Create new project → Add PostgreSQL
3. Copy the `DATABASE_URL` from Railway dashboard
4. Run migrations:
   ```bash
   DATABASE_URL="your-railway-url" pnpm prisma migrate deploy
   ```

#### Step 2: Deploy to Vercel
1. Push code to GitHub
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. Go to [Vercel.com](https://vercel.com) and import repository

3. Add environment variables in Vercel dashboard:
   - `DATABASE_URL` → Your Railway PostgreSQL URL
   - `AUTH_SECRET` → Generate with `openssl rand -base64 32`
   - `NEXTAUTH_URL` → Your Vercel deployment URL
   - `NEXT_PUBLIC_APP_URL` → Your Vercel deployment URL

4. Click **Deploy**

Your app is live! 🎉

### Option 2: AWS Deployment

#### AWS Services Required
- **EC2** - Host Next.js application
- **RDS** - PostgreSQL database
- **S3** - Static assets and backups
- **Route 53** - DNS management
- **CloudFront** - CDN for global delivery

#### Deployment Steps

1. **Setup RDS PostgreSQL**
   ```bash
   # Create RDS instance
   # Configure security groups (port 5432)
   # Note connection string
   ```

2. **Launch EC2 Instance**
   ```bash
   # SSH into EC2
   ssh -i your-key.pem ubuntu@your-ec2-ip

   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Install pnpm
   npm install -g pnpm
   ```

3. **Deploy Application**
   ```bash
   # Clone repository
   git clone https://github.com/yourusername/taskflow.git
   cd taskflow

   # Install dependencies
   pnpm install

   # Setup environment variables
   nano .env.production

   # Run migrations
   pnpm prisma migrate deploy

   # Build application
   pnpm build

   # Start with PM2
   npm install -g pm2
   pm2 start npm --name "taskflow" -- start
   pm2 save
   pm2 startup
   ```

4. **Configure Nginx**
   ```nginx
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
   ```

5. **Setup SSL with Certbot**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

---

## 📚 Code Explanation

### 1. Authentication Flow

#### Overview
TaskFlow uses NextAuth.js v5 (Auth.js) with Credentials Provider for authentication.

#### Flow Diagram
```
┌─────────────┐
│ User Login  │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│ signIn() function   │
│ (NextAuth.js)       │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Credentials Provider│
│ authorize() method  │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Fetch User from DB  │
│ (Prisma query)      │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Verify Password     │
│ (bcrypt.compare)    │
└──────┬──────────────┘
       │
       ▼
   ┌───┴───┐
   │ Valid?│
   └───┬───┘
       │
   ┌───┴────────┐
   │            │
  Yes           No
   │            │
   ▼            ▼
┌──────┐   ┌────────┐
│Return│   │Return  │
│User  │   │null    │
│Object│   │(Error) │
└───┬──┘   └────────┘
    │
    ▼
┌─────────────────────┐
│ JWT Token Created   │
│ (jwt callback)      │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Session Created     │
│ (session callback)  │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ User Authenticated  │
│ Redirect Dashboard  │
└─────────────────────┘
```

#### Code Implementation

**auth.config.ts**
```typescript
import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { compare } from 'bcrypt-ts';
import { prisma } from '@/lib/prisma';

export default {
  providers: [
    Credentials({
      credentials: {
        email: { type: 'email' },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        // 1. Validate input
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // 2. Find user in database
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user) return null;

        // 3. Verify password
        const isValid = await compare(
          credentials.password as string,
          user.password
        );

        if (!isValid) return null;

        // 4. Return user object
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    // 5. Add role to JWT token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    // 6. Add role to session
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
```

**Middleware Protection**
```typescript
// middleware.ts
import { auth } from '@/auth';

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  // Protect dashboard routes
  if (pathname.startsWith('/dashboard') && !isLoggedIn) {
    return Response.redirect(new URL('/login', req.url));
  }

  // Redirect logged-in users from auth pages
  if ((pathname === '/login' || pathname === '/register') && isLoggedIn) {
    return Response.redirect(new URL('/dashboard', req.url));
  }
});
```

### 2. Task & Project Flow

#### Project Creation Flow (Admin Only)
```
┌──────────────────┐
│ Admin Dashboard  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ "Create Project" │
│     Button       │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────┐
│ Project Form Modal       │
│ - Name                   │
│ - Description            │
│ - Assign Manager         │
│ - Status                 │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ POST /api/projects       │
│ (Check: Admin only)      │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ Prisma: Create Project   │
│ Link Manager (FK)        │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ Return Project Data      │
│ Show Success Toast       │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ Redirect to Projects     │
│ Revalidate Cache         │
└──────────────────────────┘
```

#### Task Assignment Flow
```
┌──────────────────────┐
│ Project Manager View │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Select Project       │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ "Create Task" Button │
└──────────┬───────────┘
           │
           ▼
┌─────────────────────────────┐
│ Task Form                   │
│ - Title                     │
│ - Description               │
│ - Priority (Low/Med/High)   │
│ - Assign to Member          │
│ - Due Date                  │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│ POST /api/tasks             │
│ (Check: PM or Admin)        │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│ Prisma: Create Task         │
│ Link Project & Assignee     │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│ Return Task Data            │
│ Show Success Notification   │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│ Update Task List            │
│ Notify Assigned Member      │
└─────────────────────────────┘
```

#### Code Implementation

**Create Project API**
```typescript
// app/api/projects/route.ts
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  // 1. Check authentication
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Check if user is Admin
  if ((session.user as any).role !== 'ADMIN') {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  // 3. Parse request body
  const body = await req.json();
  const { name, description, managerId, status } = body;

  // 4. Validate data
  if (!name || !managerId) {
    return Response.json({ error: 'Missing fields' }, { status: 400 });
  }

  // 5. Create project in database
  const project = await prisma.project.create({
    data: {
      name,
      description,
      managerId,
      status: status || 'PLANNING',
    },
    include: {
      manager: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  // 6. Return success response
  return Response.json(project, { status: 201 });
}
```

**Create Task API**
```typescript
// app/api/tasks/route.ts
export async function POST(req: Request) {
  const session = await auth();
  
  // Only Admin and PM can create tasks
  const role = (session.user as any).role;
  if (role !== 'ADMIN' && role !== 'PROJECT_MANAGER') {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await req.json();
  const { title, description, projectId, assigneeId, priority, dueDate } = body;

  const task = await prisma.task.create({
    data: {
      title,
      description,
      projectId,
      assigneeId,
      priority: priority || 'MEDIUM',
      status: 'TODO',
      dueDate: dueDate ? new Date(dueDate) : null,
    },
    include: {
      assignee: { select: { name: true, email: true } },
      project: { select: { name: true } },
    },
  });

  return Response.json(task, { status: 201 });
}
```

### 3. ORM Usage (Prisma)

#### Why Prisma?
- **Type Safety:** Auto-generated TypeScript types
- **Developer Experience:** Intuitive API
- **Migration Management:** Version control for database
- **Query Performance:** Optimized SQL queries
- **Relation Handling:** Easy joins and includes

#### Common Prisma Patterns

**1. Find Unique**
```typescript
const user = await prisma.user.findUnique({
  where: { email: 'user@example.com' },
});
```

**2. Create with Relations**
```typescript
const project = await prisma.project.create({
  data: {
    name: 'New Project',
    manager: {
      connect: { id: managerId },
    },
    members: {
      create: [
        { userId: member1Id },
        { userId: member2Id },
      ],
    },
  },
  include: {
    manager: true,
    members: true,
  },
});
```

**3. Update**
```typescript
const task = await prisma.task.update({
  where: { id: taskId },
  data: { status: 'COMPLETED' },
});
```

**4. Complex Queries**
```typescript
const projects = await prisma.project.findMany({
  where: {
    status: 'ACTIVE',
    members: {
      some: {
        userId: currentUserId,
      },
    },
  },
  include: {
    manager: true,
    tasks: {
      where: { status: 'TODO' },
      orderBy: { dueDate: 'asc' },
    },
    _count: {
      select: { tasks: true, members: true },
    },
  },
});
```

**5. Transactions**
```typescript
await prisma.$transaction(async (tx) => {
  // Create project
  const project = await tx.project.create({
    data: projectData,
  });

  // Add members
  await tx.projectMember.createMany({
    data: memberIds.map(id => ({
      projectId: project.id,
      userId: id,
    })),
  });

  return project;
});
```

### 4. API Structure

TaskFlow follows RESTful API conventions with Next.js App Router.

#### API Organization
```
app/api/
├── auth/               # Authentication endpoints (NextAuth)
│   └── [...nextauth]/
├── register/           # User registration
│   └── route.ts
├── dashboard/          # Dashboard statistics
│   └── stats/
│       └── route.ts
├── projects/           # Project CRUD
│   ├── route.ts        # GET (all), POST (create)
│   └── [id]/
│       └── route.ts    # GET, PUT, DELETE (single)
├── tasks/              # Task CRUD
│   ├── route.ts        # GET (all), POST (create)
│   └── [id]/
│       └── route.ts    # GET, PUT, DELETE (single)
└── users/              # User management
    └── route.ts        # GET (all users)
```

#### API Conventions

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---------------|
| POST | /api/register | Create new user | No |
| GET | /api/projects | Get all projects | Yes |
| POST | /api/projects | Create project | Admin |
| GET | /api/projects/[id] | Get single project | Yes |
| PUT | /api/projects/[id] | Update project | Admin |
| DELETE | /api/projects/[id] | Delete project | Admin |
| GET | /api/tasks | Get tasks (filtered by role) | Yes |
| POST | /api/tasks | Create task | PM/Admin |
| PUT | /api/tasks/[id] | Update task | PM/Admin/Member |

#### API Response Format

**Success Response**
```json
{
  "id": "clx1234567890",
  "name": "Project Name",
  "status": "ACTIVE",
  "createdAt": "2026-02-10T10:30:00.000Z"
}
```

**Error Response**
```json
{
  "error": "Unauthorized",
  "message": "You must be logged in to access this resource"
}
```

#### Error Handling Pattern
```typescript
// app/api/projects/[id]/route.ts
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Authentication check
    const session = await auth();
    if (!session?.user) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 2. Authorization check
    const role = (session.user as any).role;
    if (role !== 'ADMIN') {
      return Response.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // 3. Validate input
    const { id } = params;
    if (!id) {
      return Response.json(
        { error: 'Invalid project ID' },
        { status: 400 }
      );
    }

    // 4. Database operation
    await prisma.project.delete({
      where: { id },
    });

    // 5. Success response
    return Response.json(
      { message: 'Project deleted successfully' },
      { status: 200 }
    );

  } catch (error) {
    // 6. Error handling
    console.error('Delete project error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### 5. UI Component Strategy

#### Component Architecture
```
components/
├── ui/                      # shadcn/ui base components
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   ├── select.tsx
│   └── dialog.tsx
├── layout/                  # Layout components
│   ├── Sidebar.tsx
│   ├── Header.tsx
│   └── Footer.tsx
├── dashboard/               # Dashboard-specific
│   ├── StatsCard.tsx
│   ├── TaskChart.tsx
│   └── RecentActivity.tsx
├── projects/                # Project-specific
│   ├── ProjectCard.tsx
│   ├── ProjectList.tsx
│   └── CreateProjectModal.tsx
├── tasks/                   # Task-specific
│   ├── TaskCard.tsx
│   ├── TaskList.tsx
│   ├── TaskBoard.tsx
│   └── CreateTaskModal.tsx
└── shared/                  # Shared components
    ├── RoleBadge.tsx
    ├── StatusBadge.tsx
    └── PriorityBadge.tsx
```

#### Design Patterns Used

**1. Compound Components (Modal Pattern)**
```typescript
<Dialog>
  <DialogTrigger>
    <Button>Create Project</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>New Project</DialogTitle>
    </DialogHeader>
    <ProjectForm />
  </DialogContent>
</Dialog>
```

**2. Render Props Pattern (Status Badge)**
```typescript
export function StatusBadge({ status }: { status: string }) {
  const styles = {
    ACTIVE: 'bg-green-100 text-green-800',
    PLANNING: 'bg-blue-100 text-blue-800',
    COMPLETED: 'bg-gray-100 text-gray-800',
  };

  return (
    <Badge className={styles[status]}>
      {status}
    </Badge>
  );
}
```

**3. Custom Hooks**
```typescript
// hooks/useProjects.ts
export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        setProjects(data);
        setLoading(false);
      });
  }, []);

  return { projects, loading };
}
```

**4. Server vs Client Components**

Server Components (Default)
```typescript
// app/dashboard/page.tsx - Server Component
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export default async function DashboardPage() {
  // Fetch data on server
  const session = await auth();
  const stats = await prisma.project.count();

  return <DashboardContent stats={stats} />;
}
```

Client Components (Interactive)
```typescript
// components/ProjectCard.tsx - Client Component
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function ProjectCard({ project }) {
  const [liked, setLiked] = useState(false);

  return (
    <Card>
      <Button onClick={() => setLiked(!liked)}>
        {liked ? '❤️' : '🤍'}
      </Button>
    </Card>
  );
}
```

#### Styling Strategy

**1. Tailwind Utility Classes**
```tsx
<div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
    Project Name
  </h2>
</div>
```

**2. CSS Modules (Optional)**
```css
/* styles/Dashboard.module.css */
.statsCard {
  @apply p-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl;
}
```

**3. shadcn/ui Customization**
```typescript
// components/ui/button.tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground",
        outline: "border border-input hover:bg-accent",
      },
    },
  }
);
```

---

## 📂 Project Structure

```
taskflow/
├── app/
│   ├── (auth)/                    # Auth group
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── (dashboard)/               # Protected group
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── projects/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   └── tasks/
│   │       └── page.tsx
│   ├── api/                       # API routes
│   │   ├── auth/
│   │   ├── projects/
│   │   ├── tasks/
│   │   └── users/
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Landing page
├── components/
│   ├── ui/                        # shadcn/ui
│   ├── layout/
│   ├── dashboard/
│   ├── projects/
│   └── tasks/
├── lib/
│   ├── prisma.ts                  # Prisma client
│   └── utils.ts                   # Utilities
├── prisma/
│   ├── schema.prisma              # Database schema
│   └── migrations/                # Migration files
├── public/                        # Static assets
├── styles/                        # Global styles
├── auth.ts                        # NextAuth config
├── auth.config.ts                 # Auth providers
├── middleware.ts                  # Route protection
└── package.json
```

---

## 🧪 Testing

### Manual Testing Checklist

#### Authentication
- [ ] Register new user
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Logout
- [ ] Session persistence

#### Admin Role
- [ ] Create project
- [ ] Assign project manager
- [ ] Update project
- [ ] Delete project
- [ ] View all users

#### Project Manager Role
- [ ] View assigned projects
- [ ] Create tasks in projects
- [ ] Assign tasks to members
- [ ] Update task status
- [ ] Cannot create projects

#### Member Role
- [ ] View assigned tasks
- [ ] Update own task status
- [ ] Cannot create/delete tasks
- [ ] Cannot access admin features

### API Testing (Optional)

```bash
# Test login
curl -X POST http://localhost:3000/api/auth/callback/credentials \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@taskflow.com","password":"admin123"}'

# Test create project (requires auth)
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -H "Cookie: your-session-cookie" \
  -d '{"name":"Test Project","managerId":"user-id"}'
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Database Connection Error
```
Error: Can't reach database server
```
**Solution:**
- Check `DATABASE_URL` in `.env`
- Ensure PostgreSQL is running
- Test connection: `psql -h localhost -U username -d dbname`

#### 2. Prisma Client Not Generated
```
Error: Cannot find module '@prisma/client'
```
**Solution:**
```bash
pnpm prisma generate
```

#### 3. Auth Error (CredentialsSignin)
```
[auth][error] CredentialsSignin
```
**Solution:**
- Check email/password are correct
- Verify user exists in database
- Check bcrypt password hashing

#### 4. Middleware Loop
```
Middleware redirect loop detected
```
**Solution:**
- Check `middleware.ts` logic
- Ensure proper exclusion of `/api/auth` routes

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Your Name**

- GitHub: [@diwakarjha554](https://github.com/diwakarjha554)
- Email: diwakarjha554@gmail.com
- LinkedIn: [Diwakar Jha](https://linkedin.com/in/diwakarjha554)

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React Framework
- [Auth.js](https://authjs.dev/) - Authentication
- [Prisma](https://www.prisma.io/) - Database ORM
- [shadcn/ui](https://ui.shadcn.com/) - UI Components
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Vercel](https://vercel.com/) - Deployment Platform

---

<div align="center">
  <p>⭐ Star this repository if you find it helpful!</p>
  <p>Made with ❤️ by Diwakar Jha</p>
</div>