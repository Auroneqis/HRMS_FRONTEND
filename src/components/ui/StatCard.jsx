export default function StatCard({
  title,
  value,
  icon: Icon,
  color = 'indigo',
  change,
  subtitle,
}) {
  const colors = {
    indigo: {
      icon: 'from-indigo-500 to-purple-600',
      text: 'text-indigo-600',
    },
    green: {
      icon: 'from-emerald-500 to-green-600',
      text: 'text-emerald-600',
    },
    yellow: {
      icon: 'from-amber-500 to-orange-500',
      text: 'text-amber-600',
    },
    red: {
      icon: 'from-red-500 to-rose-600',
      text: 'text-red-600',
    },
    purple: {
      icon: 'from-purple-500 to-fuchsia-600',
      text: 'text-purple-600',
    },
    blue: {
      icon: 'from-blue-500 to-cyan-600',
      text: 'text-blue-600',
    },
  };

  const c = colors[color] || colors.indigo;

  return (
    <div
      className="
        bg-white/30
        backdrop-blur-2xl
        rounded-3xl
        border border-white/20
        shadow-[0_20px_60px_rgba(31,38,135,0.15)]
        p-6
        flex items-start gap-5
        transition-all duration-300
        hover:-translate-y-2
        hover:shadow-[0_30px_80px_rgba(31,38,135,0.22)]
      "
    >
      <div
        className={`
          p-4 rounded-3xl
          bg-gradient-to-br ${c.icon}
          text-white
          shadow-xl
          shrink-0
        `}
      >
        <Icon size={24} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.15em]">
          {title}
        </p>

        <p className="text-3xl font-bold text-slate-800 mt-2">
          {value ?? '—'}
        </p>

        {subtitle && (
          <p className="text-sm text-slate-500 mt-2">
            {subtitle}
          </p>
        )}

        {change !== undefined && (
          <p
            className={`text-sm mt-3 font-semibold ${
              change >= 0 ? 'text-emerald-600' : 'text-red-600'
            }`}
          >
            {change >= 0 ? '▲' : '▼'} {Math.abs(change)}% from last month
          </p>
        )}
      </div>
    </div>
  );
}