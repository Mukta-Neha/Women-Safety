import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Home } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-3xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">404</h1>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">Page Not Found</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          The page you are looking for does not exist or may have moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md shadow-rose-500/20 transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
};
