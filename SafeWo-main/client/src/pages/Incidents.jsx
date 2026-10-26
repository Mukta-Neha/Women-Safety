import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  MapPin,
  List,
  Map as MapIcon,
  Plus,
  AlertTriangle,
  SlidersHorizontal,
} from 'lucide-react';
import { IncidentMap } from '../components/maps/IncidentMap';
import { IncidentCard } from '../components/cards/IncidentCard';
import { IncidentFilters } from '../components/filters/IncidentFilters';
import { ReportIncidentModal } from '../components/modals/ReportIncidentModal';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Pagination } from '../components/common/Pagination';
import {
  fetchIncidents,
  setFilter,
  resetFilters,
  setPage,
  createIncident,
  toggleIncidentHelpful,
} from '../redux/slices/incidentSlice';
import { useGeolocation } from '../hooks/useGeolocation';

export const Incidents = () => {
  const dispatch = useDispatch();

  const { incidents, filters, total, totalPages, currentPage, loading } = useSelector(
    (state) => state.incident
  );
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const { location: coords } = useGeolocation();

  const [viewMode, setViewMode] = useState('split'); // 'split', 'map', 'list'
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);

  useEffect(() => {
    dispatch(
      fetchIncidents({
        userLat: coords?.latitude,
        userLon: coords?.longitude,
      })
    );
  }, [dispatch, filters, currentPage, coords?.latitude, coords?.longitude]);

  const handleFilterChange = (newFilters) => {
    dispatch(setFilter(newFilters));
    dispatch(setPage(1));
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
    dispatch(setPage(1));
  };

  const handlePageChange = (newPage) => {
    dispatch(setPage(newPage));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreateIncident = async (formData) => {
    const resultAction = await dispatch(createIncident(formData));
    if (createIncident.fulfilled.match(resultAction)) {
      setIsReportModalOpen(false);
      dispatch(fetchIncidents());
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Header & Report Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Safety Incidents Explorer
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300">
              {total} Reported
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Real-time community-driven safety alerts and incident mapping.
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          {/* View Toggles */}
          <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setViewMode('split')}
              className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                viewMode === 'split'
                  ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Split View"
            >
              <span className="hidden md:inline">Split</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('map')}
              className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                viewMode === 'map'
                  ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Map Only"
            >
              <MapIcon className="w-4 h-4" />
              <span className="hidden md:inline">Map</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="List Only"
            >
              <List className="w-4 h-4" />
              <span className="hidden md:inline">List</span>
            </button>
          </div>

          {/* Report Button */}
          {isAuthenticated ? (
            <button
              type="button"
              onClick={() => setIsReportModalOpen(true)}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-500/20 flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Report Incident</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsReportModalOpen(true)}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-500/20 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Report Incident</span>
            </button>
          )}
        </div>
      </div>

      {/* Filters Bar */}
      <IncidentFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        hasLocation={!!(coords?.latitude && coords?.longitude)}
      />

      {/* Dynamic Content Views */}
      {viewMode === 'map' && (
        <div className="space-y-4">
          <IncidentMap
            incidents={incidents}
            userLocation={coords}
            height="650px"
            onMarkerClick={(inc) => setSelectedIncident(inc)}
          />
        </div>
      )}

      {viewMode === 'list' && (
        <div className="space-y-6">
          {loading ? (
            <LoadingSpinner text="Fetching incidents..." />
          ) : incidents.length === 0 ? (
            <EmptyState
              title="No incidents found"
              description="No safety incidents match your selected filters. Try broadening your criteria."
              actionText="Report Incident"
              onAction={() => setIsReportModalOpen(true)}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {incidents.map((incident) => (
                <IncidentCard
                  key={incident._id}
                  incident={incident}
                  onToggleHelpful={(id) => dispatch(toggleIncidentHelpful(id))}
                  currentUserId={user?._id}
                />
              ))}
            </div>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {viewMode === 'split' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Map Column (Sticky on desktop) */}
          <div className="lg:col-span-6 lg:sticky lg:top-24">
            <IncidentMap
              incidents={incidents}
              userLocation={coords}
              height="580px"
              onMarkerClick={(inc) => setSelectedIncident(inc)}
            />
          </div>

          {/* Cards Column */}
          <div className="lg:col-span-6 space-y-4">
            {loading ? (
              <LoadingSpinner text="Loading incidents..." />
            ) : incidents.length === 0 ? (
              <EmptyState
                title="No incidents in this view"
                description="No safety incidents found matching your query."
                actionText="Report Incident"
                onAction={() => setIsReportModalOpen(true)}
              />
            ) : (
              incidents.map((incident) => (
                <IncidentCard
                  key={incident._id}
                  incident={incident}
                  onToggleHelpful={(id) => dispatch(toggleIncidentHelpful(id))}
                  currentUserId={user?._id}
                />
              ))
            )}

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      )}

      {/* Report Incident Modal */}
      <ReportIncidentModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleCreateIncident}
        currentLocation={coords}
      />
    </div>
  );
};
