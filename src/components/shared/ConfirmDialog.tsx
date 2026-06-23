import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isConfirming?: boolean;
  variant?: 'danger' | 'warning' | 'info';
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isConfirming = false,
  variant = 'danger',
}) => {
  if (!isOpen) return null;

  const variantButtonClasses = {
    danger: 'bg-red-600 hover:bg-red-500 text-white focus:ring-red-600',
    warning: 'bg-amber-500 hover:bg-amber-400 text-white focus:ring-amber-500',
    info: 'bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-slate-950 focus:ring-slate-900',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onCancel}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-md p-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-2xl z-10 animate-fade-in text-slate-800 dark:text-zinc-100">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex space-x-4">
          {variant === 'danger' && (
            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/30 flex items-center justify-center text-red-600 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
          )}

          <div className="flex-1">
            <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white mb-2">
              {title}
            </h3>
            <p className="text-sm text-slate-500 dark:text-zinc-400 mb-6">
              {description}
            </p>

            <div className="flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onCancel}
                disabled={isConfirming}
                className="px-4 py-2 border border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 text-sm font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all disabled:opacity-50"
              >
                {cancelText}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={isConfirming}
                className={`px-4 py-2 text-sm font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all disabled:opacity-50 ${variantButtonClasses[variant]}`}
              >
                {isConfirming ? 'Processing...' : confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
