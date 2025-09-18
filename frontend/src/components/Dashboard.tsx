import React, { useState, useEffect } from 'react';
import { useManager } from '../hooks/useManager';
import { useNFT } from '../hooks/useNFT';
import { useRealTimeData } from '../hooks/useRealTimeData';
import VaultCard from './VaultCard';
import DepositModal from './DepositModal';
import WithdrawModal from './WithdrawModal';
import { QuantumParticles, QuantumGrid, DataStream } from './QuantumEffects';
import {
  FloatingSpheres,
  AuroraBackground,
  HexMatrix,
  DynamicGradient,
  LaserGrid,
  ParticleConstellation
} from './EnhancedVisualEffects';

interface DashboardProps {
  managerAddress?: string;
  nftAddress?: string;
  userAddress?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  managerAddress, 
  nftAddress, 
  userAddress 
}) => {
  const [selectedVault, setSelectedVault] = useState<string>('');
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const { userData, vaultData, protocolData, refreshData } = useRealTimeData();
  const { vaults, getGlobalAPY } = useManager(managerAddress);
  const { hasNFT, nftBalance, getAPYBoost } = useNFT(nftAddress);

  const globalAPY = getGlobalAPY();
  const apyBoost = getAPYBoost();
  const effectiveAPY = hasNFT 
    ? (parseFloat(globalAPY) + parseFloat(apyBoost)).toFixed(1)
    : globalAPY;

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleDeposit = (vaultAddress: string) => {
    setSelectedVault(vaultAddress);
    setShowDepositModal(true);
  };

  const handleWithdraw = (vaultAddress: string) => {
    setSelectedVault(vaultAddress);
    setShowWithdrawModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white relative overflow-hidden">
      {/* Advanced Background Effects */}
      <AuroraBackground />
      <DynamicGradient />
      <ParticleConstellation />
      <FloatingSpheres count={6} />
      <HexMatrix />
      <LaserGrid />

      {/* Original Quantum Effects */}
      <QuantumGrid />
      <QuantumParticles count={40} interactive={true} colors={['cyan', 'purple', 'pink', 'gold']} />
      <DataStream direction="up" speed={1.5} density={0.3} color="cyan" />
      <DataStream direction="down" speed={2} density={0.15} color="purple" />
      <DataStream direction="left" speed={1.8} density={0.1} color="pink" />
      <DataStream direction="right" speed={1.2} density={0.1} color="gold" />
      
      {/* Enhanced Futuristic Header */}
      <div className="relative overflow-hidden z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-8">
            <div className="relative">
              {/* Title with enhanced effects */}
              <div className="relative">
                <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2 animate-neon-flicker">
                  QUANTUM DASHBOARD
                </h1>
                <div className="absolute inset-0 text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2 opacity-30 blur-sm animate-pulse"></div>
              </div>
              <div className="flex items-center space-x-4 mt-3">
                <div className="pulse-ring"></div>
                <div className="pulse-ring"></div>
                <div className="pulse-ring"></div>
                <p className="text-cyan-300/80 text-lg font-mono">
                  {currentTime.toLocaleTimeString()} • Somnia Network • Online
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="glass-card px-6 py-4 rounded-xl relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-green-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <p className="text-cyan-300 text-sm font-semibold mb-1">NETWORK STATUS</p>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                    <p className="text-green-400 font-mono font-bold">⚡ OPERATIONAL</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="glass-card rounded-xl p-6 hover:scale-105 transform transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-blue-400 animate-energy-beam"></div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center animate-float-3d">
                    <span className="text-2xl">💎</span>
                  </div>
                  <div className="text-cyan-400 font-mono text-sm font-bold">TVL</div>
                </div>
                <h3 className="text-gray-300 text-sm mb-2 font-semibold">Total Value Locked</h3>
                <p className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent animate-neon-flicker">
                  {protocolData.totalValueLocked} ETH
                </p>
                <p className="text-gray-400 text-xs mt-1">Across {vaults.length} quantum vaults</p>
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="glass-card rounded-xl p-6 hover:scale-105 transform transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-pink-400 animate-energy-beam" style={{animationDelay: '0.5s'}}></div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center animate-float-3d" style={{animationDelay: '1s'}}>
                    <span className="text-2xl">👛</span>
                  </div>
                  <div className="text-purple-400 font-mono text-sm font-bold">BAL</div>
                </div>
                <h3 className="text-gray-300 text-sm mb-2 font-semibold">Your Balance</h3>
                <p className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent animate-neon-flicker">
                  {userData.vaultBalance} ETH
                </p>
                <p className="text-gray-400 text-xs mt-1">Wallet: {parseFloat(userData.walletBalance).toFixed(4)} ETH</p>
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="glass-card rounded-xl p-6 hover:scale-105 transform transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-400 animate-energy-beam" style={{animationDelay: '1s'}}></div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center animate-float-3d" style={{animationDelay: '1.5s'}}>
                    <span className="text-2xl">📈</span>
                  </div>
                  <div className="text-green-400 font-mono text-sm font-bold">APY</div>
                </div>
                <h3 className="text-gray-300 text-sm mb-2 font-semibold">
                  {hasNFT ? 'Quantum Boosted APY' : 'Base APY'}
                </h3>
                <p className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent animate-neon-flicker">
                  {effectiveAPY}%
                </p>
                {hasNFT && (
                  <p className="text-green-400 text-xs mt-1 font-semibold animate-pulse">
                    +{apyBoost}% NFT BOOST ACTIVE
                  </p>
                )}
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-400 to-transparent"></div>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="glass-card rounded-xl p-6 hover:scale-105 transform transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-red-400 animate-energy-beam" style={{animationDelay: '1.5s'}}></div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center animate-float-3d" style={{animationDelay: '2s'}}>
                    <span className="text-2xl">🏆</span>
                  </div>
                  <div className="text-orange-400 font-mono text-sm font-bold">NFT</div>
                </div>
                <h3 className="text-gray-300 text-sm mb-2 font-semibold">Quantum NFTs</h3>
                <p className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent animate-neon-flicker">
                  {nftBalance}
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  {hasNFT ? 'Enhancing rewards' : 'Mint to boost yields'}
                </p>
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-400 to-transparent"></div>
              </div>
            </div>
          </div>

          {/* Quantum NFT Status */}
          {hasNFT && (
            <div className="mb-8 relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-sm border border-purple-500/40 rounded-2xl p-6">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
                      <span className="text-4xl">🏆</span>
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-xs">✓</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="px-3 py-1 bg-purple-500/30 border border-purple-400/50 rounded-full text-purple-300 text-sm font-semibold">
                        QUANTUM HOLDER
                      </span>
                      <span className="px-3 py-1 bg-pink-500/30 border border-pink-400/50 rounded-full text-pink-300 text-sm font-semibold">
                        PREMIUM TIER
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                      Quantum Enhancement Active
                    </h3>
                    <p className="text-gray-300">
                      Your <span className="text-purple-400 font-bold">{nftBalance}</span> Quantum NFT{nftBalance !== 1 ? 's are' : ' is'} generating a 
                      <span className="text-pink-400 font-bold text-lg"> +{apyBoost}% APY</span> boost across all deposits!
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 font-mono text-sm mb-1">BOOST ACTIVE</div>
                    <div className="text-3xl font-bold text-green-400">+{apyBoost}%</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quantum Vaults Grid */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-8">
              Quantum Vault Matrix
            </h2>
            {vaults.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-slate-900/50 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-8">
                  <div className="text-6xl mb-4">⚡</div>
                  <p className="text-gray-400 text-lg">Quantum vaults initializing...</p>
                  <div className="mt-4 animate-pulse flex justify-center space-x-1">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {vaults.map((vaultAddress, index) => (
                  <VaultCard
                    key={vaultAddress}
                    vaultAddress={vaultAddress}
                    onDeposit={handleDeposit}
                    onWithdraw={handleWithdraw}
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Quantum Connection Status */}
          <div className="bg-slate-900/30 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-cyan-300 text-sm">
                  Quantum Link Active: <span className="font-mono font-medium text-cyan-400">
                    {userData.address ? `${userData.address.slice(0, 6)}...${userData.address.slice(-4)}` : 'Connecting...'}
                  </span>
                </p>
              </div>
              <button 
                onClick={refreshData}
                className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-cyan-400 text-sm hover:bg-cyan-500/30 transition-all duration-200"
              >
                ⟳ Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quantum Modals */}
      <DepositModal
        isOpen={showDepositModal}
        onClose={() => setShowDepositModal(false)}
        vaultName="Quantum Vault Alpha"
        userAddress={userData.address || undefined}
      />
      
      <WithdrawModal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        vaultName="Quantum Vault Alpha"
        userAddress={userData.address || undefined}
      />
    </div>
  );
};

export default Dashboard;