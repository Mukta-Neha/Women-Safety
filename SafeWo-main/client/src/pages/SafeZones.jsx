import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  ShieldCheck,
  Plus,
  MapPin,
  Compass,
  AlertCircle,
} from 'lucide-react';
import { SafeZoneMap } from '../components/maps/SafeZoneMap';
import { SafeZoneCard } from '../components/cards/SafeZoneCard';
import { SafeZoneModal } from '../components/modals/SafeZoneModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import {
  fetchSafeZones,
  createSafeZone,
  updateSafeZone,
  deleteSafeZone,
} from '../redux/slices/safeZoneSlice';
import { useGeolocation } from '../hooks/useGeolocation';
import { useSafeZoneCheck } from '../hooks/useSafeZoneCheck';

export const SafeZones = () => {
  const dispatch = useDispatch();

  const { safeZones, loading } = useSelector((state) => state.safeZone);
  const { location: coords } = useGeolocation();
  const { isInside, activeZone } = useSafeZoneCheck(coords, safeZones);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingZone, setEditingZone] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchSafeZones(coords));
  }, [dispatch, coords?.latitude, coords?.longitude]);

  const handleOpenAdd = () => {
    setEditingZone(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (zone) => {
    setEditingZone(zone);
    setIsModalOpen(true);
  };

  const handleSaveZone = async (formData) => {
    if (editingZone) {
      await dispatch(updateSafeZone({ id: editingZone._id, data: formData }));
    } else {
      await dispatch(createSafeZone(formData));
    }
    setIsModalOpen(false);
    setEditingZone(null);
  };

  const handleOpenDelete = (zone) => {
    setDeleteTarget(zone);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteTarget) {
      await dispatch(deleteSafeZone(deleteTarget._id));
      setIsDeleteDialogOpen(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Trusted Safe Zones
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
              {safeZones.length} Zones Configured
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Define private trusted places like Home, College, or Office with custom geofence radii.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-500/20 flex items-center gap-2 transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Safe Zone</span>
        </button>
      </div>

      {/* Geofence Alert Banner */}
      {isInside && activeZone ? (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-3xl border border-emerald-300 dark:border-emerald-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
              You're currently inside your safe zone!
            </h4>
            <p className="text-xs text-emerald-700 dark:text-emerald-400">
              Within {activeZone.radius}m perimeter of "{activeZone.name}".
            </p>
          </div>
        </div>
      ) : (
        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300">
          <Compass className="w-4 h-4 text-slate-400" />
          <span>You are currently outside your designated safe zone perimeters.</span>
        </div>
      )}

      {/* Map Overview */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-card">
        <h3 className="font-bold text-slate-900 dark:text-white text-base mb-3">
          Safe Zones Map Overview
        </h3>
        <SafeZoneMap
          safeZones={safeZones}
          userLocation={coords}
          height="400px"
        />
      </div>

      {/* Safe Zone Cards Grid */}
      <div>
        <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-4">
          Your Safe Places
        </h3>

        {loading ? (
          <LoadingSpinner text="Loading safe zones..." />
        ) : safeZones.length === 0 ? (
          <EmptyState
            icon={ShieldCheck}
            title="No Safe Zones Configured"
            description="Add your residence, college campus, or office as safe zones to monitor when you safely reach your destination."
            actionText="Add Safe Zone"
            onAction={handleOpenAdd}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {safeZones.map((zone) => (
              <SafeZoneCard
                key={zone._id}
                zone={zone}
                onEdit={handleOpenEdit}
                onDelete={handleOpenDelete}
                isUserInside={isInside && activeZone?._id === zone._id}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Safe Zone Modal */}
      <SafeZoneModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingZone(null);
        }}
        onSubmit={handleSaveZone}
        initialData={editingZone}
        currentLocation={coords}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Safe Zone"
        message={`Are you sure you want to remove safe zone "${deleteTarget?.name}"?`}
        confirmText="Delete Zone"
        isDestructive={true}
      />
    </div>
  );
};
