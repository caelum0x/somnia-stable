'use client';

import React, { useState } from 'react';
import { withdrawFromVault, getUserVaultBalance } from '../../app/services/contractService';
import { StandardFormField, StandardButton, StandardModal } from './StandardUI';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  vaultName?: string;
  userAddress?: string;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({
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
  const [vaultBalance, setVaultBalance] = useState('0');

  // Load user vault balance when modal opens
  React.useEffect(() => {
    if (isOpen && userAddress) {
      getUserVaultBalance().then(balance => {
        setVaultBalance(parseFloat(balance).toFixed(4));
      }).catch(console.error);
    }
  }, [isOpen, userAddress]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (parseFloat(amount) > parseFloat(vaultBalance)) {
      setError('Amount exceeds vault balance');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setTxHash('');

    try {
      const tx = await withdrawFromVault(amount);
      setTxHash(tx.hash);
      
      if (onSuccess) {
        onSuccess();
      }

      setAmount('');
      
      // Auto-close after showing success
      setTimeout(() => {
        onClose();
      }, 3000);
      
    } catch (error: any) {
      console.error('Withdrawal failed:', error);
      setError(error.message || 'Withdrawal failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMaxClick = () => {
    setAmount(vaultBalance);
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
      title={`Withdraw from ${vaultName}`}
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
              <span>Withdrawal successful!</span>
            </div>
            <div className="mt-2 text-xs opacity-80">
              Hash: {txHash.slice(0, 10)}...{txHash.slice(-8)}
            </div>
          </div>
        )}

        <StandardFormField
          id="amount"
          label="Withdrawal Amount (ETH)"
          type="number"
          placeholder="0.000"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          helperText={`Available: ${vaultBalance} ETH`}
          required
          maxButton
          onMaxClick={handleMaxClick}
          disabled={isSubmitting}
        />

        {amount && (
          <div className="space-y-4">
            <div className="card p-5">
              <div className="text-sm text-gray-400 mb-2">Withdrawal Summary</div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-300">You Withdraw:</span>
                <span className="text-white font-bold">{amount} ETH</span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-300">Remaining in Vault:</span>
                <span className="text-blue-400 font-bold">{(parseFloat(vaultBalance) - parseFloat(amount)).toFixed(4)} ETH</span>
              </div>
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <div className="text-gray-300">Gas Fee (est.):</div>
                  <div className="text-white font-mono">~0.0015 ETH</div>
                </div>
              </div>
            </div>

            <div className="card p-4 bg-orange-900/20 border-orange-500/30">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <span className="text-xl">⚠️</span>
                </div>
                <span className="text-lg font-bold text-orange-200">Important</span>
              </div>
              <p className="text-orange-200 text-sm">
                Withdrawing from the vault will stop earning yield on the withdrawn amount. Consider partial withdrawals to keep earning.
              </p>
            </div>
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
            disabled={isSubmitting || !amount || parseFloat(amount) <= 0 || parseFloat(amount) > parseFloat(vaultBalance)}
            isLoading={isSubmitting}
            fullWidth
          >
            {isSubmitting ? 'Withdrawing...' : 'Withdraw ETH'}
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

export default WithdrawModal;