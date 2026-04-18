import React, { useEffect, useState, useCallback } from 'react';

const PRIORITY_COLORS: Record<string, string> = {
  CRITICAL: 'bg-red-500/20 text-red-400 border-red-500/30',
  HIGH:     'bg-orange-500/20 text-orange-400 border-orange-500/30',
  MEDIUM:   'bg-amber-500/20 text-amber-400 border-amber-500/30',
  LOW:      'bg-slate-500/20 text-slate-400 border-slate-500/30',
};

function getToken(): string {
  const key = Object.keys(localStorage).find(k => k.endsWith('-auth-token'));
  if (!key) return '';
  try { return JSON.parse(localStorage.getItem(key) || '{}').access_token || ''; }
  catch { return ''; }
}

function TaskCard({ task, onMove }: { task: any; onMove: (id: string, newStatus: string) => Promise<void> }) {
  const [moving, setMoving] = useState(false);
  const [moveError, setMoveError] = useState<string | null>(null);

  const nextStatus: Record<string, { label: string; next: string }> = {
    PENDING:     { label: '→ Start',    next: 'IN_PROGRESS' },
    IN_PROGRESS: { label: '→ Resolve',  next: 'COMPLETED' },
    COMPLETED:   { label: '✓ Done',     next: '' },
  };
  const action = nextStatus[task.status];

  const handleMove = async () => {
    if (!action?.next) return;
    setMoving(true);
    setMoveError(null);
    try {
      await onMove(task.id, action.next);
    } catch (err: any) {
      setMoveError(err.message || 'Failed to update');
    } finally {
      setMoving(false);
    }
  };

  return (
    <div className="bg-slate-950/80 p-4 rounded-xl flex flex-col gap-2 hover:bg-slate-900/80 transition-colors border border-white/5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-[9px] font-black tracking-widest text-slate-600 uppercase">#{task.id.substring(0, 6)}</span>
        <span className={`text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full border ${PRIORITY_COLORS[task.priority] || PRIORITY_COLORS['LOW']}`}>
          {task.priority}
        </span>
      </div>
      <h4 className="text-sm font-semibold text-slate-200 leading-snug">{task.title}</h4>
      {task.description && <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{task.description}</p>}
      <div className="flex items-center justify-between mt-1">
        <span className="text-[10px] text-slate-600 font-mono">
          {task.deadline ? `Due ${new Date(task.deadline).toLocaleDateString()}` : 'No deadline'}
        </span>
        {action?.next && (
          <button
            onClick={handleMove}
            disabled={moving}
            className="text-[10px] font-bold text-cyan-400 px-2 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 transition-all disabled:opacity-60 flex items-center gap-1"
          >
            {moving ? <span className="w-3 h-3 border border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" /> : null}
            {moving ? 'Updating...' : action.label}
          </button>
        )}
      </div>
      {moveError && <p className="text-[10px] text-rose-400 mt-1">⚠ {moveError}</p>}
    </div>
  );
}

export default function TasksBoard({ user }: { user: any }) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);

  const fetchTasks = useCallback(async () => {
    setError(null);
    const start = Date.now();
    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8080';
      const res = await fetch(`${API_BASE}/api/v1/admin/tasks`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      const elapsed = Date.now() - start;
      setLatencyMs(elapsed);
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      setTasks(await res.json());
    } catch (err: any) {
      setError(err.message || 'Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const moveTask = async (taskId: string, newStatus: string) => {
    const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8080';
    const start = Date.now();
    const res = await fetch(`${API_BASE}/api/v1/admin/tasks/${taskId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ status: newStatus }),
    });
    const elapsed = Date.now() - start;
    console.log(`[Admin] PATCH task ${taskId} → ${newStatus} (${res.status}) in ${elapsed}ms`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || `Server error ${res.status}`);
    }
    // Optimistic update
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  const pending    = tasks.filter(t => t.status === 'PENDING');
  const inProgress = tasks.filter(t => t.status === 'IN_PROGRESS');
  const completed  = tasks.filter(t => t.status === 'COMPLETED');

  const Column = ({ title, items, color }: { title: string; items: any[]; color: string }) => (
    <div className="flex-1 bg-slate-900/30 rounded-xl p-4 flex flex-col gap-3 border border-white/5 min-w-0">
      <div className="flex items-center justify-between border-b pb-2 border-white/5">
        <h3 className="font-black text-xs tracking-widest uppercase" style={{ color }}>{title}</h3>
        <span className="text-xs font-bold text-slate-600 bg-black/30 px-2 py-0.5 rounded-full">{items.length}</span>
      </div>
      <div className="flex flex-col gap-3 overflow-y-auto flex-1">
        {items.map(t => <TaskCard key={t.id} task={t} onMove={moveTask} />)}
        {items.length === 0 && (
          <div className="text-center p-8 text-xs text-slate-700 font-medium border-2 border-dashed border-white/5 rounded-lg">Empty</div>
        )}
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Action Board</h1>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-xs text-slate-400">Real-time officer dispatch tracker</p>
            {latencyMs !== null && (
              <span className="text-[9px] font-mono text-slate-600">
                {latencyMs > 1000 ? `⚠ ${latencyMs}ms` : `${latencyMs}ms`}
              </span>
            )}
          </div>
        </div>
        <button onClick={fetchTasks} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-slate-400" title="Refresh">
          <span className="material-symbols-outlined text-sm">sync</span>
        </button>
      </div>

      {error && (
        <div className="mb-4 flex items-start gap-3 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl">
          <span className="material-symbols-outlined text-rose-400 text-lg shrink-0">error</span>
          <div>
            <p className="text-sm text-rose-300 font-semibold">Failed to load tasks</p>
            <p className="text-xs text-rose-400/70 mt-0.5">{error}</p>
            <button onClick={fetchTasks} className="text-xs text-cyan-400 hover:underline mt-1">Retry</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex-1 flex items-center justify-center gap-3">
          <span className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-slate-400">Fetching live data from database...</span>
        </div>
      ) : (
        <div className="flex-1 flex gap-4 overflow-hidden min-h-0">
          <Column title="Pending"    items={pending}    color="#f43f5e" />
          <Column title="In Action"  items={inProgress} color="#0ea5e9" />
          <Column title="Resolved"   items={completed}  color="#10b981" />
        </div>
      )}
    </div>
  );
}
