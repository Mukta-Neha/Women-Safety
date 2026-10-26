import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Check,
  X,
  Trash2,
  Filter,
  Search,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import { SeverityBadge, StatusBadge, CategoryBadge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { Pagination } from '../components/common/Pagination';
import api from '../services/api';
import { formatDate, formatRelativeTime } from '../utils/formatters';

export const AdminIncidents = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchKeyword, setSearchKeyword] = useState('');

  const fetchIncidents = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/incidents', {
        params: {
          page: currentPage,
          status: statusFilter !== 'ALL' ? statusFilter : undefined,
          limit: 15,
        },
      });
      setIncidents(res.data.data);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error('Failed to fetch admin incidents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, [currentPage, statusFilter]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/admin/incidents/${id}`, { status });
      setIncidents((prev) =>
        prev.map((inc) => (inc._id === id ? { ...inc, status } : inc))
      );
    } catch (err) {
      console.error('Failed to update incident status:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Permanently delete this incident report?')) {
      try {
        await api.delete(`/incidents/${id}`);
        setIncidents((prev) => prev.filter((inc) => inc._id !== id));
        setTotal((prev) => prev - 1);
      } catch (err) {
        console.error('Failed to delete incident:', err);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Incident Moderation Console
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300">
              {total} Total Reports
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Review community safety reports, verify threats, or reject misinformation.
          </p>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending Review</option>
            <option value="VERIFIED">Verified Only</option>
            <option value="RESOLVED">Resolved Only</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Incidents Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-card overflow-hidden">
        {loading ? (
          <LoadingSpinner text="Fetching incident reports..." />
        ) : incidents.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            No incident reports found matching this criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="p-4">Incident Details</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Severity</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Reported</th>
                  <th className="p-4 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {incidents.map((incident) => (
                  <tr key={incident._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                    <td className="p-4 max-w-xs">
                      <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
                        {incident.title}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400 line-clamp-1 text-[11px]">
                        {incident.description}
                      </span>
                    </td>
                    <td className="p-4">
                      <CategoryBadge category={incident.category} />
                    </td>
                    <td className="p-4">
                      <SeverityBadge severity={incident.severity} />
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400 max-w-[180px] truncate">
                      {incident.address}
                    </td>
                    <td className="p-4">
                      <StatusBadge status={incident.status} />
                    </td>
                    <td className="p-4 text-slate-400">
                      {formatRelativeTime(incident.createdAt)}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {incident.status !== 'VERIFIED' && (
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(incident._id, 'VERIFIED')}
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 transition-colors"
                            title="Approve / Verify"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        {incident.status !== 'REJECTED' && (
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(incident._id, 'REJECTED')}
                            className="p-1.5 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 dark:bg-amber-950/60 dark:text-amber-300 transition-colors"
                            title="Reject / Dismiss"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                        {incident.status !== 'RESOLVED' && (
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(incident._id, 'RESOLVED')}
                            className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300 transition-colors"
                            title="Mark Resolved"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDelete(incident._id)}
                          className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/60 dark:text-red-300 transition-colors"
                          title="Delete Incident"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(p) => setCurrentPage(p)}
          />
        </div>
      </div>
    </div>
  );
};
