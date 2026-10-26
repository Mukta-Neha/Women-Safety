import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Activity,
  Radio,
  ArrowRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  CartesianGrid,
} from 'recharts';
import { StatsCard } from '../components/cards/StatsCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { StatusBadge, SeverityBadge } from '../components/common/Badge';
import api from '../services/api';
import { formatRelativeTime } from '../utils/formatters';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        setStats(res.data.data);
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading || !stats) {
    return <LoadingSpinner text="Loading command center statistics..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              SafeWo Admin Command Center
            </h1>
            <span className="text-xs px-3 py-1 rounded-full font-black uppercase bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300">
              System Supervisor
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Real-time emergency monitoring, incident analytics, and community dispatch telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/alerts"
            className="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-red-600 hover:bg-red-700 text-white shadow-md flex items-center gap-1.5 animate-pulse"
          >
            <Radio className="w-4 h-4" />
            <span>Active SOS Monitoring ({stats.activeAlerts})</span>
          </Link>
          <Link
            to="/admin/incidents"
            className="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
          >
            Moderate Incidents ({stats.pendingIncidents})
          </Link>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Registered Users"
          value={stats.totalUsers}
          icon={Users}
          color="purple"
          subtitle="Community members protected"
        />
        <StatsCard
          title="Active SOS Alerts"
          value={stats.activeAlerts}
          icon={Radio}
          color="red"
          subtitle="Currently requiring attention"
        />
        <StatsCard
          title="Total Safety Incidents"
          value={stats.totalIncidents}
          icon={AlertTriangle}
          color="rose"
          subtitle={`${stats.criticalIncidents} flagged Critical`}
        />
        <StatsCard
          title="SOS Resolution Rate"
          value={`${stats.resolutionRate}%`}
          icon={CheckCircle2}
          color="emerald"
          subtitle={`${stats.resolvedAlerts} resolved emergency alerts`}
        />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Incidents by Category Bar Chart */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Reported Incidents by Category
              </h3>
              <p className="text-xs text-slate-400">Distribution of crowd-reported occurrences</p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.incidentsByCategory}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="category" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" fill="#e11d48" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Incidents by Severity Pie Chart */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-card">
          <div className="mb-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Incident Severity Breakdown
            </h3>
            <p className="text-xs text-slate-400">Threat level categorization</p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.incidentsBySeverity}
                  dataKey="count"
                  nameKey="severity"
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  innerRadius={45}
                  paddingAngle={4}
                >
                  {stats.incidentsBySeverity.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2">
            {stats.incidentsBySeverity.map((s) => (
              <div key={s.severity} className="flex items-center gap-2 text-xs">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-slate-600 dark:text-slate-300 font-semibold">{s.severity}:</span>
                <span className="text-slate-900 dark:text-white font-bold">{s.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 6-Month Timeline Area Chart */}
        <div className="lg:col-span-12 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Monthly Activity Trends (Past 6 Months)
              </h3>
              <p className="text-xs text-slate-400">Incidents logged vs. SOS alerts triggered</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.monthlyTrends}>
                <defs>
                  <linearGradient id="incidentsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e11d48" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#e11d48" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="alertsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="incidents"
                  name="Incidents"
                  stroke="#e11d48"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#incidentsGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="alerts"
                  name="SOS Alerts"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#alertsGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Alerts List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Recent SOS Alerts Stream
          </h3>
          <Link
            to="/admin/alerts"
            className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
          >
            <span>View All in Monitor</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase tracking-wider font-bold">
              <tr>
                <th className="p-3 rounded-l-xl">User</th>
                <th className="p-3">Type</th>
                <th className="p-3">Location</th>
                <th className="p-3">Time</th>
                <th className="p-3">Status</th>
                <th className="p-3 rounded-r-xl text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {stats.recentAlerts.map((alert) => (
                <tr key={alert._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                  <td className="p-3">
                    <span className="font-bold text-slate-900 dark:text-white block">
                      {alert.userId?.name || 'User'}
                    </span>
                    <span className="text-slate-400 text-[10px]">{alert.userId?.phone}</span>
                  </td>
                  <td className="p-3 font-semibold text-rose-600">{alert.type}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-400">
                    {alert.latitude?.toFixed(4)}, {alert.longitude?.toFixed(4)}
                  </td>
                  <td className="p-3 text-slate-400">{formatRelativeTime(alert.createdAt)}</td>
                  <td className="p-3">
                    <StatusBadge status={alert.status} />
                  </td>
                  <td className="p-3 text-right">
                    <Link
                      to="/admin/alerts"
                      className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 font-bold text-slate-700 dark:text-slate-300"
                    >
                      Inspect
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
