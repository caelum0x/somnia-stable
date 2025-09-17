'use client';

import React, { useState, useEffect } from 'react';

interface QuantumSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'cyan' | 'purple' | 'pink' | 'green';
  speed?: 'slow' | 'normal' | 'fast';
}

export const QuantumSpinner: React.FC<QuantumSpinnerProps> = ({
  size = 'md',
  color = 'cyan',
  speed = 'normal'
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorClasses = {
    cyan: 'border-cyan-500',
    purple: 'border-purple-500',
    pink: 'border-pink-500',
    green: 'border-green-500'
  };

  const speedClasses = {
    slow: 'animate-spin',
    normal: 'animate-spin',
    fast: 'animate-spin'
  };

  const speedDuration = {
    slow: '3s',
    normal: '1.5s', 
    fast: '0.8s'
  };

  return (
    <div className="relative inline-block">
      {/* Outer ring */}
      <div 
        className={`${sizeClasses[size]} ${colorClasses[color]} border-4 border-t-transparent rounded-full ${speedClasses[speed]}`}
        style={{ animationDuration: speedDuration[speed] }}
      />
      {/* Inner ring */}
      <div 
        className={`absolute inset-1 ${colorClasses[color]} border-2 border-b-transparent rounded-full`}
        style={{ 
          animation: `spin ${speedDuration[speed]} linear infinite reverse`,
          animationDuration: `calc(${speedDuration[speed]} * 1.5)`
        }}
      />
      {/* Center dot */}
      <div className={`absolute inset-0 flex items-center justify-center`}>
        <div className={`w-1 h-1 ${color === 'cyan' ? 'bg-cyan-400' : color === 'purple' ? 'bg-purple-400' : color === 'pink' ? 'bg-pink-400' : 'bg-green-400'} rounded-full animate-pulse`} />
      </div>
    </div>
  );
};

interface QuantumDotsProps {
  count?: number;
  color?: string;
  size?: number;
}

export const QuantumDots: React.FC<QuantumDotsProps> = ({
  count = 3,
  color = '#00ffff',
  size = 8
}) => {
  return (
    <div className="flex items-center space-x-1">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-full animate-pulse"
          style={{
            width: size,
            height: size,
            backgroundColor: color,
            animationDelay: `${i * 0.2}s`,
            animationDuration: '1.4s',
            boxShadow: `0 0 ${size}px ${color}`
          }}
        />
      ))}
    </div>
  );
};

interface QuantumWaveProps {
  amplitude?: number;
  frequency?: number;
  color?: string;
}

export const QuantumWave: React.FC<QuantumWaveProps> = ({
  amplitude = 20,
  frequency = 2,
  color = '#00ffff'
}) => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase(prev => prev + 0.1);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const generatePath = () => {
    const width = 100;
    const height = amplitude * 2;
    const points = 50;
    let path = `M 0 ${height / 2}`;
    
    for (let i = 0; i <= points; i++) {
      const x = (i / points) * width;
      const y = height / 2 + Math.sin((i / points) * Math.PI * frequency + phase) * amplitude;
      path += ` L ${x} ${y}`;
    }
    
    return path;
  };

  return (
    <div className="quantum-wave">
      <svg width="100" height={amplitude * 2} className="overflow-visible">
        <path
          d={generatePath()}
          fill="none"
          stroke={color}
          strokeWidth="2"
          opacity="0.8"
          filter="drop-shadow(0 0 6px currentColor)"
        />
      </svg>
    </div>
  );
};

interface QuantumMatrixProps {
  rows?: number;
  cols?: number;
  animationSpeed?: number;
}

export const QuantumMatrix: React.FC<QuantumMatrixProps> = ({
  rows = 3,
  cols = 3,
  animationSpeed = 1000
}) => {
  const [activeCell, setActiveCell] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCell(prev => (prev + 1) % (rows * cols));
    }, animationSpeed);
    return () => clearInterval(interval);
  }, [rows, cols, animationSpeed]);

  return (
    <div 
      className="grid gap-1"
      style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
    >
      {Array.from({ length: rows * cols }).map((_, i) => (
        <div
          key={i}
          className={`w-3 h-3 rounded-sm transition-all duration-300 ${
            i === activeCell
              ? 'bg-cyan-400 shadow-lg shadow-cyan-400/50 scale-110'
              : i === (activeCell - 1 + rows * cols) % (rows * cols) ||
                i === (activeCell + 1) % (rows * cols)
              ? 'bg-cyan-600/70'
              : 'bg-slate-700'
          }`}
        />
      ))}
    </div>
  );
};

interface QuantumProgressProps {
  progress: number;
  color?: string;
  height?: number;
  showPercentage?: boolean;
  animated?: boolean;
}

export const QuantumProgress: React.FC<QuantumProgressProps> = ({
  progress,
  color = '#00ffff',
  height = 8,
  showPercentage = true,
  animated = true
}) => {
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    if (animated) {
      const interval = setInterval(() => {
        setDisplayProgress(prev => {
          const diff = progress - prev;
          if (Math.abs(diff) < 0.1) return progress;
          return prev + diff * 0.1;
        });
      }, 16);
      return () => clearInterval(interval);
    } else {
      setDisplayProgress(progress);
    }
  }, [progress, animated]);

  return (
    <div className="quantum-progress w-full">
      <div 
        className="bg-slate-800 rounded-full overflow-hidden border border-gray-600/30"
        style={{ height }}
      >
        <div
          className="h-full transition-all duration-300 relative overflow-hidden"
          style={{
            width: `${displayProgress}%`,
            background: `linear-gradient(90deg, ${color}, rgba(255,255,255,0.3), ${color})`,
            boxShadow: `0 0 ${height}px ${color}50`
          }}
        >
          {animated && (
            <div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"
              style={{ animationDuration: '2s' }}
            />
          )}
        </div>
      </div>
      {showPercentage && (
        <div className="text-xs text-gray-400 mt-1 text-center">
          {Math.round(displayProgress)}%
        </div>
      )}
    </div>
  );
};

interface DataTransferLoaderProps {
  message?: string;
  speed?: number;
}

export const DataTransferLoader: React.FC<DataTransferLoaderProps> = ({
  message = "Synchronizing quantum state...",
  speed = 1
}) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev.length >= 3) return '';
        return prev + '.';
      });
    }, 500 / speed);
    return () => clearInterval(interval);
  }, [speed]);

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <QuantumSpinner size="lg" color="cyan" speed="normal" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping" />
        </div>
      </div>
      
      <div className="text-center">
        <div className="text-cyan-400 font-medium">
          {message}{dots}
        </div>
        <div className="flex items-center justify-center space-x-1 mt-2">
          <QuantumDots count={5} color="#00ffff" size={4} />
        </div>
      </div>
    </div>
  );
};

interface TransactionLoaderProps {
  stage: 'preparing' | 'signing' | 'broadcasting' | 'confirming' | 'completed' | 'failed';
  txHash?: string;
  message?: string;
}

export const TransactionLoader: React.FC<TransactionLoaderProps> = ({
  stage,
  txHash,
  message
}) => {
  const stages = [
    { key: 'preparing', label: 'Preparing Transaction', icon: '⚙️' },
    { key: 'signing', label: 'Awaiting Signature', icon: '✍️' },
    { key: 'broadcasting', label: 'Broadcasting to Network', icon: '📡' },
    { key: 'confirming', label: 'Confirming on Blockchain', icon: '⏳' },
    { key: 'completed', label: 'Transaction Confirmed', icon: '✅' },
    { key: 'failed', label: 'Transaction Failed', icon: '❌' }
  ];

  const currentStageIndex = stages.findIndex(s => s.key === stage);
  const currentStage = stages[currentStageIndex];

  return (
    <div className="quantum-card p-6 max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="text-4xl mb-2 animate-bounce">
          {currentStage?.icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-2">
          {currentStage?.label}
        </h3>
        {message && (
          <p className="text-gray-400 text-sm">{message}</p>
        )}
      </div>

      {/* Progress Steps */}
      <div className="space-y-3 mb-6">
        {stages.slice(0, -1).map((stageItem, index) => {
          const isActive = index === currentStageIndex;
          const isCompleted = index < currentStageIndex;
          const isPending = index > currentStageIndex;

          return (
            <div
              key={stageItem.key}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
                isActive
                  ? 'bg-cyan-500/20 border border-cyan-500/30'
                  : isCompleted
                  ? 'bg-green-500/10 border border-green-500/20'
                  : 'bg-slate-800/50 border border-gray-600/20'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                isActive
                  ? 'bg-cyan-500 text-white animate-pulse'
                  : isCompleted
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-600 text-gray-300'
              }`}>
                {isCompleted ? '✓' : isActive ? <QuantumSpinner size="sm" color="cyan" /> : index + 1}
              </div>
              <span className={`flex-1 ${
                isActive ? 'text-cyan-300' : isCompleted ? 'text-green-300' : 'text-gray-400'
              }`}>
                {stageItem.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Transaction Hash */}
      {txHash && (
        <div className="bg-slate-800/50 border border-gray-600/30 rounded-lg p-3">
          <div className="text-xs text-gray-400 mb-1">Transaction Hash</div>
          <div className="font-mono text-cyan-400 text-sm break-all">
            {txHash}
          </div>
        </div>
      )}

      {/* Status indicator */}
      {stage === 'failed' && (
        <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm text-center">
          Transaction failed. Please try again.
        </div>
      )}
    </div>
  );
};

export default {
  QuantumSpinner,
  QuantumDots,
  QuantumWave,
  QuantumMatrix,
  QuantumProgress,
  DataTransferLoader,
  TransactionLoader
};