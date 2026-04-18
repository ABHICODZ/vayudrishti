/**
 * VayuDrishti System Interface
 * 
 * Design Philosophy:
 * - National-scale system interface, not a website
 * - Apple-level clarity + Government-grade seriousness
 * - ISRO control-room precision
 * - Minimal but deep - every element matters
 * - Scrollable, intentional, hierarchical
 * 
 * NO: Generic AI UI, glassmorphism, flashy effects
 * YES: Calm, confident, intelligent, purpose-driven
 */

import React, { useEffect, useState, useRef } from 'react';
import { Activity, Satellite, Brain, Database, MapPin, Clock, TrendingUp } from 'lucide-react';

interface SystemMetrics {
  stations: number;
  wards: number;
  lastUpdate: string;
  avgAqi: number;
  status: 'operational' | 'degraded' | 'offline';
}

interface SystemLandingProps {
  onEnter: () => void;
}

export const SystemLanding: React.FC<SystemLandingProps> = ({ onEnter }) => {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    stations: 42,
    wards: 251,
    lastUpdate: 'Live',
    avgAqi: 0,
    status: 'operational'
  });
  
  const [scrollProgress, setScrollProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Subtle particle field for pollution visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{ x: number; y: number; vx: number; vy: number; opacity: number }> = [];
    
    // Create minimal particle field
    for (let i = 0; i < 30; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        opacity: Math.random() * 0.3
      });
    }

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100, 116, 139, ${p.opacity})`;
        ctx.fill();
      });
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(scrolled / maxScroll);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-50 overflow-x-hidden">
      {/* Subtle background particle field */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none opacity-40"
        style={{ zIndex: 0 }}
      />

      {/* Scroll progress indicator - minimal */}
      <div 
        className="fixed top-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-orange-500 transition-all duration-300 z-50"
        style={{ width: `${scrollProgress * 100}%` }}
      />

      {/* System Status Bar - Always visible */}
      <div className="fixed top-0 right-0 z-40 p-6 flex items-center gap-4 text-xs font-mono">
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${
            metrics.status === 'operational' ? 'bg-green-400' : 'bg-yellow-400'
          } animate-pulse`} />
          <span className="text-slate-400 uppercase tracking-wider">System {metrics.status}</span>
        </div>
        <div className="text-slate-500">|</div>
        <div className="text-slate-400">{metrics.lastUpdate}</div>
      </div>

      <div className="relative z-10">
        {/* HERO - Clear Statement, Minimal, Strong Typography */}
        <section className="min-h-screen flex items-center justify-center px-6">
          <div className="max-w-5xl w-full">
            {/* System Identifier */}
            <div className="mb-12 flex items-center gap-3">
              <div className="w-8 h-0.5 bg-gradient-to-r from-blue-500 to-transparent" />
              <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                National Air Intelligence System
              </span>
            </div>

            {/* Main Statement */}
            <h1 className="text-7xl md:text-8xl font-light tracking-tight mb-8 leading-none">
              VayuDrishti
            </h1>
            
            <p className="text-2xl md:text-3xl text-slate-400 font-light max-w-3xl mb-16 leading-relaxed">
              Real-time atmospheric intelligence for governance and decision-making across 251 urban zones.
            </p>

            {/* Live System Metrics - Minimal, Precise */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl">
              <div className="border-l border-slate-700 pl-4">
                <div className="text-4xl font-light mb-1">{metrics.stations}</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider">Live Sensors</div>
              </div>
              <div className="border-l border-slate-700 pl-4">
                <div className="text-4xl font-light mb-1">{metrics.wards}</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider">Urban Zones</div>
              </div>
              <div className="border-l border-slate-700 pl-4">
                <div className="text-4xl font-light mb-1">5m</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider">Refresh Cycle</div>
              </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
              <div className="text-xs text-slate-500 uppercase tracking-widest">Scroll</div>
              <div className="w-px h-12 bg-gradient-to-b from-slate-500 to-transparent" />
            </div>
          </div>
        </section>

        {/* SYSTEM OVERVIEW - What it does, why it matters */}
        <section className="min-h-screen flex items-center px-6 py-24">
          <div className="max-w-5xl mx-auto w-full">
            <div className="grid md:grid-cols-2 gap-16">
              <div>
                <h2 className="text-5xl font-light mb-8 leading-tight">
                  Atmospheric intelligence at national scale
                </h2>
                <p className="text-lg text-slate-400 leading-relaxed mb-6">
                  VayuDrishti combines satellite observation, ground sensor networks, and spatial machine learning to provide real-time air quality intelligence across urban India.
                </p>
                <p className="text-lg text-slate-400 leading-relaxed">
                  Built for governance, monitoring, and evidence-based policy intervention.
                </p>
              </div>

              <div className="space-y-6">
                {/* Data Sources - Clean, Structured */}
                <div className="border border-slate-800 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Satellite className="w-5 h-5 text-blue-400" />
                    <span className="text-sm font-mono text-slate-300 uppercase tracking-wider">Data Sources</span>
                  </div>
                  <div className="space-y-3 text-sm text-slate-400">
                    <div className="flex justify-between">
                      <span>WAQI Ground Sensors</span>
                      <span className="text-green-400">Active</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Google Earth Engine</span>
                      <span className="text-green-400">Active</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Open-Meteo Atmospheric</span>
                      <span className="text-green-400">Active</span>
                    </div>
                  </div>
                </div>

                {/* Processing Pipeline */}
                <div className="border border-slate-800 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Brain className="w-5 h-5 text-purple-400" />
                    <span className="text-sm font-mono text-slate-300 uppercase tracking-wider">Processing</span>
                  </div>
                  <div className="space-y-3 text-sm text-slate-400">
                    <div className="flex justify-between">
                      <span>Spatial ML Inference</span>
                      <span className="text-green-400">Running</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Temporal Neural Network</span>
                      <span className="text-green-400">Running</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Policy AI (Gemini 1.5)</span>
                      <span className="text-yellow-400">Limited</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CAPABILITIES - Real-time monitoring, satellite intelligence, AI decision engine */}
        <section className="min-h-screen flex items-center px-6 py-24 bg-slate-900/30">
          <div className="max-w-6xl mx-auto w-full">
            <h2 className="text-5xl font-light mb-16">System Capabilities</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Capability 1 */}
              <div className="border border-slate-800 p-8 hover:border-slate-700 transition-colors">
                <Activity className="w-8 h-8 text-blue-400 mb-6" />
                <h3 className="text-2xl font-light mb-4">Real-Time Monitoring</h3>
                <p className="text-slate-400 leading-relaxed mb-6">
                  Continuous ingestion from 42 ground sensors with 5-minute refresh cycles. Spatial interpolation across 251 urban zones.
                </p>
                <div className="text-xs text-slate-500 font-mono uppercase tracking-wider">
                  Latency: &lt;30s
                </div>
              </div>

              {/* Capability 2 */}
              <div className="border border-slate-800 p-8 hover:border-slate-700 transition-colors">
                <Satellite className="w-8 h-8 text-purple-400 mb-6" />
                <h3 className="text-2xl font-light mb-4">Satellite Intelligence</h3>
                <p className="text-slate-400 leading-relaxed mb-6">
                  Integration with Google Earth Engine for atmospheric chemistry, wind patterns, and pollution dispersion modeling.
                </p>
                <div className="text-xs text-slate-500 font-mono uppercase tracking-wider">
                  Resolution: 10km grid
                </div>
              </div>

              {/* Capability 3 */}
              <div className="border border-slate-800 p-8 hover:border-slate-700 transition-colors">
                <Brain className="w-8 h-8 text-green-400 mb-6" />
                <h3 className="text-2xl font-light mb-4">AI Decision Engine</h3>
                <p className="text-slate-400 leading-relaxed mb-6">
                  Temporal neural networks for prediction. Gemini 1.5 Pro for policy recommendation generation based on real-time hotspots.
                </p>
                <div className="text-xs text-slate-500 font-mono uppercase tracking-wider">
                  Inference: 251 zones/cycle
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* LIVE SYSTEM PREVIEW - Data blocks, trust indicators */}
        <section className="min-h-screen flex items-center px-6 py-24">
          <div className="max-w-6xl mx-auto w-full">
            <div className="mb-16">
              <h2 className="text-5xl font-light mb-4">Live System State</h2>
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <Clock className="w-4 h-4" />
                <span>Last updated: {new Date().toLocaleTimeString()}</span>
                <span className="text-slate-700">|</span>
                <span>Source: WAQI + ML Inference</span>
              </div>
            </div>

            {/* System State Grid */}
            <div className="grid md:grid-cols-4 gap-6 mb-12">
              <div className="border border-slate-800 p-6">
                <div className="text-3xl font-light mb-2">42</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-4">Active Sensors</div>
                <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-green-400 w-full" />
                </div>
              </div>

              <div className="border border-slate-800 p-6">
                <div className="text-3xl font-light mb-2">251</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-4">Zones Monitored</div>
                <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-400 w-full" />
                </div>
              </div>

              <div className="border border-slate-800 p-6">
                <div className="text-3xl font-light mb-2">3</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-4">Data Sources</div>
                <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-400 w-full" />
                </div>
              </div>

              <div className="border border-slate-800 p-6">
                <div className="text-3xl font-light mb-2">5m</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-4">Refresh Cycle</div>
                <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-400 w-3/4" />
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="border border-slate-800 p-8">
              <div className="text-sm font-mono text-slate-400 uppercase tracking-wider mb-6">
                Data Integrity
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span className="text-sm text-slate-300">Real Sensor Data</span>
                  </div>
                  <div className="text-xs text-slate-500">42 WAQI stations, verified</div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                    <span className="text-sm text-slate-300">ML Interpolated</span>
                  </div>
                  <div className="text-xs text-slate-500">Spatial inference, 251 zones</div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-purple-400" />
                    <span className="text-sm text-slate-300">Satellite Derived</span>
                  </div>
                  <div className="text-xs text-slate-500">GEE atmospheric data</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* GOVERNANCE IMPACT - How it helps decisions */}
        <section className="min-h-screen flex items-center px-6 py-24 bg-slate-900/30">
          <div className="max-w-5xl mx-auto w-full">
            <h2 className="text-5xl font-light mb-16">Governance Impact</h2>
            
            <div className="space-y-12">
              <div className="border-l-2 border-blue-500 pl-8">
                <h3 className="text-2xl font-light mb-4">Evidence-Based Policy</h3>
                <p className="text-lg text-slate-400 leading-relaxed">
                  Real-time hotspot identification enables targeted intervention. AI-generated policy recommendations based on atmospheric chemistry and pollution source classification.
                </p>
              </div>

              <div className="border-l-2 border-purple-500 pl-8">
                <h3 className="text-2xl font-light mb-4">Resource Optimization</h3>
                <p className="text-lg text-slate-400 leading-relaxed">
                  Spatial intelligence allows efficient allocation of monitoring resources and enforcement teams. Predictive modeling for proactive measures.
                </p>
              </div>

              <div className="border-l-2 border-green-500 pl-8">
                <h3 className="text-2xl font-light mb-4">Public Transparency</h3>
                <p className="text-lg text-slate-400 leading-relaxed">
                  Open data access with full source attribution. Every data point labeled with confidence level and source. No fake behavior.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA - Minimal, Clear */}
        <section className="min-h-screen flex items-center justify-center px-6">
          <div className="max-w-3xl w-full text-center">
            <h2 className="text-6xl font-light mb-8">Access the System</h2>
            <p className="text-xl text-slate-400 mb-12">
              VayuDrishti is operational and serving real-time intelligence.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onEnter}
                className="px-8 py-4 bg-slate-50 text-slate-950 hover:bg-slate-200 transition-colors text-sm font-mono uppercase tracking-wider cursor-pointer"
              >
                Enter Dashboard
              </button>
              <button
                onClick={onEnter}
                className="px-8 py-4 border border-slate-700 hover:border-slate-600 transition-colors text-sm font-mono uppercase tracking-wider cursor-pointer"
              >
                Admin Access
              </button>
            </div>

            {/* System Info */}
            <div className="mt-16 pt-16 border-t border-slate-800">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-xs text-slate-500">
                <div>
                  <div className="mb-1">Backend</div>
                  <div className="text-slate-400">Cloud Run</div>
                </div>
                <div>
                  <div className="mb-1">Region</div>
                  <div className="text-slate-400">us-central1</div>
                </div>
                <div>
                  <div className="mb-1">Status</div>
                  <div className="text-green-400">Operational</div>
                </div>
                <div>
                  <div className="mb-1">Version</div>
                  <div className="text-slate-400">v1.0.0</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer - Minimal */}
        <footer className="border-t border-slate-800 px-6 py-12">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-6 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500" />
              <span className="font-mono uppercase tracking-widest">VayuDrishti</span>
            </div>
            <div className="flex gap-8">
              <span>National Air Intelligence System</span>
              <span>•</span>
              <span>Real-time monitoring across 251 zones</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
