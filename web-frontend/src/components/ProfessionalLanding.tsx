import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function ProfessionalLanding({ onLaunch }: { onLaunch: () => void }) {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div style={{ overflowY: 'scroll', height: '100vh' }} className="bg-[#0e0e0e] text-[#e7e5e4] font-sans">
      {/* Grain Overlay */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-[9999]" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")',
        backgroundRepeat: 'repeat'
      }}></div>

      {/* Tricolor Accent - Subtle */}
      <div className="fixed top-0 left-0 right-0 h-[2px] z-50 flex">
        <div className="flex-1 bg-[#FF9933]"></div>
        <div className="flex-1 bg-white"></div>
        <div className="flex-1 bg-[#138808]"></div>
      </div>

      {/* TopAppBar */}
      <header className="fixed top-2 w-full z-40 px-8 py-6">
        <div className="bg-neutral-950/70 backdrop-blur-xl flex justify-between items-center px-8 py-4 rounded-lg border border-neutral-800/20">
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-neutral-200 cursor-pointer hover:bg-neutral-800/50 transition-all p-2 rounded-full">menu</span>
            <span className="text-xl font-bold tracking-[-0.04em] text-neutral-100" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>VAYUDRISHTI</span>
            <div className="hidden md:flex gap-1 ml-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF9933]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#138808]"></span>
            </div>
          </div>
          <div className="hidden md:flex gap-12">
            <button onClick={() => scrollToSection('capabilities')} className="text-neutral-100 font-bold text-[0.75rem] uppercase tracking-[0.1em] hover:bg-neutral-800/50 transition-all py-2 px-4 rounded" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>INTELLIGENCE</button>
            <button onClick={() => scrollToSection('stats')} className="text-neutral-500 text-[0.75rem] uppercase tracking-[0.1em] hover:bg-neutral-800/50 transition-all py-2 px-4 rounded" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>NETWORK</button>
            <button onClick={() => scrollToSection('journey')} className="text-neutral-500 text-[0.75rem] uppercase tracking-[0.1em] hover:bg-neutral-800/50 transition-all py-2 px-4 rounded" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>SYSTEM</button>
          </div>
          <span className="material-symbols-outlined text-neutral-200 cursor-pointer hover:bg-neutral-800/50 transition-all p-2 rounded-full">blur_on</span>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden" style={{
        background: 'radial-gradient(circle at 50% 50%, #1a1a1a 0%, #0e0e0e 100%)'
      }}>
        {/* Particle Field */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#c6c6c7]/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#ffd16f]/5 rounded-full blur-[150px]"></div>
        </div>

        <motion.div style={{ opacity, scale }} className="relative z-10 max-w-5xl space-y-8 pt-24">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="text-6xl md:text-[8rem] font-bold tracking-[-0.04em] leading-[0.9]"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Air Intelligence<br/>for a Nation.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="text-xl md:text-2xl font-light text-[#acabaa] tracking-wide"
          >
            Real-time. Predictive. Actionable.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="flex items-center justify-center gap-3 text-sm text-[#FF9933] font-bold tracking-widest"
          >
            <span>भारत सरकार</span>
            <span className="text-white">•</span>
            <span className="text-[#138808]">GOVERNMENT OF INDIA</span>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="pt-12"
          >
            <button 
              onClick={onLaunch}
              className="group relative px-10 py-4 bg-transparent border border-[#484848]/30 text-[#e7e5e4] text-sm uppercase tracking-[0.2em] overflow-hidden transition-all duration-500 hover:border-[#c6c6c7]/50 hover:shadow-[0_0_30px_rgba(198,198,199,0.15)]"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              <span className="relative z-10">Enter System</span>
              <div className="absolute inset-0 bg-[#2c2c2c]/0 group-hover:bg-[#2c2c2c]/20 transition-colors duration-500"></div>
            </button>
          </motion.div>
        </motion.div>

        {/* Intelligence HUD */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-12 right-12 z-20 hidden md:block"
        >
          <div className="bg-[#252626]/60 backdrop-blur-md px-6 py-4 rounded-lg flex items-center gap-8 shadow-2xl border border-[#484848]/10">
            <div className="flex flex-col">
              <span className="text-[0.6rem] uppercase tracking-widest text-[#acabaa] mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Live AQI Index</span>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#ffd16f]"></span>
                <span className="text-2xl font-bold text-[#ffd16f]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>79.9</span>
                <span className="text-[0.7rem] text-[#eeb200]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>OPTIMAL</span>
              </div>
            </div>
            <div className="h-8 w-px bg-[#484848]/30"></div>
            <div className="flex flex-col">
              <span className="text-[0.6rem] uppercase tracking-widest text-[#acabaa] mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>System Accuracy</span>
              <span className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>79.9<span className="text-sm font-normal text-[#acabaa] ml-1">%</span></span>
            </div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-[#767575] text-xs tracking-widest"
          >
            ↓
          </motion.div>
        </motion.div>
      </section>

      {/* System Overview Section */}
      <section className="py-48 px-8 bg-[#131313] relative">
        <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-24 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="md:col-span-7"
          >
            <h2 className="text-5xl md:text-8xl font-bold tracking-[-0.04em] leading-tight mb-12" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              The Invisible<br/>Made Visible
            </h2>
            <p className="text-xl md:text-2xl text-[#acabaa] leading-relaxed max-w-2xl">
              VayuDrishti deploys a proprietary neural grid across urban ecosystems, translating atmospheric flux into strategic intelligence. We don't just measure air; we decode the breath of the nation.
            </p>
            <div className="mt-12 grid grid-cols-3 gap-8">
              <div>
                <div className="text-4xl font-bold text-[#FF9933] mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>272</div>
                <div className="text-xs text-[#767575] uppercase tracking-widest">Wards</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>30M+</div>
                <div className="text-xs text-[#767575] uppercase tracking-widest">Citizens</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-[#138808] mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>24/7</div>
                <div className="text-xs text-[#767575] uppercase tracking-widest">Monitoring</div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="md:col-span-5 relative aspect-square"
          >
            {/* Abstract Diagram */}
            <div className="absolute inset-0 flex items-center justify-center opacity-40">
              <svg className="w-full h-full stroke-[#c6c6c7]/30 stroke-[0.5]" fill="none" viewBox="0 0 400 400">
                <circle cx="200" cy="200" r="150"></circle>
                <circle cx="200" cy="200" r="100"></circle>
                <circle cx="200" cy="200" r="50"></circle>
                <path d="M50 200 L350 200"></path>
                <path d="M200 50 L200 350"></path>
                <path d="M94 94 L306 306"></path>
                <path d="M306 94 L94 306"></path>
                <circle cx="200" cy="200" fill="#c6c6c7" r="4"></circle>
                <circle cx="306" cy="94" fill="#ffd16f" r="2"></circle>
                <circle cx="94" cy="306" fill="#ffd16f" r="2"></circle>
              </svg>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4/5 h-4/5 rounded-full bg-gradient-to-br from-[#FF9933]/10 via-white/5 to-[#138808]/10 backdrop-blur-sm border border-[#484848]/20"></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section id="capabilities" className="py-48 px-8 bg-[#0e0e0e] space-y-48">
        {/* Feature 01 */}
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex-1 space-y-6"
          >
            <span className="text-sm tracking-[0.3em] text-[#c6c6c7]/60" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>01 / ARCHITECTURE</span>
            <h3 className="text-4xl md:text-6xl font-bold tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Hyper-Local Monitoring</h3>
            <p className="text-lg text-[#acabaa] leading-relaxed">
              Deploying dense sensor clusters at ward-level resolution. Capture particulate dynamics that traditional satellites miss. Precision data for a complex world.
            </p>
            <div className="flex gap-4 pt-4">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-[#FF9933]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>12,159</span>
                <span className="text-xs text-[#767575] uppercase tracking-widest">Training Samples</span>
              </div>
              <div className="w-px bg-[#484848]/30"></div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>29</span>
                <span className="text-xs text-[#767575] uppercase tracking-widest">Features</span>
              </div>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex-1 bg-[#191a1a] aspect-video rounded-xl overflow-hidden group"
          >
            <div className="w-full h-full bg-gradient-to-br from-[#FF9933]/20 via-[#191a1a] to-[#138808]/20 flex items-center justify-center transition-transform duration-700 group-hover:scale-110">
              <div className="text-center">
                <div className="text-6xl mb-4">🛰️</div>
                <div className="text-sm text-[#acabaa] uppercase tracking-widest">Satellite Integration</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Feature 02 */}
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row-reverse gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex-1 space-y-6"
          >
            <span className="text-sm tracking-[0.3em] text-[#c6c6c7]/60" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>02 / FORESIGHT</span>
            <h3 className="text-4xl md:text-6xl font-bold tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Neural Prediction</h3>
            <p className="text-lg text-[#acabaa] leading-relaxed">
              Predicting air quality shifts with 79.9% accuracy. Using historical weather patterns and real-time transit data to see the future. PyTorch-powered intelligence.
            </p>
            <div className="flex gap-4 pt-4">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-[#138808]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>198K</span>
                <span className="text-xs text-[#767575] uppercase tracking-widest">Parameters</span>
              </div>
              <div className="w-px bg-[#484848]/30"></div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>0.84</span>
                <span className="text-xs text-[#767575] uppercase tracking-widest">R² Score</span>
              </div>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex-1 bg-[#191a1a] aspect-video rounded-xl overflow-hidden group"
          >
            <div className="w-full h-full bg-gradient-to-br from-[#138808]/20 via-[#191a1a] to-[#FF9933]/20 flex items-center justify-center transition-transform duration-700 group-hover:scale-110">
              <div className="text-center">
                <div className="text-6xl mb-4">🧠</div>
                <div className="text-sm text-[#acabaa] uppercase tracking-widest">AI/ML Engine</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Feature 03 */}
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex-1 space-y-6"
          >
            <span className="text-sm tracking-[0.3em] text-[#c6c6c7]/60" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>03 / GOVERNANCE</span>
            <h3 className="text-4xl md:text-6xl font-bold tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Policy Intelligence</h3>
            <p className="text-lg text-[#acabaa] leading-relaxed">
              Actionable dashboards for city administrators. Transform data into regulation. Monitor the direct impact of traffic diversions and industrial caps in real-time.
            </p>
            <div className="flex gap-4 pt-4">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-[#FF9933]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>11</span>
                <span className="text-xs text-[#767575] uppercase tracking-widest">Districts</span>
              </div>
              <div className="w-px bg-[#484848]/30"></div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Real-Time</span>
                <span className="text-xs text-[#767575] uppercase tracking-widest">Updates</span>
              </div>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex-1 bg-[#191a1a] aspect-video rounded-xl overflow-hidden group"
          >
            <div className="w-full h-full bg-gradient-to-br from-white/10 via-[#191a1a] to-[#138808]/20 flex items-center justify-center transition-transform duration-700 group-hover:scale-110">
              <div className="text-center">
                <div className="text-6xl mb-4">🏛️</div>
                <div className="text-sm text-[#acabaa] uppercase tracking-widest">Government Dashboard</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Grid Section */}
      <section id="stats" className="py-48 px-8 bg-[#131313]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Built for India, Validated by Science
            </h2>
            <p className="text-xl text-[#acabaa]">Government-grade accuracy. Real-world tested.</p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { value: "79.9%", label: "PM2.5 Accuracy", sublabel: "Industry Leading", color: "#FF9933" },
              { value: "75.9%", label: "PM10 Accuracy", sublabel: "Target Exceeded", color: "#FFFFFF" },
              { value: "14.38", label: "PM2.5 MAE", sublabel: "µg/m³", color: "#138808" },
              { value: "27.54", label: "PM10 MAE", sublabel: "µg/m³", color: "#FF9933" },
              { value: "0.84", label: "PM2.5 R²", sublabel: "84% Variance", color: "#FFFFFF" },
              { value: "0.87", label: "PM10 R²", sublabel: "87% Variance", color: "#138808" },
              { value: "11 Years", label: "Historical Data", sublabel: "2015-2025", color: "#FF9933" },
              { value: "24/7", label: "Monitoring", sublabel: "Always Active", color: "#FFFFFF" }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                viewport={{ once: true }}
                className="bg-[#191a1a]/50 backdrop-blur-lg border border-[#484848]/20 rounded-lg p-6 text-center hover:border-[#484848]/50 transition-all"
              >
                <div className="text-4xl font-bold mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif', color: stat.color }}>
                  {stat.value}
                </div>
                <div className="text-sm font-bold text-white mb-1">{stat.label}</div>
                <div className="text-xs text-[#767575]">{stat.sublabel}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section id="journey" className="py-48 px-8 bg-[#0e0e0e]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Our Journey to Excellence
            </h2>
            <p className="text-xl text-[#acabaa]">From 59% to 80% accuracy. A testament to innovation.</p>
          </motion.div>

          <div className="space-y-12">
            {[
              { phase: "01", title: "Deep Analysis", metric: "25+ files analyzed", color: "#FF9933" },
              { phase: "02", title: "Real-World Validation", metric: "69.5% baseline", color: "#FFFFFF" },
              { phase: "03", title: "Architecture Optimization", metric: "59.2% → 66.8%", color: "#138808" },
              { phase: "04", title: "Data Expansion", metric: "6x increase", color: "#FF9933" },
              { phase: "05", title: "Weather & Spatial Intelligence", metric: "29 features", color: "#FFFFFF" },
              { phase: "06", title: "Target Achieved", metric: "79.9% / 75.9%", color: "#138808" }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center gap-8 bg-[#191a1a]/30 p-6 rounded-lg border border-[#484848]/10 hover:border-[#484848]/30 transition-all"
              >
                <div className="text-4xl font-bold opacity-30" style={{ fontFamily: 'Space Grotesk, sans-serif', color: item.color }}>
                  {item.phase}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{item.title}</h3>
                  <p className="text-sm" style={{ color: item.color }}>{item.metric}</p>
                </div>
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color, boxShadow: `0 0 20px ${item.color}` }}></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-48 px-8 bg-[#131313]">
        <div className="max-w-5xl mx-auto text-center space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-7xl font-bold tracking-tighter mb-8" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Ready to secure your skies?
            </h2>
            <p className="text-xl text-[#acabaa] mb-12">
              Join government officials, researchers, and citizens in making data-driven decisions for cleaner air.
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-6">
              <button 
                onClick={onLaunch}
                className="px-12 py-5 bg-[#c6c6c7] text-[#0e0e0e] text-sm uppercase tracking-widest rounded transition-all hover:bg-[#d4d4d4] shadow-xl"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                Request System Access
              </button>
              <button 
                onClick={() => scrollToSection('stats')}
                className="px-12 py-5 border border-[#484848]/50 text-[#e7e5e4] text-sm uppercase tracking-widest rounded transition-all hover:bg-[#2c2c2c]"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                View Network Map
              </button>
            </div>
          </motion.div>

          {/* India Focus Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mt-20 bg-gradient-to-r from-[#FF9933]/10 via-white/5 to-[#138808]/10 border border-[#484848]/20 rounded-2xl p-12"
          >
            <div className="text-6xl mb-6">🇮🇳</div>
            <h3 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Serving the Nation
            </h3>
            <p className="text-lg text-[#acabaa] mb-8">
              Monitoring 272 wards across Delhi NCR, protecting over 30 million citizens with real-time air quality intelligence.
            </p>
            <div className="flex justify-center gap-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#FF9933] mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>272</div>
                <div className="text-xs text-[#767575] uppercase tracking-widest">Wards</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>30M+</div>
                <div className="text-xs text-[#767575] uppercase tracking-widest">Citizens</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#138808] mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>11</div>
                <div className="text-xs text-[#767575] uppercase tracking-widest">Districts</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-12 px-8 bg-neutral-950 border-t border-neutral-800/15">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <span className="text-[0.75rem] uppercase tracking-[0.1em] text-neutral-400" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              © 2026 VAYUDRISHTI. AIR INTELLIGENCE SYSTEM.
            </span>
            {/* Tricolor Accents */}
            <div className="flex gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF9933]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#138808]"></span>
            </div>
          </div>
          <div className="flex gap-8">
            <button onClick={() => scrollToSection('capabilities')} className="text-[0.75rem] uppercase tracking-[0.1em] text-neutral-500 hover:text-neutral-100 transition-colors" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>INTELLIGENCE</button>
            <button onClick={() => scrollToSection('stats')} className="text-[0.75rem] uppercase tracking-[0.1em] text-neutral-500 hover:text-neutral-100 transition-colors" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>NETWORK</button>
            <button onClick={() => scrollToSection('journey')} className="text-[0.75rem] uppercase tracking-[0.1em] text-neutral-500 hover:text-neutral-100 transition-colors" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>SYSTEM</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
