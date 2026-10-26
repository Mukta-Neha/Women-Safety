import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Bell, Check, Trash2, ShieldAlert, AlertTriangle, ShieldCheck, Info } from 'lucide-react';
import { markNotificationRead, markAllNotificationsRead, fetchNotifications } from '../../redux/slices/notificationSlice';
import { formatRelativeTime } from '../../utils/formatters';

export const NotificationDropdown = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { notifications, unreadCount } = useSelector((state) => state.notification);

  if (!isOpen) return null;

  const handleNotificationClick = (notif) => {
    if (!notif.read) {
      dispatch(markNotificationRead(notif._id));
    }
    if (notif.link) {
      navigate(notif.link);
      onClose();
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'SOS':
        return <ShieldAlert className="w-4 h-4 text-red-600" />;
      case 'Incident':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'Safety':
        return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
      default:
        return <Info className="w-4 h-4 text-rose-600" />;
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-800 z-50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-rose-600" />
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">Notifications</h4>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-600 text-white">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => dispatch(markAllNotificationsRead())}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 hover:underline flex items-center gap-1"
          >
            <Check className="w-3.5 h-3.5" />
            Mark all read
          </button>
        )}
      </div>

      {/* List */}
      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No notifications yet
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif._id}
              onClick={() => handleNotificationClick(notif)}
              className={`p-3.5 flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors ${
                !notif.read ? 'bg-rose-50/40 dark:bg-rose-950/20' : ''
              }`}
            >
              <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 flex-shrink-0 mt-0.5">
                {getIcon(notif.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <h5 className={`text-xs font-bold truncate ${!notif.read ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                    {notif.title}
                  </h5>
                  <span className="text-[10px] text-slate-400 flex-shrink-0">
                    {formatRelativeTime(notif.createdAt)}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {notif.message}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
