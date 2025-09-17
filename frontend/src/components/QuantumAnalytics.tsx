'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRealTimeData } from '../hooks/useRealTimeData';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: string;
  color: 'cyan' | 'purple' | 'green' | 'orange';
  trend?: number[];
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  icon,
  color,
  trend = []
}) => {
  const colorClasses = {
    cyan: {
      bg: 'from-cyan-500/20 to-blue-500/20',
      border: 'border-cyan-500/30',
      text: 'text-cyan-400',
      glow: 'shadow-cyan-500/20'
    },
    purple: {
      bg: 'from-purple-500/20 to-pink-500/20',
      border: 'border-purple-500/30',
      text: 'text-purple-400',
      glow: 'shadow-purple-500/20'
    },
    green: {
      bg: 'from-green-500/20 to-emerald-500/20',
      border: 'border-green-500/30',
      text: 'text-green-400',
      glow: 'shadow-green-500/20'
    },
    orange: {
      bg: 'from-orange-500/20 to-red-500/20',
      border: 'border-orange-500/30',
      text: 'text-orange-400',
      glow: 'shadow-orange-500/20'
    }
  };

  const colors = colorClasses[color];

  // Mini trend chart
  const trendPath = useMemo(() => {
    if (trend.length < 2) return '';
    
    const width = 80;
    const height = 30;
    const max = Math.max(...trend);
    const min = Math.min(...trend);
    const range = max - min || 1;
    
    return trend
      .map((value, index) => {
        const x = (index / (trend.length - 1)) * width;
        const y = height - ((value - min) / range) * height;
        return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');
  }, [trend]);

  return (
    <div className={`group relative overflow-hidden rounded-xl p-6 transition-all duration-300 hover:scale-105`}>
      {/* Background glow */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} rounded-xl blur-sm group-hover:blur-md transition-all duration-300 ${colors.glow}`}></div>
      
      {/* Card content */}
      <div className={`relative bg-slate-900/80 backdrop-blur-sm border ${colors.border} rounded-xl p-6 h-full`}>
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 bg-gradient-to-br ${colors.bg} rounded-lg flex items-center justify-center text-2xl ${colors.border} border`}>
            {icon}
          </div>
          {change !== undefined && (
            <div className={`text-sm font-semibold ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {change >= 0 ? '+' : ''}{change.toFixed(2)}%
            </div>
          )}
        </div>
        
        <div className="mb-2">
          <h3 className="text-gray-300 text-sm font-medium">{title}</h3>
        </div>
        
        <div className="flex items-end justify-between">
          <div className={`text-2xl font-bold ${colors.text}`}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </div>
          
          {trend.length > 0 && (
            <div className="w-20 h-8">
              <svg width="80" height="30" className="overflow-visible">
                <path
                  d={trendPath}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={colors.text}
                  opacity="0.7"
                />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface ChartData {
  label: string;
  value: number;
  color: string;
}

const QuantumChart: React.FC<{ data: ChartData[], title: string }> = ({ data, title }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;

  return (
    <div className="quantum-card p-6">
      <h3 className="text-xl font-bold text-white mb-6">{title}</h3>
      
      <div className="flex items-center justify-between">
        <div className="relative w-40 h-40">
          <svg width="160" height="160" className="transform -rotate-90">
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const angle = (percentage / 100) * 360;
              const radius = 60;
              const x1 = 80 + radius * Math.cos((currentAngle * Math.PI) / 180);
              const y1 = 80 + radius * Math.sin((currentAngle * Math.PI) / 180);
              const x2 = 80 + radius * Math.cos(((currentAngle + angle) * Math.PI) / 180);
              const y2 = 80 + radius * Math.sin(((currentAngle + angle) * Math.PI) / 180);
              
              const largeArcFlag = angle > 180 ? 1 : 0;
              const pathData = `M 80 80 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
              
              currentAngle += angle;
              
              return (
                <path
                  key={index}
                  d={pathData}
                  fill={item.color}
                  opacity="0.8"
                  className="hover:opacity-100 transition-opacity duration-300"
                />
              );
            })}
            
            {/* Center circle */}
            <circle cx="80" cy="80" r="25" fill="rgb(15, 23, 42)" />
          </svg>
          
          {/* Center value */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">{total.toFixed(1)}</div>
              <div className="text-xs text-gray-400">Total</div>
            </div>
          </div>
        </div>
        
        <div className="flex-1 ml-6 space-y-3">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-gray-300 text-sm">{item.label}</span>
              </div>
              <span className="text-white font-semibold">{item.value.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ActivityFeed: React.FC = () => {
  const activities = [
    { type: 'deposit', amount: '2.5 ETH', user: '0x4f3...92a', time: '2 min ago', color: 'text-green-400' },
    { type: 'withdraw', amount: '1.2 ETH', user: '0x8e1...7bc', time: '5 min ago', color: 'text-orange-400' },
    { type: 'nft_mint', amount: 'Genesis #42', user: '0x2a9...4d3', time: '8 min ago', color: 'text-purple-400' },
    { type: 'deposit', amount: '0.8 ETH', user: '0x7f2...8e1', time: '12 min ago', color: 'text-green-400' },
    { type: 'reward', amount: '0.15 ETH', user: '0x9c4...1f9', time: '15 min ago', color: 'text-cyan-400' }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'deposit': return '💰';
      case 'withdraw': return '📤';
      case 'nft_mint': return '🏆';
      case 'reward': return '⭐';
      default: return '📊';
    }
  };

  const getAction = (type: string) => {
    switch (type) {
      case 'deposit': return 'Deposited';
      case 'withdraw': return 'Withdrew';
      case 'nft_mint': return 'Minted';
      case 'reward': return 'Earned';
      default: return 'Action';
    }
  };

  return (
    <div className="quantum-card p-6">
      <h3 className="text-xl font-bold text-white mb-6">Live Activity Feed</h3>
      
      <div className="space-y-4 max-h-80 overflow-y-auto custom-scrollbar">
        {activities.map((activity, index) => (
          <div 
            key={index}
            className="flex items-center space-x-4 p-3 bg-slate-800/30 rounded-lg hover:bg-slate-700/30 transition-colors duration-300"
          >
            <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-lg">
              {getIcon(activity.type)}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="text-gray-300">{getAction(activity.type)}</span>
                <span className={`font-semibold ${activity.color}`}>{activity.amount}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <span>by {activity.user}</span>
                <span>•</span>
                <span>{activity.time}</span>
              </div>
            </div>
            
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const QuantumAnalyticsDashboard: React.FC = () => {
  const { userData, vaultData, protocolData, connectionStatus } = useRealTimeData();
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h');

  // Generate mock trend data
  const [trends, setTrends] = useState({
    tvl: [] as number[],
    apy: [] as number[],
    users: [] as number[],
    volume: [] as number[]
  });

  useEffect(() => {
    const generateTrend = (baseValue: number, volatility: number = 0.1) => {
      return Array.from({ length: 20 }, (_, i) => 
        baseValue + (Math.sin(i * 0.5) + Math.random() - 0.5) * baseValue * volatility
      );
    };

    setTrends({
      tvl: generateTrend(parseFloat(protocolData.totalValueLocked) || 100, 0.15),
      apy: generateTrend(vaultData.apy || 15, 0.08),
      users: generateTrend(protocolData.activeUsers || 50, 0.2),
      volume: generateTrend(parseFloat(protocolData.totalValueLocked) * 0.3 || 30, 0.25)
    });
  }, [protocolData.totalValueLocked, vaultData.apy, protocolData.activeUsers]);

  const portfolioData: ChartData[] = [
    { label: 'Vault Deposits', value: parseFloat(userData.vaultBalance) || 0, color: '#00ffff' },
    { label: 'Wallet Balance', value: parseFloat(userData.walletBalance) || 0, color: '#8000ff' },
    { label: 'NFT Value', value: parseFloat(userData.nftBalance) * 0.5 || 0, color: '#ff0080' },
    { label: 'Rewards', value: parseFloat(userData.vaultBalance) * 0.15 || 0, color: '#00ff80' }
  ];

  const yieldData: ChartData[] = [
    { label: 'Base APY', value: vaultData.apy * 0.8, color: '#00ffff' },
    { label: 'NFT Boost', value: parseFloat(userData.nftBoost) * 100 || 0, color: '#8000ff' },
    { label: 'Volume Bonus', value: vaultData.apy * 0.1, color: '#ff0080' },
    { label: 'Loyalty Bonus', value: vaultData.apy * 0.1, color: '#00ff80' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Quantum Analytics
            </h1>
            <p className="text-gray-400 mt-2">Real-time protocol insights and performance metrics</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex bg-slate-800/50 rounded-lg p-1">
              {(['1h', '24h', '7d', '30d'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-md text-sm transition-all duration-200 ${
                    timeRange === range
                      ? 'bg-cyan-500 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
            
            <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
              connectionStatus.isOnline ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'
            }`}>
              <div className={`w-2 h-2 rounded-full animate-pulse ${
                connectionStatus.isOnline ? 'bg-green-400' : 'bg-red-400'
              }`} />
              <span className="text-sm">{connectionStatus.isOnline ? 'Live' : 'Offline'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Value Locked"
          value={`${protocolData.totalValueLocked} ETH`}
          change={12.5}
          icon="💎"
          color="cyan"
          trend={trends.tvl}
        />
        <MetricCard
          title="Current APY"
          value={`${vaultData.apy.toFixed(1)}%`}
          change={2.3}
          icon="📈"
          color="green"
          trend={trends.apy}
        />
        <MetricCard
          title="Active Users"
          value={protocolData.activeUsers}
          change={8.7}
          icon="👥"
          color="purple"
          trend={trends.users}
        />
        <MetricCard
          title="24h Volume"
          value={`${(parseFloat(protocolData.totalValueLocked) * 0.3).toFixed(1)} ETH`}
          change={-3.2}
          icon="🔄"
          color="orange"
          trend={trends.volume}
        />
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <QuantumChart data={portfolioData} title="Portfolio Distribution" />
        <QuantumChart data={yieldData} title="Yield Breakdown" />
      </div>

      {/* Activity Feed and Additional Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ActivityFeed />
        </div>
        
        <div className="space-y-6">
          {/* Performance Score */}
          <div className="quantum-card p-6">
            <h3 className="text-xl font-bold text-white mb-4">Performance Score</h3>
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg width="128" height="128" className="transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="50"
                  stroke="rgb(71, 85, 105)"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="50"
                  stroke="#00ffff"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${Math.PI * 100}`}
                  strokeDashoffset={`${Math.PI * 100 * (1 - 0.87)}`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyan-400">87</div>
                  <div className="text-xs text-gray-400">Score</div>
                </div>
              </div>
            </div>
            <div className="text-center text-gray-300">
              Excellent performance across all metrics
            </div>
          </div>

          {/* Quick Stats */}
          <div className="quantum-card p-6">
            <h3 className="text-xl font-bold text-white mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Total NFTs</span>
                <span className="text-cyan-400 font-semibold">{protocolData.totalNFTs}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Your Boost</span>
                <span className="text-green-400 font-semibold">+{userData.nftBoost}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Network</span>
                <span className="text-purple-400 font-semibold">Somnia</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Gas Price</span>
                <span className="text-orange-400 font-semibold">0.002 ETH</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuantumAnalyticsDashboard;