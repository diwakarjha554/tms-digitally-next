'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import EditTaskModal from './edit-task-modal';
import {
  MoreVertical,
  Edit,
  Trash2,
  Calendar,
  AlertCircle,
  AlertTriangle,
  ArrowDown,
  User,
  FileText,
  Loader2,
} from 'lucide-react';
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

interface TaskCardProps {
  task: Task;
  members: Member[];
  canManage: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
  onUpdate: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export default function TaskCard({
  task,
  members,
  canManage,
  onDragStart,
  onDragEnd,
  onUpdate,
  onDelete,
}: TaskCardProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return <AlertCircle className="w-3 h-3" />;
      case 'MEDIUM':
        return <AlertTriangle className="w-3 h-3" />;
      case 'LOW':
        return <ArrowDown className="w-3 h-3" />;
      default:
        return <ArrowDown className="w-3 h-3" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'LOW':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  async function handleDelete() {
    setDeleting(true);
    const loadingToast = toast.loading('Deleting task...');

    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete task');

      toast.success('Task deleted successfully!', { id: loadingToast });
      onDelete(task.id);
      setShowDeleteDialog(false);
    } catch (error) {
      toast.error('Failed to delete task', { id: loadingToast });
      setDeleting(false);
    }
  }

  function formatDate(dateString: string | null) {
    if (!dateString) return null;
    const date = new Date(dateString);
    return format(date, 'MMM dd');
  }

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'DONE';

  return (
    <>
      <Card
        draggable={canManage}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        className="hover:shadow-md transition-all cursor-move active:cursor-grabbing"
      >
        <CardContent className="p-4">
          <div className="flex justify-between items-start gap-2 mb-3">
            <h4 className="font-semibold text-gray-900 dark:text-white flex-1 line-clamp-2 text-sm leading-snug">
              {task.title}
            </h4>
            {canManage && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 shrink-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32">
                  <DropdownMenuItem onClick={() => setShowEditModal(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setShowDeleteDialog(true)}
                    className="text-red-600 dark:text-red-400 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {task.description && (
            <div className="mb-3 flex items-start gap-2">
              <FileText className="w-3 h-3 text-gray-400 dark:text-gray-600 mt-0.5 shrink-0" />
              <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{task.description}</p>
            </div>
          )}

          <div className="mb-3">
            <Badge className={`flex items-center gap-1 w-fit text-xs ${getPriorityColor(task.priority)}`}>
              {getPriorityIcon(task.priority)}
              <span>{task.priority}</span>
            </Badge>
          </div>

          <div className="flex items-center justify-between text-xs gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
            {task.assignee ? (
              <div className="flex items-center gap-2 min-w-0">
                <Avatar className="w-6 h-6 ring-2 ring-white dark:ring-gray-800">
                  <AvatarFallback className="bg-linear-to-br from-blue-500 to-indigo-600 text-white text-[10px] font-semibold">
                    {task.assignee.name?.[0]?.toUpperCase() || task.assignee.email[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-gray-700 dark:text-gray-300 truncate font-medium">
                  {task.assignee.name || task.assignee.email.split('@')[0]}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-600">
                <User className="w-3.5 h-3.5" />
                <span>Unassigned</span>
              </div>
            )}

            {task.dueDate && (
              <div
                className={`flex items-center gap-1.5 shrink-0 ${
                  isOverdue ? 'text-red-600 dark:text-red-400 font-semibold' : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{formatDate(task.dueDate)}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {showEditModal && (
        <EditTaskModal task={task} members={members} onClose={() => setShowEditModal(false)} onTaskUpdated={onUpdate} />
      )}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              Delete Task
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <span className="font-semibold">"{task.title}"</span>?
              <br />
              <span className="text-red-600 dark:text-red-400 font-medium">This action cannot be undone.</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Task
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
