import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

// Panels
import ComplaintsPanel from './ComplaintsPanel';
import TasksBoard from './TasksBoard';
import LiveMonitoring from './LiveMonitoring';
import ReportingPanel from './ReportingPanel';

export default function AdminGate() {
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        window.location.href = '/';
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      console.log("AdminGate: Profile check result:", profile);
      if (error) console.error("AdminGate: DB error:", error);

      if (profile && (
          profile.role?.toLowerCase() === 'admin' || 
          profile.role?.toLowerCase() === 'officer'
      )) {
        setUserProfile(profile);
      } else {
        const foundRole = profile?.role || 'NOT FOUND';
        console.warn(`AdminGate: Unauthorized role: '${foundRole}'`);
        window.alert(`ACCESS DENIED: Required security clearance not found.\n\nYour User ID: ${session.user.id}\nYour Role: '${foundRole}'\n\nIf role is 'NOT FOUND', you need to manually insert a row in the 'profiles' table with this User ID.`);
        window.location.href = '/';
      }
      setLoading(false);
    }
    
    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen bg-[#0c0e12] flex items-center justify-center font-sans">
        <div className="text-cyan-400 animate-pulse tracking-widest uppercase font-bold text-sm">Verifying Clearance...</div>
      </div>
    );
  }

  if (!userProfile) return null;

  return (
    <div className="h-screen w-screen bg-[#0c0e12] text-slate-200 font-sans flex overflow-hidden">
      {/* Sidebar Command Center */}
      <aside className="w-64 bg-slate-900 border-r border-white/5 flex flex-col p-6 z-50 shrink-0">
        <div className="mb-10">
          <h2 className="text-xl font-bold tracking-tighter text-white">VayuDrishti</h2>
          <p className="text-[10px] text-cyan-500 tracking-[0.3em] font-black uppercase">{userProfile.role} CONSOLE</p>
        </div>

        <nav className="flex-1 flex flex-col gap-2">
          <Link to="/admin" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-white/5 transition-all text-sm font-semibold text-slate-400 hover:text-white group">
            <span className="material-symbols-outlined text-[20px] group-hover:text-cyan-400">dashboard</span>
            Monitoring
          </Link>
          <Link to="/admin/complaints" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-white/5 transition-all text-sm font-semibold text-slate-400 hover:text-white group">
            <span className="material-symbols-outlined text-[20px] group-hover:text-cyan-400">chat_bubble</span>
            Complaints
          </Link>
          <Link to="/admin/tasks" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-white/5 transition-all text-sm font-semibold text-slate-400 hover:text-white group">
            <span className="material-symbols-outlined text-[20px] group-hover:text-cyan-400">task_alt</span>
            Tasks Board
          </Link>
          <Link to="/admin/reports" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-white/5 transition-all text-sm font-semibold text-slate-400 hover:text-white group">
            <span className="material-symbols-outlined text-[20px] group-hover:text-cyan-400">query_stats</span>
            Policy Hub
          </Link>
        </nav>
        
        <div className="mt-auto pt-6 border-t border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-cyan-400 font-bold border border-white/5">
              {userProfile.username?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="flex flex-col min-w-0">
               <span className="text-sm font-bold text-white truncate">{userProfile.username?.split('@')[0]}</span>
               <span className="text-[10px] text-slate-500 uppercase tracking-widest">{userProfile.role}</span>
            </div>
          </div>
          <button 
            onClick={() => { supabase.auth.signOut().then(() => window.location.href = '/') }}
            className="w-full py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-[10px] font-bold uppercase tracking-widest rounded transition-all"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Dynamic Content Panel */}
      <main className="flex-1 overflow-auto relative">
        <Routes>
          <Route path="/" element={<LiveMonitoring user={userProfile} />} />
          <Route path="/complaints" element={<div className="p-8"><ComplaintsPanel user={userProfile} /></div>} />
          <Route path="/tasks" element={<div className="p-8"><TasksBoard user={userProfile} /></div>} />
          <Route path="/reports" element={<div className="p-8"><ReportingPanel user={userProfile} /></div>} />
          <Route path="*" element={<div className="p-12 text-rose-500 font-bold uppercase">404: Not Found</div>} />
        </Routes>
      </main>
    </div>
  );
}
