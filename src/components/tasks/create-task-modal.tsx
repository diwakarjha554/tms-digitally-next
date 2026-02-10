'use client';

import { useState, SyntheticEvent } from 'react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import {
  Plus,
  Loader2,
  FileText,
  Clock,
  PlayCircle,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  ArrowDown,
  CalendarIcon,
  User,
  Users,
  X,
} from 'lucide-react';

interface Member {
  id: string;
  name: string | null;
  email: string;
  role: string;
}

interface CreateTaskModalProps {
  projectId: string;
  members: Member[];
  onClose: () => void;
  onTaskCreated: (task: any) => void;
}

export default function CreateTaskModal({ projectId, members, onClose, onTaskCreated }: CreateTaskModalProps) {
  const [loading, setLoading] = useState(false);
  const [taskStatus, setTaskStatus] = useState<'TODO' | 'IN_PROGRESS' | 'DONE'>('TODO');
  const [taskPriority, setTaskPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
  const [assigneeId, setAssigneeId] = useState<string>('unassigned');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);

  async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get('title'),
      description: formData.get('description'),
      status: taskStatus,
      priority: taskPriority,
      dueDate: dueDate ? dueDate.toISOString() : null,
      assigneeId: assigneeId === 'unassigned' ? null : assigneeId,
      projectId,
    };

    const loadingToast = toast.loading('Creating task...');

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to create task');
      }

      const task = await res.json();
      toast.success('Task created successfully! 🎉', { id: loadingToast });
      onTaskCreated(task);
    } catch (err: any) {
      toast.error(err.message || 'Failed to create task', { id: loadingToast });
      setLoading(false);
    }
  }

  const handleStatusChange = (value: string) => {
    setTaskStatus(value as 'TODO' | 'IN_PROGRESS' | 'DONE');
  };

  const handlePriorityChange = (value: string) => {
    setTaskPriority(value as 'LOW' | 'MEDIUM' | 'HIGH');
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Plus className="w-6 h-6" />
            Create New Task
          </DialogTitle>
          <DialogDescription>Fill in the details below to create a new task for this project</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Task Title *
            </Label>
            <Input
              id="title"
              name="title"
              type="text"
              required
              minLength={3}
              placeholder="e.g., Design landing page"
              disabled={loading}
              autoFocus
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">Minimum 3 characters</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              rows={4}
              placeholder="Add task description..."
              disabled={loading}
              className="resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status" className="flex items-center gap-2">
                <PlayCircle className="w-4 h-4" />
                Status *
              </Label>
              <Select value={taskStatus} onValueChange={handleStatusChange} disabled={loading}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODO">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-yellow-600" />
                      To Do
                    </div>
                  </SelectItem>
                  <SelectItem value="IN_PROGRESS">
                    <div className="flex items-center gap-2">
                      <PlayCircle className="w-4 h-4 text-blue-600" />
                      In Progress
                    </div>
                  </SelectItem>
                  <SelectItem value="DONE">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      Completed
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority" className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Priority *
              </Label>
              <Select value={taskPriority} onValueChange={handlePriorityChange} disabled={loading}>
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">
                    <div className="flex items-center gap-2">
                      <ArrowDown className="w-4 h-4 text-green-600" />
                      Low
                    </div>
                  </SelectItem>
                  <SelectItem value="MEDIUM">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                      Medium
                    </div>
                  </SelectItem>
                  <SelectItem value="HIGH">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      High
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                Due Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={loading}
                    className={cn('w-full justify-start text-left font-normal', !dueDate && 'text-muted-foreground')}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, 'PPP') : <span>Pick a date</span>}
                    {dueDate && (
                      <X
                        className="ml-auto h-4 w-4 opacity-50 hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDueDate(undefined);
                        }}
                      />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {dueDate && (
                <p className="text-xs text-gray-500 dark:text-gray-400">Selected: {format(dueDate, 'MMMM dd, yyyy')}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignee" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Assign To
              </Label>
              <Select value={assigneeId} onValueChange={setAssigneeId} disabled={loading}>
                <SelectTrigger id="assignee">
                  <SelectValue placeholder="Select team member" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      Unassigned
                    </div>
                  </SelectItem>
                  {members.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      <div className="flex items-center gap-2">
                        <Avatar className="w-5 h-5">
                          <AvatarFallback className="bg-linear-to-br from-blue-500 to-indigo-600 text-white text-[10px] font-semibold">
                            {member.name?.[0]?.toUpperCase() || member.email[0]?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium">{member.name || member.email}</span>
                          <span className="text-xs text-gray-500">{member.role}</span>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 dark:text-gray-400">{members.length} team members available</p>
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Task
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
