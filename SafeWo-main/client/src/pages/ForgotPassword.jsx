import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Shield, Mail, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [demoToken, setDemoToken] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await api.post('/auth/forgot-password', { email });
      setMessage(response.data.message);
      if (response.data.demoResetToken) {
        setDemoToken(response.data.demoResetToken);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to request password reset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl p-6 sm:p-8">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 flex items-center justify-center mx-auto mb-3">
            <Shield className="w-6 h-6 fill-rose-600" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Reset Password
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter your email and we'll generate a secure reset link.
          </p>
        </div>

        {message ? (
          <div className="p-5 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <h4 className="font-bold text-emerald-900 dark:text-emerald-200 text-sm mb-1">
              Reset Token Generated
            </h4>
            <p className="text-xs text-emerald-700 dark:text-emerald-400 mb-4">{message}</p>
            {demoToken && (
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl text-left border border-emerald-200 mb-4">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Demo Reset Token:</span>
                <code className="text-xs text-rose-600 font-mono break-all">{demoToken}</code>
                <div className="mt-2">
                  <Link
                    to={`/reset-password?token=${demoToken}`}
                    className="inline-block px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700"
                  >
                    Proceed with Token &rarr;
                  </Link>
                </div>
              </div>
            )}
            <Link to="/login" className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:underline">
              Back to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 text-xs font-semibold text-red-600 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Your Registered Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="e.g. priya@safewo.demo"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-500/20 disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Send Reset Link'}
            </button>

            <div className="text-center mt-4">
              <Link to="/login" className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline">
                &larr; Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
