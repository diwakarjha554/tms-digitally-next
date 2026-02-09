export interface Project {
  id: string;
  name: string;
  description: string | null;
  status: 'ACTIVE' | 'ON_HOLD' | 'COMPLETED';
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  owner: {
    id: string;
    name: string | null;
    email: string;
  };
  _count?: {
    tasks: number;
    memberships: number;
  };
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  dueDate: Date | null;
  order: number;
  projectId: string;
  assigneeId: string | null;
  createdById: string;
  project: {
    id: string;
    name: string;
  };
  assignee: {
    id: string;
    name: string | null;
  } | null;
  createdBy: {
    id: string;
    name: string | null;
  };
}
