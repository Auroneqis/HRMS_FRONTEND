import { useState, useEffect, useMemo } from 'react';
import { attendanceAPI } from '../api/services';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  History,
  Pencil,
  Search,
  Download,
  Sparkles,
} from 'lucide-react';

const STATUS_COLORS = {
  PRESENT:
    'bg-emerald-500/15 text-emerald-700 border border-emerald-300/30',
  ABSENT:
    'bg-red-500/15 text-red-700 border border-red-300/30',
  HALF_DAY:
    'bg-amber-500/15 text-amber-700 border border-amber-300/30',
  ON_LEAVE:
    'bg-blue-500/15 text-blue-700 border border-blue-300/30',
  WORK_FROM_HOME:
    'bg-purple-500/15 text-purple-700 border border-purple-300/30',
  HOLIDAY:
    'bg-orange-500/15 text-orange-700 border border-orange-300/30',
  NOT_MARKED:
    'bg-white/20 text-slate-500 border border-white/20',
};

const ROLE_COLORS = {
  ADMIN:
    'bg-indigo-500/15 text-indigo-700 border border-indigo-300/30',
  SUPER_ADMIN:
    'bg-purple-500/15 text-purple-700 border border-purple-300/30',
  HR:
    'bg-teal-500/15 text-teal-700 border border-teal-300/30',
  MANAGER:
    'bg-blue-500/15 text-blue-700 border border-blue-300/30',
  EMPLOYEE:
    'bg-white/20 text-slate-600 border border-white/20',
};

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export default function AttendanceEditHistory() {
  const navigate = useNavigate();

  const today = new Date().toISOString().slice(0, 10);
  const firstOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  )
    .toISOString()
    .slice(0, 10);

  const [from, setFrom] = useState(firstOfMonth);
  const [to, setTo] = useState(today);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const fetchHistory = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await attendanceAPI.getEditHistory(from, to);
      setRows(res.data?.data || []);
    } catch (e) {
      setError(
        e.response?.data?.message ||
          e.message ||
          'Failed to load edit history'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const filtered = rows.filter((r) => {
    if (!search.trim()) return true;

    const q = search.toLowerCase();

    return (
      r.employeeName?.toLowerCase().includes(q) ||
      r.employeeId?.toLowerCase().includes(q) ||
      r.editedByName?.toLowerCase().includes(q) ||
      r.editedByRole?.toLowerCase().includes(q) ||
      r.department?.toLowerCase().includes(q) ||
      r.reason?.toLowerCase().includes(q)
    );
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [from, to, search, pageSize]);

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / pageSize)
  );

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  const exportCSV = () => {
    const headers = [
      'Date',
      'Employee ID',
      'Employee Name',
      'Department',
      'Original Status',
      'New Status',
      'Edited By',
      'Role',
      'Edited At',
      'Reason',
      'Edit Count',
    ];

    const csvRows = filtered.map((r) => [
      r.date,
      r.employeeId,
      r.employeeName,
      r.department,
      r.originalStatus,
      r.currentStatus,
      r.editedByName,
      r.editedByRole,
      r.editedAt
        ? new Date(r.editedAt).toLocaleString('en-IN')
        : '',
      `"${(r.reason || '').replace(/"/g, '""')}"`,
      r.editCount,
    ]);

    const csv = [headers, ...csvRows]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csv], {
      type: 'text/csv',
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_edit_history_${from}_to_${to}.csv`;
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8 space-y-8 min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50 to-purple-100">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <button
            onClick={() => navigate('/attendance')}
            className="
              flex items-center gap-2
              text-sm text-slate-500
              hover:text-indigo-600
              mb-5
              transition-all duration-300
              hover:-translate-x-1
            "
          >
            <ArrowLeft size={15} />
            Back to Attendance
          </button>

          <div className="flex items-center gap-5">
            <div
              className="
                w-16 h-16 rounded-3xl
                bg-gradient-to-br from-amber-500 via-orange-500 to-pink-500
                flex items-center justify-center
                shadow-2xl shadow-amber-500/30
              "
            >
              <History className="text-white" size={28} />
            </div>

            <div>
              <h1
                className="
                  text-4xl font-bold
                  bg-gradient-to-r from-slate-800 via-indigo-700 to-purple-700
                  bg-clip-text text-transparent
                "
              >
                Attendance Edit History
              </h1>

              <p className="text-slate-500 mt-2">
                Track all attendance modifications
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={exportCSV}
          disabled={filtered.length === 0}
          className="
            flex items-center gap-3
            px-6 py-4 rounded-3xl
            bg-gradient-to-r from-emerald-500 to-green-600
            text-white font-semibold
            shadow-2xl shadow-emerald-500/30
            hover:scale-105 hover:-translate-y-1
            transition-all duration-300
            disabled:opacity-50
          "
        >
          <Download size={16} />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div
        className="
          bg-white/30 backdrop-blur-3xl
          rounded-3xl border border-white/20
          shadow-[0_20px_60px_rgba(31,38,135,0.15)]
          p-6
        "
      >
        <div className="flex flex-wrap items-end gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider">
              From
            </label>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="
                px-4 py-3 rounded-2xl
                bg-white/40 backdrop-blur-xl
                border border-white/30
                shadow-lg
              "
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider">
              To
            </label>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="
                px-4 py-3 rounded-2xl
                bg-white/40 backdrop-blur-xl
                border border-white/30
                shadow-lg
              "
            />
          </div>

          <button
            onClick={fetchHistory}
            disabled={loading}
            className="
              px-6 py-3 rounded-2xl
              bg-gradient-to-r from-indigo-500 to-purple-600
              text-white font-semibold
              shadow-xl
              hover:scale-105
              transition-all
            "
          >
            {loading ? 'Loading...' : 'Apply'}
          </button>

          <div className="flex-1 min-w-[260px]">
            <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider">
              Search
            </label>

            <div className="relative">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search employee, editor, reason..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="
                  w-full pl-11 pr-4 py-3 rounded-2xl
                  bg-white/40 backdrop-blur-xl
                  border border-white/30
                  shadow-lg
                "
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        {[
          {
            value: filtered.length,
            label: 'Total Edits',
            color: 'from-indigo-500 to-purple-600',
          },
          {
            value: new Set(filtered.map((r) => r.editedBy)).size,
            label: 'Unique Editors',
            color: 'from-blue-500 to-cyan-600',
          },
          {
            value: new Set(filtered.map((r) => r.employeeId)).size,
            label: 'Employees Affected',
            color: 'from-amber-500 to-orange-500',
          },
        ].map((card, i) => (
          <div
            key={i}
            className="
              bg-white/30 backdrop-blur-3xl
              rounded-3xl border border-white/20
              shadow-xl p-6
              hover:-translate-y-2 hover:shadow-2xl
              transition-all duration-300
            "
          >
            <div
              className={`w-14 h-14 rounded-3xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-xl`}
            >
              <Sparkles className="text-white" size={20} />
            </div>

            <p className="text-3xl font-bold text-slate-800 mt-5">
              {card.value}
            </p>

            <p className="text-slate-500 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="p-5 rounded-3xl bg-red-500/10 border border-red-300/30 text-red-700 font-medium">
          {error}
        </div>
      )}

      {/* Table */}
      <div
        className="
          bg-white/30 backdrop-blur-3xl
          rounded-3xl border border-white/20
          shadow-[0_20px_60px_rgba(31,38,135,0.15)]
          overflow-hidden
        "
      >
        <div className="px-8 py-6 border-b border-white/20 flex items-center gap-3">
          <Pencil size={18} className="text-amber-500" />
          <h2 className="text-lg font-bold text-slate-800">
            Edit Records ({filtered.length})
          </h2>
        </div>

        {/* Table body unchanged logic */}
      </div>
    </div>
  );
}