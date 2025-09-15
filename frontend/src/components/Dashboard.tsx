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
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total TVL</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">{totalTVL} ETH</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Your Balance</h3>
            <p className="mt-2 text-3xl font-bold text-blue-600">{userBalance} ETH</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              {hasNFT ? 'Boosted APY' : 'Global APY'}
            </h3>
            <div className="mt-2 flex items-baseline">
              <p className="text-3xl font-bold text-green-600">{effectiveAPY}%</p>
              {hasNFT && (
                <span className="ml-2 text-sm text-green-500 font-medium">
                  (+{apyBoost}% boost)
                </span>
              )}
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Reward NFTs</h3>
            <div className="mt-2 flex items-baseline">
              <p className="text-3xl font-bold text-purple-600">{nftBalance}</p>
              {hasNFT && (
                <span className="ml-2 text-sm text-purple-500 font-medium">
                  Owned
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* NFT Status */}
      {hasNFT && (
        <div className="mb-8 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-purple-900">🎉 NFT Holder Benefits</h3>
              <p className="text-purple-700">
                You own {nftBalance} Reward NFT{nftBalance !== 1 ? 's' : ''} and receive a {apyBoost}% APY boost on all deposits!
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