import React from 'react';
import { Database, Satellite, Brain, Clock, AlertCircle, CheckCircle } from 'lucide-react';

interface DataSource {
  name: string;
  type: 'waqi' | 'ml' | 'gee' | 'supabase' | 'openmeteo';
  status: 'active' | 'loading' | 'error' | 'unavailable';
}

interface DataSourceIndicatorProps {
  sources: DataSource[];
  lastUpdated?: string;
  queryTime?: number;
  className?: string;
}

export const DataSourceIndicator: React.FC<DataSourceIndicatorProps> = ({
  sources,
  lastUpdated,
  queryTime,
  className = '',
}) => {
  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'waqi':
        return <Satellite className="w-3 h-3" />;
      case 'ml':
        return <Brain className="w-3 h-3" />;
      case 'gee':
        return <Satellite className="w-3 h-3" />;
      case 'supabase':
        return <Database className="w-3 h-3" />;
      case 'openmeteo':
        return <Satellite className="w-3 h-3" />;
      default:
        return <Database className="w-3 h-3" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'loading':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'error':
        return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'unavailable':
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-3 h-3" />;
      case 'loading':
        return <Clock className="w-3 h-3 animate-spin" />;
      case 'error':
        return <AlertCircle className="w-3 h-3" />;
      default:
        return <AlertCircle className="w-3 h-3" />;
    }
  };

  const getSourceLabel = (type: string) => {
    switch (type) {
      case 'waqi':
        return 'WAQI Sensors';
      case 'ml':
        return 'ML Inference';
      case 'gee':
        return 'Google Earth Engine';
      case 'supabase':
        return 'Database';
      case 'openmeteo':
        return 'Open-Meteo';
      default:
        return type.toUpperCase();
    }
  };

  return (
    <div className={`flex flex-wrap items-center gap-2 text-xs ${className}`}>
      {/* Data Sources */}
      <div className="flex items-center gap-1.5">
        <span className="text-gray-400">Sources:</span>
        {sources.map((source, idx) => (
          <div
            key={idx}
            className={`flex items-center gap-1 px-2 py-1 rounded border ${getStatusColor(
              source.status
            )}`}
            title={`${getSourceLabel(source.type)}: ${source.status}`}
          >
            {getSourceIcon(source.type)}
            <span className="font-medium">{getSourceLabel(source.type)}</span>
            {getStatusIcon(source.status)}
          </div>
        ))}
      </div>

      {/* Last Updated */}
      {lastUpdated && (
        <div className="flex items-center gap-1 text-gray-400">
          <Clock className="w-3 h-3" />
          <span>
            Updated: {new Date(lastUpdated).toLocaleTimeString()}
          </span>
        </div>
      )}

      {/* Query Time */}
      {queryTime !== undefined && (
        <div className="flex items-center gap-1 text-gray-400">
          <span>Response: {queryTime}ms</span>
        </div>
      )}
    </div>
  );
};

// Confidence indicator for interpolated vs real data
interface ConfidenceIndicatorProps {
  confidence: 'real' | 'interpolated' | 'forecast';
  className?: string;
}

export const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({
  confidence,
  className = '',
}) => {
  const getConfidenceConfig = () => {
    switch (confidence) {
      case 'real':
        return {
          label: 'Real Sensor Data',
          color: 'text-green-400 bg-green-400/10 border-green-400/20',
          icon: <CheckCircle className="w-3 h-3" />,
        };
      case 'interpolated':
        return {
          label: 'ML Interpolated',
          color: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
          icon: <Brain className="w-3 h-3" />,
        };
      case 'forecast':
        return {
          label: 'Forecast',
          color: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
          icon: <Clock className="w-3 h-3" />,
        };
    }
  };

  const config = getConfidenceConfig();

  return (
    <div
      className={`inline-flex items-center gap-1 px-2 py-1 rounded border text-xs ${config.color} ${className}`}
    >
      {config.icon}
      <span className="font-medium">{config.label}</span>
    </div>
  );
};
