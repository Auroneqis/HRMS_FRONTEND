export default function Card({ children, className = '' }) {
  return (
    <div
      className={`bg-white/30 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-[0_20px_50px_rgba(31,38,135,0.15)] transition-all duration-300 hover:shadow-[0_25px_70px_rgba(31,38,135,0.2)] hover:-translate-y-1 ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-center justify-between px-6 py-5 border-b border-white/20">
      <div>
        <h3 className="text-lg font-bold text-slate-800">{title}</h3>
        {subtitle && (
          <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

export function CardBody({ children, className = '' }) {
  return <div className={`px-6 py-5 ${className}`}>{children}</div>;
}