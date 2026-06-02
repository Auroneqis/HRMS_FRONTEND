import { useEffect, useState } from 'react';
import { employeeAPI } from '../api/services';
import {
  FileText, Download, Loader2, Inbox,
  Sparkles, CheckCircle2, Clock, RefreshCw,
  Calendar, ShieldCheck,
} from 'lucide-react';

export default function MyForm16() {
  const [data,     setData]     = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [dlId,     setDlId]     = useState(null);   // which row is downloading
  const [error,    setError]    = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await employeeAPI.getMyForm16List();
      setData(res?.data?.data || []);
    } catch (e) {
      setError(e.response?.data?.message || e.message || 'Failed to load Form 16');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDownload = async (fy, id) => {
    setDlId(id);
    try {
      const res = await employeeAPI.downloadMyForm16(fy);
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url  = window.URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `Form16_FY${fy}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      // mark as downloaded in local state so badge updates immediately
      setData(prev => prev.map(f => f.id === id ? { ...f, downloaded: true } : f));
    } catch (e) {
      alert(e.response?.data?.message || 'Download failed');
    } finally {
      setDlId(null);
    }
  };

  const totalCount      = data.length;
  const downloadedCount = data.filter(f => f.downloaded).length;
  const newCount        = totalCount - downloadedCount;

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="p-8 space-y-8 min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50 to-purple-100">

      {/* ── Animated background orbs (same as rest of app) ── */}
      <style>{`
        @keyframes float-orb {
          0%,100% { transform: translate(0,0) scale(1); }
          33%      { transform: translate(20px,-20px) scale(1.07); }
          66%      { transform: translate(-15px,15px) scale(0.94); }
        }
        @keyframes card-in {
          from { opacity:0; transform:translateY(24px) scale(0.97); }
          to   { opacity:1; transform:translateY(0)   scale(1);    }
        }
        @keyframes row-in {
          from { opacity:0; transform:translateX(-12px); }
          to   { opacity:1; transform:translateX(0); }
        }
        @keyframes dl-spin {
          to { transform: rotate(360deg); }
        }
        .card-in  { animation: card-in 0.55s cubic-bezier(0.16,1,0.3,1) both; }
        .row-in   { animation: row-in  0.4s cubic-bezier(0.16,1,0.3,1) both; }
        .orb      { animation: float-orb 18s ease-in-out infinite; position:fixed; border-radius:50%; filter:blur(70px); opacity:0.22; pointer-events:none; z-index:0; }
        .glass    { background:rgba(255,255,255,0.28); backdrop-filter:blur(24px); border:1px solid rgba(255,255,255,0.22); }
        .btn-dl   { transition: transform 0.18s, box-shadow 0.18s, opacity 0.18s; }
        .btn-dl:hover:not(:disabled) { transform:translateY(-2px) scale(1.04); box-shadow:0 10px 28px rgba(79,70,229,0.35); }
        .btn-dl:active:not(:disabled){ transform:scale(0.96); }
        .row-hover:hover { background:rgba(255,255,255,0.22); }
      `}</style>

      {/* Fixed decorative orbs */}
      <div className="orb" style={{ width:500, height:500, background:'radial-gradient(circle,#6366f1 0%,transparent 70%)', top:-120, left:-120 }} />
      <div className="orb" style={{ width:400, height:400, background:'radial-gradient(circle,#ec4899 0%,transparent 70%)', bottom:-100, right:-100, animationDelay:'7s' }} />
      <div className="orb" style={{ width:350, height:350, background:'radial-gradient(circle,#10b981 0%,transparent 70%)', top:'45%', left:'50%', animationDelay:'14s' }} />

      <div className="relative z-10 space-y-8">

        {/* ── HEADER ── */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 card-in">
          <div className="flex items-center gap-5">
            <div
              className="w-16 h-16 rounded-3xl flex items-center justify-center shadow-2xl"
              style={{ background:'linear-gradient(135deg,#6366f1 0%,#a855f7 50%,#ec4899 100%)', boxShadow:'0 12px 40px rgba(99,102,241,0.4)' }}
            >
              <FileText className="text-white" size={28} />
            </div>
            <div>
              <h1
                className="text-4xl font-bold bg-clip-text text-transparent"
                style={{ backgroundImage:'linear-gradient(135deg,#1e293b 0%,#4338ca 50%,#7c3aed 100%)' }}
              >
                My Form 16
              </h1>
              <p className="text-slate-500 mt-1 font-medium">{today}</p>
            </div>
          </div>

          <button
            onClick={fetchData}
            disabled={loading}
            className="
              glass flex items-center gap-3
              px-6 py-3.5 rounded-3xl
              font-semibold text-slate-700
              shadow-xl
              hover:scale-105 hover:-translate-y-1
              transition-all duration-300
              disabled:opacity-50
            "
          >
            {loading
              ? <Loader2 size={16} className="animate-spin text-indigo-500" />
              : <RefreshCw size={16} className="text-indigo-500" />
            }
            Refresh
          </button>
        </div>

        {/* ── STAT CARDS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              icon: FileText,
              label: 'Total Documents',
              value: totalCount,
              gradient: 'from-indigo-500 to-purple-600',
              shadow: 'rgba(99,102,241,0.35)',
              delay: '0s',
            },
            {
              icon: Sparkles,
              label: 'New / Unread',
              value: newCount,
              gradient: 'from-amber-500 to-orange-500',
              shadow: 'rgba(245,158,11,0.35)',
              delay: '0.08s',
            },
            {
              icon: CheckCircle2,
              label: 'Downloaded',
              value: downloadedCount,
              gradient: 'from-emerald-500 to-green-600',
              shadow: 'rgba(16,185,129,0.35)',
              delay: '0.16s',
            },
          ].map(({ icon: Icon, label, value, gradient, shadow, delay }) => (
            <div
              key={label}
              className="glass rounded-3xl p-6 flex items-center gap-5 shadow-xl card-in
                hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
              style={{ animationDelay: delay }}
            >
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-xl shrink-0`}
                style={{ boxShadow:`0 8px 24px ${shadow}` }}
              >
                <Icon size={24} className="text-white" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest font-bold text-slate-500">{label}</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">{loading ? '—' : value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── ERROR ── */}
        {error && (
          <div className="glass rounded-3xl px-6 py-4 text-red-700 border border-red-200/40 shadow-lg flex items-center gap-3 card-in">
            <ShieldCheck size={18} className="text-red-500 shrink-0" />
            {error}
          </div>
        )}

        {/* ── MAIN CARD ── */}
        <div className="glass rounded-3xl shadow-[0_20px_60px_rgba(31,38,135,0.15)] overflow-hidden card-in" style={{ animationDelay:'0.1s' }}>

          {/* Card header */}
          <div className="px-8 py-5 border-b border-white/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                <FileText size={16} className="text-white" />
              </div>
              <div>
                <h2 className="font-bold text-slate-800 text-base">Income Tax Documents</h2>
                <p className="text-xs text-slate-500">Download your Form 16 PDFs for each financial year</p>
              </div>
            </div>
            {!loading && data.length > 0 && (
              <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">
                {data.length} record{data.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {/* Loading skeleton */}
          {loading && (
            <div className="p-8 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 animate-pulse">
                  <div className="w-12 h-12 rounded-2xl bg-white/40" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-white/40 rounded-xl w-1/3" />
                    <div className="h-3 bg-white/30 rounded-xl w-1/2" />
                  </div>
                  <div className="w-28 h-9 bg-white/40 rounded-2xl" />
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && data.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 px-4 gap-5">
              <div
                className="w-20 h-20 rounded-3xl flex items-center justify-center shadow-xl"
                style={{ background:'linear-gradient(135deg,#e0e7ff,#ede9fe)' }}
              >
                <Inbox size={36} className="text-indigo-400" />
              </div>
              <div className="text-center">
                <p className="font-bold text-slate-700 text-lg">No Form 16 Yet</p>
                <p className="text-slate-400 text-sm mt-1">
                  Your employer hasn't uploaded any Form 16 documents yet.
                </p>
              </div>
            </div>
          )}

          {/* Records */}
          {!loading && data.length > 0 && (
            <div className="divide-y divide-white/10">
              {data.map((f, idx) => (
                <div
                  key={f.id}
                  className="row-hover row-in flex items-center gap-5 px-8 py-5 transition-all duration-300"
                  style={{ animationDelay: `${idx * 0.07}s` }}
                >
                  {/* File icon */}
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shrink-0"
                    style={{
                      background: f.downloaded
                        ? 'linear-gradient(135deg,#d1fae5,#a7f3d0)'
                        : 'linear-gradient(135deg,#ede9fe,#ddd6fe)',
                    }}
                  >
                    <FileText
                      size={20}
                      className={f.downloaded ? 'text-emerald-600' : 'text-indigo-500'}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-slate-800 text-sm">
                        Form 16 · FY {f.financialYear}
                      </p>
                      {f.downloaded ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                          <CheckCircle2 size={9} /> Downloaded
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
                          <Sparkles size={9} /> New
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-1 flex-wrap">
                      {f.fileName && (
                        <span className="text-xs text-slate-500 truncate max-w-[220px]">{f.fileName}</span>
                      )}
                      {f.uploadedAt && (
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                          <Calendar size={10} />
                          {new Date(f.uploadedAt).toLocaleDateString('en-IN', {
                            day: '2-digit', month: 'short', year: 'numeric',
                          })}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Download button */}
                  <button
                    onClick={() => handleDownload(f.financialYear, f.id)}
                    disabled={dlId === f.id}
                    className="btn-dl shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-2xl text-white text-sm font-semibold shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{
                      background: dlId === f.id
                        ? 'linear-gradient(135deg,#818cf8,#a78bfa)'
                        : 'linear-gradient(135deg,#4f46e5,#7c3aed)',
                      boxShadow: '0 6px 20px rgba(79,70,229,0.3)',
                    }}
                  >
                    {dlId === f.id
                      ? <Loader2 size={14} className="animate-spin" />
                      : <Download size={14} />
                    }
                    {dlId === f.id ? 'Downloading…' : 'Download PDF'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── INFO FOOTER ── */}
        <div className="glass rounded-3xl px-8 py-5 flex items-start gap-4 shadow-lg card-in" style={{ animationDelay:'0.2s' }}>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shrink-0">
            <ShieldCheck size={18} className="text-white" />
          </div>
          <div>
            <p className="font-semibold text-slate-700 text-sm">About Form 16</p>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              Form 16 is a TDS certificate issued by your employer under Section 203 of the Income Tax Act.
              It contains details of salary paid and tax deducted at source during the financial year.
              Keep it safe — you'll need it for filing your Income Tax Return (ITR).
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}