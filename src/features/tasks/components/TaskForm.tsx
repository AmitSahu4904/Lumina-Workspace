import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { ProjectMember } from '../../../types/models';
import { TaskStatus, TaskPriority } from '../../../types/enums';

const taskFormSchema = z.object({
  title: z
    .string()
    .min(3, 'Task title must be at least 3 characters')
    .max(100, 'Task title must not exceed 100 characters'),
  description: z
    .string()
    .max(1000, 'Description must not exceed 1000 characters')
    .optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  assigned_to: z.string().optional(),
  due_date: z.string().optional(),
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  initialValues?: any | null;
  members: ProjectMember[];
  title: string;
  isSubmitting?: boolean;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
  members,
  title,
  isSubmitting = false,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      description: '',
      status: 'TODO',
      priority: 'MEDIUM',
      assigned_to: '',
      due_date: '',
    },
  });

  const handleFormSubmit = (data: TaskFormValues) => {
    onSubmit({
      ...data,
      description: data.description || null,
      assigned_to: data.assigned_to || null,
      due_date: data.due_date || null,
    });
  };

  useEffect(() => {
    if (initialValues) {
      reset({
        title: initialValues.title,
        description: initialValues.description || '',
        status: initialValues.status,
        priority: initialValues.priority,
        assigned_to: initialValues.assigned_to || '',
        due_date: initialValues.due_date || '',
      });
    } else {
      reset({
        title: '',
        description: '',
        status: 'TODO',
        priority: 'MEDIUM',
        assigned_to: '',
        due_date: '',
      });
    }
  }, [initialValues, reset, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-lg p-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-2xl z-10 animate-fade-in text-slate-800 dark:text-zinc-100 flex flex-col max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <X className="w-4.5 h-4.5" />
        </button>

        <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
          {title}
        </h3>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 overflow-y-auto pr-1">
          {/* Title */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 dark:text-zinc-300">
              Task Title
            </label>
            <input
              type="text"
              {...register('title')}
              placeholder="e.g. Design Landing Page"
              className="w-full px-4 py-2 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all text-slate-900 dark:text-white text-sm"
            />
            {errors.title && (
              <p className="text-xs text-red-500 font-medium">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 dark:text-zinc-300">
              Description (optional)
            </label>
            <textarea
              {...register('description')}
              rows={3}
              placeholder="Add details about this task..."
              className="w-full px-4 py-2 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all text-slate-900 dark:text-white text-sm resize-none"
            />
            {errors.description && (
              <p className="text-xs text-red-500 font-medium">{errors.description.message}</p>
            )}
          </div>

          {/* Grid fields: Status & Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 dark:text-zinc-300">
                Status
              </label>
              <select
                {...register('status')}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 rounded-xl focus:outline-none text-slate-900 dark:text-white text-sm"
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 dark:text-zinc-300">
                Priority
              </label>
              <select
                {...register('priority')}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 rounded-xl focus:outline-none text-slate-900 dark:text-white text-sm"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
          </div>

          {/* Grid fields: Assignee & Due Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 dark:text-zinc-300">
                Assignee
              </label>
              <select
                {...register('assigned_to')}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 rounded-xl focus:outline-none text-slate-900 dark:text-white text-sm"
              >
                <option value="">Unassigned</option>
                {members.map((m) => (
                  <option key={m.user_id} value={m.user_id}>
                    {m.profile.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 dark:text-zinc-300">
                Due Date
              </label>
              <input
                type="date"
                {...register('due_date')}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 rounded-xl focus:outline-none text-slate-900 dark:text-white text-sm"
              />
            </div>
          </div>

          {/* Buttons Footer */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-zinc-800 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 border border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 text-sm font-semibold rounded-xl focus:outline-none transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-slate-950 font-semibold text-sm rounded-xl focus:outline-none transition-all disabled:opacity-50 shadow-md"
            >
              {isSubmitting ? 'Saving...' : 'Save Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
