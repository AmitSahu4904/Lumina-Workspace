import React from 'react';
import { Task } from '../../../types/models';
import { TaskStatus } from '../../../types/enums';
import TaskCard from './TaskCard';

interface KanbanColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onMoveStatus: (id: string, newStatus: TaskStatus) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  title,
  status,
  tasks,
  onEditTask,
  onDeleteTask,
  onMoveStatus,
}) => {
  const statusColors = {
    TODO: 'bg-slate-100/60 dark:bg-zinc-800/20 text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-zinc-800',
    IN_PROGRESS: 'bg-amber-50/40 dark:bg-amber-950/10 text-amber-800 dark:text-amber-400 border-amber-200/50 dark:border-amber-900/10',
    DONE: 'bg-emerald-50/40 dark:bg-emerald-950/10 text-emerald-800 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-900/10',
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50 dark:bg-zinc-900/20 border border-slate-200 dark:border-zinc-800/80 rounded-2xl p-4 min-w-[280px] w-full max-h-[70vh]">
      {/* Column Title Header */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100 dark:border-zinc-800/80">
        <h3 className="font-bold text-sm text-slate-800 dark:text-zinc-200">
          {title}
        </h3>
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-bold font-mono border ${
            statusColors[status]
          }`}
        >
          {tasks.length}
        </span>
      </div>

      {/* Task List container */}
      <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 py-1">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <p className="text-xs text-slate-400 dark:text-zinc-500 italic">
              No tasks here
            </p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onMoveStatus={onMoveStatus}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
