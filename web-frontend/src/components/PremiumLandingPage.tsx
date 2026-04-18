import React, { useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function PremiumLandingPage({ onLaunch }: { onLaunch: () => void }) {
  const { scrollYProgress } = useScroll();
  
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  return (
    <div className="bg-black text-white overflow-x-hidden">
      {/* Hero Section - Full Screen */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-black to-cyan-900/20"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(34, 211, 238, 0.1) 0%, transparent 50%)`,
            animation: 'pulse 4s ease-in-out infinite'
          }}></div>
        </div>

        {/* Hero Content */}
        <motion.div 
          style={{ opacity, scale }}
          className="relative z-10 text-center px-8 max-w-6xl"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-8xl md:text-9xl font-black mb-6 tracking-tighter">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 animate-gradient">
                VayuDrishti
              </span>
            </h1>
            <p className="text-2xl md:text-3xl text-slate-300 mb-4 font-light tracking-wide">
              India's Most Advanced Air Quality Intelligence System
            </p>
            <p className="text-cyan-400 text-lg mb-12 tracking-widest uppercase">
              Powered by AI • Validated by Satellite • Trusted by Government
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="flex flex-wrap justify-center gap-6 mb-12"
          >
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl px-8 py-6">
              <div className="text-5xl font-black text-cyan-400 mb-2">79.9%</div>
              <div className="text-sm text-slate-400 uppercase tracking-widest">PM2.5 Accuracy</div>
            </div>
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl px-8 py-6">
              <div className="text-5xl font-black text-cyan-400 mb-2">75.9%</div>
              <div className="text-sm text-slate-400 uppercase tracking-widest">PM10 Accuracy</div>
            </div>
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl px-8 py-6">
              <div className="text-5xl font-black text-cyan-400 mb-2">272</div>
              <div className="text-sm text-slate-400 uppercase tracking-widest">Delhi Wards</div>
            </div>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onLaunch}
            className="group relative px-12 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full font-bold text-lg uppercase tracking-wider overflow-hidden shadow-2xl shadow-cyan-500/50"
          >
            <span className="relative z-10">Launch Dashboard</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </motion.button>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="mt-16 text-slate-500 text-sm"
          >
            Scroll to explore our journey
            <div className="mt-4 animate-bounce">↓</div>
          </motion.div>
        </motion.div>
      </section>

      {/* Our Journey Section */}
      <section className="relative py-32 px-8 bg-gradient-to-b from-black to-slate-950">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-6xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              Our Journey to Excellence
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              From 59% to 80% accuracy in 9 intensive sessions. A testament to innovation, dedication, and cutting-edge AI.
            </p>
          </motion.div>

          {/* Timeline */}
          <div className="space-y-16">
            {[
              {
                phase: "Phase 1",
                title: "Deep Analysis & Security Audit",
                desc: "Comprehensive codebase analysis, identified 150+ hardcoded values, secured critical vulnerabilities",
                metric: "25+ files analyzed",
                color: "from-red-500 to-orange-500"
              },
              {
                phase: "Phase 2",
                title: "Real-World Validation",
                desc: "End-to-end testing against live WAQI government data across 6 Delhi locations",
                metric: "69.5% baseline accuracy",
                color: "from-orange-500 to-yellow-500"
              },
              {
                phase: "Phase 3",
                title: "Model Architecture Optimization",
                desc: "Tested 8 different neural network architectures, discovered wider networks outperform deeper ones",
                metric: "59.2% → 66.8% PM2.5",
                color: "from-yellow-500 to-green-500"
              },
              {
                phase: "Phase 4",
                title: "Massive Data Expansion",
                desc: "Processed 2021-2025 data: 1,551 daily + 9,409 hourly records. 6x dataset increase",
                metric: "2,007 → 12,159 samples",
                color: "from-green-500 to-cyan-500"
              },
              {
                phase: "Phase 5",
                title: "Weather & Spatial Intelligence",
                desc: "Integrated 17 new features: temperature, humidity, wind, industrial zones, traffic density",
                metric: "12 → 29 features",
                color: "from-cyan-500 to-blue-500"
              },
              {
                phase: "Phase 6",
                title: "Target Achieved & Exceeded",
                desc: "Final model with enhanced architecture [512, 256, 128]. Government-grade accuracy achieved",
                metric: "79.9% PM2.5 | 75.9% PM10",
                color: "from-blue-500 to-purple-500"
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                viewport={{ once: true }}
                className={`flex ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} items-center gap-12`}
              >
                <div className="flex-1">
                  <div className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${item.color} text-white text-sm font-bold mb-4`}>
                    {item.phase}
                  </div>
                  <h3 className="text-3xl font-bold mb-3">{item.title}</h3>
                  <p className="text-slate-400 text-lg mb-4">{item.desc}</p>
                  <div className="text-cyan-400 font-mono text-xl font-bold">{item.metric}</div>
                </div>
                <div className="w-px h-32 bg-gradient-to-b from-transparent via-cyan-500 to-transparent"></div>
                <div className="flex-1"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="relative py-32 px-8 bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-6xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              Powered by Cutting-Edge Technology
            </h2>
            <p className="text-xl text-slate-400">
              Enterprise-grade stack trusted by government institutions
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🧠",
                title: "Advanced AI/ML",
                items: ["PyTorch Neural Networks", "198,018 Parameters", "Dual-Output Architecture", "ReduceLROnPlateau Optimization"]
              },
              {
                icon: "🛰️",
                title: "Satellite Integration",
                items: ["Google Earth Engine", "Sentinel-5P Data", "Real-time NO2, SO2, CO", "Biomass Burning Detection"]
              },
              {
                icon: "🌐",
                title: "Data Sources",
                items: ["WAQI Government API", "OpenAQ Historical Data", "CPCB Official Records", "11 Years of Data (2015-2025)"]
              },
              {
                icon: "⚡",
                title: "Backend Infrastructure",
                items: ["FastAPI Python", "PostgreSQL + TimescaleDB", "Supabase Auth", "RESTful API"]
              },
              {
                icon: "🎨",
                title: "Modern Frontend",
                items: ["React + TypeScript", "Leaflet Maps", "Recharts Analytics", "Framer Motion"]
              },
              {
                icon: "📊",
                title: "Features",
                items: ["29 Input Features", "Weather Data", "Spatial Intelligence", "Traffic & Industrial Zones"]
              }
            ].map((tech, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:border-cyan-500/50 transition-all duration-300"
              >
                <div className="text-5xl mb-4">{tech.icon}</div>
                <h3 className="text-2xl font-bold mb-4 text-cyan-400">{tech.title}</h3>
                <ul className="space-y-2">
                  {tech.items.map((item, j) => (
                    <li key={j} className="text-slate-400 flex items-start gap-2">
                      <span className="text-cyan-500 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact & Recognition */}
      <section className="relative py-32 px-8 bg-gradient-to-b from-slate-950 to-black">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-6xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              Built for India, Validated by Science
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {[
              { value: "12,159", label: "Training Samples", sublabel: "2015-2025 Data" },
              { value: "79.9%", label: "PM2.5 Accuracy", sublabel: "Industry Leading" },
              { value: "75.9%", label: "PM10 Accuracy", sublabel: "Target Exceeded" },
              { value: "14.38", label: "PM2.5 MAE (µg/m³)", sublabel: "Best in Class" },
              { value: "27.54", label: "PM10 MAE (µg/m³)", sublabel: "Highly Accurate" },
              { value: "0.84", label: "PM2.5 R² Score", sublabel: "84% Variance Explained" },
              { value: "0.87", label: "PM10 R² Score", sublabel: "87% Variance Explained" },
              { value: "24/7", label: "Real-Time Monitoring", sublabel: "Always Active" }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-5xl font-black text-cyan-400 mb-2">{stat.value}</div>
                <div className="text-lg font-bold text-white mb-1">{stat.label}</div>
                <div className="text-sm text-slate-500">{stat.sublabel}</div>
              </motion.div>
            ))}
          </div>

          {/* India Map Highlight */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-3xl p-12 text-center"
          >
            <div className="text-6xl mb-6">🇮🇳</div>
            <h3 className="text-4xl font-black mb-4">Serving the Nation</h3>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
              Monitoring 272 wards across Delhi NCR, providing real-time air quality intelligence to protect 
              over 30 million citizens. Our system integrates with government databases and satellite imagery 
              to deliver actionable insights for policy makers and citizens alike.
            </p>
            <div className="flex justify-center gap-8 flex-wrap">
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400">272</div>
                <div className="text-sm text-slate-400">Wards Monitored</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400">30M+</div>
                <div className="text-sm text-slate-400">Citizens Protected</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400">11</div>
                <div className="text-sm text-slate-400">Districts Covered</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-32 px-8 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-6xl font-black mb-8">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                Experience the Future of Air Quality Monitoring
              </span>
            </h2>
            <p className="text-2xl text-slate-400 mb-12">
              Join government officials, researchers, and citizens in making data-driven decisions for cleaner air.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onLaunch}
              className="px-16 py-6 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full font-bold text-xl uppercase tracking-wider shadow-2xl shadow-cyan-500/50 hover:shadow-cyan-500/70 transition-all"
            >
              Launch Dashboard Now
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-8 bg-black">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-slate-500 text-sm">
            © 2026 VayuDrishti. Built for India's Future.
          </div>
          <div className="text-slate-500 text-sm">
            Version 5.0 Enhanced • Government Grade
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
}
