import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle, XCircle, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { updatePassword } from '../api/authApi';

export default function UpdatePassword() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [form,    setForm]    = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [show,    setShow]    = useState({ current: false, newP: false, confirm: false });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState(false);

  const checks = [
    { label: 'At least 8 characters',  pass: form.newPassword.length >= 8 },
    { label: 'Contains a number',      pass: /\d/.test(form.newPassword) },
    { label: 'Contains uppercase',     pass: /[A-Z]/.test(form.newPassword) },
    { label: 'Passwords match',        pass: form.newPassword === form.confirmPassword && form.confirmPassword !== '' },
  ];
  const strength = checks.filter(c => c.pass).length;
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength];
  const strengthColor = ['', '#ef4444', '#f59e0b', '#3b82f6', '#10b981'][strength];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(false);
    if (form.newPassword !== form.confirmPassword) { setError('New passwords do not match'); return; }
    if (form.newPassword.length < 8) { setError('Password must be at least 8 characters'); return; }
    setLoading(true);
    try {
      await updatePassword(form.currentPassword, form.newPassword, form.confirmPassword, token);
      setSuccess(true); setError('');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) { setError(err.message); setSuccess(false); }
    finally { setLoading(false); }
  };

  const InputField = ({ label, fieldKey, showKey, placeholder }) => (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
      <div className="relative flex items-center">
        <Lock size={16} className="absolute left-4 text-slate-400 pointer-events-none" />
        <input
          type={show[showKey] ? 'text' : 'password'}
          placeholder={placeholder}
          value={form[fieldKey]}
          onChange={e => setForm(f => ({ ...f, [fieldKey]: e.target.value }))}
          required
          className="w-full pl-10 pr-11 py-3 rounded-2xl bg-white/40 backdrop-blur-xl border border-white/30 shadow-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
        />
        <button type="button" onClick={() => setShow(s => ({ ...s, [showKey]: !s[showKey] }))}
          className="absolute right-3 text-slate-400 hover:text-slate-600 transition-colors p-1">
          {show[showKey] ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50 to-purple-100 p-8 flex items-center justify-center">
      <style>{`
        @keyframes float-orb { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(20px,-20px) scale(1.07)} 66%{transform:translate(-15px,15px) scale(.94)} }
        @keyframes card-in   { from{opacity:0;transform:translateY(24px) scale(.97)} to{opacity:1;transform:none} }
        .orb   { animation:float-orb 18s ease-in-out infinite;position:fixed;border-radius:50%;filter:blur(70px);opacity:.2;pointer-events:none;z-index:0; }
        .glass { background:rgba(255,255,255,.28);backdrop-filter:blur(24px);border:1px solid rgba(255,255,255,.22); }
        .card-in { animation:card-in .55s cubic-bezier(.16,1,.3,1) both; }
        .btn-p { transition:transform .15s,box-shadow .15s; }
        .btn-p:hover:not(:disabled){ transform:translateY(-2px) scale(1.03); box-shadow:0 10px 28px rgba(79,70,229,.4); }
        .btn-p:active:not(:disabled){ transform:scale(.97); }
      `}</style>

      <div className="orb" style={{ width:500,height:500,background:"radial-gradient(circle,#6366f1 0%,transparent 70%)",top:-120,left:-120 }} />
      <div className="orb" style={{ width:400,height:400,background:"radial-gradient(circle,#ec4899 0%,transparent 70%)",bottom:-100,right:-100,animationDelay:"7s" }} />

      <div className="relative z-10 w-full max-w-lg card-in">
        {/* Back */}
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 mb-6 transition-all hover:-translate-x-1 duration-300">
          <ArrowLeft size={15} /> Back
        </button>

        {/* Page header */}
        <div className="flex items-center gap-5 mb-8">
          <div className="w-16 h-16 rounded-3xl flex items-center justify-center shadow-2xl"
            style={{ background:"linear-gradient(135deg,#4f46e5,#7c3aed,#ec4899)", boxShadow:"0 12px 40px rgba(99,102,241,.4)" }}>
            <ShieldCheck className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent"
              style={{ backgroundImage:"linear-gradient(135deg,#1e293b,#4338ca,#7c3aed)" }}>
              Update Password
            </h1>
            <p className="text-slate-500 mt-1 text-sm">
              Changing password for <span className="text-indigo-600 font-semibold">{user?.email}</span>
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="glass rounded-3xl shadow-[0_20px_60px_rgba(31,38,135,.15)] p-8 space-y-5">

          {success && (
            <div className="flex items-center gap-3 p-4 bg-emerald-50/80 border border-emerald-200/60 rounded-2xl text-emerald-700 text-sm font-semibold">
              <CheckCircle size={18} className="text-emerald-500 shrink-0" />
              Password updated successfully!
            </div>
          )}
          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-50/80 border border-red-200/60 rounded-2xl text-red-600 text-sm font-semibold">
              <XCircle size={18} className="text-red-500 shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <InputField label="Current Password"  fieldKey="currentPassword"  showKey="current" placeholder="Enter current password" />

            <div className="border-t border-white/30" />

            <InputField label="New Password"      fieldKey="newPassword"      showKey="newP"    placeholder="Enter new password" />
            <InputField label="Confirm Password"  fieldKey="confirmPassword"  showKey="confirm" placeholder="Confirm new password" />

            {/* Strength indicator */}
            {form.newPassword && (
              <div className="glass rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles size={11} className="text-indigo-400" /> Password Strength
                  </p>
                  <span className="text-xs font-bold" style={{ color: strengthColor }}>{strengthLabel}</span>
                </div>
                {/* Bar */}
                <div className="h-1.5 bg-white/40 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500"
                    style={{ width:`${(strength / 4) * 100}%`, background: strengthColor }} />
                </div>
                {/* Checks */}
                <div className="grid grid-cols-2 gap-2">
                  {checks.map((c, i) => (
                    <div key={i} className="flex items-center gap-2">
                      {c.pass
                        ? <CheckCircle size={13} className="text-emerald-500 shrink-0" />
                        : <XCircle    size={13} className="text-slate-300 shrink-0" />}
                      <span className={`text-xs ${c.pass ? 'text-emerald-600 font-medium' : 'text-slate-400'}`}>{c.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => navigate(-1)}
                className="flex-1 px-4 py-3 rounded-2xl glass font-semibold text-slate-600 hover:bg-white/50 transition-all">
                Cancel
              </button>
              <button type="submit" disabled={loading}
                className="btn-p flex-1 px-4 py-3 rounded-2xl text-white font-semibold shadow-xl disabled:opacity-60 flex items-center justify-center gap-2"
                style={{ background:"linear-gradient(135deg,#4f46e5,#7c3aed)", boxShadow:"0 8px 24px rgba(79,70,229,.35)" }}>
                {loading
                  ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Updating…</>
                  : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}