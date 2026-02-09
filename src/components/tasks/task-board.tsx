'use client';

import { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay } from '@dnd-kit/core';
import TaskColumn from './task-column';
import TaskCard from './task-card';
import CreateTaskModal from './create-task-modal';

interface Task {
  id: string;
  title: string;
  description: string | null;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  dueDate: Date | null;
  assignee: { id: string; name: string | null } | null;
}

interface Member {
  id: string;
  name: string | null;
  email: string;
}

interface TaskBoardProps {
  projectId: string;
  initialTasks: Task[];
  members: Member[];
  isOwner: boolean;
}

export default function TaskBoard({
  projectId,
  initialTasks,
  members,
  isOwner,
}: TaskBoardProps) {
  const [tasks, setTasks] = useState(initialTasks);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<'TODO' | 'IN_PROGRESS' | 'DONE'>('TODO');

  const todoTasks = tasks.filter((t) => t.status === 'TODO');
  const inProgressTasks = tasks.filter((t) => t.status === 'IN_PROGRESS');
  const doneTasks = tasks.filter((t) => t.status === 'DONE');

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    
    if (!over || active.id === over.id) return;

    const taskId = active.id as string;
    const newStatus = over.id as 'TODO' | 'IN_PROGRESS' | 'DONE';

    // Optimistic update
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );

    // API call
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Failed to update task');
    } catch (error) {
      // Revert on error
      setTasks(initialTasks);
      alert('Failed to update task');
    }
  }

  function handleCreateTask(status: 'TODO' | 'IN_PROGRESS' | 'DONE') {
    setSelectedStatus(status);
    setShowCreateModal(true);
  }

  async function handleTaskCreated() {
    // Refresh tasks
    const res = await fetch(`/api/tasks?projectId=${projectId}`);
    const newTasks = await res.json();
    setTasks(newTasks);
  }

  async function handleDeleteTask(taskId: string) {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete task');

      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (error) {
      alert('Failed to delete task');
    }
  }

  return (
    <>
      <DndContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TaskColumn
            title="To Do"
            status="TODO"
            tasks={todoTasks}
            onCreateTask={() => handleCreateTask('TODO')}
            onDeleteTask={handleDeleteTask}
          />
          <TaskColumn
            title="In Progress"
            status="IN_PROGRESS"
            tasks={inProgressTasks}
            onCreateTask={() => handleCreateTask('IN_PROGRESS')}
            onDeleteTask={handleDeleteTask}
          />
          <TaskColumn
            title="Done"
            status="DONE"
            tasks={doneTasks}
            onCreateTask={() => handleCreateTask('DONE')}
            onDeleteTask={handleDeleteTask}
          />
        </div>

        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} /> : null}
        </DragOverlay>
      </DndContext>

      {showCreateModal && (
        <CreateTaskModal
          projectId={projectId}
          status={selectedStatus}
          members={members}
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleTaskCreated}
        />
      )}
    </>
  );
}
