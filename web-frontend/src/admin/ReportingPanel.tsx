import React, { useEffect, useState } from 'react';

export default function ReportingPanel({ user }: { user: any }) {
  const [recs, setRecs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8080";
        // Vertex AI generated suggestions
        const res = await fetch(`${API_BASE}/api/v1/dashboard/recommendations`);
        if (res.ok) {
          setRecs(await res.json());
        }
      } catch (e) {
        console.error("Error fetching policy reports:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchRecommendations();
  }, []);

  const handleCreateTask = async (rec: any) => {
    setProcessingId(rec.id);
    try {
      const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8080";
      const tokenKey = Object.keys(localStorage).find(k => k.endsWith('-auth-token'));
      const tokenStr = tokenKey ? localStorage.getItem(tokenKey) : null;
      let token = '';
      if (tokenStr) token = JSON.parse(tokenStr).access_token;

      // Map Vertex AI Policy to Admin Action Task
      const taskPayload = {
        title: `Policy Enforcement [${rec.ward}]`,
        description: `Implement auto-generated AI Policy: ${rec.action}`,
        priority: rec.urgency === 'High' ? 'CRITICAL' : rec.urgency === 'Medium' ? 'HIGH' : 'MEDIUM'
      };

      const res = await fetch(`${API_BASE}/api/v1/admin/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(taskPayload)
      });

      if (res.ok) {
        alert("Enforcement Task Officially Generated & Dispatched!");
        setRecs(recs.filter(r => r.id !== rec.id));
      } else {
        alert("Failed to escalate Policy to Action Grid.");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
     return <div className="p-8 text-cyan-500 animate-pulse">Computing Vertex AI Policy Analysis...</div>;
  }

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-black uppercase tracking-tight text-white">Vertex AI Policy Hub</h1>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Autonomous Strategy & Escalations</p>
      </div>

      <div className="flex-1 bg-slate-900/50 border border-white/10 rounded-xl p-6 shadow-2xl overflow-y-auto">
         <h2 className="text-xs font-black tracking-widest text-cyan-400 uppercase border-b border-white/10 pb-3 mb-6">
            Recommended Interventions (Auto-Generated via Gemini 3 Pro)
         </h2>
         
         <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {recs.length > 0 ? recs.map(r => (
               <div key={r.id} className="bg-slate-950/80 border border-white/5 rounded-xl p-5 flex flex-col gap-4 relative overflow-hidden group hover:border-cyan-500/30 transition-all">
                  
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-3xl -z-10 rounded-full group-hover:bg-cyan-500/10 transition-all"></div>
                  
                  <div className="flex justify-between items-start">
                     <span className="font-mono text-[9px] text-slate-500 font-black tracking-widest uppercase bg-white/5 px-2 py-1 rounded">SYS:{r.id}</span>
                     <span className={`text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full ${
                        r.urgency === 'High' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                        r.urgency === 'Medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                     }`}>{r.urgency} Priority</span>
                  </div>

                  <div>
                     <h3 className="text-sm font-bold text-white uppercase tracking-wide">Target Zone: {r.ward}</h3>
                     <p className="text-xs text-slate-300 mt-2 leading-relaxed">{r.action}</p>
                  </div>

                  <div className="mt-auto pt-4 border-t border-white/5 flex gap-3">
                     <button 
                       onClick={() => handleCreateTask(r)}
                       disabled={processingId === r.id}
                       className="flex-1 text-[10px] font-black tracking-widest uppercase bg-cyan-500/20 text-cyan-400 hover:bg-cyan-400 hover:text-slate-900 py-2 rounded transition-all disabled:opacity-50"
                     >
                        {processingId === r.id ? 'ESCALATING...' : 'ENFORCE POLICY'}
                     </button>
                     <button 
                       onClick={() => setRecs(recs.filter(rec => rec.id !== r.id))}
                       className="text-[10px] font-black tracking-widest uppercase text-slate-500 hover:text-rose-400 py-2 px-3 rounded transition-all"
                     >
                        IGNORE
                     </button>
                  </div>
               </div>
            )) : (
              <div className="col-span-full text-center py-12 text-slate-500 font-bold uppercase tracking-widest text-xs">
                 No policy escalations detected from the Neural Engine.
              </div>
            )}
         </div>
      </div>
    </div>
  );
}
