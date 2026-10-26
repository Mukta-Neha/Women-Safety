import React from 'react';
import { Modal } from './Modal';
import { AlertTriangle } from 'lucide-react';

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = false,
  loading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="flex items-start gap-4 mb-6">
        <div
          className={`p-3 rounded-2xl flex-shrink-0 ${
            isDestructive
              ? 'bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400'
              : 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400'
          }`}
        >
          <AlertTriangle className="w-6 h-6" />
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{message}</p>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="px-4 py-2.5 rounded-xl font-medium text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {cancelText}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={loading}
          className={`px-5 py-2.5 rounded-xl font-semibold text-sm text-white shadow-sm transition-all duration-150 ${
            isDestructive
              ? 'bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-200 dark:focus:ring-red-900/40'
              : 'bg-rose-600 hover:bg-rose-700 focus:ring-4 focus:ring-rose-200 dark:focus:ring-rose-900/40'
          }`}
        >
          {loading ? 'Processing...' : confirmText}
        </button>
      </div>
    </Modal>
  );
};
