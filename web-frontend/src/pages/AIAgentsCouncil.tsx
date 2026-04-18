import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'thinking' | 'idle';
  avatar: string;
  lastAction: string;
  confidence: number;
}

export default function AIAgentsCouncil() {
  const [agents, setAgents] = useState<Agent[]>([
    { id: '1', name: 'Sentinel', role: 'AQI Predictor', status: 'active', avatar: '🛡️', lastAction: 'Analyzing PM2.5 trends', confidence: 94 },
    { id: '2', name: 'Oracle', role: 'Policy Advisor', status: 'thinking', avatar: '🔮', lastAction: 'Generating recommendations', confidence: 87 },
    { id: '3', name: 'Scout', role: 'Satellite Monitor', status: 'active', avatar: '🛰️', lastAction: 'Processing GEE data', confidence: 91 },
    { id: '4', name: 'Guardian', role: 'Health Protector', status: 'idle', avatar: '💚', lastAction: 'Monitoring asthma alerts', confidence: 96 },
    { id: '5', name: 'Strategist', role: 'Resource Optimizer', status: 'thinking', avatar: '⚡', lastAction: 'Optimizing cleanup routes', confidence: 89 }
  ]);

  const [councilDecision, setCouncilDecision] = useState<string>('');
  const [isDeliberating, setIsDeliberating] = useState(false);

  const startDeliberation = async () => {
    setIsDeliberating(true);
    setCouncilDecision('');
    
    // Simulate agent deliberation
    const decisions = [
      'Deploy air purifiers to Dwarka Sector 10 (AQI 312)',
      'Issue traffic restrictions in Connaught Place',
      'Activate emergency protocols in 3 critical zones',
      'Recommend industrial shutdown in East Delhi',
      'Increase public transport frequency by 40%'
    ];
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    setCouncilDecision(decisions[Math.floor(Math.random() * decisions.length)]);
    setIsDeliberating(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tight text-white">AI Agents Council</h2>
          <p className="text-sm text-slate-400 mt-1">Multi-agent collaborative intelligence system</p>
        </div>
        <button
          onClick={startDeliberation}
          disabled={isDeliberating}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
        >
          {isDeliberating ? 'Deliberating...' : 'Start Council Meeting'}
        </button>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-5 gap-4">
        {agents.map((agent) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 hover:border-purple-500/50 transition-all"
          >
            <div className="flex flex-col items-center text-center">
              <div className="text-5xl mb-3">{agent.avatar}</div>
              <h3 className="font-bold text-white text-sm">{agent.name}</h3>
              <p className="text-xs text-slate-400 mb-2">{agent.role}</p>
              
              <div className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase mb-2 ${
                agent.status === 'active' ? 'bg-green-500/20 text-green-400' :
                agent.status === 'thinking' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-slate-500/20 text-slate-400'
              }`}>
                {agent.status}
              </div>
              
              <p className="text-xs text-slate-500 mb-2">{agent.lastAction}</p>
              
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                  style={{ width: `${agent.confidence}%` }}
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">{agent.confidence}% confidence</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Council Decision */}
      <AnimatePresence>
        {(isDeliberating || councilDecision) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🏛️</span>
              <h3 className="text-xl font-bold text-white">Council Decision</h3>
            </div>
            
            {isDeliberating ? (
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-slate-300">Agents are deliberating...</p>
              </div>
            ) : (
              <div className="bg-slate-900/50 rounded-lg p-4 border border-purple-500/20">
                <p className="text-lg text-white font-medium">{councilDecision}</p>
                <div className="flex gap-3 mt-4">
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 transition-all">
                    Approve & Execute
                  </button>
                  <button className="px-4 py-2 bg-slate-700 text-white rounded-lg text-sm font-bold hover:bg-slate-600 transition-all">
                    Request Revision
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Agent Activity Log */}
      <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined">history</span>
          Recent Agent Activity
        </h3>
        <div className="space-y-2">
          {[
            { agent: 'Sentinel', action: 'Predicted AQI spike in 3 zones', time: '2 min ago', type: 'warning' },
            { agent: 'Oracle', action: 'Generated 5 policy recommendations', time: '5 min ago', type: 'success' },
            { agent: 'Scout', action: 'Detected biomass burning anomaly', time: '8 min ago', type: 'alert' },
            { agent: 'Guardian', action: 'Sent 127 asthma safety alerts', time: '12 min ago', type: 'info' },
            { agent: 'Strategist', action: 'Optimized cleanup crew routes', time: '15 min ago', type: 'success' }
          ].map((log, i) => (
            <div key={i} className="flex items-center justify-between bg-slate-900/50 p-3 rounded-lg border border-slate-800">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  log.type === 'warning' ? 'bg-yellow-500' :
                  log.type === 'alert' ? 'bg-red-500' :
                  log.type === 'success' ? 'bg-green-500' :
                  'bg-blue-500'
                }`} />
                <span className="text-sm font-bold text-white">{log.agent}</span>
                <span className="text-sm text-slate-400">{log.action}</span>
              </div>
              <span className="text-xs text-slate-500">{log.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
