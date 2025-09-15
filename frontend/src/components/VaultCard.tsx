import React from 'react';
import Link from 'next/link';
import { useVault } from '../hooks/useVault';

interface VaultCardProps {
  vaultAddress: string;
  onDeposit: (vaultAddress: string) => void;
  onWithdraw: (vaultAddress: string) => void;
}

const VaultCard: React.FC<VaultCardProps> = ({ vaultAddress, onDeposit, onWithdraw }) => {
  const { totalBalance, getAPY, loading } = useVault(vaultAddress);

  const apy = getAPY();
  const shortAddress = `${vaultAddress.slice(0, 6)}...${vaultAddress.slice(-4)}`;

  return (
    <div className="vault-card group">
      <div className="flex items-center justify-between mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform floating-animation">
          <span className="text-3xl">🏛️</span>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-green-400">{apy}% APY</div>
          <div className="text-gray-400 text-sm">Annual Yield</div>
        </div>
      </div>

      <h3 className="text-2xl font-bold text-white mb-3">Quantum Vault</h3>
      <p className="text-gray-300 text-lg mb-6">
        Ultra-secure quantum-encrypted vault with military-grade protection and advanced yield optimization.
      </p>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Total Locked:</span>
          <span className="text-white font-medium">{totalBalance} ETH</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Contract:</span>
          <span className="text-white font-mono text-sm">{shortAddress}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Risk Level:</span>
          <span className="text-green-400 font-medium">Low</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Lock Period:</span>
          <span className="text-white font-medium">Flexible</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex space-x-3">
          <button
            onClick={() => onDeposit(vaultAddress)}
            disabled={loading}
            className="cyber-button-primary flex-1 px-6 py-3 font-semibold rounded-lg disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Deposit'}
          </button>
          <button
            onClick={() => onWithdraw(vaultAddress)}
            disabled={loading}
            className="cyber-button flex-1 px-6 py-3 font-semibold rounded-lg disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Withdraw'}
          </button>
        </div>
        <Link
          href={`/vault/${vaultAddress}`}
          className="cyber-button w-full px-6 py-3 font-semibold rounded-lg text-center block"
        >
          View Details
        </Link>
      </div>

      {loading && (
        <div className="absolute inset-0 bg-black/20 rounded-2xl flex items-center justify-center">
          <div className="loading-shimmer w-full h-full rounded-2xl"></div>
        </div>
      )}
    </div>
  );
};

export default VaultCard;