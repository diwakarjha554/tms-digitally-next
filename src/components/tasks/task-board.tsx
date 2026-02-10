'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import TaskCard from './task-card';
import CreateTaskModal from './create-task-modal';
import { ListTodo, Plus, Clock, PlayCircle, CheckCircle2, Inbox } from 'lucide-react';
import toast from 'react-hot-toast';

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate: string | null;
  assignee: {
    id: string;
    name: string | null;
    email: string;
  } | null;
  assigneeId: string | null;
}

interface Member {
  id: string;
  name: string | null;
  email: string;
  role: string;
}

interface TaskBoardProps {
  projectId: string;
  initialTasks: Task[];
  members: Member[];
  canManageTasks: boolean;
}

export default function TaskBoard({ projectId, initialTasks, members, canManageTasks }: TaskBoardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  const todoTasks = tasks.filter((t) => t.status === 'TODO');
  const inProgressTasks = tasks.filter((t) => t.status === 'IN_PROGRESS');
  const completedTasks = tasks.filter((t) => t.status === 'DONE');

  async function handleStatusChange(taskId: string, newStatus: 'TODO' | 'IN_PROGRESS' | 'DONE') {
    const previousTasks = [...tasks];
    setTasks(tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)));

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('API Error:', {
          status: res.status,
          statusText: res.statusText,
          error: errorData,
          taskId,
          newStatus,
        });
        throw new Error(errorData.error || errorData.message || 'Failed to update task');
      }

      const responseData = await res.json();
      setTasks((currentTasks) => currentTasks.map((t) => (t.id === taskId ? responseData : t)));

      const statusMessages = {
        TODO: 'Task moved to To Do',
        IN_PROGRESS: 'Task moved to In Progress',
        DONE: 'Task marked as completed!',
      };

      toast.success(statusMessages[newStatus]);
    } catch (error: any) {
      console.error('Failed to update task:', error);
      setTasks(previousTasks);
      toast.error(error.message || 'Failed to move task. Please try again.', {
        duration: 4000,
      });
    }
  }

  function handleDragStart(task: Task) {
    setDraggedTask(task);
  }

  function handleDragOver(e: React.DragEvent, column: string) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(column);
  }

  function handleDragLeave(e: React.DragEvent) {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    if (x < rect.left || x >= rect.right || y < rect.top || y >= rect.bottom) {
      setDragOverColumn(null);
    }
  }

  async function handleDrop(e: React.DragEvent, status: 'TODO' | 'IN_PROGRESS' | 'DONE') {
    e.preventDefault();

    if (!draggedTask || !canManageTasks) {
      setDraggedTask(null);
      setDragOverColumn(null);
      return;
    }

    if (draggedTask.status !== status) {
      await handleStatusChange(draggedTask.id, status);
    } else {
      toast('Task is already in this column', {
        icon: 'ℹ️',
        duration: 2000,
      });
    }

    setDraggedTask(null);
    setDragOverColumn(null);
  }

  function handleDragEnd() {
    setDraggedTask(null);
    setDragOverColumn(null);
  }

  function handleTaskCreated(newTask: Task) {
    setTasks([...tasks, newTask]);
    setShowCreateModal(false);
  }

  function handleTaskUpdated(updatedTask: Task) {
    setTasks(tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
  }

  function handleTaskDeleted(taskId: string) {
    setTasks(tasks.filter((t) => t.id !== taskId));
  }

  const columns = [
    {
      id: 'TODO',
      title: 'To Do',
      icon: Clock,
      iconColor: 'text-yellow-600 dark:text-yellow-500',
      topBorderColor: 'border-t-yellow-500',
      badgeColor: 'bg-yellow-500 text-white',
      emptyBgColor: 'bg-yellow-50 dark:bg-yellow-900/10',
      tasks: todoTasks,
    },
    {
      id: 'IN_PROGRESS',
      title: 'In Progress',
      icon: PlayCircle,
      iconColor: 'text-blue-600 dark:text-blue-500',
      topBorderColor: 'border-t-blue-500',
      badgeColor: 'bg-blue-500 text-white',
      emptyBgColor: 'bg-blue-50 dark:bg-blue-900/10',
      tasks: inProgressTasks,
    },
    {
      id: 'DONE',
      title: 'Done',
      icon: CheckCircle2,
      iconColor: 'text-green-600 dark:text-green-500',
      topBorderColor: 'border-t-green-500',
      badgeColor: 'bg-green-500 text-white',
      emptyBgColor: 'bg-green-50 dark:bg-green-900/10',
      tasks: completedTasks,
    },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <ListTodo className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Tasks</h2>
          <Badge variant="outline" className="text-sm">
            {tasks.length} total
          </Badge>
        </div>
        {canManageTasks && (
          <Button onClick={() => setShowCreateModal(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Task
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => {
          const Icon = column.icon;
          const isDropTarget = dragOverColumn === column.id;
          const isDraggingToSameColumn = draggedTask?.status === column.id;

          return (
            <div key={column.id} className="flex flex-col">
              <Card
                className={`flex-1 overflow-hidden transition-all duration-200 border-t-4 ${column.topBorderColor} ${
                  isDropTarget && !isDraggingToSameColumn
                    ? 'ring-2 ring-blue-500 shadow-xs scale-[1.02] bg-blue-50/50 dark:bg-blue-900/10'
                    : ''
                } ${isDraggingToSameColumn && isDropTarget ? 'opacity-50' : ''}`}
                onDragOver={(e) => handleDragOver(e, column.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, column.id as any)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-5 h-5 ${column.iconColor}`} />
                      <h3 className="font-semibold text-gray-900 dark:text-white">{column.title}</h3>
                    </div>
                    <Badge className={column.badgeColor}>{column.tasks.length}</Badge>
                  </div>
                </CardHeader>

                <CardContent className="p-4 space-y-3 min-h-100 bg-gray-50 dark:bg-gray-900/50">
                  {column.tasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className={`p-3 rounded-full ${column.emptyBgColor} mb-3`}>
                        <Inbox className="w-8 h-8 text-gray-400 dark:text-gray-600" />
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">No tasks here</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {canManageTasks && column.id === 'TODO' ? 'Create a task to get started' : 'Drag tasks here'}
                      </p>
                    </div>
                  ) : (
                    column.tasks.map((task) => (
                      <div
                        key={task.id}
                        className={`transition-opacity duration-200 ${
                          draggedTask?.id === task.id ? 'opacity-50' : 'opacity-100'
                        }`}
                      >
                        <TaskCard
                          task={task}
                          members={members}
                          canManage={canManageTasks}
                          onDragStart={() => handleDragStart(task)}
                          onDragEnd={handleDragEnd}
                          onUpdate={handleTaskUpdated}
                          onDelete={handleTaskDeleted}
                        />
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>

      {showCreateModal && (
        <CreateTaskModal
          projectId={projectId}
          members={members}
          onClose={() => setShowCreateModal(false)}
          onTaskCreated={handleTaskCreated}
        />
      )}
    </div>
  );
}
