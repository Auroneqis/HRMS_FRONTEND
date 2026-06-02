import { useEffect, useState } from 'react';
import { adminAPI } from '../api/services';
import {
  Plus,
  X,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Shield,
  Users,
  Sparkles,
  Loader2,
} from 'lucide-react';

const unwrap = (res) => res?.data?.data;

export default function Admins() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchAdmins = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminAPI.getAll({ page: 0, size: 50 });
      const data = unwrap(res);
      setAdmins(Array.isArray(data) ? data : data?.content ?? []);
    } catch (e) {
      setError(`Failed to load admins: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();

    const fd = new FormData(e.currentTarget);

    const payload = {
      firstName: (fd.get('firstName') || '').toString().trim(),
      lastName: (fd.get('lastName') || '').toString().trim(),
      emailId: (fd.get('emailId') || '').toString().trim(),
      password: (fd.get('password') || '').toString(),
      phone: (fd.get('phone') || '').toString().trim(),
      department: (fd.get('department') || '').toString().trim(),
      role: (fd.get('role') || 'ADMIN').toString(),
    };

    setSaving(true);
    setFormError('');

    try {
      await adminAPI.register(payload);
      setShowModal(false);
      fetchAdmins();
    } catch (e) {
      setFormError(e.response?.data?.message || e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      await adminAPI.toggleActive(id);
      fetchAdmins();
    } catch (e) {
      alert(e.response?.data?.message || e.message);
    }
  };

  const handleDelete = async (admin) => {
    if (!confirm(`Delete admin ${admin.fullName || admin.emailId}?`)) return;

    try {
      await adminAPI.delete(admin.id);
      fetchAdmins();
    } catch (e) {
      alert(e.response?.data?.message || e.message);
    }
  };

  const Field = ({ label, name, type = 'text', options }) => (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        {label}
      </label>

      {options ? (
        <select
          name={name}
          className="
            w-full px-4 py-3 rounded-2xl
            bg-white/40 backdrop-blur-xl
            border border-white/30
            shadow-lg
            text-slate-700
            focus:outline-none focus:ring-2 focus:ring-indigo-500
            transition-all duration-300
            hover:scale-[1.01]
          "
        >
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          className="
            w-full px-4 py-3 rounded-2xl
            bg-white/40 backdrop-blur-xl
            border border-white/30
            shadow-lg
            text-slate-700
            focus:outline-none focus:ring-2 focus:ring-indigo-500
            transition-all duration-300
            hover:scale-[1.01]
          "
        />
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div
            className="
              w-16 h-16 rounded-3xl
              bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500
              flex items-center justify-center
              shadow-2xl shadow-indigo-500/30
            "
          >
            <Shield className="text-white" size={28} />
          </div>

          <div>
            <h1
              className="
                text-4xl font-bold
                bg-gradient-to-r from-slate-800 via-indigo-700 to-purple-700
                bg-clip-text text-transparent
              "
            >
              Admin Users
            </h1>

            <p className="text-slate-500 mt-2 font-medium">
              {admins.length} administrators
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setFormError('');
            setShowModal(true);
          }}
          className="
            inline-flex items-center gap-3
            px-6 py-4 rounded-3xl
            bg-gradient-to-r from-indigo-500 to-purple-600
            text-white font-semibold
            shadow-2xl shadow-indigo-500/30
            hover:scale-105 hover:-translate-y-1
            transition-all duration-300
          "
        >
          <Plus size={18} />
          Add Admin
        </button>
      </div>

      {/* Error */}
      {error && (
        <div
          className="
            bg-red-500/10
            backdrop-blur-xl
            border border-red-300/30
            rounded-3xl
            px-6 py-4
            text-red-700
            font-medium
            shadow-lg
          "
        >
          {error}
        </div>
      )}

      {/* Table */}
      <div
        className="
          bg-white/30
          backdrop-blur-3xl
          rounded-3xl
          border border-white/20
          shadow-[0_20px_60px_rgba(31,38,135,0.15)]
          overflow-hidden
        "
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr
                className="
                  bg-white/20
                  backdrop-blur-xl
                  border-b border-white/20
                "
              >
                {['Name', 'Email', 'Role', 'Department', 'Status', 'Actions'].map(
                  (h) => (
                    <th
                      key={h}
                      className="
                        px-6 py-5
                        text-left
                        text-xs
                        font-bold
                        uppercase
                        tracking-[0.15em]
                        text-slate-600
                      "
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(6)].map((_, j) => (
                      <td key={j} className="px-6 py-5">
                        <div
                          className="
                            h-5 rounded-2xl
                            bg-white/40
                            animate-pulse
                          "
                        />
                      </td>
                    ))}
                  </tr>
                ))
              ) : admins.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <Users size={40} className="text-slate-400" />
                      <p className="text-slate-500 font-medium">
                        No admin users found
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                admins.map((admin) => (
                  <tr
                    key={admin.id}
                    className="
                      border-b border-white/10
                      hover:bg-white/20
                      transition-all duration-300
                    "
                  >
                    <td className="px-6 py-5 font-semibold text-slate-800">
                      {admin.fullName ||
                        `${admin.firstName} ${admin.lastName}`}
                    </td>

                    <td className="px-6 py-5 text-slate-600">
                      {admin.emailId}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className="
                          px-4 py-2 rounded-2xl
                          bg-indigo-500/10
                          border border-indigo-200/30
                          text-indigo-700
                          text-xs font-bold
                        "
                      >
                        {admin.role}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-slate-600">
                      {admin.department || '—'}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`
                          px-4 py-2 rounded-2xl text-xs font-bold
                          ${
                            admin.active
                              ? 'bg-emerald-500/10 text-emerald-700 border border-emerald-300/30'
                              : 'bg-slate-500/10 text-slate-600 border border-slate-300/30'
                          }
                        `}
                      >
                        {admin.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleToggle(admin.id)}
                          className="
                            p-3 rounded-2xl
                            bg-white/20
                            hover:bg-indigo-500/20
                            transition-all duration-300
                            hover:scale-110
                          "
                        >
                          {admin.active ? (
                            <ToggleRight
                              size={20}
                              className="text-emerald-500"
                            />
                          ) : (
                            <ToggleLeft
                              size={20}
                              className="text-slate-500"
                            />
                          )}
                        </button>

                        <button
                          onClick={() => handleDelete(admin)}
                          className="
                            p-3 rounded-2xl
                            bg-white/20
                            hover:bg-red-500/20
                            transition-all duration-300
                            hover:scale-110
                          "
                        >
                          <Trash2
                            size={18}
                            className="text-red-500"
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl"
            onClick={() => setShowModal(false)}
          />

          <div
            className="
              relative w-full max-w-2xl
              bg-white/30
              backdrop-blur-3xl
              rounded-3xl
              border border-white/20
              shadow-[0_25px_80px_rgba(15,23,42,0.35)]
              overflow-hidden
            "
          >
            <div className="flex items-center justify-between px-8 py-6 border-b border-white/20">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  Add Admin User
                </h2>

                <p className="text-slate-500 mt-1">
                  Create administrator account
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="
                  p-3 rounded-2xl
                  bg-white/20
                  hover:bg-white/40
                  transition-all duration-300
                  hover:rotate-90
                "
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-8 space-y-6">
              {formError && (
                <div
                  className="
                    bg-red-500/10
                    border border-red-300/30
                    rounded-2xl
                    px-5 py-4
                    text-red-700
                  "
                >
                  {formError}
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-5">
                <Field label="First Name *" name="firstName" />
                <Field label="Last Name *" name="lastName" />
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <Field label="Email *" name="emailId" type="email" />
                <Field label="Password *" name="password" type="password" />
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <Field label="Contact Number" name="phone" />
                <Field label="Department" name="department" />
              </div>

              <Field
                label="Role"
                name="role"
                options={['ADMIN', 'HR', 'MANAGER']}
              />

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="
                    px-6 py-3 rounded-2xl
                    bg-white/30
                    border border-white/20
                    font-semibold
                    text-slate-700
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="
                    px-6 py-3 rounded-2xl
                    bg-gradient-to-r from-indigo-500 to-purple-600
                    text-white font-semibold
                    shadow-xl
                    hover:scale-105
                    transition-all duration-300
                  "
                >
                  {saving ? (
                    <span className="flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin" />
                      Creating...
                    </span>
                  ) : (
                    'Create Admin'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}