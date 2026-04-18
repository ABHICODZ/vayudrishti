import React from 'react';

interface LandingPageProps {
  onLaunch: () => void;
}

export default function LandingPage({ onLaunch }: LandingPageProps) {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-background text-on-background font-body selection:bg-primary-container selection:text-on-primary-container w-full h-full overflow-y-auto no-scrollbar scroll-smooth">
      {/* TopAppBar Navigation */}
      <header className="fixed top-0 left-0 w-full z-50 bg-[#171a1f]/40 backdrop-blur-xl shadow-[0px_20px_40px_rgba(0,242,255,0.08)] transition-all duration-300">
        <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00f2ff] text-2xl" data-icon="sensors">sensors</span>
            <span className="text-2xl font-bold tracking-tighter text-[#f6f6fc] font-headline">VayuDrishti</span>
          </div>
          <div className="hidden md:flex items-center gap-8 font-label text-sm">
            <button onClick={() => scrollTo('hero')} className="text-[#00f2ff] font-bold">Monitor</button>
            <button onClick={() => scrollTo('how-it-works')} className="text-[#aaabb0] hover:text-[#f6f6fc] hover:bg-[#ffffff]/10 hover:backdrop-blur-2xl transition-all px-3 py-1 rounded-lg">Insights</button>
            <button onClick={() => scrollTo('intelligence')} className="text-[#aaabb0] hover:text-[#f6f6fc] hover:bg-[#ffffff]/10 hover:backdrop-blur-2xl transition-all px-3 py-1 rounded-lg">Satellites</button>
            <button onClick={() => scrollTo('features')} className="text-[#aaabb0] hover:text-[#f6f6fc] hover:bg-[#ffffff]/10 hover:backdrop-blur-2xl transition-all px-3 py-1 rounded-lg">Features</button>
          </div>
          <button 
            onClick={onLaunch}
            className="bg-gradient-to-r from-primary-container to-secondary px-6 py-2.5 rounded-xl text-on-secondary font-headline font-bold text-sm hover:scale-105 active:scale-95 transition-all duration-150 shadow-[0_0_20px_rgba(0,241,254,0.4)]">
            Launch Citizen Portal
          </button>
        </nav>
      </header>
      
      <main className="relative overflow-hidden">
        {/* Hero Section */}
        <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-12 px-6">
          {/* Background Elements */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px]"></div>
            <div className="absolute top-1/4 left-1/3 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px]"></div>
          </div>
          {/* 3D/Abstract Particle Sphere Simulation (Visual Representation) */}
          <div className="relative w-full max-w-2xl aspect-square flex items-center justify-center mb-[-100px] md:mb-[-150px] z-10">
            <div className="absolute inset-0 rounded-full border border-primary/20 animate-[spin_60s_linear_infinite]"></div>
            <div className="absolute inset-10 rounded-full border border-secondary/10 animate-[spin_45s_linear_infinite_reverse]"></div>
            <div className="absolute inset-20 rounded-full border border-primary/5 animate-[spin_30s_linear_infinite]"></div>
            <div className="relative z-20 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-outline-variant/30 mb-8">
                <span className="w-2 h-2 rounded-full bg-primary-container breathe-indicator"></span>
                <span className="font-label text-xs uppercase tracking-widest text-primary">Live Atmospheric Feed</span>
              </div>
              <h1 className="font-headline font-bold text-5xl md:text-8xl lg:text-9xl leading-[0.9] tracking-tighter mb-6 bg-gradient-to-b from-on-background via-on-background to-on-surface-variant/40 bg-clip-text text-transparent">
                VayuDrishti:<br/>The Future of Breath
              </h1>
            </div>
            {/* Floating Data Points */}
            <div className="absolute top-1/4 right-0 glass-panel p-4 rounded-xl border border-outline-variant/30 text-glow hidden md:block">
              <div className="font-label text-[10px] text-on-surface-variant uppercase mb-1">PM2.5 Density</div>
              <div className="font-headline font-bold text-2xl text-primary">12.4 <span className="text-xs font-normal">μg/m³</span></div>
            </div>
            <div className="absolute bottom-1/3 left-0 glass-panel p-4 rounded-xl border border-outline-variant/30 hidden md:block">
              <div className="font-label text-[10px] text-on-surface-variant uppercase mb-1">Ozone (O3)</div>
              <div className="font-headline font-bold text-2xl text-secondary">38.2 <span className="text-xs font-normal">ppb</span></div>
            </div>
          </div>
          {/* Hero Stats Bento */}
          <div className="relative z-20 w-full max-w-6xl mt-24 grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-4 glass-panel p-8 rounded-2xl border border-outline-variant/20 flex flex-col justify-between min-h-[200px] gradient-border">
              <div className="flex justify-between items-start">
                <span className="material-symbols-outlined text-primary text-3xl" data-icon="cloud_done">cloud_done</span>
                <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] font-bold">99.9% ACCURACY</span>
              </div>
              <div>
                <h3 className="font-headline font-bold text-xl mb-1 mt-4">Global Coverage</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">Real-time tracking of pollution across 180+ countries with sub-meter precision.</p>
              </div>
            </div>
            <div className="md:col-span-8 glass-panel p-8 rounded-2xl border border-outline-variant/20 flex flex-col md:flex-row gap-8 items-center gradient-border overflow-hidden">
              <div className="flex-1 w-full">
                <div className="font-label text-xs text-primary font-bold tracking-widest uppercase mb-4">Cybernetic Health Score</div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="font-headline font-bold text-6xl text-on-background">AQI 42</span>
                  <span className="text-on-surface-variant text-lg">/ 500</span>
                </div>
                <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
                  <div className="h-full w-[42%] bg-gradient-to-r from-primary to-secondary"></div>
                </div>
                <p className="mt-4 text-on-surface-variant text-sm">Atmospheric conditions in your current sector are <span className="text-primary font-bold">Optimal</span>. No respiratory hazard detected.</p>
              </div>
              <div className="w-full md:w-48 h-32 bg-surface-container-lowest rounded-xl border border-outline-variant/30 relative flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary shadow-[0_0_15px_rgba(34,211,238,0.5)] animate-[pulse_2s_infinite] text-4xl" data-icon="query_stats">query_stats</span>
              </div>
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section id="how-it-works" className="py-32 px-6 bg-surface-container-low relative">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-24">
              <div>
                <div className="inline-block px-4 py-1 bg-surface-container-highest rounded-full text-secondary font-label text-xs font-bold tracking-widest uppercase mb-6">Technological Core</div>
                <h2 className="font-headline font-bold text-4xl md:text-6xl tracking-tight mb-8">Atmospheric Depth Intelligence</h2>
                <p className="text-on-surface-variant text-lg leading-relaxed max-w-xl mb-12 italic">
                  By fusing deep-space satellite observation with neural predictive models, we transform complex gas dynamics into actionable health data.
                </p>
                <div id="intelligence" className="space-y-8">
                  <div className="flex gap-6 group">
                    <div className="w-14 h-14 shrink-0 rounded-2xl bg-surface-container-high border border-outline-variant/30 flex items-center justify-center group-hover:border-primary/50 transition-all duration-300">
                      <span className="material-symbols-outlined text-primary text-2xl" data-icon="satellite_alt">satellite_alt</span>
                    </div>
                    <div>
                      <h4 className="font-headline font-bold text-xl mb-2">Copernicus Sentinel-5P</h4>
                      <p className="text-on-surface-variant text-sm leading-relaxed">Direct telemetry from the world's most advanced tropospheric monitoring instrument, tracking NO2, O3, and Aerosols with 7km resolution.</p>
                    </div>
                  </div>
                  <div className="flex gap-6 group">
                    <div className="w-14 h-14 shrink-0 rounded-2xl bg-surface-container-high border border-outline-variant/30 flex items-center justify-center group-hover:border-secondary/50 transition-all duration-300">
                      <span className="material-symbols-outlined text-secondary text-2xl" data-icon="psychology">psychology</span>
                    </div>
                    <div>
                      <h4 className="font-headline font-bold text-xl mb-2">Llama 3 AI Engine</h4>
                      <p className="text-on-surface-variant text-sm leading-relaxed">Advanced inference processing to predict pollutant migration patterns up to 72 hours in advance, accounting for micro-climates.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -inset-4 bg-primary/5 rounded-[2rem] blur-2xl"></div>
                <div className="relative rounded-3xl overflow-hidden border border-outline-variant/20 shadow-2xl bg-[#0b1120] p-8 min-h-[400px] flex items-center justify-center">
                   <div className="text-center">
                      <span className="material-symbols-outlined text-primary text-6xl mb-4">public</span>
                      <h4 className="text-white font-headline text-2xl font-bold mb-2 tracking-widest uppercase italic">Orbital Feed Active</h4>
                      <p className="text-slate-500 text-xs tracking-widest">S5P STREAM: DEL-NCR_GRID_ACQUIRED</p>
                   </div>
                </div>
              </div>
            </div>
            
            {/* Cards Grid */}
            <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="glass-panel p-10 rounded-3xl border border-outline-variant/20 hover:border-primary/40 transition-all duration-500 group">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant group-hover:text-primary transition-colors mb-8" data-icon="health_and_safety">health_and_safety</span>
                <h3 className="font-headline font-bold text-2xl mb-4">Asthma Safety Protocol</h3>
                <p className="text-on-surface-variant leading-relaxed text-sm">Automated respiratory bio-curfews and hyper-local alerts triggered instantly when AQI thresholds intersect with your medical profile.</p>
              </div>
              <div className="glass-panel p-10 rounded-3xl border border-outline-variant/20 hover:border-primary/40 transition-all duration-500 group">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant group-hover:text-primary transition-colors mb-8" data-icon="timeline">timeline</span>
                <h3 className="font-headline font-bold text-2xl mb-4">8-Day AI Forecast</h3>
                <p className="text-on-surface-variant leading-relaxed text-sm">Llama 3 neural networking processes satellite telemetry to generate accurate 8-day predictive AQI charting for any geographic coordinate.</p>
              </div>
              <div className="glass-panel p-10 rounded-3xl border border-outline-variant/20 hover:border-primary/40 transition-all duration-500 group">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant group-hover:text-primary transition-colors mb-8" data-icon="local_fire_department">local_fire_department</span>
                <h3 className="font-headline font-bold text-2xl mb-4">Biomass Action Loop</h3>
                <p className="text-on-surface-variant leading-relaxed text-sm">Empowering citizens to actively report localized biomass burning incidents, feeding ground-truth data back into the central prediction engine.</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="relative py-40 px-6 overflow-hidden">
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="font-headline font-bold text-5xl md:text-7xl mb-8 tracking-tighter">Ready to See the Air?</h2>
            <p className="text-on-surface-variant text-xl mb-12 max-w-2xl mx-auto">Join the global initiative to map the atmosphere in real-time. Access the high-fidelity portal now.</p>
            <button 
              onClick={onLaunch}
              className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-xl blur opacity-60 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative bg-background px-12 py-5 rounded-xl font-headline font-bold text-xl text-on-background flex items-center gap-3">
                Launch Citizen Portal
                <span className="material-symbols-outlined" data-icon="arrow_forward">arrow_forward</span>
              </div>
            </button>
          </div>
          {/* Background Decorative Elements */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1200px] h-[400px] bg-primary/5 blur-[120px] rounded-[100%] pointer-events-none"></div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-[#0c0e12] py-20 px-6 border-t border-outline-variant/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 text-[#aaabb0] font-label text-xs tracking-widest uppercase">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-2xl" data-icon="sensors">sensors</span>
            <span className="text-lg font-bold tracking-tighter text-[#f6f6fc] font-headline">VayuDrishti</span>
          </div>
          <p>© 2026 VayuDrishti. Powered by Copernicus &amp; Llama 3 AI.</p>
          <div className="flex gap-4">
             <span>v2.5_STABLE</span>
          </div>
        </div>
      </footer>
      
      <style>{`
        .glass-panel {
          background: rgba(23, 26, 31, 0.4);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        .breathe-indicator {
          animation: pulse 2s infinite ease-in-out;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}
