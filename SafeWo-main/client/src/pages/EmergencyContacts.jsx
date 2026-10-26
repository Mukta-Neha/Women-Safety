import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Users,
  Plus,
  Phone,
  Shield,
  Star,
  AlertCircle,
} from 'lucide-react';
import { EmergencyContactCard } from '../components/cards/EmergencyContactCard';
import { ContactModal } from '../components/modals/ContactModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { HelplineBanner } from '../components/common/HelplineBanner';
import {
  fetchContacts,
  createContact,
  updateContact,
  deleteContact,
} from '../redux/slices/contactSlice';

export const EmergencyContacts = () => {
  const dispatch = useDispatch();

  const { contacts, loading } = useSelector((state) => state.contact);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchContacts());
  }, [dispatch]);

  const handleOpenAdd = () => {
    setEditingContact(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (contact) => {
    setEditingContact(contact);
    setIsModalOpen(true);
  };

  const handleSaveContact = async (formData) => {
    if (editingContact) {
      await dispatch(updateContact({ id: editingContact._id, data: formData }));
    } else {
      await dispatch(createContact(formData));
    }
    setIsModalOpen(false);
    setEditingContact(null);
  };

  const handleOpenDelete = (contact) => {
    setDeleteTarget(contact);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteTarget) {
      await dispatch(deleteContact(deleteTarget._id));
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
              Emergency Contacts Circle
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300">
              {contacts.length} / 10 Added
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            These trusted people receive your live GPS coordinates immediately during an SOS emergency.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-500/20 flex items-center gap-2 transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Emergency Contact</span>
        </button>
      </div>

      {/* Helpline Shortcut */}
      <HelplineBanner compact />

      {/* Contacts List */}
      {loading ? (
        <LoadingSpinner text="Loading your emergency contacts..." />
      ) : contacts.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Emergency Contacts Added"
          description="Add your parents, siblings, or close friends so they can be immediately alerted with your live location during an SOS."
          actionText="Add Your First Contact"
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {contacts.map((contact) => (
            <EmergencyContactCard
              key={contact._id}
              contact={contact}
              onEdit={handleOpenEdit}
              onDelete={handleOpenDelete}
            />
          ))}
        </div>
      )}

      {/* Add / Edit Contact Modal */}
      <ContactModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingContact(null);
        }}
        onSubmit={handleSaveContact}
        initialData={editingContact}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Remove Emergency Contact"
        message={`Are you sure you want to remove "${deleteTarget?.name}" from your emergency circle? They will no longer receive distress alerts.`}
        confirmText="Remove Contact"
        isDestructive={true}
      />
    </div>
  );
};
