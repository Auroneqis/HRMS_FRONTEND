import { useEffect, useState } from "react";
import { leavePolicyAPI } from "../api/services";
import { Plus, Pencil, Trash2, X, Loader2, ShieldCheck, Sparkles, CalendarDays } from "lucide-react";

const employeeTypes = ["FULL_TIME", "CONTRACT", "TEMPORARY", "INTERN"];
const leaveTypes = [
  "PLANNED",
  "CASUAL",
  "SICK",
  "EARNED",
  "WFH",
  "MATERNITY",
  "BEREAVEMENT",
  "MARRIAGE",
  "LOP",
  "PUBLIC_HOLIDAY",
  "OPTIONAL_HOLIDAY",
  "PATERNITY"
];

const TYPE_COLORS = {
  FULL_TIME:  { bg: "from-indigo-500 to-purple-600", light: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  CONTRACT:   { bg: "from-blue-500 to-cyan-600",     light: "bg-blue-50 text-blue-700 border-blue-200"     },
  TEMPORARY:  { bg: "from-amber-500 to-orange-500",  light: "bg-amber-50 text-amber-700 border-amber-200"  },
  INTERN:     { bg: "from-pink-500 to-rose-500",     light: "bg-pink-50 text-pink-700 border-pink-200"     },
};
const LEAVE_COLORS = {
  Planned: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Sick:    "bg-red-50 text-red-700 border-red-200",
};

const EMPTY = { employeeType: "FULL_TIME",leaveType: "CASUAL", totalDays: "", description: "" };

export default function LeavePolicy() {
  const [policies,   setPolicies]   = useState([]);
  const [form,       setForm]       = useState(EMPTY);
  const [editingId,  setEditingId]  = useState(null);
  const [saving,     setSaving]     = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [showModal,  setShowModal]  = useState(false);
  const [deleteId,   setDeleteId]   = useState(null);
  const [error,      setError]      = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await leavePolicyAPI.getAll();
      setPolicies(res.data || []);
    } catch { setError("Failed to load policies"); }
    finally  { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const openAdd = () => { setForm(EMPTY); setEditingId(null); setError(""); setShowModal(true); };
  const openEdit = (p) => {
    setForm({ employeeType: p.employeeType, leaveType: p.leaveType, totalDays: p.totalDays, description: p.description || "" });
    setEditingId(p.id); setError(""); setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setError("");
    try {
      if (editingId) await leavePolicyAPI.update(editingId, form);
      else           await leavePolicyAPI.create(form);
      setShowModal(false);
      loadData();
    } catch (err) {
      setError(err?.response?.data?.message || err?.response?.data || "Error occurred");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    setDeleteId(id);
    try { await leavePolicyAPI.delete(id); loadData(); }
    catch { alert("Delete failed"); }
    finally { setDeleteId(null); }
  };

  const statCards = [
    { label: "Total Policies",   value: policies.length,                                        gradient: "from-indigo-500 to-purple-600", shadow: "rgba(99,102,241,.35)"  },
    { label: "Leave Types",      value: [...new Set(policies.map(p => p.leaveType))].length,    gradient: "from-emerald-500 to-green-600", shadow: "rgba(16,185,129,.35)"  },
    { label: "Employee Types",   value: [...new Set(policies.map(p => p.employeeType))].length, gradient: "from-amber-500 to-orange-500",  shadow: "rgba(245,158,11,.35)"  },
  ];

  return (
    <div className="p-8 space-y-8 min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50 to-purple-100">
      <style>{`
        @keyframes float-orb { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(20px,-20px) scale(1.07)} 66%{transform:translate(-15px,15px) scale(.94)} }
        @keyframes card-in   { from{opacity:0;transform:translateY(20px) scale(.97)} to{opacity:1;transform:none} }
        @keyframes row-in    { from{opacity:0;transform:translateX(-10px)} to{opacity:1;transform:none} }
        .orb   { animation:float-orb 18s ease-in-out infinite; position:fixed; border-radius:50%; filter:blur(70px); opacity:.2; pointer-events:none; z-index:0; }
        .glass { background:rgba(255,255,255,.28); backdrop-filter:blur(24px); border:1px solid rgba(255,255,255,.22); }
        .card-in { animation:card-in .55s cubic-bezier(.16,1,.3,1) both; }
        .row-in  { animation:row-in .4s cubic-bezier(.16,1,.3,1) both; }
        .row-h:hover { background:rgba(255,255,255,.22); }
        .btn-primary { transition:transform .15s,box-shadow .15s; }
        .btn-primary:hover:not(:disabled) { transform:translateY(-2px) scale(1.04); box-shadow:0 10px 28px rgba(79,70,229,.38); }
        .btn-primary:active:not(:disabled){ transform:scale(.96); }
      `}</style>

      {/* Orbs */}
      <div className="orb" style={{ width:500,height:500,background:"radial-gradient(circle,#6366f1 0%,transparent 70%)",top:-120,left:-120 }} />
      <div className="orb" style={{ width:400,height:400,background:"radial-gradient(circle,#ec4899 0%,transparent 70%)",bottom:-100,right:-100,animationDelay:"7s" }} />
      <div className="orb" style={{ width:350,height:350,background:"radial-gradient(circle,#10b981 0%,transparent 70%)",top:"45%",left:"50%",animationDelay:"14s" }} />

      <div className="relative z-10 space-y-8">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 card-in">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-3xl flex items-center justify-center shadow-2xl"
              style={{ background:"linear-gradient(135deg,#6366f1,#a855f7,#ec4899)", boxShadow:"0 12px 40px rgba(99,102,241,.4)" }}>
              <CalendarDays className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-clip-text text-transparent"
                style={{ backgroundImage:"linear-gradient(135deg,#1e293b,#4338ca,#7c3aed)" }}>
                Leave Policy
              </h1>
              <p className="text-slate-500 mt-1 font-medium">Configure leave entitlements by employee type</p>
            </div>
          </div>
          <button onClick={openAdd}
            className="btn-primary glass flex items-center gap-3 px-6 py-3.5 rounded-3xl font-semibold text-white shadow-xl"
            style={{ background:"linear-gradient(135deg,#4f46e5,#7c3aed)", boxShadow:"0 8px 28px rgba(79,70,229,.35)" }}>
            <Plus size={18} /> Add Policy
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {statCards.map(({ label, value, gradient, shadow }, i) => (
            <div key={label} className="glass rounded-3xl p-6 flex items-center gap-5 shadow-xl card-in hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
              style={{ animationDelay:`${i * 0.08}s` }}>
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-xl shrink-0`}
                style={{ boxShadow:`0 8px 24px ${shadow}` }}>
                <Sparkles size={22} className="text-white" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest font-bold text-slate-500">{label}</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">{loading ? "—" : value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Table card */}
        <div className="glass rounded-3xl shadow-[0_20px_60px_rgba(31,38,135,.15)] overflow-hidden card-in" style={{ animationDelay:".1s" }}>
          <div className="px-8 py-5 border-b border-white/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                <ShieldCheck size={16} className="text-white" />
              </div>
              <div>
                <h2 className="font-bold text-slate-800">All Policies</h2>
                <p className="text-xs text-slate-500">{policies.length} configured rules</p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-8 space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 animate-pulse">
                  <div className="w-10 h-10 rounded-2xl bg-white/40" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-white/40 rounded-xl w-1/4" />
                    <div className="h-3 bg-white/30 rounded-xl w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : policies.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <div className="w-16 h-16 rounded-3xl flex items-center justify-center" style={{ background:"linear-gradient(135deg,#e0e7ff,#ede9fe)" }}>
                <CalendarDays size={30} className="text-indigo-400" />
              </div>
              <p className="font-bold text-slate-600">No policies configured yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/20">
                    {["Employee Type","Leave Type","Days","Description","Actions"].map(h => (
                      <th key={h} className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-slate-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {policies.map((p, i) => (
                    <tr key={p.id} className="row-h row-in transition-all duration-200" style={{ animationDelay:`${i * 0.05}s` }}>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full border ${TYPE_COLORS[p.employeeType]?.light || "bg-slate-100 text-slate-600 border-slate-200"}`}>
                          {p.employeeType.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full border ${LEAVE_COLORS[p.leaveType] || "bg-slate-100 text-slate600 border-slate-200"}`}>
                          {p.leaveType}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-2xl font-bold text-slate-800">{p.totalDays}</span>
                        <span className="text-xs text-slate-400 ml-1">days</span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 max-w-xs truncate">{p.description || "—"}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEdit(p)}
                            className="p-2 rounded-2xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:scale-110 transition-all duration-200 border border-indigo-100">
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => handleDelete(p.id)} disabled={deleteId === p.id}
                            className="p-2 rounded-2xl bg-red-50 text-red-500 hover:bg-red-100 hover:scale-110 transition-all duration-200 border border-red-100 disabled:opacity-50">
                            {deleteId === p.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-md glass rounded-3xl shadow-[0_30px_100px_rgba(15,23,42,.35)] overflow-hidden card-in">
            <div className="flex items-center justify-between px-8 py-6 border-b border-white/20">
              <h2 className="text-xl font-bold text-slate-800">{editingId ? "Edit Policy" : "Add Policy"}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-2xl bg-white/20 hover:bg-white/40 hover:rotate-90 transition-all duration-300">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50/80 border border-red-200/60 rounded-2xl text-red-700 text-sm">
                  <ShieldCheck size={15} className="shrink-0" /> {error}
                </div>
              )}
              {[
                { label:"Employee Type", key:"employeeType", options:employeeTypes },
                { label:"Leave Type",    key:"leaveType",    options:leaveTypes    },
              ].map(({ label, key, options }) => (
                <div key={key}>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
                  <select value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    className="w-full px-4 py-3 rounded-2xl bg-white/40 backdrop-blur-xl border border-white/30 shadow-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    {options.map((o) => (
  <option key={o} value={o}>
    {({
      PLANNED: "Planned",
      CASUAL: "Casual Leave",
      SICK: "Sick Leave",
      EARNED: "Earned Leave",
      WFH: "Work From Home",
      MATERNITY: "Maternity Leave",
      BEREAVEMENT: "Bereavement Leave",
      MARRIAGE: "Marriage Leave",
      LOP: "Loss Of Pay",
      PUBLIC_HOLIDAY: "Public Holiday",
      OPTIONAL_HOLIDAY: "Optional Holiday",
      PATERNITY: "Paternity Leave",
    })[o] || o}
  </option>
))}
                  </select>
                </div>
              ))}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Total Days *</label>
                <input type="number" required min={1} value={form.totalDays}
                  onChange={e => setForm(f => ({ ...f, totalDays: e.target.value }))}
                  placeholder="e.g. 12"
                  className="w-full px-4 py-3 rounded-2xl bg-white/40 backdrop-blur-xl border border-white/30 shadow-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                <input type="text" value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Optional note"
                  className="w-full px-4 py-3 rounded-2xl bg-white/40 backdrop-blur-xl border border-white/30 shadow-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 rounded-2xl bg-white/30 border border-white/20 font-semibold text-slate-700 hover:bg-white/50 transition-all">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="btn-primary flex-1 px-4 py-3 rounded-2xl text-white font-semibold shadow-xl disabled:opacity-60 flex items-center justify-center gap-2"
                  style={{ background:"linear-gradient(135deg,#4f46e5,#7c3aed)", boxShadow:"0 8px 24px rgba(79,70,229,.35)" }}>
                  {saving ? <><Loader2 size={15} className="animate-spin" /> Saving…</> : editingId ? "Update" : "Add Policy"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}