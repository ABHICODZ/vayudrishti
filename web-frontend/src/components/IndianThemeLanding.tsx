import React from 'react';
import { motion } from 'framer-motion';

export default function IndianThemeLanding({ onLaunch }: { onLaunch: () => void }) {
  return (
    <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-y-auto min-h-screen">
      {/* Tricolor Accent Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50 flex">
        <div className="flex-1 bg-[#FF9933]"></div>
        <div className="flex-1 bg-white"></div>
        <div className="flex-1 bg-[#138808]"></div>
      </div>

      {/* Animated Particles - Tricolor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              background: i % 3 === 0 ? '#FF9933' : i % 3 === 1 ? '#FFFFFF' : '#138808',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              boxShadow: `0 0 10px ${i % 3 === 0 ? '#FF9933' : i % 3 === 1 ? '#FFFFFF' : '#138808'}`,
            }}
            animate={{
              y: [0, -50, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-8 pt-20">
        {/* India Map Silhouette */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5">
          <svg viewBox="0 0 800 1000" className="w-full max-w-2xl h-auto">
            <motion.path
              d="M400,100 L420,120 L450,150 L480,180 L500,220 L510,260 L515,300 L510,340 L500,380 L485,420 L465,460 L440,500 L410,540 L380,570 L350,590 L320,600 L290,590 L260,570 L235,540 L215,500 L200,460 L190,420 L185,380 L190,340 L200,300 L215,260 L235,220 L260,180 L290,150 L320,120 L350,100 L380,90 Z"
              fill="url(#tricolor)"
              stroke="#FF9933"
              strokeWidth="2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.3 }}
              transition={{ duration: 3 }}
            />
            <defs>
              <linearGradient id="tricolor" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FF9933" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#138808" stopOpacity="0.3" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="relative z-10 text-center max-w-6xl">
          {/* Ashoka Chakra */}
          <motion.div
            className="w-20 h-20 mx-auto mb-8"
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          >
            <svg viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#000080" strokeWidth="3"/>
              <circle cx="50" cy="50" r="40" fill="none" stroke="#000080" strokeWidth="1"/>
              {[...Array(24)].map((_, i) => (
                <g key={i}>
                  <line
                    x1="50"
                    y1="50"
                    x2="50"
                    y2="10"
                    stroke="#000080"
                    strokeWidth="2"
                    transform={`rotate(${i * 15} 50 50)`}
                  />
                  <circle
                    cx="50"
                    cy="15"
                    r="2"
                    fill="#000080"
                    transform={`rotate(${i * 15} 50 50)`}
                  />
                </g>
              ))}
              <circle cx="50" cy="50" r="8" fill="#000080"/>
            </svg>
          </motion.div>

          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-7xl md:text-9xl font-black mb-4 tracking-tighter">
              <span className="bg-gradient-to-r from-[#FF9933] via-white to-[#138808] bg-clip-text text-transparent">
                VayuDrishti
              </span>
            </h1>
            <p className="text-2xl md:text-3xl text-[#FF9933] mb-2 font-bold">
              वायु दृष्टि
            </p>
            <p className="text-xl text-slate-400 mb-12">
              India's National Air Quality Intelligence System
            </p>
          </motion.div>

          {/* Stats Cards with Tricolor Accents */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            {[
              { value: "79.9%", label: "PM2.5 Accuracy", color: "#FF9933", icon: "🎯" },
              { value: "272", label: "Delhi Wards", color: "#FFFFFF", icon: "🏛️" },
              { value: "30M+", label: "Citizens Protected", color: "#138808", icon: "🇮🇳" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.7 + i * 0.1, type: "spring", stiffness: 200 }}
                className="relative bg-slate-900/50 backdrop-blur-xl border-2 rounded-2xl p-8 hover:scale-105 transition-transform"
                style={{ borderColor: stat.color }}
              >
                <div className="absolute top-0 left-0 w-full h-1" style={{ background: stat.color }}></div>
                <div className="text-5xl mb-2">{stat.icon}</div>
                <div className="text-5xl font-black mb-2" style={{ color: stat.color }}>
                  {stat.value}
                </div>
                <div className="text-sm text-slate-400 uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Button with Tricolor Gradient */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(255, 153, 51, 0.5)" }}
            whileTap={{ scale: 0.95 }}
            onClick={onLaunch}
            className="relative px-16 py-6 bg-gradient-to-r from-[#FF9933] via-white to-[#138808] text-black font-bold text-xl rounded-full overflow-hidden group"
          >
            <span className="relative z-10 flex items-center gap-3">
              <span>🇮🇳</span>
              <span>Launch Dashboard</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-[#138808] via-white to-[#FF9933]"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.6 }}
            />
          </motion.button>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="mt-16 text-slate-500 text-sm"
          >
            <div className="flex flex-col items-center gap-2">
              <span>Scroll to explore</span>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                ↓
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Journey Section */}
      <section className="relative py-32 px-8 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-[#FF9933] via-white to-[#138808] bg-clip-text text-transparent">
                Our Journey to Excellence
              </span>
            </h2>
            <p className="text-xl text-slate-400">
              From 59% to 80% accuracy - A testament to Indian innovation
            </p>
          </motion.div>

          {/* Timeline with Tricolor Theme */}
          <div className="space-y-16">
            {[
              { phase: "Phase 1", title: "Deep Analysis", metric: "25+ files", color: "#FF9933" },
              { phase: "Phase 2", title: "Real-World Validation", metric: "69.5% baseline", color: "#FFFFFF" },
              { phase: "Phase 3", title: "Architecture Optimization", metric: "59.2% → 66.8%", color: "#138808" },
              { phase: "Phase 4", title: "Data Expansion", metric: "6x increase", color: "#FF9933" },
              { phase: "Phase 5", title: "Weather & Spatial Intelligence", metric: "29 features", color: "#FFFFFF" },
              { phase: "Phase 6", title: "Target Achieved", metric: "79.9% / 75.9%", color: "#138808" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="flex items-center gap-8"
              >
                <div className="flex-1 text-right">
                  <div
                    className="inline-block px-4 py-2 rounded-full font-bold mb-2"
                    style={{ backgroundColor: item.color, color: item.color === "#FFFFFF" ? "#000" : "#FFF" }}
                  >
                    {item.phase}
                  </div>
                  <h3 className="text-2xl font-bold">{item.title}</h3>
                  <p className="text-lg" style={{ color: item.color }}>{item.metric}</p>
                </div>
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color, boxShadow: `0 0 20px ${item.color}` }}></div>
                <div className="flex-1"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section with India Focus */}
      <section className="relative py-32 px-8 bg-slate-900">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-8xl mb-8">🇮🇳</div>
            <h2 className="text-5xl font-black mb-6">
              <span className="bg-gradient-to-r from-[#FF9933] via-white to-[#138808] bg-clip-text text-transparent">
                Serving the Nation
              </span>
            </h2>
            <p className="text-2xl text-slate-300 max-w-3xl mx-auto mb-12">
              Monitoring 272 wards across Delhi NCR, protecting over 30 million citizens with real-time air quality intelligence.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: "272", label: "Wards" },
                { value: "30M+", label: "Citizens" },
                { value: "11", label: "Districts" },
                { value: "24/7", label: "Monitoring" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="text-5xl font-black text-[#FF9933] mb-2">{stat.value}</div>
                  <div className="text-sm text-slate-400 uppercase tracking-wider">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-32 px-8 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-black mb-8">
              <span className="bg-gradient-to-r from-[#FF9933] via-white to-[#138808] bg-clip-text text-transparent">
                Join India's Air Quality Revolution
              </span>
            </h2>
            <p className="text-2xl text-slate-400 mb-12">
              Be part of the movement for cleaner air and healthier cities
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onLaunch}
              className="px-16 py-6 bg-gradient-to-r from-[#FF9933] via-white to-[#138808] text-black font-bold text-xl rounded-full shadow-2xl"
            >
              🇮🇳 Launch Dashboard Now
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer with Tricolor */}
      <footer className="border-t border-white/10 py-8 px-8 bg-slate-950">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-slate-500 text-sm">
            © 2026 VayuDrishti. Built for India's Future.
          </div>
          <div className="flex gap-2">
            <div className="w-8 h-8 rounded-full bg-[#FF9933]"></div>
            <div className="w-8 h-8 rounded-full bg-white"></div>
            <div className="w-8 h-8 rounded-full bg-[#138808]"></div>
          </div>
        </div>
      </footer>
    </div>
  );
}
