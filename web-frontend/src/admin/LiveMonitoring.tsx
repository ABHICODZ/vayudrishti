import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '../supabaseClient';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function LiveMonitoring({ user }: { user: any }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const layerGroup = useRef<L.LayerGroup | null>(null);
  
  const [wards, setWards] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Initial Map Setup (Imperative - avoids all React Context issues)
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    mapInstance.current = L.map(mapRef.current, {
      center: [28.6139, 77.2090],
      zoom: 11,
      zoomControl: false
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; CARTO'
    }).addTo(mapInstance.current);

    layerGroup.current = L.layerGroup().addTo(mapInstance.current);

    return () => {
      mapInstance.current?.remove();
      mapInstance.current = null;
    };
  }, []);

  // 2. Data Fetching
  const fetchData = async () => {
     try {
       const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";
       
       const wRes = await fetch(`${API_BASE}/api/v1/dashboard/wards?level=ward`);
       if (wRes.ok) {
         const wData = await wRes.json();
         setWards(wData);
       }

       const { data, error } = await supabase
         .from('alerts')
         .select('*')
         .eq('is_acknowledged', false);
       
       if (!error && data) setAlerts(data);
     } catch (err) {
       console.error("LiveMonitoring fetch exception:", err);
     } finally {
       setLoading(false);
     }
  };

  useEffect(() => {
    fetchData();
    const inv = setInterval(fetchData, 30000);
    return () => clearInterval(inv);
  }, []);

  const prevData = useRef(JSON.stringify({ wards, alerts }));

  // 3. Layer Management (Imperative Update)
  useEffect(() => {
    if (!layerGroup.current || !mapInstance.current) return;
    
    // Performance Guard: Only redraw if data has meaningfully changed
    const currentData = JSON.stringify({ wards, alerts });
    if (currentData === prevData.current) return;
    prevData.current = currentData;
    
    console.log("Tactical Grid: Redrawing layers...");
    layerGroup.current.clearLayers();

    // Draw Wards
    wards.forEach(w => {
       const color = w.aqi > 200 ? '#ef4444' : w.aqi > 100 ? '#eab308' : '#22c55e';
       const marker = L.circleMarker([w.lat, w.lon], {
         radius: 6,
         color: color,
         fillColor: color,
         fillOpacity: 0.6,
         weight: 1
       });
       marker.bindTooltip(`${w.name} (AQI: ${Math.round(w.aqi)})`);
       layerGroup.current?.addLayer(marker);
    });

    // Draw Alerts
    alerts.forEach(a => {
       const targetWard = wards.find(w => w.name === a.ward);
       if (targetWard) {
         const alertCircle = L.circleMarker([targetWard.lat, targetWard.lon], {
           radius: 20,
           color: '#f43f5e',
           fill: false,
           weight: 2,
           dashArray: '5,5'
         });
         
         const divIcon = L.divIcon({
            className: 'custom-alert-icon',
            html: `<div style="background:#e11d48; color:white; font-size:8px; font-weight:900; padding:2px 6px; border-radius:10px; border:1px solid #fff; white-space:nowrap; animation: pulse 2s infinite;">CRITICAL: ${a.trigger_type}</div>`,
            iconSize: [100, 20],
            iconAnchor: [50, 30]
         });
         
         L.marker([targetWard.lat, targetWard.lon], { icon: divIcon }).addTo(layerGroup.current!);
         layerGroup.current?.addLayer(alertCircle);
       }
    });
  }, [wards, alerts]);

  return (
    <div className="h-full flex flex-col relative bg-[#0b1120] overflow-hidden">
       {/* Map Div - Pure HTML target for Leaflet */}
       <div ref={mapRef} className="absolute inset-0 z-0 bg-[#0b1120]" />
       
       {/* Strategic HUD Overlays */}
       <div className="absolute top-8 left-8 z-[1000] pointer-events-none">
          <div className="p-4 bg-slate-950/80 backdrop-blur-md rounded-lg border border-white/10 shadow-2xl">
            <h1 className="text-xl font-black uppercase tracking-tighter text-white">ATMOSPHERIC COMMAND</h1>
            <div className="flex items-center gap-2 mt-2">
               <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
               <span className="font-bold tracking-[0.2em] text-[8px] text-slate-400 uppercase">System Integrity: ACTIVE</span>
            </div>
          </div>
       </div>

       {/* Tactical Legend */}
       <div className="absolute bottom-10 right-10 z-[1000] pointer-events-none">
          <div className="p-4 bg-slate-950/80 backdrop-blur-md rounded-xl border border-white/10 shadow-2xl">
             <div className="text-[9px] font-black tracking-widest text-slate-500 uppercase mb-3">AQI SCALE</div>
             <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                   <div className="w-3 h-3 rounded-full bg-[#22c55e]" />
                   <span className="text-[10px] font-bold text-slate-300">GOOD (0-50)</span>
                </div>
                <div className="flex items-center gap-3">
                   <div className="w-3 h-3 rounded-full bg-[#eab308]" />
                   <span className="text-[10px] font-bold text-slate-300">MODERATE (51-150)</span>
                </div>
                <div className="flex items-center gap-3">
                   <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
                   <span className="text-[10px] font-bold text-slate-300">UNHEALTHY (151+)</span>
                </div>
             </div>
          </div>
       </div>

       {/* Map Controls */}
       <div className="absolute bottom-10 left-10 z-[1000] flex flex-col gap-2">
          <button 
            onClick={() => mapInstance.current?.zoomIn()}
            className="w-10 h-10 bg-slate-950/80 backdrop-blur-md border border-white/10 text-white rounded-lg hover:bg-cyan-500/20 transition-all flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-sm">add</span>
          </button>
          <button 
            onClick={() => mapInstance.current?.zoomOut()}
            className="w-10 h-10 bg-slate-950/80 backdrop-blur-md border border-white/10 text-white rounded-lg hover:bg-cyan-500/20 transition-all flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-sm">remove</span>
          </button>
          <button 
            onClick={fetchData}
            className="h-10 px-4 bg-slate-950/80 backdrop-blur-md border border-white/10 text-cyan-400 text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-cyan-500/20 transition-all flex items-center justify-center gap-2 mt-2"
          >
            <span className={`material-symbols-outlined text-sm ${loading ? 'animate-spin' : ''}`}>sync</span>
            {loading ? 'SYNCING...' : 'REFRESH'}
          </button>
       </div>

       <div className="absolute top-8 right-8 z-[1000] w-80 pointer-events-auto">
          <div className="p-6 bg-slate-950/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
             <div className="flex justify-between items-center mb-6">
               <h3 className="text-xs font-black tracking-widest text-rose-400 uppercase">System Alerts</h3>
               <span className="bg-rose-500/20 text-rose-400 px-3 py-1 rounded-full text-[10px] font-bold border border-rose-500/20">
                 {alerts.length} ACTIVE
               </span>
             </div>
             
             <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {alerts.length > 0 ? alerts.map(a => (
                   <div key={a.id} className="group p-4 bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 rounded-xl transition-all cursor-pointer">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-black text-white text-xs uppercase tracking-tight">{a.ward}</span>
                        <span className="text-[10px] text-slate-500">{new Date(a.created_at).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-[10px] text-rose-300 font-bold uppercase tracking-wider bg-rose-500/10 px-2 py-1 rounded inline-block">
                        {a.trigger_type.replace('_', ' ')}
                      </p>
                   </div>
                )) : (
                  <div className="text-center py-12">
                    <span className="material-symbols-outlined text-slate-700 text-4xl mb-2">task_alt</span>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">All zones clear</p>
                  </div>
                )}
             </div>
          </div>
       </div>

       <style>{`
          @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.05); opacity: 0.8; }
            100% { transform: scale(1); opacity: 1; }
          }
          .custom-alert-icon {
            background: transparent !important;
            border: none !important;
          }
       `}</style>
    </div>
  );
}
