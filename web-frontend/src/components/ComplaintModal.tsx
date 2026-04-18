import React, { useState } from 'react';

interface ComplaintModalProps {
  ward: { name: string; lat: number; lon: number } | null;
  userProfile: any;
  onClose: () => void;
}

export default function ComplaintModal({ ward, userProfile, onClose }: ComplaintModalProps) {
  const [category, setCategory] = useState('Biomass Burning');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<{ id: string } | null>(null);

  const getToken = (): string => {
    const tokenKey = Object.keys(localStorage).find(k => k.endsWith('-auth-token'));
    if (!tokenKey) return '';
    try { return JSON.parse(localStorage.getItem(tokenKey) || '{}').access_token || ''; }
    catch { return ''; }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) { setError('Please provide a description of the issue.'); return; }
    
    // Check if user is logged in
    if (!userProfile || !userProfile.id) {
      setError('You must be logged in to submit a complaint. Please sign in first.');
      return;
    }

    setLoading(true);
    setError(null);
    const start = Date.now();

    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8080';
      const token = getToken();
      
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }

      // Ensure citizen_id is a valid UUID string
      const citizenId = typeof userProfile.id === 'string' ? userProfile.id : String(userProfile.id);

      const payload = {
        citizen_id: citizenId,
        ward: ward?.name || 'Unknown',
        category,
        description: description.trim(),
        location_lat: ward?.lat || 28.6139,
        location_lon: ward?.lon || 77.2090,
        media_url: null,
      };

      console.log('[ComplaintModal] Submitting payload:', { ...payload, citizen_id: citizenId.substring(0, 8) + '...' });

      const res = await fetch(`${API_BASE}/api/v1/admin/complaints/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const elapsed = Date.now() - start;
      console.log(`[ComplaintModal] POST /complaints → ${res.status} in ${elapsed}ms`);

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.error('[ComplaintModal] Error response:', errData);
        throw new Error(errData.detail || `Server error ${res.status}`);
      }

      const data = await res.json();
      setSubmitted({ id: data.id });
    } catch (err: any) {
      console.error('[ComplaintModal] Submit error:', err);
      setError(err.message || 'Failed to submit. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative bg-slate-900 border border-white/10 rounded-2xl w-full max-w-lg mx-4 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="text-lg font-bold text-white">File Incident Report</h2>
            <p className="text-xs text-slate-400 mt-0.5">Ward: <span className="text-cyan-400 font-semibold">{ward?.name}</span></p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white">
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>

        {submitted ? (
          /* Success State */
          <div className="p-8 flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-emerald-400 text-3xl">check_circle</span>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Report Submitted</h3>
              <p className="text-slate-400 text-sm mt-1">Your incident has been logged and is now in the admin review queue.</p>
            </div>
            <div className="w-full bg-slate-950 rounded-xl p-4 border border-white/5">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Reference ID</p>
              <p className="font-mono text-cyan-400 font-bold text-sm">{submitted.id.substring(0, 8).toUpperCase()}-{submitted.id.substring(8, 16).toUpperCase()}</p>
              <p className="text-[10px] text-slate-500 mt-2">Track this in "My Reports" below the map.</p>
            </div>
            <button onClick={onClose} className="w-full py-3 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 font-bold text-sm rounded-xl transition-colors">
              Close
            </button>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Incident Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
              >
                <option>Biomass Burning</option>
                <option>Construction Dust</option>
                <option>Industrial Emission</option>
                <option>Vehicle Pollution</option>
                <option>Garbage Burning</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Description</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe the incident — location, severity, any visible sources..."
                rows={4}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 transition-colors resize-none"
              />
            </div>

            {/* Error Banner */}
            {error && (
              <div className="flex items-start gap-3 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl">
                <span className="material-symbols-outlined text-rose-400 text-lg shrink-0">error</span>
                <p className="text-sm text-rose-300">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting to database...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg">local_fire_department</span>
                  Submit Incident Report
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
