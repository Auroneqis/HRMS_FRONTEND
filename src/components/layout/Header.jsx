import { Bell, Search, User, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import { useLocation } from 'react-router-dom';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/employees': 'Employee Management',
  '/attendance': 'Attendance',
  '/leaves': 'Leave Management',
  '/payroll': 'Payroll',
  '/admins': 'Admin Users',
  '/emails': 'Email Logs',
};

export default function Header() {
  const { user } = useAuth();
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'HRMS';

  return (
    <header className="sticky top-0 z-50 px-6 py-4 backdrop-blur-2xl bg-white/10 border-b border-white/20 shadow-[0_8px_32px_rgba(31,38,135,0.18)]">
      <div className="flex items-center justify-between">

        {/* Left */}
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30 animate-pulse">
              <Sparkles className="text-white" size={18} />
            </div>

            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 via-indigo-700 to-purple-700 bg-clip-text text-transparent">
                {title}
              </h1>

              <p className="text-sm text-slate-500">
                {new Date().toLocaleDateString('en-IN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">

          {/* Search */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/40 backdrop-blur-xl border border-white/30 shadow-lg hover:scale-105 transition-all duration-300">
            <Search size={18} className="text-slate-500" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400"
            />
          </div>

          {/* Notification */}
          <button className="relative p-3 rounded-2xl bg-white/30 backdrop-blur-xl border border-white/30 shadow-lg hover:scale-110 hover:rotate-6 transition-all duration-300">
            <Bell size={20} className="text-slate-700" />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span>
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
          </button>

          {/* User */}
          <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/30 backdrop-blur-xl border border-white/30 shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-lg">
              {(user?.name || user?.email || 'U')[0].toUpperCase()}
            </div>

            <div className="hidden md:block">
              <p className="font-semibold text-slate-800">
                {user?.name || user?.email}
              </p>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                {user?.role}
              </p>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}