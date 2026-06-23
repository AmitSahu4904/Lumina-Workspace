import React, { useState } from 'react';
import { Calendar, Edit, Trash2, ArrowRightLeft, ShieldAlert } from 'lucide-react';
import { Task } from '../../../types/models';
import { TaskStatus, TaskPriority } from '../../../types/enums';
import useAuth from '../../../hooks/useAuth';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onMoveStatus: (id: string, newStatus: TaskStatus) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onMoveStatus,
}) => {
  const { user } = useAuth();
  const [isMoveOpen, setIsMoveOpen] = useState(false);

  const isCreator = task.created_by === user?.id;

  const priorityColors = {
    HIGH: 'text-red-700 bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/30',
    MEDIUM: 'text-amber-700 bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30',
    LOW: 'text-blue-700 bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/30',
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const statusOptions: { label: string; value: TaskStatus }[] = [
    { label: 'To Do', value: 'TODO' },
    { label: 'In Progress', value: 'IN_PROGRESS' },
    { label: 'Done', value: 'DONE' },
  ];

  return (
    <div className="group bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm hover:shadow transition-all text-slate-800 dark:text-zinc-100 flex flex-col space-y-4">
      {/* Priority & Top actions */}
      <div className="flex justify-between items-center relative">
        <span
          className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${
            priorityColors[task.priority]
          }`}
        >
          {task.priority}
        </span>

        {/* Task CRUD Action Buttons */}
        <div className="flex items-center space-x-1.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(task)}
            className="p-1 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-white rounded-md transition-colors"
            title="Edit Task"
          >
            <Edit className="w-3.5 h-3.5" />
          </button>
          
          {isCreator ? (
            <button
              onClick={() => onDelete(task.id)}
              className="p-1 hover:bg-red-50 dark:hover:bg-red-950/20 text-slate-400 hover:text-red-600 rounded-md transition-colors"
              title="Delete Task"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          ) : (
            <span
              className="p-1 text-slate-300 dark:text-zinc-700 cursor-not-allowed"
              title="Only task creator can delete"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
            </span>
          )}
        </div>
      </div>

      {/* Task Info Content */}
      <div className="space-y-1">
        <h4 className="font-semibold text-sm text-slate-900 dark:text-white line-clamp-2">
          {task.title}
        </h4>
        {task.description && (
          <p className="text-xs text-slate-500 dark:text-zinc-400 line-clamp-2">
            {task.description}
          </p>
        )}
      </div>

      {/* Footer Metadata & Move Controls */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-zinc-800/80">
        <div className="flex items-center space-x-2">
          {/* Assignee display */}
          {task.assignee ? (
            <div 
              className="flex items-center justify-center shrink-0" 
              title={`Assigned to ${task.assignee.name}`}
            >
              {task.assignee.avatar_url ? (
                <img
                  src={task.assignee.avatar_url}
                  alt={task.assignee.name}
                  className="w-6 h-6 rounded-full object-cover border border-slate-200 dark:border-zinc-700"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-950 flex items-center justify-center text-[10px] font-bold">
                  {getInitials(task.assignee.name)}
                </div>
              )}
            </div>
          ) : (
            <span className="text-[10px] text-slate-400 dark:text-zinc-600 italic">
              Unassigned
            </span>
          )}

          {/* Due date display */}
          {task.due_date && (
            <div className="flex items-center space-x-1 text-[10px] text-slate-400 dark:text-zinc-500">
              <Calendar className="w-3 h-3" />
              <span>{task.due_date}</span>
            </div>
          )}
        </div>

        {/* Move dropdown trigger */}
        <div className="relative">
          <button
            onClick={() => setIsMoveOpen(!isMoveOpen)}
            className="flex items-center space-x-1 px-2 py-1 bg-slate-50 dark:bg-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-700 text-slate-600 dark:text-zinc-300 rounded-lg text-xs font-semibold border border-slate-200 dark:border-zinc-700/60 transition-colors"
          >
            <ArrowRightLeft className="w-3 h-3" />
            <span>Move</span>
          </button>

          {isMoveOpen && (
            <>
              <div 
                className="fixed inset-0 z-20" 
                onClick={() => setIsMoveOpen(false)}
              />
              <div className="absolute bottom-full right-0 mb-1.5 w-36 py-1 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-xl z-30 animate-fade-in divide-y divide-slate-50 dark:divide-zinc-800 text-left">
                {statusOptions
                  .filter((opt) => opt.value !== task.status)
                  .map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        onMoveStatus(task.id, opt.value);
                        setIsMoveOpen(false);
                      }}
                      className="w-full px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-xs font-semibold transition-colors flex items-center justify-between"
                    >
                      <span>{opt.label}</span>
                    </button>
                  ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
