import React from 'react';
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
    <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Stable Vault</h3>
          <p className="text-sm text-gray-500">{shortAddress}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-green-600">{apy}%</p>
          <p className="text-sm text-gray-500">APY</p>
        </div>
      </div>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">Total Value Locked:</span>
          <span className="font-semibold">{totalBalance} ETH</span>
        </div>
      </div>
      
      <div className="flex space-x-3">
        <button
          onClick={() => onDeposit(vaultAddress)}
          disabled={loading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          {loading ? 'Loading...' : 'Deposit'}
        </button>
        <button
          onClick={() => onWithdraw(vaultAddress)}
          disabled={loading}
          className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          {loading ? 'Loading...' : 'Withdraw'}
        </button>
      </div>
    </div>
  );
};

export default VaultCard;