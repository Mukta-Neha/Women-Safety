import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  ArrowLeft,
  MapPin,
  Clock,
  ThumbsUp,
  Flag,
  Share2,
  ShieldAlert,
  User,
  CheckCircle2,
} from 'lucide-react';
import { SeverityBadge, CategoryBadge, StatusBadge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Modal } from '../components/common/Modal';
import { IncidentMap } from '../components/maps/IncidentMap';
import {
  fetchIncidentById,
  toggleIncidentHelpful,
  reportIncidentMisinformation,
} from '../redux/slices/incidentSlice';
import { formatDate, formatRelativeTime } from '../utils/formatters';

export const IncidentDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentIncident, loading } = useSelector((state) => state.incident);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchIncidentById(id));
    }
  }, [id, dispatch]);

  if (loading || !currentIncident) {
    return <LoadingSpinner text="Loading incident details..." />;
  }

  const isHelpful =
    user && currentIncident.helpfulUsers
      ? currentIncident.helpfulUsers.some((u) => (typeof u === 'string' ? u === user._id : u?._id === user._id))
      : false;

  const helpfulCount = currentIncident.helpfulUsers ? currentIncident.helpfulUsers.length : 0;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: currentIncident.title,
        text: currentIncident.description,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReportMisinformation = async (e) => {
    e.preventDefault();
    await dispatch(reportIncidentMisinformation({ id: currentIncident._id, reason: reportReason }));
    setReportSubmitted(true);
    setTimeout(() => {
      setIsReportModalOpen(false);
      setReportSubmitted(false);
      setReportReason('');
    }, 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Back Button */}
      <button
        type="button"
        onClick={() => navigate('/incidents')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Incidents</span>
      </button>

      {/* Main Incident Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-6">
        {/* Header Badges & Title */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <CategoryBadge category={currentIncident.category} />
              <SeverityBadge severity={currentIncident.severity} />
              <StatusBadge status={currentIncident.status} />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleShare}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                title="Share Incident"
              >
                <Share2 className="w-4 h-4" />
              </button>
              {copied && <span className="text-xs text-emerald-600 font-semibold">Link Copied!</span>}
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
            {currentIncident.title}
          </h1>
        </div>

        {/* Metadata Bar */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-500 dark:text-slate-400 py-3 border-y border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-rose-500 flex-shrink-0" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {currentIncident.address}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span>
              {formatDate(currentIncident.createdAt)} ({formatRelativeTime(currentIncident.createdAt)})
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span>
              Reported by:{' '}
              <strong className="text-slate-700 dark:text-slate-300">
                {currentIncident.anonymous ? 'Anonymous Member' : currentIncident.userId?.name || 'Verified User'}
              </strong>
            </span>
          </div>
        </div>

        {/* Description Body */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Description</h3>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
            {currentIncident.description}
          </p>
        </div>

        {/* Location Map */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Incident Location</h3>
          <IncidentMap
            incidents={[currentIncident]}
            center={[currentIncident.latitude, currentIncident.longitude]}
            zoom={15}
            height="320px"
          />
        </div>

        {/* Action Buttons: Helpful & Report Misinformation */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => dispatch(toggleIncidentHelpful(currentIncident._id))}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-colors ${
              isHelpful
                ? 'bg-rose-600 text-white shadow-md shadow-rose-500/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <ThumbsUp className={`w-4 h-4 ${isHelpful ? 'fill-white' : ''}`} />
            <span>Helpful ({helpfulCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setIsReportModalOpen(true)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-red-600 transition-colors"
          >
            <Flag className="w-3.5 h-3.5" />
            <span>Report Misinformation</span>
          </button>
        </div>
      </div>

      {/* Misinformation Report Modal */}
      <Modal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        title="Report Inaccurate or Misleading Info"
        maxWidth="max-w-md"
      >
        {reportSubmitted ? (
          <div className="py-6 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-slate-900 dark:text-white text-base">Report Received</h4>
            <p className="text-xs text-slate-500">Thank you. Our moderation team will investigate this report.</p>
          </div>
        ) : (
          <form onSubmit={handleReportMisinformation} className="space-y-4">
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              SafeWo is built on community trust. If you believe this incident is fictitious, duplicated, or contains false statements, let us know:
            </p>
            <textarea
              required
              rows="3"
              placeholder="Explain why this incident report is inaccurate or should be flagged..."
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsReportModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold bg-red-600 text-white hover:bg-red-700 shadow-sm"
              >
                Submit Report
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
