'use client';

import React, { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  hue: number;
  life: number;
  maxLife: number;
}

interface QuantumParticlesProps {
  count?: number;
  colors?: string[];
  speed?: number;
  size?: number;
  interactive?: boolean;
}

export const QuantumParticles: React.FC<QuantumParticlesProps> = ({
  count = 50,
  colors = ['cyan', 'purple', 'pink', 'blue'],
  speed = 0.5,
  size = 2,
  interactive = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticle = (): Particle => {
      const hueMap: Record<string, number> = {
        cyan: 180,
        purple: 270,
        pink: 320,
        blue: 240
      };
      
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        size: Math.random() * size + 1,
        opacity: Math.random() * 0.8 + 0.2,
        hue: hueMap[colors[Math.floor(Math.random() * colors.length)]] || 180,
        life: 0,
        maxLife: Math.random() * 200 + 100
      };
    };

    const initParticles = () => {
      particlesRef.current = Array.from({ length: count }, createParticle);
    };

    const updateParticles = () => {
      particlesRef.current.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Update life
        particle.life++;
        
        // Interactive mouse attraction
        if (interactive) {
          const dx = mouseRef.current.x - particle.x;
          const dy = mouseRef.current.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            const force = (100 - distance) / 1000;
            particle.vx += dx * force;
            particle.vy += dy * force;
          }
        }
        
        // Quantum field fluctuation
        particle.vx += (Math.random() - 0.5) * 0.01;
        particle.vy += (Math.random() - 0.5) * 0.01;
        
        // Damping
        particle.vx *= 0.99;
        particle.vy *= 0.99;
        
        // Boundary wrapping
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        
        // Opacity based on life
        particle.opacity = Math.max(0, 1 - particle.life / particle.maxLife);
        
        // Respawn particle
        if (particle.life >= particle.maxLife) {
          particlesRef.current[index] = createParticle();
        }
      });
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particlesRef.current.forEach(particle => {
        ctx.save();
        
        // Quantum glow effect
        ctx.shadowBlur = 20;
        ctx.shadowColor = `hsl(${particle.hue}, 100%, 50%)`;
        
        // Draw particle
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = `hsl(${particle.hue}, 100%, 50%)`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw quantum trail
        ctx.globalAlpha = particle.opacity * 0.3;
        ctx.fillStyle = `hsl(${particle.hue}, 100%, 70%)`;
        ctx.beginPath();
        ctx.arc(
          particle.x - particle.vx * 5, 
          particle.y - particle.vy * 5, 
          particle.size * 0.5, 
          0, 
          Math.PI * 2
        );
        ctx.fill();
        
        ctx.restore();
      });
      
      // Draw quantum connections
      ctx.strokeStyle = 'rgba(100, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const p1 = particlesRef.current[i];
          const p2 = particlesRef.current[j];
          const distance = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
          
          if (distance < 100) {
            const opacity = (100 - distance) / 100 * 0.2;
            ctx.globalAlpha = opacity;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      updateParticles();
      drawParticles();
      animationRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const handleResize = () => {
      resizeCanvas();
      initParticles();
    };

    resizeCanvas();
    initParticles();
    animate();

    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    window.addEventListener('resize', handleResize);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, [count, colors, speed, size, interactive]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  );
};

interface QuantumOrbProps {
  size?: number;
  color?: string;
  intensity?: number;
  animate?: boolean;
}

export const QuantumOrb: React.FC<QuantumOrbProps> = ({
  size = 100,
  color = 'cyan',
  intensity = 1,
  animate = true
}) => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!animate) return;

    const interval = setInterval(() => {
      setPhase(prev => (prev + 0.1) % (Math.PI * 2));
    }, 50);

    return () => clearInterval(interval);
  }, [animate]);

  const glowIntensity = animate ? Math.sin(phase) * 0.3 + 0.7 : 1;

  return (
    <div 
      className="quantum-orb absolute rounded-full"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 30% 30%, 
          rgba(255, 255, 255, 0.8) 0%, 
          rgba(${color === 'cyan' ? '0, 255, 255' : color === 'purple' ? '128, 0, 255' : '255, 0, 128'}, 0.6) 30%, 
          transparent 70%)`,
        boxShadow: `
          0 0 ${20 * intensity * glowIntensity}px rgba(${color === 'cyan' ? '0, 255, 255' : color === 'purple' ? '128, 0, 255' : '255, 0, 128'}, 0.8),
          0 0 ${40 * intensity * glowIntensity}px rgba(${color === 'cyan' ? '0, 255, 255' : color === 'purple' ? '128, 0, 255' : '255, 0, 128'}, 0.4),
          inset 0 0 ${10 * intensity}px rgba(255, 255, 255, 0.3)
        `,
        filter: `blur(${2 - glowIntensity}px)`,
        animation: animate ? 'quantum-pulse 3s ease-in-out infinite' : 'none'
      }}
    />
  );
};

interface DataStreamProps {
  direction?: 'up' | 'down' | 'left' | 'right';
  speed?: number;
  density?: number;
  color?: string;
}

export const DataStream: React.FC<DataStreamProps> = ({
  direction = 'up',
  speed = 2,
  density = 0.3,
  color = 'cyan'
}) => {
  const [particles, setParticles] = useState<Array<{ id: string; delay: number }>>([]);

  useEffect(() => {
    const particleCount = Math.floor(density * 20);
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: `particle-${i}`,
      delay: Math.random() * 3
    }));
    setParticles(newParticles);
  }, [density]);

  const getAnimationClass = () => {
    const directions = {
      up: 'animate-data-stream-up',
      down: 'animate-data-stream-down',
      left: 'animate-data-stream-left',
      right: 'animate-data-stream-right'
    };
    return directions[direction];
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(particle => (
        <div
          key={particle.id}
          className={`absolute w-1 h-4 ${getAnimationClass()}`}
          style={{
            background: `linear-gradient(to bottom, transparent, ${color === 'cyan' ? '#00ffff' : color === 'purple' ? '#8000ff' : '#ff0080'}, transparent)`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${3 / speed}s`,
            left: direction === 'up' || direction === 'down' ? `${Math.random() * 100}%` : '0',
            top: direction === 'left' || direction === 'right' ? `${Math.random() * 100}%` : '0',
            boxShadow: `0 0 6px ${color === 'cyan' ? '#00ffff' : color === 'purple' ? '#8000ff' : '#ff0080'}`
          }}
        />
      ))}
    </div>
  );
};

// Quantum Grid Background Component
export const QuantumGrid: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <div 
        className="w-full h-full opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'grid-pulse 4s ease-in-out infinite'
        }}
      />
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, #00ffff 2px, transparent 2px),
            radial-gradient(circle at 75% 75%, #8000ff 2px, transparent 2px)
          `,
          backgroundSize: '100px 100px',
          animation: 'grid-shimmer 6s ease-in-out infinite'
        }}
      />
    </div>
  );
};