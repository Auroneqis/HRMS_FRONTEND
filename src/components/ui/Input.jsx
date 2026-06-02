export default function Input({
  label,
  error,
  className = '',
  required,
  ...props
}) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-semibold text-slate-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <input
        className={`
          block w-full px-4 py-3 text-sm rounded-2xl
          bg-white/40 backdrop-blur-xl
          border border-white/30
          shadow-lg
          transition-all duration-300
          focus:outline-none focus:ring-2 focus:ring-indigo-500
          hover:scale-[1.01]
          ${error ? 'border-red-400 bg-red-100/40' : ''}
          ${className}
        `}
        {...props}
      />

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function Select({
  label,
  error,
  children,
  className = '',
  required,
  ...props
}) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-semibold text-slate-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <select
        className={`
          block w-full px-4 py-3 text-sm rounded-2xl
          bg-white/40 backdrop-blur-xl
          border border-white/30
          shadow-lg
          transition-all duration-300
          focus:outline-none focus:ring-2 focus:ring-indigo-500
          hover:scale-[1.01]
          ${error ? 'border-red-400 bg-red-100/40' : ''}
          ${className}
        `}
        {...props}
      >
        {children}
      </select>

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function Textarea({
  label,
  error,
  className = '',
  required,
  ...props
}) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-semibold text-slate-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <textarea
        rows={3}
        className={`
          block w-full px-4 py-3 text-sm rounded-2xl resize-none
          bg-white/40 backdrop-blur-xl
          border border-white/30
          shadow-lg
          transition-all duration-300
          focus:outline-none focus:ring-2 focus:ring-indigo-500
          hover:scale-[1.01]
          ${error ? 'border-red-400 bg-red-100/40' : ''}
          ${className}
        `}
        {...props}
      />

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}