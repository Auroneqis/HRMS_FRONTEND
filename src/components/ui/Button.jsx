export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled,
  loading,
  onClick,
  type = 'button',
  ...props
}) {
  const base =
    'inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 shadow-xl backdrop-blur-xl';

  const variants = {
    primary:
      'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-indigo-500/30 hover:shadow-2xl',
    secondary:
      'bg-white/40 border border-white/30 text-slate-700 hover:bg-white/60',
    danger:
      'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-red-500/30',
    success:
      'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-green-500/30',
    ghost:
      'bg-transparent hover:bg-white/20 text-slate-700',
    warning:
      'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-amber-500/30',
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs gap-2',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-7 py-3 text-base gap-3',
  };

  return (
    <button
      type={type}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}