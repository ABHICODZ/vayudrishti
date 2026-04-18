import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function EnhancedLandingPage({ onLaunch }: { onLaunch: () => void }) {
  const [loading, setLoading] = useState(false);

  const handleLaunch = () => {
    setLoading(true);
    setTimeout(() => onLaunch(), 1500);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/50 to-slate-950"></div>
      
      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, rgba(34, 211, 238, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(34, 211, 238, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'gridMove 20s linear infinite'
        }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-8">
        
        {/* Logo Animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, type: "spring", stiffness: 100 }}
          className="mb-12"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-500 blur-3xl opacity-30 animate-pulse"></div>
            <div className="relative w-32 h-32 bg-gradient-to-tr from-cyan-500 to-blue-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-cyan-500/50 border border-cyan-400/30">
              <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-center mb-8"
        >
          <h1 className="font-headline font-black text-7xl md:text-8xl tracking-tighter uppercase mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 animate-gradient">
              VayuDrishti
            </span>
          </h1>
          <p className="font-label text-cyan-400/80 text-sm md:text-base tracking-[0.3em] uppercase">
            Atmospheric Intelligence Command
          </p>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-slate-400 text-center max-w-2xl mb-12 text-lg leading-relaxed"
        >
          Real-time air quality monitoring powered by advanced AI and satellite data.
          <br />
          <span className="text-cyan-400 font-semibold">79.9% PM2.5 accuracy • 75.9% PM10 accuracy</span>
        </motion.p>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="flex gap-8 mb-12"
        >
          <div className="text-center">
            <div className="text-4xl font-black text-cyan-400 mb-1">272</div>
            <div className="text-xs text-slate-500 uppercase tracking-widest">Wards</div>
          </div>
          <div className="w-px bg-slate-700"></div>
          <div className="text-center">
            <div className="text-4xl font-black text-cyan-400 mb-1">24/7</div>
            <div className="text-xs text-slate-500 uppercase tracking-widest">Monitoring</div>
          </div>
          <div className="w-px bg-slate-700"></div>
          <div className="text-center">
            <div className="text-4xl font-black text-cyan-400 mb-1">AI</div>
            <div className="text-xs text-slate-500 uppercase tracking-widest">Powered</div>
          </div>
        </motion.div>

        {/* Launch Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLaunch}
          disabled={loading}
          className="group relative px-12 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full font-headline font-bold text-white uppercase tracking-widest text-sm overflow-hidden shadow-2xl shadow-cyan-500/50 hover:shadow-cyan-500/70 transition-all duration-300 disabled:opacity-50"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center gap-3">
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Initializing...</span>
              </>
            ) : (
              <>
                <span>Launch Dashboard</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </div>
        </motion.button>

        {/* Version Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="absolute bottom-8 text-center"
        >
          <p className="text-slate-600 text-xs uppercase tracking-widest">
            Version 5.0 • Enhanced with Weather & Spatial Features
          </p>
        </motion.div>
      </div>

      {/* Corner Accents */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-cyan-500/10 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/10 blur-3xl"></div>
      
      <style>{`
        @keyframes gridMove {
          0% { transform: translateY(0); }
          100% { transform: translateY(50px); }
        }
      `}</style>
    </div>
  );
}
