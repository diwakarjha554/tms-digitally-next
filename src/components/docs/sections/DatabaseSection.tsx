'use client';

import { Database } from 'lucide-react';

export default function DatabaseSection() {
  return (
    <section id="database" className="docs-section scroll-mt-24">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-gray-900 dark:text-white">
        <Database className="w-8 h-8 text-cyan-600" />
        Database Schema
      </h2>

      <div className="space-y-6">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          TaskFlow uses <strong>PostgreSQL</strong> with <strong>Prisma ORM</strong> for type-safe database access. The
          schema is designed to support role-based access control and efficient task management.
        </p>

        {/* Prisma Schema */}
        <div>
          <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Prisma Schema</h3>
          <div className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto">
            <pre className="text-sm">
              {`// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
}

enum UserRole {
  ADMIN
  PROJECT_MANAGER
  MEMBER
}

enum ProjectStatus {
  ACTIVE
  ON_HOLD
  COMPLETED
}

enum TaskStatus {
  TODO
  IN_PROGRESS
  DONE
}

enum TaskPriority {
  LOW
  MEDIUM
  HIGH
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String?
  role      UserRole @default(MEMBER)
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  createdProjects    Project[]           @relation("ProjectOwner")
  managedProjects    Project[]           @relation("ProjectManager")
  projectMemberships ProjectMembership[]
  createdTasks       Task[]              @relation("TaskCreator")
  assignedTasks      Task[]              @relation("TaskAssignee")
  activityLogs       ActivityLog[]

  @@map("users")
}

model Project {
  id          String        @id @default(uuid())
  name        String
  description String?
  status      ProjectStatus @default(ACTIVE)
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  // Owner (Admin who created)
  ownerId String
  owner   User   @relation("ProjectOwner", fields: [ownerId], references: [id], onDelete: Cascade)

  // Project Manager (assigned by admin)
  managerId String?
  manager   User?   @relation("ProjectManager", fields: [managerId], references: [id], onDelete: SetNull)

  // Relations
  tasks        Task[]
  memberships  ProjectMembership[]
  activityLogs ActivityLog[]

  @@map("projects")
}

model ProjectMembership {
  id        String   @id @default(uuid())
  createdAt DateTime @default(now())

  userId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  projectId String
  project   Project @relation(fields: [projectId], references: [id], onDelete: Cascade)

  @@unique([userId, projectId])
  @@map("project_memberships")
}

model Task {
  id          String       @id @default(uuid())
  title       String
  description String?
  priority    TaskPriority @default(MEDIUM)
  status      TaskStatus   @default(TODO)
  dueDate     DateTime?
  order       Int          @default(0)
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
  completedAt DateTime?

  projectId String
  project   Project @relation(fields: [projectId], references: [id], onDelete: Cascade)

  assigneeId String?
  assignee   User?   @relation("TaskAssignee", fields: [assigneeId], references: [id], onDelete: SetNull)

  createdById String
  createdBy   User   @relation("TaskCreator", fields: [createdById], references: [id], onDelete: Cascade)

  activityLogs ActivityLog[]

  @@map("tasks")
}

model ActivityLog {
  id        String   @id @default(uuid())
  action    String // "created", "updated", "deleted", "assigned", "completed"
  entity    String // "project", "task", "user"
  entityId  String
  details   String? // JSON string with details
  createdAt DateTime @default(now())

  userId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  projectId String?
  project   Project? @relation(fields: [projectId], references: [id], onDelete: Cascade)

  taskId String?
  task   Task?   @relation(fields: [taskId], references: [id], onDelete: Cascade)

  @@map("activity_logs")
}`}
            </pre>
          </div>
        </div>

        {/* ER Diagram Description - FIXED */}
        <div className="bg-linear-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
          <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Entity Relationships</h3>
          <div className="space-y-5 text-gray-700 dark:text-gray-300">
            {/* User ↔ Project */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
              <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                User ↔ Project (Multiple Relationships)
              </h4>
              <ul className="ml-6 space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">→</span>
                  <span>
                    <strong>Owner Relationship:</strong> One User can <strong>own</strong> multiple Projects (1:M)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">→</span>
                  <span>
                    <strong>Manager Relationship:</strong> One User can <strong>manage</strong> multiple Projects (1:M)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">→</span>
                  <span>
                    <strong>Member Relationship:</strong> One User can be <strong>member</strong> of multiple Projects
                    (M:M through ProjectMembership)
                  </span>
                </li>
                <li className="flex items-start gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-purple-600 mt-0.5">←</span>
                  <span>
                    <strong>Reverse:</strong> One Project has ONE owner (required)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-0.5">←</span>
                  <span>
                    <strong>Reverse:</strong> One Project has ONE manager (optional)
                  </span>
                </li>
              </ul>
            </div>

            {/* ProjectMembership Junction Table */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
              <h4 className="font-semibold text-purple-600 dark:text-purple-400 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                User ↔ ProjectMembership ↔ Project (Junction Table)
              </h4>
              <ul className="ml-6 space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-0.5">•</span>
                  <span>
                    <strong>Many-to-Many:</strong> Users can be members of multiple Projects
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-0.5">•</span>
                  <span>One User → multiple ProjectMemberships (1:M)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-0.5">•</span>
                  <span>One Project → multiple ProjectMemberships (1:M)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-0.5">•</span>
                  <span>Unique constraint prevents duplicate memberships</span>
                </li>
              </ul>
            </div>

            {/* Project ↔ Task */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-green-200 dark:border-green-700">
              <h4 className="font-semibold text-green-600 dark:text-green-400 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-600"></span>
                Project ↔ Task
              </h4>
              <ul className="ml-6 space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">→</span>
                  <span>One Project has multiple Tasks (1:M)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">←</span>
                  <span>One Task belongs to ONE Project (M:1, required)</span>
                </li>
              </ul>
            </div>

            {/* User ↔ Task */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-orange-200 dark:border-orange-700">
              <h4 className="font-semibold text-orange-600 dark:text-orange-400 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-600"></span>
                User ↔ Task (Two Relationships)
              </h4>
              <ul className="ml-6 space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 mt-0.5">→</span>
                  <span>
                    <strong>Creator Relationship:</strong> One User can <strong>create</strong> multiple Tasks (1:M)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 mt-0.5">→</span>
                  <span>
                    <strong>Assignee Relationship:</strong> One User can be <strong>assigned</strong> to multiple Tasks
                    (1:M)
                  </span>
                </li>
                <li className="flex items-start gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-red-600 mt-0.5">←</span>
                  <span>
                    <strong>Reverse:</strong> One Task has ONE creator (required)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-0.5">←</span>
                  <span>
                    <strong>Reverse:</strong> One Task has ONE assignee (optional)
                  </span>
                </li>
              </ul>
            </div>

            {/* ActivityLog */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-300 dark:border-gray-700">
              <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gray-600"></span>
                ActivityLog Relationships
              </h4>
              <ul className="ml-6 space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-gray-600 mt-0.5">•</span>
                  <span>One User → multiple ActivityLogs (1:M, required)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-600 mt-0.5">•</span>
                  <span>One Project → multiple ActivityLogs (1:M, optional)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-600 mt-0.5">•</span>
                  <span>One Task → multiple ActivityLogs (1:M, optional)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Database Constraints */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Database Constraints & Rules</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-blue-600 mb-2">Cascade Deletes</h4>
              <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                <li>• Delete Project → deletes all Tasks</li>
                <li>• Delete Project → deletes all ProjectMemberships</li>
                <li>• Delete User → deletes owned Projects</li>
                <li>• Delete Task → deletes related ActivityLogs</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-purple-600 mb-2">Set Null Actions</h4>
              <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                <li>• Delete Manager → sets managerId to null</li>
                <li>• Delete Assignee → sets assigneeId to null</li>
                <li>• Project continues without manager</li>
                <li>• Task becomes unassigned</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-green-600 mb-2">Unique Constraints</h4>
              <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                <li>• User email must be unique</li>
                <li>• (userId, projectId) unique in ProjectMembership</li>
                <li>• Prevents duplicate project memberships</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-orange-600 mb-2">Default Values</h4>
              <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                <li>• UserRole defaults to MEMBER</li>
                <li>• ProjectStatus defaults to ACTIVE</li>
                <li>• TaskStatus defaults to TODO</li>
                <li>• TaskPriority defaults to MEDIUM</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div>
          <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Database Features</h3>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">✓</span>
              <span>
                <strong>Type-Safe Enums:</strong> UserRole, ProjectStatus, TaskStatus, TaskPriority for data consistency
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">✓</span>
              <span>
                <strong>UUID Primary Keys:</strong> Globally unique identifiers for better security and scalability
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">✓</span>
              <span>
                <strong>Automatic Timestamps:</strong> createdAt and updatedAt tracking on all major entities
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">✓</span>
              <span>
                <strong>Soft Delete Support:</strong> isActive field on User for account deactivation
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">✓</span>
              <span>
                <strong>Activity Tracking:</strong> Comprehensive audit log for all major actions
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">✓</span>
              <span>
                <strong>Flexible Task Ordering:</strong> Order field for custom task sorting in Kanban boards
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
