import React, { useState, useEffect } from 'react';
import {
  Radio,
  MapPin,
  Clock,
  Phone,
  CheckCircle2,
  AlertOctagon,
  Eye,
  ShieldCheck,
} from 'lucide-react';
import { LiveSOSMap } from '../components/maps/LiveSOSMap';
import { StatusBadge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import api from '../services/api';
import { formatDate, formatRelativeTime } from '../utils/formatters';
import { getSocket } from '../services/socket';

export const AdminAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');

  const fetchAlerts = async () => {
    try {
      const res = await api.get('/admin/alerts', {
        params: { status: filterStatus !== 'ALL' ? filterStatus : undefined },
      });
      setAlerts(res.data.data);
      if (!selectedAlert && res.data.data.length > 0) {
        setSelectedAlert(res.data.data[0]);
      }
    } catch (err) {
      console.error('Error fetching admin alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [filterStatus]);

  // Real-time socket listener for live emergency tracking
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    // Listen for new SOS created
    socket.on('sos:created', (data) => {
      setAlerts((prev) => [data.alert, ...prev]);
      if (!selectedAlert) setSelectedAlert(data.alert);
    });

    // Listen for live location updates from victims
    socket.on('location:updated', (data) => {
      setAlerts((prev) =>
        prev.map((a) => {
          if (a._id === data.alertId || a.userId?._id === data.userId) {
            return {
              ...a,
              latitude: data.latitude,
              longitude: data.longitude,
              accuracy: data.accuracy,
            };
          }
          return a;
        })
      );

      setSelectedAlert((prev) => {
        if (prev && (prev._id === data.alertId || prev.userId?._id === data.userId)) {
          return {
            ...prev,
            latitude: data.latitude,
            longitude: data.longitude,
            accuracy: data.accuracy,
          };
        }
        return prev;
      });
    });

    // Listen for SOS resolved
    socket.on('sos:resolved', (data) => {
      setAlerts((prev) =>
        prev.map((a) => (a._id === data._id ? { ...a, status: 'RESOLVED' } : a))
      );
      setSelectedAlert((prev) => (prev?._id === data._id ? { ...prev, status: 'RESOLVED' } : prev));
    });

    return () => {
      socket.off('sos:created');
      socket.off('location:updated');
      socket.off('sos:resolved');
    };
  }, [selectedAlert]);

  const handleUpdateStatus = async (alertId, newStatus) => {
    try {
      const res = await api.put(`/admin/alerts/${alertId}`, {
        status: newStatus,
        resolutionNotes: `Status changed to ${newStatus} by admin supervisor.`,
      });
      setAlerts((prev) =>
        prev.map((a) => (a._id === alertId ? res.data.data : a))
      );
      if (selectedAlert?._id === alertId) {
        setSelectedAlert(res.data.data);
      }
    } catch (err) {
      console.error('Failed to update alert status:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Live SOS Monitoring Center
            </h1>
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Real-time emergency broadcast ingestion and dynamic map tracking.
          </p>
        </div>

        {/* Filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200"
        >
          <option value="ALL">All Alerts</option>
          <option value="ACTIVE">Active Emergency Only</option>
          <option value="ACKNOWLEDGED">Acknowledged</option>
          <option value="RESOLVED">Resolved</option>
        </select>
      </div>

      {loading ? (
        <LoadingSpinner text="Connecting to emergency dispatch stream..." />
      ) : alerts.length === 0 ? (
        <EmptyState
          icon={Radio}
          title="No Emergency Alerts"
          description="There are currently no active or historical alerts matching this filter."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Alerts Table / List */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Alerts Queue</h3>
              <span className="text-xs text-slate-400 font-semibold">{alerts.length} Incidents</span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[580px] overflow-y-auto">
              {alerts.map((alert) => {
                const isSelected = selectedAlert?._id === alert._id;
                const isActive = alert.status === 'ACTIVE';

                return (
                  <div
                    key={alert._id}
                    onClick={() => setSelectedAlert(alert)}
                    className={`p-3.5 rounded-2xl cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-rose-50/80 dark:bg-rose-950/40 border-2 border-rose-500'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        {isActive && (
                          <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping flex-shrink-0" />
                        )}
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                          {alert.userId?.name || 'User in Distress'}
                        </h4>
                      </div>
                      <StatusBadge status={alert.status} />
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium line-clamp-1 mb-2">
                      "{alert.message}"
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-rose-500" />
                          {alert.latitude?.toFixed(4)}, {alert.longitude?.toFixed(4)}
                        </span>
                        <span>&bull;</span>
                        <span>{formatRelativeTime(alert.createdAt)}</span>
                      </div>

                      {alert.userId?.phone && (
                        <a
                          href={`tel:${alert.userId.phone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="font-bold text-emerald-600 hover:underline flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3" />
                          <span>{alert.userId.phone}</span>
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Live Selected Alert Map & Dispatch Controls */}
          <div className="lg:col-span-6 space-y-4">
            {selectedAlert ? (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-4">
                {/* Live Tracking Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      Live GPS Tracking: {selectedAlert.userId?.name || 'Victim'}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Coordinates: {selectedAlert.latitude?.toFixed(5)}, {selectedAlert.longitude?.toFixed(5)} (±{Math.round(selectedAlert.accuracy || 10)}m)
                    </p>
                  </div>
                  <StatusBadge status={selectedAlert.status} />
                </div>

                {/* Map */}
                <LiveSOSMap
                  latitude={selectedAlert.latitude}
                  longitude={selectedAlert.longitude}
                  accuracy={selectedAlert.accuracy}
                  userName={selectedAlert.userId?.name}
                  height="360px"
                />

                {/* Admin Actions Bar */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {selectedAlert.userId?.phone && (
                      <a
                        href={`tel:${selectedAlert.userId.phone}`}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call Victim</span>
                      </a>
                    )}
                    <a
                      href="tel:112"
                      className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                    >
                      <span>Dispatch 112</span>
                    </a>
                  </div>

                  <div className="flex items-center gap-2">
                    {selectedAlert.status === 'ACTIVE' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(selectedAlert._id, 'ACKNOWLEDGED')}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm"
                      >
                        Acknowledge
                      </button>
                    )}

                    {selectedAlert.status !== 'RESOLVED' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(selectedAlert._id, 'RESOLVED')}
                        className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-emerald-600 dark:hover:bg-emerald-700 font-bold text-xs shadow-sm flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark Resolved</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center text-slate-400 text-sm">
                Select an alert from the list to monitor live tracking.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
