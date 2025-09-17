'use client';

import React, { useState, useEffect, useRef } from 'react';
import { TransactionLoader } from './QuantumLoaders';

interface TransactionParticle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
}

interface QuantumTransactionVisualizerProps {
  isActive: boolean;
  transactionType: 'deposit' | 'withdraw' | 'mint' | 'transfer';
  amount?: string;
  onComplete?: () => void;
}

export const QuantumTransactionVisualizer: React.FC<QuantumTransactionVisualizerProps> = ({
  isActive,
  transactionType,
  amount,
  onComplete
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<TransactionParticle[]>([]);
  const animationRef = useRef<number | undefined>(undefined);
  const [stage, setStage] = useState(0);

  const transactionConfig = {
    deposit: {
      color: '#00ff88',
      particleCount: 50,
      pattern: 'flow-in',
      duration: 3000
    },
    withdraw: {
      color: '#ff8800',
      particleCount: 40,
      pattern: 'flow-out',
      duration: 2500
    },
    mint: {
      color: '#8800ff',
      particleCount: 60,
      pattern: 'explosion',
      duration: 4000
    },
    transfer: {
      color: '#00ffff',
      particleCount: 35,
      pattern: 'stream',
      duration: 2000
    }
  };

  const config = transactionConfig[transactionType];

  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 400;
    canvas.height = 300;

    const createParticle = (x: number, y: number): TransactionParticle => ({
      id: Math.random().toString(36),
      x,
      y,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      size: Math.random() * 4 + 2,
      opacity: 1,
      color: config.color,
      life: 0,
      maxLife: 60 + Math.random() * 60
    });

    const initParticles = () => {
      particlesRef.current = [];
      
      switch (config.pattern) {
        case 'flow-in':
          // Particles flow from edges to center
          for (let i = 0; i < config.particleCount; i++) {
            const side = Math.floor(Math.random() * 4);
            let x, y;
            
            switch (side) {
              case 0: x = Math.random() * 400; y = 0; break;
              case 1: x = 400; y = Math.random() * 300; break;
              case 2: x = Math.random() * 400; y = 300; break;
              default: x = 0; y = Math.random() * 300; break;
            }
            
            const particle = createParticle(x, y);
            const centerX = 200;
            const centerY = 150;
            const angle = Math.atan2(centerY - y, centerX - x);
            particle.vx = Math.cos(angle) * 2;
            particle.vy = Math.sin(angle) * 2;
            particlesRef.current.push(particle);
          }
          break;
          
        case 'flow-out':
          // Particles flow from center to edges
          for (let i = 0; i < config.particleCount; i++) {
            const particle = createParticle(200 + (Math.random() - 0.5) * 50, 150 + (Math.random() - 0.5) * 50);
            const angle = Math.random() * Math.PI * 2;
            particle.vx = Math.cos(angle) * 3;
            particle.vy = Math.sin(angle) * 3;
            particlesRef.current.push(particle);
          }
          break;
          
        case 'explosion':
          // Particles explode from center
          for (let i = 0; i < config.particleCount; i++) {
            const particle = createParticle(200, 150);
            const angle = (i / config.particleCount) * Math.PI * 2;
            const speed = 1 + Math.random() * 4;
            particle.vx = Math.cos(angle) * speed;
            particle.vy = Math.sin(angle) * speed;
            particle.color = `hsl(${280 + Math.random() * 40}, 100%, 60%)`;
            particlesRef.current.push(particle);
          }
          break;
          
        case 'stream':
          // Particles stream horizontally
          for (let i = 0; i < config.particleCount; i++) {
            const particle = createParticle(0, 150 + (Math.random() - 0.5) * 100);
            particle.vx = 2 + Math.random() * 2;
            particle.vy = (Math.random() - 0.5) * 0.5;
            particlesRef.current.push(particle);
          }
          break;
      }
    };

    const updateParticles = () => {
      particlesRef.current.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life++;
        
        // Fade out over time
        particle.opacity = Math.max(0, 1 - particle.life / particle.maxLife);
        
        // Add quantum fluctuations
        particle.vx += (Math.random() - 0.5) * 0.1;
        particle.vy += (Math.random() - 0.5) * 0.1;
        
        // Apply damping
        particle.vx *= 0.99;
        particle.vy *= 0.99;
        
        // Remove dead particles
        if (particle.life >= particle.maxLife || particle.opacity <= 0) {
          particlesRef.current.splice(index, 1);
        }
      });
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw connection lines
      ctx.strokeStyle = config.color + '20';
      ctx.lineWidth = 1;
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const p1 = particlesRef.current[i];
          const p2 = particlesRef.current[j];
          const distance = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
          
          if (distance < 60) {
            ctx.globalAlpha = (60 - distance) / 60 * 0.3;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
      
      // Draw particles
      particlesRef.current.forEach(particle => {
        ctx.save();
        
        // Quantum glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = particle.color;
        
        // Draw particle
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw quantum trail
        ctx.globalAlpha = particle.opacity * 0.3;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(
          particle.x - particle.vx * 3,
          particle.y - particle.vy * 3,
          particle.size * 0.5,
          0,
          Math.PI * 2
        );
        ctx.fill();
        
        ctx.restore();
      });
    };

    const animate = () => {
      updateParticles();
      drawParticles();
      
      if (particlesRef.current.length > 0) {
        animationRef.current = requestAnimationFrame(animate);
      } else if (onComplete) {
        onComplete();
      }
    };

    initParticles();
    animate();

    // Progress stages
    const stageInterval = setInterval(() => {
      setStage(prev => prev + 1);
    }, config.duration / 4);

    const cleanup = setTimeout(() => {
      if (onComplete) onComplete();
    }, config.duration);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      clearInterval(stageInterval);
      clearTimeout(cleanup);
    };
  }, [isActive, transactionType, config, onComplete]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="quantum-card p-8 max-w-lg mx-4">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-white mb-2">
            Quantum {transactionType.charAt(0).toUpperCase() + transactionType.slice(1)}
          </h3>
          {amount && (
            <p className="text-gray-300">
              Processing {amount}
            </p>
          )}
        </div>

        {/* Quantum Animation Canvas */}
        <div className="relative mb-6">
          <canvas
            ref={canvasRef}
            className="w-full h-64 rounded-lg border border-gray-600/30"
            style={{ background: 'radial-gradient(circle at center, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.95) 100%)' }}
          />
          
          {/* Center Portal */}
          <div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border-2 animate-pulse"
            style={{ 
              borderColor: config.color,
              boxShadow: `0 0 20px ${config.color}50, inset 0 0 20px ${config.color}30`
            }}
          />
        </div>

        {/* Progress Indicators */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-500 ${
                i <= stage
                  ? `bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg`
                  : 'bg-gray-700'
              }`}
              style={{
                boxShadow: i <= stage ? `0 0 10px ${config.color}80` : 'none'
              }}
            />
          ))}
        </div>

        {/* Stage Description */}
        <div className="text-center">
          <div className="text-cyan-400 font-medium mb-2">
            {stage === 0 && 'Initializing quantum field...'}
            {stage === 1 && 'Preparing transaction matrix...'}
            {stage === 2 && 'Broadcasting to quantum network...'}
            {stage === 3 && 'Confirming quantum entanglement...'}
            {stage >= 4 && 'Transaction completed!'}
          </div>
          <div className="text-sm text-gray-400">
            Quantum encryption active • Somnia Network
          </div>
        </div>
      </div>
    </div>
  );
};

interface QuantumTransactionFeedProps {
  transactions: Array<{
    id: string;
    type: 'deposit' | 'withdraw' | 'mint' | 'transfer';
    amount: string;
    status: 'pending' | 'confirmed' | 'failed';
    timestamp: Date;
    user: string;
    hash?: string;
  }>;
}

export const QuantumTransactionFeed: React.FC<QuantumTransactionFeedProps> = ({
  transactions
}) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deposit': return '⬇️';
      case 'withdraw': return '⬆️';
      case 'mint': return '🏭';
      case 'transfer': return '↔️';
      default: return '📄';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-400';
      case 'pending': return 'text-yellow-400';
      case 'failed': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'deposit': return 'from-green-500/20 to-emerald-500/20 border-green-500/30';
      case 'withdraw': return 'from-orange-500/20 to-red-500/20 border-orange-500/30';
      case 'mint': return 'from-purple-500/20 to-pink-500/20 border-purple-500/30';
      case 'transfer': return 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30';
      default: return 'from-gray-500/20 to-gray-600/20 border-gray-500/30';
    }
  };

  return (
    <div className="quantum-card p-6">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center">
        <span className="mr-2">⚡</span>
        Live Transaction Stream
      </h3>
      
      <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <div className="text-4xl mb-2">🌌</div>
            <p>Quantum field is calm...</p>
          </div>
        ) : (
          transactions.map((tx, index) => (
            <div
              key={tx.id}
              className={`relative overflow-hidden rounded-xl p-4 transition-all duration-300 hover:scale-[1.02] bg-gradient-to-r ${getTypeColor(tx.type)} border`}
              style={{
                animationDelay: `${index * 100}ms`,
                animation: 'slideInRight 0.5s ease-out forwards'
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-slate-800/80 rounded-full flex items-center justify-center text-xl border border-gray-600/50">
                      {getTypeIcon(tx.type)}
                    </div>
                    {tx.status === 'pending' && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full animate-pulse border-2 border-slate-900" />
                    )}
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-semibold capitalize">{tx.type}</span>
                      <span className={`text-sm font-medium ${getStatusColor(tx.status)}`}>
                        {tx.status}
                      </span>
                    </div>
                    <div className="text-gray-400 text-sm">
                      by {tx.user} • {tx.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-white font-bold">{tx.amount}</div>
                  {tx.hash && (
                    <div className="text-xs text-gray-400 font-mono">
                      {tx.hash.slice(0, 8)}...
                    </div>
                  )}
                </div>
              </div>
              
              {/* Quantum effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default {
  QuantumTransactionVisualizer,
  QuantumTransactionFeed
};