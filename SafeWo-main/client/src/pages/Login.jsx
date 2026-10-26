import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearAuthError } from '../redux/slices/authSlice';
import { Shield, Lock, Mail, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { DEMO_USERS } from '../utils/constants';

export const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (error) dispatch(clearAuthError());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(loginUser(formData));
    if (loginUser.fulfilled.match(resultAction)) {
      if (resultAction.payload.user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate(from, { replace: true });
      }
    }
  };

  const handleFillDemo = (email, password) => {
    setFormData({ email, password });
    if (error) dispatch(clearAuthError());
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl p-6 sm:p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 to-pink-500 text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-rose-500/20">
            <Shield className="w-6 h-6 fill-white" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Welcome Back to SafeWo
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Sign in to access your safety dashboard and emergency tools
          </p>
        </div>

        {/* Quick Demo Credentials Autofill */}
        <div className="mb-6 p-3.5 bg-rose-50/70 dark:bg-rose-950/30 rounded-2xl border border-rose-200/80 dark:border-rose-900/40">
          <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700 dark:text-rose-300 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-rose-600" />
            <span>One-Click Demo Accounts</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleFillDemo(DEMO_USERS[1].email, DEMO_USERS[1].password)}
              className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-800 text-[11px] font-bold text-rose-600 dark:text-rose-300 hover:bg-rose-100/50 transition-colors shadow-sm"
            >
              Demo User (Priya)
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo(DEMO_USERS[0].email, DEMO_USERS[0].password)}
              className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-purple-300 dark:border-purple-800 text-[11px] font-bold text-purple-600 dark:text-purple-300 hover:bg-purple-100/50 transition-colors shadow-sm"
            >
              Demo Admin
            </button>
          </div>
        </div>

        {/* Error Notice */}
        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-xs font-semibold text-red-600 dark:text-red-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                name="email"
                required
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-500/25 flex items-center justify-center gap-2 disabled:opacity-50 transition-all mt-2"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-rose-600 dark:text-rose-400 hover:underline">
            Register for Free
          </Link>
        </p>
      </div>
    </div>
  );
};
