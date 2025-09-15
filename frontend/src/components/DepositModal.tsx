import React, { useState } from 'react';
import { useVault } from '../hooks/useVault';
import { useNFT } from '../hooks/useNFT';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  vaultAddress: string;
  nftAddress: string;
}

const DepositModal: React.FC<DepositModalProps> = ({
  isOpen,
  onClose,
  vaultAddress,
  nftAddress
}) => {
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { deposit, getAPY } = useVault(vaultAddress);
  const { mintEligibility } = useNFT(nftAddress);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;

    setIsSubmitting(true);
    try {
      await deposit(amount);

      // Check if eligible for NFT mint
      const amountNumber = parseFloat(amount);
      const eligible = mintEligibility(amountNumber);
      if (eligible) {
        // Show success message with NFT eligibility
        alert('🎉 Deposit successful! You are eligible for an Elite NFT that boosts your APY!');
      } else {
        alert('✅ Deposit successful!');
      }

      setAmount('');
      onClose();
    } catch (error) {
      console.error('Deposit failed:', error);
      alert('❌ Deposit failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const estimatedYield = amount ? (parseFloat(amount) * parseFloat(getAPY()) / 100).toFixed(4) : '0';
  const isEligibleForNFT = amount ? mintEligibility(parseFloat(amount)) : false;

  return (
    <div
      className="fixed inset-0 modal-overlay flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <div className="modal-content p-8 w-full max-w-md mx-4 relative">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-white">Deposit to Vault</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-3xl transition-colors"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="amount" className="block text-lg font-medium text-gray-300 mb-3">
              Amount (ETH)
            </label>
            <input
              type="number"
              id="amount"
              step="0.001"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input-cyber text-lg"
              placeholder="0.000"
              required
            />
          </div>

          {amount && (
            <div className="space-y-4">
              <div className="cyber-card p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Estimated Annual Yield:</span>
                  <span className="text-green-400 font-bold">{estimatedYield} ETH</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Current APY:</span>
                  <span className="text-white font-medium">{getAPY()}%</span>
                </div>
              </div>

              {isEligibleForNFT ? (
                <div className="p-4 rounded-lg bg-gradient-to-r from-purple-900/30 via-pink-900/30 to-purple-900/30 border border-purple-500/30">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">🎉</span>
                    <span className="text-lg font-bold text-purple-200">NFT Eligible!</span>
                  </div>
                  <p className="text-purple-200 text-sm">
                    This deposit qualifies you for an Elite NFT that provides permanent APY boosts!
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-lg bg-blue-900/20 border border-blue-500/30">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-xl">💡</span>
                    <span className="text-lg font-bold text-blue-200">Pro Tip</span>
                  </div>
                  <p className="text-blue-200 text-sm">
                    Deposit 0.1 ETH or more to be eligible for an Elite NFT with permanent APY boosts!
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="flex space-x-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="cyber-button flex-1 px-6 py-3 font-semibold rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !amount || parseFloat(amount) <= 0}
              className="cyber-button-primary flex-1 px-6 py-3 font-semibold rounded-lg disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="loading-shimmer w-4 h-4 rounded-full"></div>
                  <span>Depositing...</span>
                </div>
              ) : (
                'Deposit ETH'
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Transaction will be processed on Somnia Network
          </p>
        </div>
      </div>
    </div>
  );
};

export default DepositModal;