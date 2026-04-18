import React, { useEffect, useState, useCallback } from 'react';

const STATUS_OPTIONS = ['NEW', 'UNDER_REVIEW', 'IN_ACTION', 'RESOLVED', 'REJECTED'];
const STATUS_COLORS: Record<string, string> = {
  NEW:          'bg-slate-500/10 text-slate-300 border-slate-500/30',
  UNDER_REVIEW: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  IN_ACTION:    'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
  RESOLVED:     'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  REJECTED:     'bg-rose-500/10 text-rose-400 border-rose-500/30',
};

function getToken(): string {
  const key = Object.keys(localStorage).find(k => k.endsWith('-auth-token'));
  if (!key) return '';
  try { return JSON.parse(localStorage.getItem(key) || '{}').access_token || ''; }
  catch { return ''; }
}

interface UpdateDrawerProps {
  complaint: any;
  onClose: () => void;
  onUpdated: () => void;
}

function UpdateDrawer({ complaint, onClose, onUpdated }: UpdateDrawerProps) {
  const [status, setStatus] = useState(complaint.status);
  const [notes, setNotes] = useState(complaint.internal_notes || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    setSaving(true);
    setError(null);
    const start = Date.now();
    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8080';
      const res = await fetch(`${API_BASE}/api/v1/admin/complaints/${complaint.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ status, internal_notes: notes }),
      });
      const elapsed = Date.now() - start;
      console.log(`[Admin] PATCH complaint ${complaint.id} → ${res.status} in ${elapsed}ms`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `Server error ${res.status}`);
      }
      onUpdated();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update. Check connection.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md mx-4 p-6 shadow-2xl flex flex-col gap-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white">Update Complaint</h3>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5">{complaint.id.substring(0, 8).toUpperCase()}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400"><span className="material-symbols-outlined text-sm">close</span></button>
        </div>

        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Status</label>
          <div className="grid grid-cols-3 gap-2">
            {STATUS_OPTIONS.map(s => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`text-[10px] font-bold uppercase tracking-widest py-2 px-3 rounded-lg border transition-all ${status === s ? STATUS_COLORS[s] + ' ring-1 ring-offset-1 ring-current ring-offset-slate-900' : 'bg-transparent text-slate-500 border-white/5 hover:border-white/20'}`}
              >
                {s.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Internal Note (visible to citizen)</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={3}
            placeholder="Add a note for the citizen, e.g., 'Investigation team dispatched to the area.'"
            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 transition-colors resize-none"
          />
        </div>

        {error && (
          <div className="flex items-start gap-2 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl">
            <span className="material-symbols-outlined text-rose-400 text-sm shrink-0">error</span>
            <p className="text-xs text-rose-300">{error}</p>
          </div>
        )}

        <button
          onClick={save}
          disabled={saving}
          className="w-full py-3 bg-cyan-500/20 hover:bg-cyan-500/30 disabled:opacity-50 text-cyan-400 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
        >
          {saving ? <><span className="w-4 h-4 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" /> Saving to database...</> : 'Save Update'}
        </button>
      </div>
    </div>
  );
}

export default function ComplaintsPanel({ user }: { user: any }) {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [selected, setSelected] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchComplaints = useCallback(async () => {
    setError(null);
    const start = Date.now();
    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8080';
      const params = statusFilter ? `?status=${statusFilter}` : '';
      const res = await fetch(`${API_BASE}/api/v1/admin/complaints${params}`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      const elapsed = Date.now() - start;
      setLatencyMs(elapsed);
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      setComplaints(await res.json());
    } catch (err: any) {
      setError(err.message || 'Failed to load complaints.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { fetchComplaints(); }, [fetchComplaints]);

  return (
    <div className="h-full flex flex-col">
      {selected && (
        <UpdateDrawer
          complaint={selected}
          onClose={() => setSelected(null)}
          onUpdated={() => { setSelected(null); fetchComplaints(); }}
        />
      )}

      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Citizen Complaints</h1>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-xs text-slate-400">Regional Grievance Network</p>
            {latencyMs !== null && (
              <span className="text-[9px] font-mono text-slate-600">
                {latencyMs > 1000 ? `⚠ ${latencyMs}ms (slow)` : `${latencyMs}ms`}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {['', 'NEW', 'UNDER_REVIEW', 'IN_ACTION', 'RESOLVED'].map(s => (
            <button
              key={s || 'ALL'}
              onClick={() => setStatusFilter(s)}
              className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border transition-all ${statusFilter === s ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' : 'text-slate-500 border-white/5 hover:border-white/20'}`}
            >
              {s || 'All'}
            </button>
          ))}
          <button
            onClick={fetchComplaints}
            className="p-1.5 hover:bg-white/5 rounded-lg transition-colors text-slate-400"
            title="Refresh"
          >
            <span className="material-symbols-outlined text-sm">sync</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 flex items-start gap-3 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl">
          <span className="material-symbols-outlined text-rose-400 text-lg shrink-0">error</span>
          <div>
            <p className="text-sm text-rose-300 font-semibold">Failed to load complaints</p>
            <p className="text-xs text-rose-400/70 mt-0.5">{error}</p>
            <button onClick={fetchComplaints} className="text-xs text-cyan-400 hover:underline mt-1">Retry</button>
          </div>
        </div>
      )}

      <div className="flex-1 bg-slate-900/30 border border-white/5 rounded-xl overflow-hidden flex flex-col">
        {loading ? (
          <div className="flex-1 flex items-center justify-center gap-3">
            <span className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-slate-400">Fetching live data from database...</span>
          </div>
        ) : (
          <div className="overflow-x-auto overflow-y-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/80 border-b border-white/5 text-[10px] uppercase font-black tracking-widest text-slate-500 sticky top-0">
                  <th className="p-4">Ref ID</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Ward</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-white/5">
                {complaints.length > 0 ? complaints.map(c => (
                  <tr key={c.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="p-4 font-mono text-[10px] text-slate-400">{c.id.substring(0, 8).toUpperCase()}</td>
                    <td className="p-4 text-slate-300 text-xs">{new Date(c.created_at).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span className="bg-white/5 border border-white/10 px-2 py-1 rounded text-[10px] font-bold text-slate-200 uppercase">{c.ward}</span>
                    </td>
                    <td className="p-4 text-slate-300 text-sm font-medium">{c.category}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border ${STATUS_COLORS[c.status] || STATUS_COLORS['NEW']}`}>
                        {c.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => setSelected(c)}
                        className="text-xs font-bold bg-cyan-500/10 text-cyan-400 px-3 py-1.5 rounded-lg hover:bg-cyan-500/20 transition-all border border-cyan-500/20"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-slate-600 text-sm font-medium">
                      No complaints found{statusFilter ? ` with status "${statusFilter}"` : ''}.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
