import React from 'react';
import Link from 'next/link';
import { useVault } from '../hooks/useVault';

interface VaultCardProps {
  vaultAddress: string;
  onDeposit: (vaultAddress: string) => void;
  onWithdraw: (vaultAddress: string) => void;
  index?: number;
  vaultType?: string;
  vaultIcon?: string;
  vaultColor?: string;
}

const VaultCard: React.FC<VaultCardProps> = ({ 
  vaultAddress, 
  onDeposit, 
  onWithdraw,
  index = 0,
  vaultType,
  vaultIcon,
  vaultColor
}) => {
  const { totalBalance, getAPY, loading } = useVault(vaultAddress);
  
  // Quantum vault configurations
  const vaultConfigs = [
    {
      name: "Genesis Quantum Vault",
      icon: "⚛️",
      color: "cyan",
      description: "Primary quantum-secured vault with advanced neural optimization protocols.",
      gradient: "from-cyan-500/30 to-blue-500/20",
      border: "border-cyan-500/40"
    },
    {
      name: "Nexus Infinity Vault", 
      icon: "🌌",
      color: "purple",
      description: "Multi-dimensional yield farming with cosmic energy amplification systems.",
      gradient: "from-purple-500/30 to-pink-500/20",
      border: "border-purple-500/40"
    },
    {
      name: "Alpha Singularity Vault",
      icon: "🔮",
      color: "green", 
      description: "Ultra-high frequency trading vault with quantum entanglement protocols.",
      gradient: "from-green-500/30 to-emerald-500/20",
      border: "border-green-500/40"
    }
  ];
  
  const config = vaultConfigs[index % vaultConfigs.length];
  const displayName = vaultType || config.name;
  const displayIcon = vaultIcon || config.icon;
  const displayColor = vaultColor || config.color;

  const apy = getAPY();
  const shortAddress = `${vaultAddress.slice(0, 6)}...${vaultAddress.slice(-4)}`;
  
  // Get color based on vault type
  const getGradientColors = () => {
    switch (displayColor) {
      case 'green':
        return 'from-green-500/30 to-emerald-500/20 border-green-500/40 shadow-green-500/20';
      case 'purple':
        return 'from-purple-500/30 to-pink-500/20 border-purple-500/40 shadow-purple-500/20';
      case 'cyan':
        return 'from-cyan-500/30 to-blue-500/20 border-cyan-500/40 shadow-cyan-500/20';
      default:
        return 'from-blue-500/30 to-cyan-500/20 border-blue-500/40 shadow-blue-500/20';
    }
  };
  
  // Get badge color based on APY
  const getApyBadgeColor = () => {
    const apyValue = parseFloat(apy);
    if (apyValue >= 15) return 'bg-purple-500/30 text-purple-300 border-purple-500/40 shadow-purple-500/30';
    if (apyValue >= 10) return 'bg-blue-500/30 text-blue-300 border-blue-500/40 shadow-blue-500/30';
    return 'bg-green-500/30 text-green-300 border-green-500/40 shadow-green-500/30';
  };

  const getBadgeVariant = () => {
    const apyValue = parseFloat(apy);
    if (apyValue >= 15) return 'purple';
    if (apyValue >= 10) return 'blue';
    return 'green';
  };
  
  // Get risk level styling
  const getRiskLevel = () => {
    const apyValue = parseFloat(apy);
    if (apyValue >= 15) {
      return { text: 'High', color: 'text-amber-400' };
    } else if (apyValue >= 10) {
      return { text: 'Medium', color: 'text-blue-400' };
    }
    return { text: 'Low', color: 'text-green-400' };
  };

  const risk = getRiskLevel();
  
  return (
    <div className="group relative">
      {/* Quantum Glow Effect */}
      <div className={`absolute inset-0 bg-gradient-to-r ${config.gradient} rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-50`}></div>
      
      <div className={`relative bg-slate-900/80 backdrop-blur-sm border ${config.border} rounded-2xl p-6 hover:border-opacity-70 transition-all duration-500 h-full flex flex-col`}>
      {/* Top Badge */}
      <div className="absolute top-4 right-4">
        <div className={`px-3 py-1.5 rounded-full ${getApyBadgeColor()} backdrop-blur-sm flex items-center gap-1`}>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 7L13 15L9 11L3 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 7H15M21 7V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="font-bold">{apy}% APY</span>
        </div>
      </div>
      
      <div className="flex flex-col h-full">
        {/* Quantum Header */}
        <div className="flex items-start mb-6">
          <div className="relative">
            <div className={`w-16 h-16 bg-gradient-to-br ${config.gradient} rounded-2xl border ${config.border} flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500`}>
              <span className="text-3xl animate-pulse">{displayIcon}</span>
            </div>
            {/* Quantum Ring */}
            <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-cyan-500/50 to-purple-500/50 bg-clip-border animate-spin" style={{animationDuration: '3s'}}></div>
          </div>
          <div className="ml-4 mt-1 flex-1">
            <h3 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover:from-cyan-400 group-hover:to-purple-400 transition-all duration-300">
              {displayName}
            </h3>
            <div className="flex items-center mt-2 space-x-2">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                <span className="text-green-400 text-xs font-semibold">ACTIVE</span>
              </div>
              <div className="text-gray-500 text-xs">•</div>
              <span className="text-gray-400 text-xs font-mono">{shortAddress}</span>
            </div>
          </div>
        </div>

        {/* Quantum Description */}
        <div className="relative mb-6 p-4 rounded-xl overflow-hidden bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-gray-600/30">
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full bg-gradient-to-r from-cyan-500/20 via-transparent to-purple-500/20 animate-pulse"></div>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed relative z-10">
            {config.description}
          </p>
        </div>

        {/* Quantum Stats Matrix */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="group/stat relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl blur-sm group-hover/stat:blur-md transition-all duration-300"></div>
            <div className="relative bg-slate-800/60 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-4 hover:border-cyan-400/50 transition-all duration-300">
              <div className="flex items-center justify-between mb-2">
                <div className="text-cyan-400 text-xs font-semibold tracking-wider">TVL</div>
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
              </div>
              <div className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                {totalBalance} ETH
              </div>
            </div>
          </div>
          
          <div className="group/stat relative">
            <div className={`absolute inset-0 bg-gradient-to-r ${config.gradient} rounded-xl blur-sm group-hover/stat:blur-md transition-all duration-300`}></div>
            <div className={`relative bg-slate-800/60 backdrop-blur-sm border ${config.border} rounded-xl p-4 hover:border-opacity-70 transition-all duration-300`}>
              <div className="flex items-center justify-between mb-2">
                <div className={`text-xs font-semibold tracking-wider ${risk.color}`}>RISK</div>
                <div className={`w-2 h-2 rounded-full animate-pulse ${risk.color.replace('text-', 'bg-')}`}></div>
              </div>
              <div className={`text-xl font-bold ${risk.color}`}>{risk.text}</div>
            </div>
          </div>
        </div>

        {/* Quantum Action Matrix */}
        <div className="mt-auto space-y-4">
          {/* APY Display */}
          <div className="flex items-center justify-center mb-4">
            <div className={`px-4 py-2 rounded-full ${getApyBadgeColor()} backdrop-blur-sm border border-current/20`}>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
                <span className="font-bold text-lg">{apy}% APY</span>
                <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onDeposit(vaultAddress)}
              disabled={loading}
              className="group relative overflow-hidden bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-center space-x-2">
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                )}
                <span>DEPOSIT</span>
              </div>
            </button>
            
            <button
              onClick={() => onWithdraw(vaultAddress)}
              disabled={loading}
              className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-center space-x-2">
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                )}
                <span>WITHDRAW</span>
              </div>
            </button>
          </div>
          
          {/* Details Link */}
          <Link
            href={`/vault/${vaultAddress}`}
            className="group w-full flex items-center justify-center space-x-2 py-2 px-4 border border-gray-600/50 rounded-xl text-gray-300 hover:text-white hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all duration-300"
          >
            <span className="text-sm font-medium">Quantum Analytics</span>
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
      </div>
      
      {/* Quantum Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-2xl flex items-center justify-center z-20">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-12 h-12 border-4 border-purple-500/30 border-b-purple-400 rounded-full animate-spin" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VaultCard;