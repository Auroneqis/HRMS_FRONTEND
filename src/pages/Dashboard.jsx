import { useEffect, useState } from 'react';
import { dashboardAPI } from '../api/services';
import { useAuth } from '../context/useAuth';
import {
  Users,
  Clock,
  Calendar,
  UserCheck,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

const unwrap = (res) => res?.data?.data;

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div
      className="
        bg-white/30
        backdrop-blur-3xl
        rounded-3xl
        border border-white/20
        shadow-[0_20px_60px_rgba(31,38,135,0.15)]
        p-6
        flex items-center gap-5
        transition-all duration-300
        hover:-translate-y-2
        hover:shadow-[0_30px_80px_rgba(31,38,135,0.22)]
      "
    >
      <div
        className={`
          w-16 h-16 rounded-3xl
          flex items-center justify-center
          bg-gradient-to-br ${color}
          shadow-xl
        `}
      >
        <Icon size={26} className="text-white" />
      </div>

      <div>
        <p className="text-xs uppercase tracking-[0.15em] font-bold text-slate-500">
          {label}
        </p>

        <p className="text-3xl font-bold text-slate-800 mt-2">
          {value ?? '—'}
        </p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user, isAdmin, isHR, isManager } = useAuth();
  const canManage = isAdmin || isHR || isManager;
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!canManage) {
      setLoading(false);
      return;
    }

    dashboardAPI
      .getOverview()
      .then((res) => {
        const data = unwrap(res);
        if (data && typeof data === 'object') setStats(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [canManage]);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-4">
            <div
              className="
                w-16 h-16 rounded-3xl
                bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500
                flex items-center justify-center
                shadow-2xl shadow-indigo-500/30
              "
            >
              <Sparkles className="text-white" size={28} />
            </div>

            <div>
              <h1
                className="
                  text-4xl font-bold
                  bg-gradient-to-r from-slate-800 via-indigo-700 to-purple-700
                  bg-clip-text text-transparent
                "
              >
                Dashboard
              </h1>

              <p className="text-slate-500 mt-2 font-medium">
                {today}
              </p>
            </div>
          </div>
        </div>
      </div>

      {canManage && (
        <>
          {/* Stats */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="
                    h-32 rounded-3xl
                    bg-white/30
                    backdrop-blur-2xl
                    border border-white/20
                    animate-pulse
                  "
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={Users}
                label="Total Employees"
                value={stats?.totalEmployees}
                color="from-indigo-500 to-purple-600"
              />

              <StatCard
                icon={UserCheck}
                label="Active Employees"
                value={stats?.activeEmployees}
                color="from-emerald-500 to-green-600"
              />

              <StatCard
                icon={Clock}
                label="Present Today"
                value={stats?.presentToday}
                color="from-blue-500 to-cyan-600"
              />

              <StatCard
                icon={Calendar}
                label="Pending Leaves"
                value={stats?.managerPendingLeaveCount}
                color="from-amber-500 to-orange-500"
              />
            </div>
          )}

          {/* Main Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Profile */}
            <div
              className="
                bg-white/30
                backdrop-blur-3xl
                rounded-3xl
                border border-white/20
                shadow-[0_20px_60px_rgba(31,38,135,0.15)]
                p-8
              "
            >
              <h2 className="text-xl font-bold text-slate-800 mb-6">
                Welcome back, {user?.name}
              </h2>

              <div className="space-y-4">
                <div
                  className="
                    flex justify-between items-center
                    p-4 rounded-2xl
                    bg-white/20
                  "
                >
                  <span className="text-slate-500 font-medium">Role</span>
                  <span className="font-bold text-indigo-600">
                    {user?.role}
                  </span>
                </div>

                <div
                  className="
                    flex justify-between items-center
                    p-4 rounded-2xl
                    bg-white/20
                  "
                >
                  <span className="text-slate-500 font-medium">Email</span>
                  <span className="font-semibold text-slate-700">
                    {user?.email}
                  </span>
                </div>

                {user?.employeeId && (
                  <div
                    className="
                      flex justify-between items-center
                      p-4 rounded-2xl
                      bg-white/20
                    "
                  >
                    <span className="text-slate-500 font-medium">
                      Employee ID
                    </span>
                    <span className="font-semibold text-slate-700">
                      {user?.employeeId}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div
              className="
                bg-white/30
                backdrop-blur-3xl
                rounded-3xl
                border border-white/20
                shadow-[0_20px_60px_rgba(31,38,135,0.15)]
                p-8
              "
            >
              <h2 className="text-xl font-bold text-slate-800 mb-6">
                Quick Actions
              </h2>

              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    label: 'Manage Employees',
                    href: '/employees',
                    color:
                      'from-indigo-500 to-purple-600',
                  },
                  {
                    label: 'Attendance',
                    href: '/attendance',
                    color:
                      'from-blue-500 to-cyan-600',
                  },
                  {
                    label: 'Leave Requests',
                    href: '/leaves',
                    color:
                      'from-amber-500 to-orange-500',
                  },
                  {
                    label: 'Payroll',
                    href: '/payroll',
                    color:
                      'from-emerald-500 to-green-600',
                  },
                ].map((action) => (
                  <a
                    key={action.href}
                    href={action.href}
                    className={`
                      p-5 rounded-3xl
                      bg-gradient-to-br ${action.color}
                      text-white font-semibold
                      shadow-xl
                      hover:scale-105 hover:-translate-y-1
                      transition-all duration-300
                      flex items-center justify-between
                    `}
                  >
                    <span>{action.label}</span>
                    <ArrowRight size={18} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {!canManage && (
        <div
          className="
            max-w-xl
            bg-white/30
            backdrop-blur-3xl
            rounded-3xl
            border border-white/20
            shadow-[0_20px_60px_rgba(31,38,135,0.15)]
            p-8
          "
        >
          <h2 className="text-xl font-bold text-slate-800 mb-6">
            Welcome back, {user?.name}
          </h2>

          <div className="space-y-4">
            <div className="flex justify-between p-4 rounded-2xl bg-white/20">
              <span className="text-slate-500">Role</span>
              <span className="font-bold text-indigo-600">
                {user?.role}
              </span>
            </div>

            <div className="flex justify-between p-4 rounded-2xl bg-white/20">
              <span className="text-slate-500">Email</span>
              <span className="font-semibold text-slate-700">
                {user?.email}
              </span>
            </div>

            {user?.employeeId && (
              <div className="flex justify-between p-4 rounded-2xl bg-white/20">
                <span className="text-slate-500">Employee ID</span>
                <span className="font-semibold text-slate-700">
                  {user?.employeeId}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}