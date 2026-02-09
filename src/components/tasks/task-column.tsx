'use client';

import { useDroppable } from '@dnd-kit/core';
import TaskCard from './task-card';

interface Task {
  id: string;
  title: string;
  description: string | null;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  dueDate: Date | null;
  assignee: { id: string; name: string | null } | null;
}

interface TaskColumnProps {
  title: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  tasks: Task[];
  onCreateTask: () => void;
  onDeleteTask: (taskId: string) => void;
}

export default function TaskColumn({
  title,
  status,
  tasks,
  onCreateTask,
  onDeleteTask,
}: TaskColumnProps) {
  const { setNodeRef } = useDroppable({ id: status });

  const colorClass =
    status === 'TODO'
      ? 'border-yellow-300 bg-yellow-50'
      : status === 'IN_PROGRESS'
      ? 'border-blue-300 bg-blue-50'
      : 'border-green-300 bg-green-50';

  return (
    <div className="bg-gray-100 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-900">
          {title} <span className="text-gray-500">({tasks.length})</span>
        </h3>
        <button
          onClick={onCreateTask}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          + Add
        </button>
      </div>

      <div
        ref={setNodeRef}
        className={`space-y-3 min-h-125 p-2 rounded-lg border-2 border-dashed ${colorClass}`}
      >
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onDelete={onDeleteTask} />
        ))}
      </div>
    </div>
  );
}
