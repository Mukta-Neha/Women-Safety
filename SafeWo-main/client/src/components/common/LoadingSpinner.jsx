import React from 'react';

export const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div
        className={`${sizeClasses[size]} border-rose-200 dark:border-rose-950 border-t-rose-600 rounded-full animate-spin mb-3`}
      />
      {text && <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{text}</p>}
    </div>
  );
};

export const SkeletonCard = () => (
  <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <div className="w-24 h-5 bg-slate-200 dark:bg-slate-800 rounded-full" />
      <div className="w-16 h-5 bg-slate-200 dark:bg-slate-800 rounded-full" />
    </div>
    <div className="w-3/4 h-6 bg-slate-200 dark:bg-slate-800 rounded mb-2" />
    <div className="w-full h-4 bg-slate-200 dark:bg-slate-800 rounded mb-2" />
    <div className="w-2/3 h-4 bg-slate-200 dark:bg-slate-800 rounded" />
  </div>
);
