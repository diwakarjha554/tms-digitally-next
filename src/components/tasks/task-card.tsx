'use client';

import { useDraggable } from '@dnd-kit/core';
import { formatDate } from '@/lib/utils';

interface Task {
  id: string;
  title: string;
  description: string | null;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate: Date | null;
  assignee: { id: string; name: string | null } | null;
}

interface TaskCardProps {
  task: Task;
  onDelete?: (taskId: string) => void;
}

export default function TaskCard({ task, onDelete }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1,
      }
    : undefined;

  const priorityColor =
    task.priority === 'HIGH'
      ? 'bg-red-100 text-red-800'
      : task.priority === 'MEDIUM'
      ? 'bg-yellow-100 text-yellow-800'
      : 'bg-green-100 text-green-800';

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-move hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-gray-900 flex-1">{task.title}</h4>
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
            className="text-red-500 hover:text-red-700 text-sm ml-2"
          >
            ×
          </button>
        )}
      </div>

      {task.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center justify-between text-xs">
        <span className={`px-2 py-1 rounded-full font-medium ${priorityColor}`}>
          {task.priority}
        </span>
        {task.dueDate && (
          <span className="text-gray-500">{formatDate(task.dueDate)}</span>
        )}
      </div>

      {task.assignee && (
        <div className="mt-2 text-xs text-gray-600">
          Assigned to: {task.assignee.name}
        </div>
      )}
    </div>
  );
}
