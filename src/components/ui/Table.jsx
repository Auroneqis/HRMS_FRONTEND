export default function Table({
  columns,
  data,
  loading,
  emptyMessage = 'No data found',
}) {
  return (
    <div
      className="
        overflow-hidden
        rounded-3xl
        bg-white/30
        backdrop-blur-2xl
        border border-white/20
        shadow-[0_20px_60px_rgba(31,38,135,0.15)]
      "
    >
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-white/20 backdrop-blur-xl border-b border-white/20">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="
                    px-6 py-4
                    text-left
                    text-xs
                    font-bold
                    text-slate-600
                    uppercase
                    tracking-[0.15em]
                    whitespace-nowrap
                  "
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-10 text-center"
                >
                  <div className="flex items-center justify-center gap-3 text-slate-500">
                    <svg
                      className="animate-spin h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
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
                    Loading...
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-10 text-center text-sm text-slate-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr
                  key={i}
                  className="
                    border-b border-white/10
                    hover:bg-white/20
                    transition-all duration-300
                  "
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="
                        px-6 py-4
                        text-sm
                        text-slate-700
                        whitespace-nowrap
                      "
                    >
                      {col.render
                        ? col.render(row[col.key], row)
                        : row[col.key] ?? '—'}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}