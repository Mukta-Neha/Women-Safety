import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Star } from 'lucide-react';

export const ContactModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    relationship: 'Mother',
    phone: '',
    email: '',
    priority: 1,
    isPrimary: false,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        relationship: initialData.relationship || 'Mother',
        phone: initialData.phone || '',
        email: initialData.email || '',
        priority: initialData.priority || 1,
        isPrimary: initialData.isPrimary || false,
      });
    } else {
      setFormData({
        name: '',
        relationship: 'Mother',
        phone: '',
        email: '',
        priority: 1,
        isPrimary: false,
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const relationships = ['Mother', 'Father', 'Sister', 'Brother', 'Husband', 'Guardian', 'Friend', 'Colleague', 'Other'];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Emergency Contact' : 'Add Emergency Contact'}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Contact Full Name *
          </label>
          <input
            type="text"
            name="name"
            required
            placeholder="e.g. Sunita Sharma"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Relationship *
            </label>
            <select
              name="relationship"
              value={formData.relationship}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            >
              {relationships.map((rel) => (
                <option key={rel} value={rel}>
                  {rel}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Alert Priority (1-5)
            </label>
            <input
              type="number"
              name="priority"
              min="1"
              max="5"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Phone Number *
          </label>
          <input
            type="tel"
            name="phone"
            required
            placeholder="e.g. +91 98351 12345"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Email Address
            </label>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
              Receives Instant Auto-Email
            </span>
          </div>
          <input
            type="email"
            name="email"
            placeholder="e.g. contact@example.com"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
          />
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            SafeWo automatically emails an urgent distress alert with your live Google Maps coordinates to this address when SOS is pressed.
          </p>
        </div>

        <div className="flex items-center gap-3 p-3 bg-amber-50/60 dark:bg-amber-950/30 rounded-2xl border border-amber-200/60 dark:border-amber-900/60">
          <input
            type="checkbox"
            id="isPrimary"
            name="isPrimary"
            checked={formData.isPrimary}
            onChange={handleChange}
            className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500 border-slate-300"
          />
          <label htmlFor="isPrimary" className="text-xs text-slate-700 dark:text-slate-300 cursor-pointer flex-1">
            <span className="font-bold flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              Set as Primary Emergency Contact
            </span>
            <span className="text-slate-500 text-[11px] block">
              Will be dialed and notified first during an SOS alert.
            </span>
          </label>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl text-sm font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-500/20 disabled:opacity-50"
          >
            {loading ? 'Saving...' : initialData ? 'Update Contact' : 'Save Contact'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
