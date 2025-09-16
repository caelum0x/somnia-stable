import React, { useState } from 'react';
import { useManager } from '../hooks/useManager';
import { useNFT } from '../hooks/useNFT';
import VaultCard from './VaultCard';
import DepositModal from './DepositModal';
import WithdrawModal from './WithdrawModal';

interface DashboardProps {
  managerAddress: string;
  nftAddress: string;
  userAddress: string;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  managerAddress, 
  nftAddress, 
  userAddress 
}) => {
  const [selectedVault, setSelectedVault] = useState<string>('');
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  
  const { vaults, totalTVL, userBalance, getGlobalAPY } = useManager(managerAddress);
  const { hasNFT, nftBalance, getAPYBoost } = useNFT(nftAddress);

  const globalAPY = getGlobalAPY();
  const apyBoost = getAPYBoost();
  const effectiveAPY = hasNFT 
    ? (parseFloat(globalAPY) + parseFloat(apyBoost)).toFixed(1)
    : globalAPY;

  const handleDeposit = (vaultAddress: string) => {
    setSelectedVault(vaultAddress);
    setShowDepositModal(true);
  };

  const handleWithdraw = (vaultAddress: string) => {
    setSelectedVault(vaultAddress);
    setShowWithdrawModal(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* User Stats */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold gradient-text mb-8">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="stats-card">
            <span className="stats-icon">💎</span>
            <h3 className="stats-title">Total Locked Value</h3>
            <p className="stats-value blue">{totalTVL} ETH</p>
            <p className="stats-desc">Across all vaults</p>
          </div>
          
          <div className="stats-card">
            <span className="stats-icon">👛</span>
            <h3 className="stats-title">Your Balance</h3>
            <p className="stats-value purple">{userBalance} ETH</p>
            <p className="stats-desc">Total deposited assets</p>
          </div>
          
          <div className="stats-card">
            <span className="stats-icon">📈</span>
            <h3 className="stats-title">
              {hasNFT ? 'Boosted APY' : 'Global APY'}
            </h3>
            <div className="flex flex-col">
              <p className="stats-value green">{effectiveAPY}%</p>
              {hasNFT && (
                <span className="text-sm text-green-400 font-medium">
                  Including {apyBoost}% boost
                </span>
              )}
            </div>
          </div>
          
          <div className="stats-card">
            <span className="stats-icon">🏆</span>
            <h3 className="stats-title">Reward NFTs</h3>
            <div className="flex flex-col">
              <p className="stats-value pink">{nftBalance}</p>
              <span className="stats-desc">
                {hasNFT ? 'Boosting your rewards' : 'None owned yet'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* NFT Status */}
      {hasNFT && (
        <div className="mb-8 nft-benefits-card">
          <div className="flex items-center">
            <div className="nft-icon floating-animation">🏆</div>
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <span className="nft-badge">NFT Holder</span>
                <span className="nft-badge">Premium</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Enhanced Yield Rewards</h3>
              <p className="text-purple-100">
                Your {nftBalance} Reward NFT{nftBalance !== 1 ? 's are' : ' is'} generating an additional <span className="font-bold text-purple-300">{apyBoost}% APY</span> boost on all your deposits!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Vaults Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Vaults</h2>
        {vaults.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No vaults available. Check back later!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vaults.map((vaultAddress) => (
              <VaultCard
                key={vaultAddress}
                vaultAddress={vaultAddress}
                onDeposit={handleDeposit}
                onWithdraw={handleWithdraw}
              />
            ))}
          </div>
        )}
      </div>

      {/* Connected Account */}
      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-sm text-gray-600">
          Connected as: <span className="font-mono font-medium">{userAddress}</span>
        </p>
      </div>

      {/* Modals */}
      <DepositModal
        isOpen={showDepositModal}
        onClose={() => setShowDepositModal(false)}
        vaultAddress={selectedVault}
        nftAddress={nftAddress}
      />
      
      <WithdrawModal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        vaultAddress={selectedVault}
      />
    </div>
  );
};

export default Dashboard;