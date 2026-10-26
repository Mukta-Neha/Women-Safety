import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Clock,
  Filter,
  ShieldAlert,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { AlertCard } from '../components/cards/AlertCard';
import { LiveSOSMap } from '../components/maps/LiveSOSMap';
import { Modal } from '../components/common/Modal';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Pagination } from '../components/common/Pagination';
import {
  fetchAlertsHistory,
  fetchAlertById,
  resolveSOSAlert,
} from '../redux/slices/alertSlice';

export const AlertHistory = () => {
  const dispatch = useDispatch();

  const { alerts, total, totalPages, currentPage, loading, currentAlertDetails } = useSelector(
    (state) => state.alert
  );

  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedAlertForMap, setSelectedAlertForMap] = useState(null);

  useEffect(() => {
    dispatch(fetchAlertsHistory({ status: statusFilter, page: currentPage }));
  }, [dispatch, statusFilter, currentPage]);

  const handleResolve = (alert) => {
    dispatch(resolveSOSAlert({ alertId: alert._id, resolutionNotes: 'Marked resolved from history' }));
  };

  const handleViewOnMap = async (alert) => {
    setSelectedAlertForMap(alert);
    dispatch(fetchAlertById(alert._id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              SOS Alert History
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {total} Total Alerts
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Log of previously triggered emergency alerts and location dispatch history.
          </p>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Only</option>
            <option value="RESOLVED">Resolved Only</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Alerts Grid */}
      {loading ? (
        <LoadingSpinner text="Loading alert history..." />
      ) : alerts.length === 0 ? (
        <EmptyState
          icon={ShieldAlert}
          title="No Alert Records Found"
          description="You have no recorded emergency alerts in this status."
        />
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {alerts.map((alert) => (
              <AlertCard
                key={alert._id}
                alert={alert}
                onResolve={handleResolve}
                onView={handleViewOnMap}
              />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(p) => dispatch(fetchAlertsHistory({ status: statusFilter, page: p }))}
          />
        </div>
      )}

      {/* View Alert Location Map Modal */}
      <Modal
        isOpen={!!selectedAlertForMap}
        onClose={() => setSelectedAlertForMap(null)}
        title="SOS Alert Location & Path"
        maxWidth="max-w-2xl"
      >
        {selectedAlertForMap && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>
                Coordinates: {selectedAlertForMap.latitude?.toFixed(4)}, {selectedAlertForMap.longitude?.toFixed(4)}
              </span>
              <span className="font-bold text-rose-600 uppercase">
                Status: {selectedAlertForMap.status}
              </span>
            </div>

            <LiveSOSMap
              latitude={selectedAlertForMap.latitude}
              longitude={selectedAlertForMap.longitude}
              accuracy={selectedAlertForMap.accuracy}
              trail={currentAlertDetails?.trail || []}
              height="350px"
              userName="You"
            />
          </div>
        )}
      </Modal>
    </div>
  );
};
