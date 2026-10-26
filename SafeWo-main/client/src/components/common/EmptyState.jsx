import React from 'react';
import { AlertCircle } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = AlertCircle,
  title = 'No records found',
  description = 'There are no items to display at this moment.',
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-slate-800">
      <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1.5">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-all duration-150"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
