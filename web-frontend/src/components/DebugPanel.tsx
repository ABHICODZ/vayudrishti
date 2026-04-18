import React, { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronUp, Activity, Database, Wifi, Clock } from 'lucide-react';

interface DebugLog {
  timestamp: string;
  type: 'request' | 'response' | 'error' | 'info';
  endpoint?: string;
  status?: number;
  duration?: number;
  data?: any;
  message?: string;
}

interface DebugPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DebugPanel: React.FC<DebugPanelProps> = ({ isOpen, onClose }) => {
  const [logs, setLogs] = useState<DebugLog[]>([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const [filter, setFilter] = useState<'all' | 'request' | 'response' | 'error'>('all');

  // Expose global debug logger
  useEffect(() => {
    (window as any).__debugLog = (log: DebugLog) => {
      setLogs(prev => [...prev.slice(-99), { ...log, timestamp: new Date().toISOString() }]);
    };

    return () => {
      delete (window as any).__debugLog;
    };
  }, []);

  if (!isOpen) return null;

  const filteredLogs = logs.filter(log => filter === 'all' || log.type === filter);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'request': return 'text-blue-400';
      case 'response': return 'text-green-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'request': return <Wifi className="w-4 h-4" />;
      case 'response': return <Database className="w-4 h-4" />;
      case 'error': return <Activity className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-[600px] bg-gray-900 border border-gray-700 rounded-lg shadow-2xl z-[9999] font-mono text-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700 rounded-t-lg">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-green-400" />
          <span className="text-white font-semibold">Debug Console</span>
          <span className="text-gray-400 text-xs">({logs.length} logs)</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {isMinimized ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Filters */}
          <div className="flex gap-2 px-4 py-2 bg-gray-850 border-b border-gray-700">
            {['all', 'request', 'response', 'error'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-3 py-1 rounded text-xs transition-colors ${
                  filter === f
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {f.toUpperCase()}
              </button>
            ))}
            <button
              onClick={() => setLogs([])}
              className="ml-auto px-3 py-1 rounded text-xs bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              CLEAR
            </button>
          </div>

          {/* Logs */}
          <div className="h-[400px] overflow-y-auto p-4 space-y-2 bg-gray-900">
            {filteredLogs.length === 0 ? (
              <div className="text-gray-500 text-center py-8">No logs yet</div>
            ) : (
              filteredLogs.map((log, idx) => (
                <div
                  key={idx}
                  className="p-2 bg-gray-800 rounded border border-gray-700 hover:border-gray-600 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={getTypeColor(log.type)}>
                      {getTypeIcon(log.type)}
                    </span>
                    <span className="text-gray-400 text-xs">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                    {log.endpoint && (
                      <span className="text-blue-400 text-xs">{log.endpoint}</span>
                    )}
                    {log.status && (
                      <span className={`text-xs ${log.status < 400 ? 'text-green-400' : 'text-red-400'}`}>
                        {log.status}
                      </span>
                    )}
                    {log.duration && (
                      <span className="text-yellow-400 text-xs">{log.duration}ms</span>
                    )}
                  </div>
                  {log.message && (
                    <div className="text-gray-300 text-xs mb-1">{log.message}</div>
                  )}
                  {log.data && (
                    <details className="text-xs">
                      <summary className="text-gray-400 cursor-pointer hover:text-gray-300">
                        View Data
                      </summary>
                      <pre className="mt-1 p-2 bg-gray-900 rounded text-gray-300 overflow-x-auto">
                        {JSON.stringify(log.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

// Global debug logger utility
export const debugLog = {
  request: (endpoint: string, data?: any) => {
    if ((window as any).__debugLog) {
      (window as any).__debugLog({
        type: 'request',
        endpoint,
        data,
        message: `Requesting ${endpoint}`
      });
    }
  },
  
  response: (endpoint: string, status: number, duration: number, data?: any) => {
    if ((window as any).__debugLog) {
      (window as any).__debugLog({
        type: 'response',
        endpoint,
        status,
        duration,
        data,
        message: `Response from ${endpoint}`
      });
    }
  },
  
  error: (endpoint: string, error: any) => {
    if ((window as any).__debugLog) {
      (window as any).__debugLog({
        type: 'error',
        endpoint,
        message: error.message || String(error),
        data: error
      });
    }
  },
  
  info: (message: string, data?: any) => {
    if ((window as any).__debugLog) {
      (window as any).__debugLog({
        type: 'info',
        message,
        data
      });
    }
  }
};
