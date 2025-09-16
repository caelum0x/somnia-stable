import React from 'react';
import Link from 'next/link';
import { useVault } from '../hooks/useVault';
import { StandardButton, StandardCard, StandardBadge } from './StandardUI';

interface VaultCardProps {
  vaultAddress: string;
  onDeposit: (vaultAddress: string) => void;
  onWithdraw: (vaultAddress: string) => void;
  vaultType?: string;
  vaultIcon?: string;
  vaultColor?: string;
}

const VaultCard: React.FC<VaultCardProps> = ({ 
  vaultAddress, 
  onDeposit, 
  onWithdraw,
  vaultType = "Quantum Vault",
  vaultIcon = "🏛️",
  vaultColor = "blue"
}) => {
  const { totalBalance, getAPY, loading } = useVault(vaultAddress);

  const apy = getAPY();
  const shortAddress = `${vaultAddress.slice(0, 6)}...${vaultAddress.slice(-4)}`;
  
  // Get color based on vault type
  const getGradientColors = () => {
    switch (vaultColor) {
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
    <StandardCard
      className="relative overflow-hidden group hover:scale-[1.03] transition-all duration-500 cyber-card"
      variant="hover"
    >
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
        {/* Icon & Title */}
        <div className="flex items-start mb-6">
          <div className={`w-16 h-16 bg-gradient-to-br ${getGradientColors()} rounded-2xl border flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500 floating-animation`}>
            <span className="text-3xl">{vaultIcon}</span>
          </div>
          <div className="ml-4 mt-1">
            <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors duration-300">{vaultType}</h3>
            <div className="text-gray-400 text-sm font-mono flex items-center">
              <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
              {shortAddress}
            </div>
          </div>
        </div>

        {/* Description with gradient background */}
        <div className="relative mb-6 p-3 rounded-lg overflow-hidden bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/10">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <p className="text-gray-300 text-sm line-clamp-3 relative z-10">
            Ultra-secure quantum-encrypted vault with military-grade protection and advanced yield optimization.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-3 transition-all duration-300 hover:bg-white/10 hover:border-white/20">
            <div className="text-gray-400 text-xs mb-1 flex items-center gap-1">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3V21M12 3L7 8M12 3L17 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Total Locked
            </div>
            <div className="text-xl font-bold text-white">{totalBalance} ETH</div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-3 transition-all duration-300 hover:bg-white/10 hover:border-white/20">
            <div className="text-gray-400 text-xs mb-1 flex items-center gap-1">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 9V13M12 17H12.01M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Risk Level
            </div>
            <div className={`text-xl font-bold ${risk.color}`}>{risk.text}</div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-auto space-y-3">
          <div className="flex space-x-3">
            <StandardButton
              variant="primary"
              onClick={() => onDeposit(vaultAddress)}
              disabled={loading}
              isLoading={loading}
              size="sm"
              fullWidth
            >
              <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 19V5M12 5L5 12M12 5L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Deposit
            </StandardButton>
            
            <StandardButton
              variant="secondary"
              onClick={() => onWithdraw(vaultAddress)}
              disabled={loading}
              isLoading={loading}
              size="sm"
              fullWidth
            >
              <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19M12 19L19 12M12 19L5 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Withdraw
            </StandardButton>
          </div>
          
          <Link
            href={`/vault/${vaultAddress}`}
            className="btn btn-outline w-full text-sm flex items-center justify-center group transition-all duration-300 hover:bg-blue-500/20"
          >
            <span>View Details</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
      
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
          <div className="spinner spinner-lg"></div>
        </div>
      )}
    </StandardCard>
  );
};

export default VaultCard;