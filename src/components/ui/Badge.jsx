export default function Badge({ children, variant = 'default' }) {
  const variants = {
    default:
      'bg-white/30 text-slate-700 border border-white/30 shadow-lg backdrop-blur-xl',
    success:
      'bg-emerald-500/20 text-emerald-700 border border-emerald-300/30 shadow-lg backdrop-blur-xl',
    warning:
      'bg-amber-500/20 text-amber-700 border border-amber-300/30 shadow-lg backdrop-blur-xl',
    danger:
      'bg-red-500/20 text-red-700 border border-red-300/30 shadow-lg backdrop-blur-xl',
    info:
      'bg-blue-500/20 text-blue-700 border border-blue-300/30 shadow-lg backdrop-blur-xl',
    purple:
      'bg-purple-500/20 text-purple-700 border border-purple-300/30 shadow-lg backdrop-blur-xl',
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 hover:scale-105 ${variants[variant] || variants.default}`}
    >
      {children}
    </span>
  );
}

export function statusBadge(status) {
  const map = {
    ACTIVE: 'success',
    APPROVED: 'success',
    PAID: 'success',
    PRESENT: 'success',
    PENDING: 'warning',
    DRAFT: 'warning',
    PROCESSING: 'info',
    REJECTED: 'danger',
    FAILED: 'danger',
    TERMINATED: 'danger',
    ABSENT: 'danger',
    CANCELLED: 'default',
    EXITED: 'default',
    ON_HOLD: 'purple',
    HALF_DAY: 'warning',
    WORK_FROM_HOME: 'info',
    NOTICE_PERIOD: 'warning',
    RESIGNATION_SUBMITTED: 'warning',
  };

  return map[status] || 'default';
}