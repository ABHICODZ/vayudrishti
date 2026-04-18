import React, { useEffect, useState, useCallback } from 'react';

interface Complaint {
  id: string;
  ward: string;
  category: string;
  description: string;
  status: string;
  created_at: string;
  resolved_at: string | null;
  internal_notes: string | null;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  NEW:           { label: 'New',          color: 'text-slate-300',   bg: 'bg-slate-500/20',  border: 'border-slate-500/30' },
  UNDER_REVIEW:  { label: 'Under Review', color: 'text-amber-300',   bg: 'bg-amber-500/20',  border: 'border-amber-500/30' },
  IN_ACTION:     { label: 'In Action',    color: 'text-cyan-300',    bg: 'bg-cyan-500/20',   border: 'border-cyan-500/30' },
  RESOLVED:      { label: 'Resolved',     color: 'text-emerald-300', bg: 'bg-emerald-500/20',border: 'border-emerald-500/30' },
  REJECTED:      { label: 'Rejected',     color: 'text-rose-300',    bg: 'bg-rose-500/20',   border: 'border-rose-500/30' },
};

interface MyComplaintsProps {
  userProfile: any;
}

export default function MyComplaints({ userProfile }: MyComplaintsProps) {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const getToken = (): string => {
    const tokenKey = Object.keys(localStorage).find(k => k.endsWith('-auth-token'));
    if (!tokenKey) return '';
    try { return JSON.parse(localStorage.getItem(tokenKey) || '{}').access_token || ''; }
    catch { return ''; }
  };

  const fetchMyComplaints = useCallback(async () => {
    setError(null);
    const start = Date.now();
    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8080';
      const token = getToken();
      const res = await fetch(`${API_BASE}/api/v1/users/complaints`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const elapsed = Date.now() - start;
      setLatencyMs(elapsed);
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      setComplaints(await res.json());
    } catch (err: any) {
      setError(err.message || 'Failed to load your reports.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!userProfile) return;
    fetchMyComplaints();
    const interval = setInterval(fetchMyComplaints, 30000); // Live poll every 30s
    return () => clearInterval(interval);
  }, [userProfile, fetchMyComplaints]);

  if (!userProfile) return null;

  return (
    <div className="mt-6 bg-slate-900/30 rounded-2xl border border-white/5 overflow-hidden">
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-cyan-400 text-[18px]">receipt_long</span>
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">My Reports</span>
        </div>
        {latencyMs !== null && latencyMs > 500 && (
          <span className="text-[9px] text-slate-500 font-mono">{latencyMs}ms</span>
        )}
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-[9px] text-slate-500 uppercase tracking-widest">Live</span>
        </div>
      </div>

      {loading ? (
        <div className="p-6 flex items-center gap-3">
          <span className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin shrink-0" />
          <span className="text-xs text-slate-400">Fetching your reports...</span>
        </div>
      ) : error ? (
        <div className="p-4 flex items-start gap-3">
          <span className="material-symbols-outlined text-rose-400 text-sm shrink-0">error</span>
          <div>
            <p className="text-xs text-rose-300 font-medium">Failed to load reports</p>
            <p className="text-[10px] text-slate-500 mt-0.5">{error}</p>
            <button onClick={fetchMyComplaints} className="text-[10px] text-cyan-400 hover:underline mt-1">
              Retry
            </button>
          </div>
        </div>
      ) : complaints.length === 0 ? (
        <div className="p-6 text-center">
          <p className="text-xs text-slate-500">No reports filed yet.</p>
          <p className="text-[10px] text-slate-600 mt-1">Use the Biomass button below to report an incident.</p>
        </div>
      ) : (
        <div className="divide-y divide-white/5 max-h-48 overflow-y-auto">
          {complaints.map(c => {
            const cfg = STATUS_CONFIG[c.status] || STATUS_CONFIG['NEW'];
            const isExpanded = expanded === c.id;
            return (
              <div
                key={c.id}
                className="p-4 hover:bg-white/[0.02] transition-colors cursor-pointer"
                onClick={() => setExpanded(isExpanded ? null : c.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-mono text-[9px] text-slate-500 shrink-0">
                      {c.id.substring(0, 8).toUpperCase()}
                    </span>
                    <span className="text-xs text-slate-300 truncate font-medium">{c.category}</span>
                  </div>
                  <span className={`shrink-0 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                    {cfg.label}
                  </span>
                </div>

                {isExpanded && (
                  <div className="mt-3 space-y-2">
                    <p className="text-[11px] text-slate-400 leading-relaxed">{c.description}</p>
                    <div className="flex items-center gap-4 text-[10px] text-slate-500">
                      <span>Ward: <span className="text-slate-300">{c.ward}</span></span>
                      <span>Filed: <span className="text-slate-300">{new Date(c.created_at).toLocaleDateString()}</span></span>
                    </div>
                    {c.internal_notes && (
                      <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-lg p-3">
                        <p className="text-[9px] font-black text-cyan-500 uppercase tracking-widest mb-1">Admin Note</p>
                        <p className="text-[11px] text-slate-300">{c.internal_notes}</p>
                      </div>
                    )}
                    {c.resolved_at && (
                      <p className="text-[10px] text-emerald-400">
                        ✓ Resolved: {new Date(c.resolved_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
