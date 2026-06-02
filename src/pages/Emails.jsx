import { useEffect, useState } from 'react';
import { emailAPI } from '../api/services';
import {
  Send,
  RefreshCw,
  Search,
  AlertCircle,
  CheckCircle,
  Mail,
  Sparkles,
  X,
} from 'lucide-react';

const unwrap = (res) => res?.data?.data;

export default function Emails() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchEmail, setSearchEmail] = useState('');

  const [showBroadcast, setShowBroadcast] = useState(false);
  const [form, setForm] = useState({
    subject: '',
    body: '',
    recipientType: 'ALL',
  });

  const [sending, setSending] = useState(false);
  const [sendStatus, setSendStatus] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    setError('');

    try {
      const res = searchEmail.trim()
        ? await emailAPI.searchLogs(searchEmail.trim())
        : await emailAPI.getLogs();

      const data = unwrap(res);
      setLogs(Array.isArray(data) ? data : data?.content ?? []);
    } catch (e) {
      setError(`Failed to load email logs: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleBroadcast = async (e) => {
    e.preventDefault();
    setSending(true);
    setSendStatus('');

    try {
      await emailAPI.broadcast(form);

      setSendStatus('success');
      setForm({
        subject: '',
        body: '',
        recipientType: 'ALL',
      });

      setTimeout(() => {
        setShowBroadcast(false);
        setSendStatus('');
        fetchLogs();
      }, 1500);
    } catch (ex) {
      setSendStatus(
        ex.response?.data?.message || ex.message
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-8 space-y-8 min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50 to-purple-100">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div
            className="
              w-16 h-16 rounded-3xl
              bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500
              flex items-center justify-center
              shadow-2xl shadow-indigo-500/30
              hover:rotate-6 hover:scale-110
              transition-all duration-500
            "
          >
            <Mail className="text-white" size={28} />
          </div>

          <div>
            <h1
              className="
                text-4xl font-bold
                bg-gradient-to-r from-slate-800 via-indigo-700 to-purple-700
                bg-clip-text text-transparent
              "
            >
              Email Logs
            </h1>

            <p className="text-slate-500 mt-2 font-medium">
              {logs.length} records
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={fetchLogs}
            className="
              flex items-center gap-3
              px-6 py-4 rounded-3xl
              bg-white/30 backdrop-blur-2xl
              border border-white/20
              shadow-xl
              hover:scale-105 hover:-translate-y-1
              transition-all duration-300
              font-semibold text-slate-700
            "
          >
            <RefreshCw size={16} />
            Refresh
          </button>

          <button
            onClick={() => setShowBroadcast(true)}
            className="
              flex items-center gap-3
              px-6 py-4 rounded-3xl
              bg-gradient-to-r from-indigo-500 to-purple-600
              text-white font-semibold
              shadow-2xl shadow-indigo-500/30
              hover:scale-105 hover:-translate-y-1
              transition-all duration-300
            "
          >
            <Send size={16} />
            Broadcast Email
          </button>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div
          className="
            bg-red-500/10 backdrop-blur-xl
            border border-red-300/30
            text-red-700
            px-5 py-4 rounded-3xl
            shadow-lg
            flex items-center gap-3
          "
        >
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* TABLE CARD */}
      <div
        className="
          bg-white/30 backdrop-blur-3xl
          rounded-3xl border border-white/20
          shadow-[0_20px_60px_rgba(31,38,135,0.15)]
          p-6
          hover:shadow-2xl
          transition-all duration-500
        "
      >
        {/* SEARCH */}
        <div className="relative max-w-md mb-6">
          <Search
            size={18}
            className="
              absolute left-4 top-1/2 -translate-y-1/2
              text-slate-400
            "
          />

          <input
            type="email"
            placeholder="Search by email..."
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            onKeyDown={(e) =>
              e.key === 'Enter' && fetchLogs()
            }
            className="
              w-full pl-12 pr-5 py-4
              rounded-3xl
              bg-white/40 backdrop-blur-xl
              border border-white/30
              shadow-lg
              focus:outline-none focus:ring-2 focus:ring-indigo-400
            "
          />
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto rounded-3xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/20 backdrop-blur-xl">
                {[
                  'Recipient',
                  'Subject',
                  'Type',
                  'Sent At',
                  'Status',
                ].map((h) => (
                  <th
                    key={h}
                    className="
                      text-left py-5 px-5
                      text-xs font-bold
                      text-slate-600 uppercase
                      tracking-[0.15em]
                    "
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(5)].map((_, j) => (
                      <td key={j} className="py-5 px-5">
                        <div className="h-5 rounded-2xl bg-white/30 animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : logs.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="
                      py-14 text-center
                      text-slate-400 font-medium
                    "
                  >
                    No email logs found
                  </td>
                </tr>
              ) : (
                logs.map((log, i) => (
                  <tr
                    key={log.id || i}
                    className="
                      border-b border-white/10
                      hover:bg-white/20
                      transition-all duration-300
                    "
                  >
                    <td className="py-5 px-5 font-medium text-slate-700">
                      {log.recipientEmail}
                    </td>

                    <td className="py-5 px-5 text-slate-600 max-w-xs truncate">
                      {log.subject}
                    </td>

                    <td className="py-5 px-5">
                      <span
                        className="
                          px-3 py-1.5 rounded-2xl
                          bg-white/30 backdrop-blur-xl
                          border border-white/20
                          text-xs font-semibold text-slate-700
                        "
                      >
                        {log.emailType || '—'}
                      </span>
                    </td>

                    <td className="py-5 px-5 text-slate-500 text-xs font-mono">
                      {log.sentAt
                        ? new Date(log.sentAt).toLocaleString()
                        : '—'}
                    </td>

                    <td className="py-5 px-5">
                      {log.success || log.status === 'SENT' ? (
                        <span className="flex items-center gap-2 text-green-600 text-xs font-bold">
                          <CheckCircle size={14} />
                          Sent
                        </span>
                      ) : (
                        <span className="flex items-center gap-2 text-red-500 text-xs font-bold">
                          <AlertCircle size={14} />
                          Failed
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {showBroadcast && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-xl"
            onClick={() => setShowBroadcast(false)}
          />

          <div
            className="
              relative w-full max-w-2xl
              bg-white/30 backdrop-blur-3xl
              rounded-3xl border border-white/20
              shadow-[0_30px_100px_rgba(15,23,42,0.35)]
              overflow-hidden
            "
          >
            <div className="flex items-center justify-between p-8 border-b border-white/20">
              <h2 className="text-2xl font-bold flex items-center gap-3 text-slate-800">
                <Sparkles size={22} className="text-indigo-500" />
                Send Broadcast Email
              </h2>

              <button
                onClick={() => setShowBroadcast(false)}
                className="
                  p-3 rounded-2xl
                  bg-white/20 hover:bg-white/40
                  transition-all duration-300
                  hover:rotate-90
                "
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={handleBroadcast}
              className="p-8 space-y-6"
            >
              {sendStatus &&
                sendStatus !== 'success' && (
                  <div className="bg-red-500/10 border border-red-300/30 text-red-700 px-5 py-4 rounded-3xl">
                    {sendStatus}
                  </div>
                )}

              {sendStatus === 'success' && (
                <div className="bg-green-500/10 border border-green-300/30 text-green-700 px-5 py-4 rounded-3xl flex items-center gap-3">
                  <CheckCircle size={18} />
                  Email broadcast sent successfully!
                </div>
              )}

              <select
                value={form.recipientType}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    recipientType: e.target.value,
                  }))
                }
                className="w-full px-5 py-4 rounded-3xl bg-white/40 border border-white/30"
              >
                {[
                  'ALL',
                  'EMPLOYEES',
                  'ADMINS',
                  'HR',
                  'MANAGERS',
                ].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>

              <input
                required
                type="text"
                value={form.subject}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    subject: e.target.value,
                  }))
                }
                placeholder="Email subject..."
                className="w-full px-5 py-4 rounded-3xl bg-white/40 border border-white/30"
              />

              <textarea
                required
                rows={7}
                value={form.body}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    body: e.target.value,
                  }))
                }
                placeholder="Enter email message..."
                className="w-full px-5 py-4 rounded-3xl bg-white/40 border border-white/30 resize-none"
              />

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowBroadcast(false)}
                  className="
                    px-6 py-4 rounded-3xl
                    bg-white/20 border border-white/20
                    font-semibold
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={sending}
                  className="
                    flex items-center gap-3
                    px-6 py-4 rounded-3xl
                    bg-gradient-to-r from-indigo-500 to-purple-600
                    text-white font-semibold
                    shadow-xl
                  "
                >
                  <Send size={16} />
                  {sending ? 'Sending...' : 'Send Email'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}