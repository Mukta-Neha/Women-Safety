export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export const formatRelativeTime = (dateString) => {
  if (!dateString) return '';
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return formatDate(dateString);
};

export const getSeverityColor = (severity) => {
  switch (severity?.toUpperCase()) {
    case 'CRITICAL':
      return {
        bg: 'bg-red-100 dark:bg-red-950/60',
        text: 'text-red-700 dark:text-red-400',
        border: 'border-red-300 dark:border-red-800',
        dot: 'bg-red-500',
        marker: '#ef4444',
      };
    case 'HIGH':
      return {
        bg: 'bg-orange-100 dark:bg-orange-950/60',
        text: 'text-orange-700 dark:text-orange-400',
        border: 'border-orange-300 dark:border-orange-800',
        dot: 'bg-orange-500',
        marker: '#f97316',
      };
    case 'MEDIUM':
      return {
        bg: 'bg-amber-100 dark:bg-amber-950/60',
        text: 'text-amber-700 dark:text-amber-400',
        border: 'border-amber-300 dark:border-amber-800',
        dot: 'bg-amber-500',
        marker: '#f59e0b',
      };
    case 'LOW':
    default:
      return {
        bg: 'bg-emerald-100 dark:bg-emerald-950/60',
        text: 'text-emerald-700 dark:text-emerald-400',
        border: 'border-emerald-300 dark:border-emerald-800',
        dot: 'bg-emerald-500',
        marker: '#10b981',
      };
  }
};

export const getStatusBadge = (status) => {
  switch (status?.toUpperCase()) {
    case 'ACTIVE':
      return {
        label: 'Active',
        bg: 'bg-rose-100 dark:bg-rose-950/60',
        text: 'text-rose-700 dark:text-rose-300',
        border: 'border-rose-300 dark:border-rose-800',
      };
    case 'VERIFIED':
      return {
        label: 'Verified',
        bg: 'bg-emerald-100 dark:bg-emerald-950/60',
        text: 'text-emerald-700 dark:text-emerald-300',
        border: 'border-emerald-300 dark:border-emerald-800',
      };
    case 'PENDING':
      return {
        label: 'Pending Review',
        bg: 'bg-amber-100 dark:bg-amber-950/60',
        text: 'text-amber-700 dark:text-amber-300',
        border: 'border-amber-300 dark:border-amber-800',
      };
    case 'RESOLVED':
      return {
        label: 'Resolved',
        bg: 'bg-blue-100 dark:bg-blue-950/60',
        text: 'text-blue-700 dark:text-blue-300',
        border: 'border-blue-300 dark:border-blue-800',
      };
    case 'CANCELLED':
    case 'REJECTED':
      return {
        label: status === 'REJECTED' ? 'Rejected' : 'Cancelled',
        bg: 'bg-slate-100 dark:bg-slate-800',
        text: 'text-slate-600 dark:text-slate-400',
        border: 'border-slate-300 dark:border-slate-700',
      };
    default:
      return {
        label: status || 'Unknown',
        bg: 'bg-slate-100 dark:bg-slate-800',
        text: 'text-slate-700 dark:text-slate-300',
        border: 'border-slate-300 dark:border-slate-700',
      };
  }
};
