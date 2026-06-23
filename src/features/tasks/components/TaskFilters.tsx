import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { ProjectMember } from '../../../types/models';

interface TaskFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  priority: string;
  onPriorityChange: (val: string) => void;
  assigneeId: string;
  onAssigneeIdChange: (val: string) => void;
  members: ProjectMember[];
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  search,
  onSearchChange,
  priority,
  onPriorityChange,
  assigneeId,
  onAssigneeIdChange,
  members,
}) => {
  const handleClearFilters = () => {
    onSearchChange('');
    onPriorityChange('');
    onAssigneeIdChange('');
  };

  const isFiltered = search || priority || assigneeId;

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-4 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm text-slate-800 dark:text-zinc-100">
      {/* Text search filter */}
      <div className="relative flex-1">
        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-zinc-500 pointer-events-none">
          <Search className="w-4 h-4" />
        </span>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tasks..."
          className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all text-slate-900 dark:text-white text-sm"
        />
      </div>

      {/* Select Dropdowns */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Priority Filter */}
        <select
          value={priority}
          onChange={(e) => onPriorityChange(e.target.value)}
          className="px-3 py-2 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 rounded-xl focus:outline-none text-slate-700 dark:text-zinc-300 text-sm"
        >
          <option value="">All Priorities</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>

        {/* Assignee Filter */}
        <select
          value={assigneeId}
          onChange={(e) => onAssigneeIdChange(e.target.value)}
          className="px-3 py-2 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 rounded-xl focus:outline-none text-slate-700 dark:text-zinc-300 text-sm max-w-[160px]"
        >
          <option value="">All Assignees</option>
          <option value="null">Unassigned</option>
          {members.map((m) => (
            <option key={m.user_id} value={m.user_id}>
              {m.profile.name}
            </option>
          ))}
        </select>

        {/* Clear filters shortcut */}
        {isFiltered && (
          <button
            onClick={handleClearFilters}
            className="flex items-center space-x-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-600 dark:text-zinc-300 rounded-xl text-xs font-semibold transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span>Clear Filters</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskFilters;
