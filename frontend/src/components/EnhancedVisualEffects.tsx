'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';

// Advanced 3D Floating Spheres
export const FloatingSpheres: React.FC<{ count?: number }> = ({ count = 8 }) => {
  const spheres = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      size: Math.random() * 100 + 50,
      x: Math.random() * 100,
      y: Math.random() * 100,
      z: Math.random() * 100,
      rotationX: Math.random() * 360,
      rotationY: Math.random() * 360,
      color: ['#00ffff', '#8000ff', '#ff0080', '#00ff80'][i % 4],
      duration: Math.random() * 20 + 10
    })), [count]
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {spheres.map(sphere => (
        <div
          key={sphere.id}
          className="absolute animate-float-3d"
          style={{
            left: `${sphere.x}%`,
            top: `${sphere.y}%`,
            width: sphere.size,
            height: sphere.size,
            animationDuration: `${sphere.duration}s`,
            animationDelay: `${sphere.id * 2}s`,
            transform: `translateZ(${sphere.z}px) rotateX(${sphere.rotationX}deg) rotateY(${sphere.rotationY}deg)`
          }}
        >
          <div
            className="w-full h-full rounded-full"
            style={{
              background: `radial-gradient(circle at 30% 30%,
                rgba(255, 255, 255, 0.9) 0%,
                ${sphere.color}60 40%,
                ${sphere.color}20 70%,
                transparent 100%)`,
              boxShadow: `
                0 0 ${sphere.size * 0.5}px ${sphere.color}80,
                0 0 ${sphere.size}px ${sphere.color}40,
                inset 0 0 ${sphere.size * 0.2}px rgba(255, 255, 255, 0.3)
              `,
              filter: 'blur(1px)',
              animation: 'sphere-glow 4s ease-in-out infinite alternate'
            }}
          />
        </div>
      ))}
    </div>
  );
};

// Holographic Data Visualization
export const HolographicData: React.FC = () => {
  const [dataPoints, setDataPoints] = useState<Array<{x: number, y: number, value: number, id: number}>>([]);

  useEffect(() => {
    const generateData = () => {
      const points = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        value: Math.random()
      }));
      setDataPoints(points);
    };

    generateData();
    const interval = setInterval(generateData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
      <svg width="100%" height="100%" className="absolute inset-0">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {dataPoints.map((point, index) => (
          <g key={point.id}>
            <circle
              cx={`${point.x}%`}
              cy={`${point.y}%`}
              r={point.value * 10 + 2}
              fill={`hsl(${180 + point.value * 60}, 100%, 50%)`}
              filter="url(#glow)"
              className="animate-pulse"
              style={{
                animationDelay: `${index * 0.1}s`,
                animationDuration: '3s'
              }}
            />
            {index > 0 && (
              <line
                x1={`${dataPoints[index - 1]?.x}%`}
                y1={`${dataPoints[index - 1]?.y}%`}
                x2={`${point.x}%`}
                y2={`${point.y}%`}
                stroke={`hsl(${180 + point.value * 60}, 100%, 50%)`}
                strokeWidth="1"
                opacity="0.3"
                filter="url(#glow)"
              />
            )}
          </g>
        ))}
      </svg>
    </div>
  );
};

// Quantum Field Distortion
export const QuantumFieldDistortion: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    let time = 0;

    const drawField = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Create quantum field distortion effect
      for (let x = 0; x < canvas.width; x += 20) {
        for (let y = 0; y < canvas.height; y += 20) {
          const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
          const wave = Math.sin(distance * 0.01 + time * 0.02) * 10;
          const opacity = Math.max(0, 0.3 - distance / 800);

          if (opacity > 0) {
            ctx.save();
            ctx.globalAlpha = opacity;
            ctx.fillStyle = `hsl(${180 + wave * 3}, 100%, 50%)`;
            ctx.beginPath();
            ctx.arc(x + wave, y + wave * 0.5, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        }
      }

      time++;
      requestAnimationFrame(drawField);
    };

    resizeCanvas();
    drawField();

    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

// Aurora Background Effect
export const AuroraBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div className="aurora-container">
        <div className="aurora aurora-1"></div>
        <div className="aurora aurora-2"></div>
        <div className="aurora aurora-3"></div>
        <div className="aurora aurora-4"></div>
      </div>
    </div>
  );
};

// Hexagonal Matrix Background
export const HexMatrix: React.FC = () => {
  const hexagons = useMemo(() =>
    Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: (i % 10) * 10,
      y: Math.floor(i / 10) * 8.66,
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 2
    })), []
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-0 opacity-10">
      <svg width="100%" height="100%" viewBox="0 0 100 87">
        <defs>
          <polygon
            id="hexagon"
            points="5,0 15,0 20,8.66 15,17.32 5,17.32 0,8.66"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.1"
          />
        </defs>

        {hexagons.map(hex => (
          <use
            key={hex.id}
            href="#hexagon"
            x={hex.x}
            y={hex.y}
            className="text-cyan-400"
            style={{
              animation: `hex-pulse ${hex.duration}s ease-in-out infinite`,
              animationDelay: `${hex.delay}s`
            }}
          />
        ))}
      </svg>
    </div>
  );
};

// Dynamic Gradient Background
export const DynamicGradient: React.FC = () => {
  const [gradientState, setGradientState] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setGradientState(prev => (prev + 1) % 360);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        background: `
          radial-gradient(ellipse at ${50 + Math.sin(gradientState * 0.01) * 20}% ${50 + Math.cos(gradientState * 0.01) * 20}%,
            rgba(0, 255, 255, 0.1) 0%,
            transparent 50%),
          radial-gradient(ellipse at ${50 + Math.cos(gradientState * 0.015) * 25}% ${50 + Math.sin(gradientState * 0.015) * 25}%,
            rgba(128, 0, 255, 0.1) 0%,
            transparent 50%),
          radial-gradient(ellipse at ${50 + Math.sin(gradientState * 0.02) * 15}% ${50 + Math.cos(gradientState * 0.02) * 30}%,
            rgba(255, 0, 128, 0.1) 0%,
            transparent 50%)
        `,
        filter: 'blur(100px)',
        animation: 'gradient-shift 20s ease-in-out infinite'
      }}
    />
  );
};

// Laser Grid Scanner
export const LaserGrid: React.FC = () => {
  const [scanPosition, setScanPosition] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanPosition(prev => (prev + 2) % 100);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Horizontal scan line */}
      <div
        className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60"
        style={{
          top: `${scanPosition}%`,
          boxShadow: '0 0 20px #00ffff, 0 0 40px #00ffff',
          transition: 'top 0.1s linear'
        }}
      />

      {/* Vertical scan line */}
      <div
        className="absolute h-full w-0.5 bg-gradient-to-b from-transparent via-purple-400 to-transparent opacity-60"
        style={{
          left: `${(scanPosition * 1.3) % 100}%`,
          boxShadow: '0 0 20px #8000ff, 0 0 40px #8000ff',
          transition: 'left 0.1s linear'
        }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px'
        }}
      />
    </div>
  );
};

// Particle Constellation
export const ParticleConstellation: React.FC = () => {
  const [stars, setStars] = useState<Array<{x: number, y: number, size: number, twinkle: number}>>([]);

  useEffect(() => {
    const generateStars = () => {
      const newStars = Array.from({ length: 200 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        twinkle: Math.random() * 3 + 1
      }));
      setStars(newStars);
    };

    generateStars();
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {stars.map((star, index) => (
        <div
          key={index}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, 0.8)`,
            animation: `twinkle ${star.twinkle}s ease-in-out infinite`,
            animationDelay: `${index * 0.1}s`
          }}
        />
      ))}
    </div>
  );
};

export default {
  FloatingSpheres,
  HolographicData,
  QuantumFieldDistortion,
  AuroraBackground,
  HexMatrix,
  DynamicGradient,
  LaserGrid,
  ParticleConstellation
};