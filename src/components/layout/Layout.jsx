import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuth } from '../../context/useAuth';

export default function Layout() {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-gradient-to-br from-slate-100 via-indigo-100 to-purple-100">

      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-400/20 rounded-full blur-3xl animate-pulse"></div>

      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <div className="flex flex-col flex-1 min-w-0 relative z-10">

        {/* Header */}
        <Header />

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="min-h-full rounded-3xl bg-white/30 backdrop-blur-2xl border border-white/20 shadow-[0_20px_60px_rgba(31,38,135,0.2)] p-6">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
}