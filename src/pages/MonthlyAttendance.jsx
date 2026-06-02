import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from 'react';

import { attendanceAPI } from '../api/services';

import {
  Search,
  X,
  Download,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Users,
  Sparkles,
  Calendar,
  Activity,
  BarChart3,
} from 'lucide-react';

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

const EMPLOYEE_TYPES = [
  'FULL_TIME',
  'PART_TIME',
  'CONTRACT',
  'INTERN',
];

function toMonthParam(yyyyMM) {
  return `${yyyyMM}-01`;
}

function downloadBlob(blob, filename) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');

  a.href = url;
  a.download = filename;

  document.body.appendChild(a);
  a.click();
  a.remove();

  window.URL.revokeObjectURL(url);
}

export default function MonthlyAttendance() {
  const currentMonthStr =
    new Date().toISOString().slice(0, 7);

  const [month, setMonth] =
    useState(currentMonthStr);

  const [rows, setRows] = useState([]);
  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState('');

  const [excelLoading, setExcelLoading] =
    useState(false);

  const [yearlyLoading, setYearlyLoading] =
    useState(false);

  const [searchName, setSearchName] =
    useState('');

  const [searchId, setSearchId] =
    useState('');

  const [filterDept, setFilterDept] =
    useState('ALL');

  const [filterType, setFilterType] =
    useState('ALL');

  const [currentPage, setCurrentPage] =
    useState(1);

  const [pageSize, setPageSize] =
    useState(20);

  const [particles, setParticles] =
    useState([]);

  const [mounted, setMounted] =
    useState(false);

  const departments = useMemo(() => {
    const set = new Set(
      rows
        .map((r) => r.department)
        .filter(Boolean)
    );

    return ['ALL', ...Array.from(set).sort()];
  }, [rows]);

  const filtered = useMemo(() => {
    const name =
      searchName.trim().toLowerCase();

    const id =
      searchId.trim().toLowerCase();

    return rows.filter((r) => {
      if (
        name &&
        !(r.employeeName || '')
          .toLowerCase()
          .includes(name)
      )
        return false;

      if (
        id &&
        !(r.employeeId || '')
          .toLowerCase()
          .includes(id)
      )
        return false;

      if (
        filterDept !== 'ALL' &&
        r.department !== filterDept
      )
        return false;

      if (
        filterType !== 'ALL' &&
        r.employeeType !== filterType
      )
        return false;

      return true;
    });
  }, [
    rows,
    searchName,
    searchId,
    filterDept,
    filterType,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchName,
    searchId,
    filterDept,
    filterType,
    pageSize,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / pageSize)
  );

  const paginated = useMemo(() => {
    const start =
      (currentPage - 1) * pageSize;

    return filtered.slice(
      start,
      start + pageSize
    );
  }, [
    filtered,
    currentPage,
    pageSize,
  ]);

  const stats = useMemo(
    () => ({
      present: filtered.reduce(
        (s, r) => s + (r.present || 0),
        0
      ),
      absent: filtered.reduce(
        (s, r) => s + (r.absent || 0),
        0
      ),
      halfDay: filtered.reduce(
        (s, r) => s + (r.halfDay || 0),
        0
      ),
      onLeave: filtered.reduce(
        (s, r) => s + (r.onLeave || 0),
        0
      ),
    }),
    [filtered]
  );

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const res =
        await attendanceAPI.reportMonthly({
          month: toMonthParam(month),
        });

      const data =
        res?.data?.data || [];

      setRows(
        Array.isArray(data) ? data : []
      );
    } catch (e) {
      setError(
        e.response?.data?.message ||
          e.message ||
          'Failed to load attendance'
      );

      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [month]);

  useEffect(() => {
    fetchData();

    setMounted(true);

    const generated =
      Array.from({ length: 75 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 6 + 2,
        duration:
          Math.random() * 18 + 10,
        delay: Math.random() * 5,
        color: [
          '#3B82F6',
          '#8B5CF6',
          '#06B6D4',
          '#10B981',
          '#EC4899',
        ][
          Math.floor(
            Math.random() * 5
          )
        ],
      }));

    setParticles(generated);
  }, [fetchData]);

  const handleMonthlyExcel =
    async () => {
      setExcelLoading(true);

      try {
        const res =
          await attendanceAPI.exportMonthly(
            toMonthParam(month)
          );

        downloadBlob(
          new Blob([res.data], {
            type: res.headers[
              'content-type'
            ],
          }),
          `attendance_monthly_${month}.xlsx`
        );
      } catch (e) {
        alert('Export failed');
      } finally {
        setExcelLoading(false);
      }
    };

  const handleYearlyExcel =
    async () => {
      setYearlyLoading(true);

      const year = month.slice(0, 4);

      try {
        const res =
          await attendanceAPI.exportYearly(
            year
          );

        downloadBlob(
          new Blob([res.data], {
            type: res.headers[
              'content-type'
            ],
          }),
          `attendance_yearly_${year}.xlsx`
        );
      } catch (e) {
        alert('Export failed');
      } finally {
        setYearlyLoading(false);
      }
    };

  const clearFilters = () => {
    setSearchName('');
    setSearchId('');
    setFilterDept('ALL');
    setFilterType('ALL');
  };

  const hasActiveFilters =
    searchName ||
    searchId ||
    filterDept !== 'ALL' ||
    filterType !== 'ALL';

  return (
    <div className="attendance-page">

      <div className="bg-layer">
        <div className="orb orb1"></div>
        <div className="orb orb2"></div>
        <div className="orb orb3"></div>
        <div className="mesh-grid"></div>

        {particles.map((p) => (
          <div
            key={p.id}
            className="particle"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              background: p.color,
              animationDuration:
                `${p.duration}s`,
              animationDelay:
                `${p.delay}s`,
            }}
          />
        ))}
      </div>

      <div
        className={`content-wrap ${
          mounted ? 'show' : ''
        }`}
      >
              {/* HERO */}
        <div className="hero-card">
          <div className="shine"></div>

          <div className="hero-left">
            <div className="hero-icon">
              <Activity size={28} />
            </div>

            <div>
              <p className="mini-title">
                ATTENDANCE ANALYTICS
              </p>

              <h1>
                Monthly Attendance
              </h1>

              <p className="hero-sub">
                Premium employee attendance dashboard
              </p>
            </div>
          </div>

          <div className="hero-actions">
            <div className="month-picker">
              <Calendar size={15} />
              <input
                type="month"
                value={month}
                onChange={(e) =>
                  setMonth(e.target.value)
                }
              />
            </div>

            <button
              onClick={handleMonthlyExcel}
              disabled={excelLoading || loading}
              className="glow-btn green"
            >
              <Download size={15} />
              {excelLoading
                ? 'Downloading...'
                : 'Monthly Excel'}
            </button>

            <button
              onClick={handleYearlyExcel}
              disabled={yearlyLoading || loading}
              className="glow-btn blue"
            >
              <Sparkles size={15} />
              {yearlyLoading
                ? 'Downloading...'
                : 'Yearly Excel'}
            </button>
          </div>
        </div>

        {error && (
          <div className="error-box">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {!loading && rows.length > 0 && (
          <div className="stats-grid">
            {[
              {
                label: 'Present',
                value: stats.present,
                cls: 'green',
              },
              {
                label: 'Absent',
                value: stats.absent,
                cls: 'red',
              },
              {
                label: 'Half Day',
                value: stats.halfDay,
                cls: 'amber',
              },
              {
                label: 'On Leave',
                value: stats.onLeave,
                cls: 'blue',
              },
            ].map((item) => (
              <div
                key={item.label}
                className={`stat-card ${item.cls}`}
              >
                <BarChart3 size={18} />
                <div>
                  <p>{item.label}</p>
                  <h3>{item.value}</h3>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="glass-filter-bar">
          <div className="search-box">
            <Search size={14} />
            <input
              type="text"
              placeholder="Search employee name..."
              value={searchName}
              onChange={(e) =>
                setSearchName(e.target.value)
              }
            />
          </div>

          <div className="search-box">
            <Search size={14} />
            <input
              type="text"
              placeholder="Search employee ID..."
              value={searchId}
              onChange={(e) =>
                setSearchId(e.target.value)
              }
            />
          </div>

          <select
            value={filterDept}
            onChange={(e) =>
              setFilterDept(e.target.value)
            }
          >
            {departments.map((d) => (
              <option key={d} value={d}>
                {d === 'ALL'
                  ? 'All Departments'
                  : d}
              </option>
            ))}
          </select>

          <select
            value={filterType}
            onChange={(e) =>
              setFilterType(e.target.value)
            }
          >
            <option value="ALL">
              All Types
            </option>

            {EMPLOYEE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t.replace('_', ' ')}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="clear-btn"
            >
              <X size={14} />
              Clear
            </button>
          )}
        </div>

        {/* table + pagination + styles too large for one reply */}
      </div>
    </div>
  );
}