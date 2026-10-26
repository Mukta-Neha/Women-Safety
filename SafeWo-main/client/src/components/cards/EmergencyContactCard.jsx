import React from 'react';
import { Phone, Star, Edit3, Trash2, Shield } from 'lucide-react';

export const EmergencyContactCard = ({ contact, onEdit, onDelete }) => {
  return (
    <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 font-extrabold text-lg flex items-center justify-center flex-shrink-0">
            {contact.name[0].toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-slate-900 dark:text-white text-base">{contact.name}</h4>
              {contact.isPrimary && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 px-2 py-0.5 rounded-full">
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                  Primary
                </span>
              )}
            </div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {contact.relationship} &bull; Priority {contact.priority}
            </p>
          </div>
        </div>

        {/* Priority Indicator */}
        <span className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
          Rank #{contact.priority}
        </span>
      </div>

      <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-4">
        {contact.phone}
        {contact.email && (
          <span className="block text-xs font-normal text-slate-400 mt-0.5 truncate">
            {contact.email}
          </span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80 gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <a
            href={`tel:${contact.phone}`}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors"
            title="Call Contact"
          >
            <Phone className="w-3 h-3 text-emerald-600" />
            <span>Call</span>
          </a>

          <a
            href={`https://wa.me/${contact.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
              `SafeWo Safety Alert Test: Hi ${contact.name}, you are listed as an emergency contact on SafeWo.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors"
            title="Chat on WhatsApp"
          >
            <span>WhatsApp</span>
          </a>

          <a
            href={`sms:${contact.phone}?&body=${encodeURIComponent(
              `SafeWo Safety Alert Test: Hi ${contact.name}, you are listed as an emergency contact.`
            )}`}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-colors"
            title="Send SMS"
          >
            <span>SMS</span>
          </a>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(contact)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Edit Contact"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(contact)}
            className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            aria-label="Delete Contact"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
