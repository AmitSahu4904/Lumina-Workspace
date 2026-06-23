import React, { useState } from 'react';
import { X, Search, Plus, UserPlus } from 'lucide-react';
import { useUserSearch } from '../hooks/useMembers';
import { useDebounce } from '../../../hooks/useDebounce';
import LoadingSpinner from '../../../components/shared/LoadingSpinner';

interface AddMemberDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMember: (email: string) => Promise<void>;
  projectId: string;
  isAdding: boolean;
}

export const AddMemberDialog: React.FC<AddMemberDialogProps> = ({
  isOpen,
  onClose,
  onAddMember,
  projectId,
  isAdding,
}) => {
  const [searchEmail, setSearchEmail] = useState('');
  const debouncedSearch = useDebounce(searchEmail, 300);

  // Search registered users, excluding members already added to this project
  const { data: searchResults, isLoading } = useUserSearch(debouncedSearch, projectId);

  const handleAddClick = async (email: string) => {
    try {
      await onAddMember(email);
      setSearchEmail('');
      onClose();
    } catch (err) {
      // Error is already alerted by the hook
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-md p-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-2xl z-10 animate-fade-in text-slate-800 dark:text-zinc-100 flex flex-col max-h-[85vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <X className="w-4.5 h-4.5" />
        </button>

        <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
          Add Member to Project
        </h3>

        {/* Email Search Bar */}
        <div className="relative w-full mb-6">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-zinc-500 pointer-events-none">
            <Search className="w-4.5 h-4.5" />
          </span>
          <input
            type="text"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            placeholder="Search by registered email..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all text-slate-900 dark:text-white text-sm"
          />
        </div>

        {/* Search Results Display Area */}
        <div className="flex-1 overflow-y-auto min-h-[150px] max-h-[300px] space-y-2 pr-1">
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <LoadingSpinner size="md" />
            </div>
          ) : searchResults && searchResults.length > 0 ? (
            <div className="space-y-2">
              {searchResults.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 border border-slate-100 dark:border-zinc-800 bg-slate-50/20 dark:bg-zinc-800/10 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800/40 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    {user.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={user.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-zinc-700"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-800 dark:bg-zinc-800 dark:text-zinc-200 flex items-center justify-center text-xs font-bold font-sans border border-slate-200 dark:border-zinc-700">
                        {getInitials(user.name)}
                      </div>
                    )}
                    <div className="text-left">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">
                        {user.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-zinc-400">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddClick(user.email)}
                    disabled={isAdding}
                    className="p-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-slate-950 rounded-lg transition-colors disabled:opacity-50 shrink-0"
                    title="Add User"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : searchEmail.trim().length >= 2 ? (
            <div className="text-center py-10">
              <p className="text-sm text-slate-500 dark:text-zinc-400">
                No registered users found for "{searchEmail}"
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center text-slate-400 dark:text-zinc-500">
              <UserPlus className="w-10 h-10 mb-2 stroke-1.5" />
              <p className="text-xs">
                Type at least 2 characters of a user's email to lookup.
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-zinc-800 text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 text-sm font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMemberDialog;
