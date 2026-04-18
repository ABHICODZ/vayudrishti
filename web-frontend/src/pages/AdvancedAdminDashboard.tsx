import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import LeafletMap from '../components/LeafletMap';
import AIAgentsCouncil from './AIAgentsCouncil';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface AdminDashboardProps {
  userProfile: any;
  onBack: () => void;
}

export default function AdvancedAdminDashboard({ userProfile, onBack }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'agents' | 'analytics' | 'operations'>('overview');
  const [wards, setWards] = useState<any[]>([]);
  const [selectedWard, setSelectedWard] = useState<any>(null);
  const [stats, setStats] = useState({
    totalComplaints: 0,
    activeTasks: 0,
    criticalZones: 0,
    avgAQI: 0
  });

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8080';
      const wardsRes = await fetch(`${API_BASE}/api/v1/dashboard/wards?level=ward`);
      const wardsData = await wardsRes.json();
      setWards(wardsData);
      
      const avgAQI = Math.round(wardsData.reduce((acc: number, w: any) => acc + w.aqi, 0) / wardsData.length);
      const criticalZones = wardsData.filter((w: any) => w.aqi > 300).length;
      
      setStats({
        totalComplaints: 234,
        activeTasks: 45,
        criticalZones,
        avgAQI
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  };

  const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6'];
  
  const aqiDistribution = [
    { name: 'Hazardous', value: wards.filter(w => w.aqi > 300).length, color: '#ef4444' },
    { name: 'Unhealthy', value: wards.filter(w => w.aqi > 200 && w.aqi <= 300).length, color: '#f59e0b' },
    { name: 'Moderate', value: wards.filter(w => w.aqi > 100 && w.aqi <= 200).length, color: '#10b981' },
    { name: 'Good', value: wards.filter(w => w.aqi <= 100).length, color: '#3b82f6' }
  ];

  const trendData = [
    { time: '00:00', aqi: 145 },
    { time: '04:00', aqi: 167 },
    { time: '08:00', aqi: 198 },
    { time: '12:00', aqi: 223 },
    { time: '16:00', aqi: 245 },
    { time: '20:00', aqi: 212 },
    { time: '24:00', aqi: 189 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/20 to-slate-950 text-white">
      {/* Header */}
      <header className="bg-slate-950/60 backdrop-blur-2xl border-b border-white/10 px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-slate-800 rounded-lg transition-all"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div>
              <h1 className="text-2xl font-black uppercase tracking-tight">Admin Command Center</h1>
              <p className="text-xs text-slate-400">Advanced AI-Powered Operations Dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-900/50 px-4 py-2 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-bold">System Online</span>
            </div>
            <div className="flex items-center gap-3 bg-white/5 pr-4 pl-1 py-1 rounded-full">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold">
                {userProfile?.full_name?.charAt(0) || 'A'}
              </div>
              <div>
                <p className="text-xs font-bold">{userProfile?.full_name || 'Admin'}</p>
                <p className="text-[10px] text-purple-400">ADMIN ACCESS</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mt-4">
          {[
            { id: 'overview', label: 'Overview', icon: 'dashboard' },
            { id: 'agents', label: 'AI Agents Council', icon: 'psychology' },
            { id: 'analytics', label: 'Deep Analytics', icon: 'analytics' },
            { id: 'operations', label: 'Live Operations', icon: 'military_tech' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'bg-slate-900/50 text-slate-400 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-lg">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Content */}
      <main className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: 'Total Complaints', value: stats.totalComplaints, icon: 'report', color: 'from-red-600 to-orange-600' },
                { label: 'Active Tasks', value: stats.activeTasks, icon: 'task_alt', color: 'from-blue-600 to-cyan-600' },
                { label: 'Critical Zones', value: stats.criticalZones, icon: 'warning', color: 'from-yellow-600 to-amber-600' },
                { label: 'Avg City AQI', value: stats.avgAQI, icon: 'air', color: 'from-purple-600 to-pink-600' }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-purple-500/50 transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                      <span className="material-symbols-outlined text-white text-2xl">{stat.icon}</span>
                    </div>
                    <span className="text-3xl font-black">{stat.value}</span>
                  </div>
                  <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Maps Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Main AQI Map */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
                <div className="bg-slate-900 px-4 py-3 border-b border-slate-800">
                  <h3 className="font-bold text-sm uppercase tracking-wider">Live AQI Heatmap</h3>
                </div>
                <div className="h-[400px] relative">
                  <LeafletMap 
                    wards={wards} 
                    selectedWard={selectedWard} 
                    onWardClick={setSelectedWard}
                    granularity="ward"
                  />
                </div>
              </div>

              {/* Hotspot Map */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
                <div className="bg-slate-900 px-4 py-3 border-b border-slate-800">
                  <h3 className="font-bold text-sm uppercase tracking-wider">Critical Hotspots (AQI &gt; 300)</h3>
                </div>
                <div className="h-[400px] relative">
                  <LeafletMap 
                    wards={wards.filter(w => w.aqi > 300)} 
                    selectedWard={selectedWard} 
                    onWardClick={setSelectedWard}
                    granularity="ward"
                  />
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Trend Chart */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                <h3 className="font-bold text-sm uppercase tracking-wider mb-4">24-Hour AQI Trend</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={trendData}>
                    <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                      labelStyle={{ color: '#94a3b8' }}
                    />
                    <Line type="monotone" dataKey="aqi" stroke="#a855f7" strokeWidth={3} dot={{ fill: '#a855f7', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Distribution Chart */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                <h3 className="font-bold text-sm uppercase tracking-wider mb-4">AQI Distribution</h3>
                <div className="flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={aqiDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {aqiDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {aqiDistribution.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-xs text-slate-400">{item.name}: {item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'agents' && <AIAgentsCouncil />}

        {activeTab === 'analytics' && (
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 text-center">
            <span className="material-symbols-outlined text-6xl text-slate-600 mb-4">analytics</span>
            <h3 className="text-xl font-bold mb-2">Deep Analytics Module</h3>
            <p className="text-slate-400">Advanced predictive models and trend analysis coming soon</p>
          </div>
        )}

        {activeTab === 'operations' && (
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 text-center">
            <span className="material-symbols-outlined text-6xl text-slate-600 mb-4">military_tech</span>
            <h3 className="text-xl font-bold mb-2">Live Operations Center</h3>
            <p className="text-slate-400">Real-time task management and field operations tracking</p>
          </div>
        )}
      </main>
    </div>
  );
}
