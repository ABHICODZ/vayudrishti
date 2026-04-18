import React from 'react';
import { motion } from 'framer-motion';

export default function NationalIntelligenceLanding({ onLaunch }: { onLaunch: () => void }) {
  return (
    <div className="bg-[#0c0e10] text-white font-['Inter'] overflow-y-auto min-h-screen">
      {/* Telemetry Grid Background */}
      <div className="fixed inset-0 pointer-events-none opacity-40" style={{
        backgroundSize: '100px 100px',
        backgroundImage: 'linear-gradient(to right, rgba(66, 73, 78, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(66, 73, 78, 0.05) 1px, transparent 1px)'
      }}></div>
      
      {/* Radial Glow */}
      <div className="fixed inset-0 pointer-events-none" style={{
        background: 'radial-gradient(circle at center, rgba(255, 153, 51, 0.05) 0%, rgba(12, 14, 16, 0) 70%)'
      }}></div>

      {/* Top Navigation */}
      <header className="sticky top-0 z-50 flex justify-between items-center w-full px-6 py-4 border-b border-white/5 bg-[#0c0e10]/80 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[#FF9933]">security</span>
          <span className="text-white font-black tracking-tighter uppercase">National Air Intelligence</span>
        </div>
        <nav className="hidden md:flex gap-8">
          <a className="text-[#FF9933] font-bold uppercase tracking-widest text-sm hover:bg-[#1b2025] transition-colors px-2 py-1" href="#monitor">Monitor</a>
          <a className="text-white/60 uppercase tracking-widest text-sm hover:bg-[#1b2025] transition-colors px-2 py-1" href="#capabilities">Capabilities</a>
          <a className="text-white/60 uppercase tracking-widest text-sm hover:bg-[#1b2025] transition-colors px-2 py-1" href="#impact">Impact</a>
          <a className="text-white/60 uppercase tracking-widest text-sm hover:bg-[#1b2025] transition-colors px-2 py-1" href="#deploy">Deploy</a>
        </nav>
        <div className="flex items-center gap-4">
          <span className="font-bold uppercase tracking-widest text-sm text-[#FF9933]">● LIVE</span>
        </div>
      </header>

      <main className="relative">
        {/* Hero Section */}
        <section id="monitor" className="relative pt-32 pb-24 px-6 flex flex-col items-center text-center min-h-screen justify-center">
          {/* Background India Map */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full opacity-5 pointer-events-none">
            <svg viewBox="0 0 800 800" className="w-full h-full">
              <path d="M400,100 L450,150 L500,200 L520,280 L500,350 L480,420 L450,480 L400,520 L350,480 L320,420 L300,350 L280,280 L300,200 L350,150 Z" 
                    fill="none" stroke="white" strokeWidth="2" opacity="0.3"/>
            </svg>
          </div>

          {/* Status Indicators */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex gap-4 mb-8 font-['Public_Sans'] text-[10px] tracking-[0.3em] uppercase opacity-70"
          >
            <div className="flex items-center gap-2 px-3 py-1 bg-[#1b2025] border-l border-[#FF9933]">
              <span className="text-[#FF9933]">LIVE_DATA</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-[#1b2025] border-l border-[#138808]">
              <span className="text-[#138808]">UPDATED_24_SECONDS_AGO</span>
            </div>
          </motion.div>

          {/* Main Title */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase mb-6 max-w-5xl leading-[0.9] text-white"
          >
            National Air Intelligence System
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="font-['Public_Sans'] text-white/70 max-w-2xl text-lg md:text-xl font-light mb-12 tracking-wide leading-relaxed"
          >
            Real-time monitoring, prediction, and action for cleaner air. <br className="hidden md:block"/> 
            Built for the specialized demands of urban governance and national security.
          </motion.p>

          {/* Key Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 w-full max-w-4xl"
          >
            <div className="bg-[#161a1e] border border-white/5 p-6 hover:border-[#FF9933]/30 transition-all">
              <div className="text-4xl font-black text-[#FF9933] mb-2">79.9%</div>
              <div className="text-xs text-white/50 uppercase tracking-widest">PM2.5 Accuracy</div>
            </div>
            <div className="bg-[#161a1e] border border-white/5 p-6 hover:border-[#FF9933]/30 transition-all">
              <div className="text-4xl font-black text-[#FF9933] mb-2">75.9%</div>
              <div className="text-xs text-white/50 uppercase tracking-widest">PM10 Accuracy</div>
            </div>
            <div className="bg-[#161a1e] border border-white/5 p-6 hover:border-[#FF9933]/30 transition-all">
              <div className="text-4xl font-black text-[#FF9933] mb-2">272</div>
              <div className="text-xs text-white/50 uppercase tracking-widest">Delhi Wards</div>
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onLaunch}
            className="bg-[#FF9933] text-black font-bold uppercase tracking-widest px-10 py-5 hover:bg-[#ffa44f] transition-all duration-300 active:scale-95 flex items-center gap-3"
          >
            Enter Command Center
            <span className="material-symbols-outlined">arrow_forward</span>
          </motion.button>

          {/* Coordinate Telemetry */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-24 w-full max-w-6xl flex justify-between items-end border-t border-white/10 pt-8 opacity-40 font-['Public_Sans'] text-[10px] tracking-widest"
          >
            <div>GEO_COORD: 28.6139° N, 77.2090° E</div>
            <div className="text-right">SYS_VER: 5.0.2 // ARCH: SOVEREIGN_CLOUD</div>
          </motion.div>
        </section>

        {/* System Capabilities: Bento Layout */}
        <section id="capabilities" className="max-w-7xl mx-auto px-6 py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="text-[#FF9933] font-['Public_Sans'] text-xs font-bold tracking-[0.4em] uppercase mb-4">System Capabilities</div>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white">Asymmetric Intelligence</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            {/* Card 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="group bg-[#161a1e] p-8 border-r border-b md:border-b-0 border-white/5 hover:bg-[#1b2025] transition-colors relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-2 opacity-20 text-[8px] font-['Public_Sans']">01 / MOD_SENS</div>
              <span className="material-symbols-outlined text-[#FF9933] mb-6 text-3xl">monitoring</span>
              <h3 className="font-bold text-xl uppercase tracking-tight mb-3 text-white">Real-Time Monitoring</h3>
              <p className="font-['Public_Sans'] text-sm text-white/70 leading-relaxed">
                Hyper-local sensory array delivering sub-minute latency for particulate and gaseous detection across 272 wards.
              </p>
            </motion.div>

            {/* Card 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="group bg-[#161a1e] p-8 border-r border-b md:border-b-0 border-white/5 hover:bg-[#1b2025] transition-colors relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-2 opacity-20 text-[8px] font-['Public_Sans']">02 / SAT_INTEL</div>
              <span className="material-symbols-outlined text-[#138808] mb-6 text-3xl">satellite_alt</span>
              <h3 className="font-bold text-xl uppercase tracking-tight mb-3 text-white">Satellite Intelligence</h3>
              <p className="font-['Public_Sans'] text-sm text-white/70 leading-relaxed">
                Cross-referenced orbital telemetry from Sentinel-5P for broad-scale predictive thermal and aerosol mapping.
              </p>
            </motion.div>

            {/* Card 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="group bg-[#161a1e] p-8 border-white/5 hover:bg-[#1b2025] transition-colors relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-2 opacity-20 text-[8px] font-['Public_Sans']">03 / AI_POLICY</div>
              <span className="material-symbols-outlined text-white mb-6 text-3xl">gavel</span>
              <h3 className="font-bold text-xl uppercase tracking-tight mb-3 text-white">AI Policy Engine</h3>
              <p className="font-['Public_Sans'] text-sm text-white/70 leading-relaxed">
                Automated administrative advisories generated through recursive machine learning models with 79.9% accuracy.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Live Preview Section */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="flex-1 w-full order-2 lg:order-1"
            >
              <div className="relative bg-[#000000] border border-white/10 p-1">
                <div className="w-full aspect-video bg-gradient-to-br from-[#FF9933]/20 via-[#0c0e10] to-[#138808]/20 flex items-center justify-center">
                  <div className="text-center">
                    <span className="material-symbols-outlined text-6xl text-[#FF9933] mb-4">map</span>
                    <div className="text-white/50 text-sm uppercase tracking-widest">Interactive Map Preview</div>
                  </div>
                </div>
                {/* HUD Overlays */}
                <div className="absolute top-4 left-4 bg-[#0c0e10]/80 backdrop-blur px-3 py-1 text-[10px] font-['Public_Sans'] border-l-2 border-[#FF9933] uppercase">
                  WAQI / GEE Source Cluster
                </div>
                <div className="absolute bottom-4 right-4 bg-[#0c0e10]/80 backdrop-blur px-3 py-1 text-[10px] font-['Public_Sans'] border-r-2 border-[#138808] uppercase">
                  Latency: 42ms
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="flex-1 order-1 lg:order-2"
            >
              <div className="mb-4 text-[#138808] font-['Public_Sans'] text-xs font-bold tracking-[0.4em] uppercase">Tactical Overview</div>
              <h2 className="text-4xl font-black uppercase tracking-tighter text-white mb-6">Asymmetric Data Correlation</h2>
              <p className="font-['Public_Sans'] text-white/70 leading-relaxed mb-8">
                Our sovereign lens identifies pollution corridors previously invisible to standard monitors. By fusing ground sensor clusters 
                with satellite feeds, we provide a definitive truth for administrative action.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-4 text-sm font-['Public_Sans'] text-white/80">
                  <span className="w-1 h-4 bg-[#FF9933]"></span>
                  Particulate Matter Tracking (PM2.5 / PM10) - 79.9% / 75.9%
                </li>
                <li className="flex items-center gap-4 text-sm font-['Public_Sans'] text-white/80">
                  <span className="w-1 h-4 bg-white"></span>
                  Nitrogen Dioxide (NO2) Dispersion Modeling
                </li>
                <li className="flex items-center gap-4 text-sm font-['Public_Sans'] text-white/80">
                  <span className="w-1 h-4 bg-[#138808]"></span>
                  Aerosol Optical Depth (AOD) Analysis via Sentinel-5P
                </li>
              </ul>
            </motion.div>
          </div>
        </section>

        {/* Impact Section */}
        <section id="impact" className="py-32 bg-[#111416] border-y border-white/5 relative">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <motion.blockquote 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-12 italic leading-tight"
            >
              "Measurable improvement in urban health through policy-driven satellite data."
            </motion.blockquote>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              <div className="text-left">
                <div className="text-[#138808] text-4xl font-black">20.7%</div>
                <div className="font-['Public_Sans'] text-[10px] tracking-widest opacity-50 uppercase mt-1">PM2.5 Improvement</div>
              </div>
              <div className="text-left">
                <div className="text-[#FF9933] text-4xl font-black">272</div>
                <div className="font-['Public_Sans'] text-[10px] tracking-widest opacity-50 uppercase mt-1">Wards Monitored</div>
              </div>
              <div className="text-left">
                <div className="text-[#138808] text-4xl font-black">30M+</div>
                <div className="font-['Public_Sans'] text-[10px] tracking-widest opacity-50 uppercase mt-1">Citizens Protected</div>
              </div>
              <div className="text-left">
                <div className="text-[#FF9933] text-4xl font-black">24/7</div>
                <div className="font-['Public_Sans'] text-[10px] tracking-widest opacity-50 uppercase mt-1">Live Monitoring</div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Deployment Section */}
        <section id="deploy" className="py-32 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="text-[#FF9933] font-['Public_Sans'] text-xs font-bold tracking-[0.4em] uppercase mb-4">Ready for Deployment</div>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white mb-8">
                Experience National-Grade Intelligence
              </h2>
              <p className="text-xl text-white/70 mb-12 font-['Public_Sans']">
                Join government officials, researchers, and citizens in making data-driven decisions for cleaner air.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onLaunch}
                className="bg-[#FF9933] text-black font-bold uppercase tracking-widest px-16 py-6 hover:bg-[#ffa44f] transition-all duration-300 flex items-center gap-3 mx-auto"
              >
                Launch Dashboard Now
                <span className="material-symbols-outlined">arrow_forward</span>
              </motion.button>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full px-8 py-12 flex flex-col md:flex-row justify-between items-center gap-4 bg-[#0c0e10] border-t border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-white/20 font-black tracking-tighter uppercase">National Air Intelligence</span>
        </div>
        <div className="flex flex-wrap justify-center gap-8 font-['Public_Sans'] text-[9px] uppercase tracking-[0.2em] text-white/30">
          <a className="hover:text-white transition-opacity" href="#">WAQI References</a>
          <a className="hover:text-white transition-opacity" href="#">GEE Telemetry</a>
          <a className="hover:text-white transition-opacity" href="#">Protocol</a>
          <a className="hover:text-white transition-opacity" href="#">Disclaimer</a>
        </div>
        <div className="text-white/30 font-['Public_Sans'] text-[9px] uppercase tracking-[0.2em] text-right">
          © 2026 VayuDrishti. Secure Government Environment.
        </div>
      </footer>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-16 bg-[#111416] border-t border-white/10 md:hidden">
        <button className="flex flex-col items-center gap-1 text-[#FF9933] border-t-2 border-[#FF9933] pt-1">
          <span className="material-symbols-outlined text-lg">monitoring</span>
          <span className="font-['Public_Sans'] text-[8px] uppercase tracking-wider">Monitor</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-white/40 pt-1 hover:text-white transition-colors">
          <span className="material-symbols-outlined text-lg">gavel</span>
          <span className="font-['Public_Sans'] text-[8px] uppercase tracking-wider">Policy</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-white/40 pt-1 hover:text-white transition-colors">
          <span className="material-symbols-outlined text-lg">analytics</span>
          <span className="font-['Public_Sans'] text-[8px] uppercase tracking-wider">Impact</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-white/40 pt-1 hover:text-white transition-colors">
          <span className="material-symbols-outlined text-lg">admin_panel_settings</span>
          <span className="font-['Public_Sans'] text-[8px] uppercase tracking-wider">Admin</span>
        </button>
      </nav>
    </div>
  );
}
