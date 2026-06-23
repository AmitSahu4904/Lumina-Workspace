import React from 'react';
import { LucideIcon, Inbox } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  actionText?: string;
  onActionClick?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon = Inbox,
  actionText,
  onActionClick,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl bg-white/50 dark:bg-zinc-900/30 py-12 transition-all">
      <div className="p-4 bg-slate-50 dark:bg-zinc-800/40 rounded-full text-slate-400 dark:text-zinc-500 mb-4">
        <Icon className="w-8 h-8 stroke-1.5" />
      </div>
      <h3 className="text-lg font-bold tracking-tight text-slate-800 dark:text-zinc-200 mb-1">
        {title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-zinc-400 max-w-sm mb-6">
        {description}
      </p>
      {actionText && onActionClick && (
        <button
          type="button"
          onClick={onActionClick}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-slate-950 font-semibold text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all shadow-md"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
