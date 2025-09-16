'use client';

import React, { useState } from 'react';
import { depositToVault, getWalletBalance } from '../../app/services/contractService';
import { StandardFormField, StandardButton, StandardModal, StandardBadge } from './StandardUI';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  vaultName?: string;
  userAddress?: string;
}

const DepositModal: React.FC<DepositModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  vaultName = "Quantum Vault Alpha",
  userAddress
}) => {
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [txHash, setTxHash] = useState('');
  const [userBalance, setUserBalance] = useState('0');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setTxHash('');

    try {
      const tx = await depositToVault(amount);
      setTxHash(tx.hash);
      
      // Check if eligible for NFT mint
      const amountNumber = parseFloat(amount);
      const eligible = amountNumber >= 0.1; // NFT eligibility threshold
      
      if (onSuccess) {
        onSuccess();
      }

      setAmount('');
      
      // Auto-close after showing success
      setTimeout(() => {
        onClose();
      }, 3000);
      
    } catch (error: any) {
      console.error('Deposit failed:', error);
      setError(error.message || 'Deposit failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Load user balance when modal opens
  React.useEffect(() => {
    if (isOpen && userAddress) {
      getWalletBalance(userAddress).then(balance => {
        setUserBalance(parseFloat(balance).toFixed(4));
      }).catch(console.error);
    }
  }, [isOpen, userAddress]);

  const estimatedYield = amount ? (parseFloat(amount) * 15.2 / 100).toFixed(4) : '0'; // 15.2% APY
  const isEligibleForNFT = amount ? parseFloat(amount) >= 0.1 : false;

  const handleMaxClick = () => {
    const maxAmount = Math.max(0, parseFloat(userBalance) - 0.01); // Leave some for gas
    setAmount(maxAmount.toFixed(4));
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setAmount('');
      setError('');
      setTxHash('');
      onClose();
    }
  };

  return (
    <StandardModal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Deposit to ${vaultName}`}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {txHash && (
          <div className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Transaction successful!</span>
            </div>
            <div className="mt-2 text-xs opacity-80">
              Hash: {txHash.slice(0, 10)}...{txHash.slice(-8)}
            </div>
          </div>
        )}

        <StandardFormField
          id="amount"
          label="Amount (ETH)"
          type="number"
          placeholder="0.000"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          helperText={`Balance: ${userBalance} ETH`}
          required
          maxButton
          onMaxClick={handleMaxClick}
          disabled={isSubmitting}
        />

          {amount && (
            <div className="space-y-4">
              <div className="card p-5">
                <div className="text-sm text-gray-400 mb-2">Deposit Summary</div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-300">You Deposit:</span>
                  <span className="text-white font-bold">{amount} ETH</span>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-300">Annual Yield:</span>
                  <span className="text-green-400 font-bold">{estimatedYield} ETH</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Current APY:</span>
                  <StandardBadge variant="green">15.2%</StandardBadge>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="text-gray-300">Gas Fee (est.):</div>
                    <div className="text-white font-mono">~0.0023 ETH</div>
                  </div>
                </div>
              </div>

              {isEligibleForNFT ? (
                <div className="card p-4 bg-gradient-to-r from-purple-900/30 via-pink-900/30 to-purple-900/30 border-purple-500/30">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <span className="text-2xl">🎉</span>
                    </div>
                    <span className="text-lg font-bold text-purple-200">NFT Eligible!</span>
                  </div>
                  <p className="text-purple-200 text-sm">
                    This deposit qualifies you for an Elite NFT that provides permanent APY boosts and exclusive features!
                  </p>
                </div>
              ) : (
                <div className="card p-4 bg-blue-900/20 border-blue-500/30">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <span className="text-xl">💡</span>
                    </div>
                    <span className="text-lg font-bold text-blue-200">Pro Tip</span>
                  </div>
                  <p className="text-blue-200 text-sm">
                    Deposit 0.1 ETH or more to be eligible for an Elite NFT with permanent APY boosts and exclusive features!
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="flex space-x-4 pt-6">
            <StandardButton 
              variant="secondary" 
              onClick={handleClose} 
              fullWidth
              disabled={isSubmitting}
            >
              Cancel
            </StandardButton>
            
            <StandardButton
              type="submit"
              variant="primary"
              disabled={isSubmitting || !amount || parseFloat(amount) <= 0}
              isLoading={isSubmitting}
              fullWidth
            >
              {isSubmitting ? 'Depositing...' : 'Deposit ETH'}
            </StandardButton>
          </div>
        </form>

        <div className="mt-8 pt-4 border-t border-white/10">
          <div className="flex items-center justify-center space-x-2 text-gray-400 text-sm">
            <div className="pulse-dot"></div>
            <p>Transaction will be processed on Somnia Network</p>
          </div>
        </div>
    </StandardModal>
  );
};

export default DepositModal;