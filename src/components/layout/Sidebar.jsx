import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Clock,
  CalendarDays,
  Calendar,
  DollarSign,
  ShieldCheck,
  Mail,
  LogOut,
  Building2,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  FileText,
  KeyRound,
  CalendarRange,
  CalendarClock,
  FileSpreadsheet,
} from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import { useState } from 'react';
import favicon from "../../assets/favicon.jpg";

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['ADMIN', 'SUPER_ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'] },
  { to: '/employees', icon: Users, label: 'Employees', roles: ['ADMIN', 'SUPER_ADMIN', 'HR', 'MANAGER'] },
  { to: '/payroll', icon: DollarSign, label: 'Payroll', roles: ['ADMIN', 'SUPER_ADMIN', 'HR', 'MANAGER'] },
  { to: '/reports', icon: BarChart3, label: 'Reports', roles: ['ADMIN', 'SUPER_ADMIN', 'HR', 'MANAGER'] },
  { to: '/reports/daily', icon: Calendar, label: 'Daily Attendance', roles: ['ADMIN', 'SUPER_ADMIN', 'HR', 'MANAGER'], indent: true },
  { to: '/reports/monthly', icon: CalendarRange, label: 'Monthly Attendance', roles: ['ADMIN', 'SUPER_ADMIN', 'HR', 'MANAGER'], indent: true },
  { to: '/reports/leave', icon: CalendarClock, label: 'Leave Balance', roles: ['ADMIN', 'SUPER_ADMIN', 'HR', 'MANAGER'], indent: true },
  { to: '/reports/payroll', icon: FileSpreadsheet, label: 'Payroll Report', roles: ['ADMIN', 'SUPER_ADMIN', 'HR', 'MANAGER'], indent: true },
  { to: '/form16-admin', icon: FileText, label: 'Form 16 Upload', roles: ['ADMIN', 'SUPER_ADMIN', 'HR', 'MANAGER'] },
  { to: '/attendance', icon: Clock, label: 'My Attendance', roles: ['EMPLOYEE', 'MANAGER'] },
  { to: '/my-leaves', icon: CalendarDays, label: 'My Leaves', roles: ['EMPLOYEE', 'MANAGER'] },
  { to: '/calendar', icon: Calendar, label: 'My Calendar', roles: ['EMPLOYEE', 'MANAGER'] },
  { to: '/payslips', icon: FileSpreadsheet, label: 'My Payslips', roles: ['EMPLOYEE', 'MANAGER'] },
  { to: '/form16', icon: FileText, label: 'My Form 16', roles: ['EMPLOYEE', 'MANAGER'] },
  { to: '/admins', icon: ShieldCheck, label: 'Admin Users', roles: ['ADMIN', 'SUPER_ADMIN'] },
  { to: '/leave-policy', icon: CalendarDays, label: 'Leave Policy', roles: ['ADMIN', 'SUPER_ADMIN'] },
  { to: '/emails', icon: Mail, label: 'Email Logs', roles: ['ADMIN', 'SUPER_ADMIN'] },
  { to: '/leave-approvals', icon: CalendarDays, label: 'Leave Approvals', roles: ['ADMIN', 'SUPER_ADMIN', 'MANAGER', 'HR'] },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [showReports, setShowReports] = useState(false);

  const filtered = navItems.filter(
    (item) => !item.roles || item.roles.includes(user?.role)
  );

  return (
    <aside
      className={`
        ${collapsed ? 'w-20' : 'w-72'}
        flex flex-col min-h-screen shrink-0
        bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950
        backdrop-blur-3xl
        border-r border-white/10
        shadow-[20px_0_60px_rgba(15,23,42,0.7)]
        transition-all duration-500
      `}
    >
      {/* Logo */}
<div className="relative px-4 py-5 border-b border-white/10">
  {!collapsed ? (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="relative">
          {/* Glow */}
          <div className="absolute inset-0 rounded-3xl bg-indigo-500/30 blur-2xl" />

          {/* Glass logo */}
          <div  className=" w-16 h-16 flex items-center justify-center">
           <img
  src={favicon}
  alt="HRMS Logo"
  className="w-full h-full object-contain p-2"
 />
          </div>
        </div>

        <div>
          <h1 className="text-white text-xl font-bold tracking-tight">
            AURONEQIS
          </h1>
        </div>
      </div>
  <br />
      <button
        onClick={() => setCollapsed(true)}
        className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-white/20 transition-all duration-300"
      >
        <ChevronLeft size={18} className="text-white" />
      </button>
    </div>
  ) : (
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        <div className="absolute inset-0 rounded-3xl bg-indigo-500/30 blur-xl" />

        <div className=" bg-white/10  flex items-center justify-center">
          <img
            src={favicon}
            alt="HRMS Logo"
            className="w-8 h-8 object-contain"
          />
        </div>
      </div>

      <button
        onClick={() => setCollapsed(false)}
        className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-white/20 transition-all duration-300"
      >
        <ChevronRight size={18} className="text-white" />
      </button>
    </div>
  )}
</div>

      {/* Nav */}
      <nav className="flex-1 py-5 px-3 space-y-2 overflow-y-auto">
        {filtered.map(({ to, icon: Icon, label, indent }, index) => {
          if (to === '/reports') {
            return (
              <button
                key={to}
                onClick={() => setShowReports(!showReports)}
                className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-slate-300 bg-white/5 hover:bg-white/10 hover:scale-[1.02] transition-all duration-300"
              >
                <Icon size={20} />
                {!collapsed && label}
              </button>
            );
          }

          if (to.startsWith('/reports/') && !showReports) return null;

          const isMyWorkspaceItem = [
            '/attendance',
            '/leaves',
            '/calendar',
            '/payslips',
            '/form16',
          ].includes(to);

          return (
            <div key={to}>
              {isMyWorkspaceItem &&
                user?.role === 'MANAGER' &&
                !collapsed &&
                index ===
                  filtered.findIndex((i) =>
                    ['/attendance', '/leaves', '/calendar', '/payslips', '/form16'].includes(i.to)
                  ) && (
                  <p className="text-xs text-slate-500 px-4 mt-5 mb-2 uppercase tracking-wider">
                    My Workspace
                  </p>
                )}

              <NavLink
                to={to}
                className={({ isActive }) =>
                  `
                  flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-medium
                  transition-all duration-300 transform
                  hover:scale-[1.03] hover:-translate-y-0.5
                  ${indent && !collapsed ? 'ml-5' : ''}
                  ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-xl shadow-indigo-500/30'
                      : 'text-slate-300 bg-white/5 hover:bg-white/10'
                  }
                `
                }
              >
                <Icon size={indent ? 16 : 20} />
                {!collapsed && label}
              </NavLink>
            </div>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-white/10 p-4 space-y-2">
        <button
          onClick={() => navigate('/update-password')}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl bg-white/5 hover:bg-indigo-500/20 text-slate-300 hover:text-indigo-300 transition-all duration-300 hover:scale-[1.02]"
        >
          <KeyRound size={20} />
          {!collapsed && 'Change Password'}
        </button>

        <button
          onClick={logout}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl bg-white/5 hover:bg-red-500/20 text-slate-300 hover:text-red-300 transition-all duration-300 hover:scale-[1.02]"
        >
          <LogOut size={20} />
          {!collapsed && 'Logout'}
        </button>
      </div>
    </aside>
  );
}