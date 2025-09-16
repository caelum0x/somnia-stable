import React, { useState } from 'react';
import { useVault } from '../hooks/useVault';
import { useNFT } from '../hooks/useNFT';
import { StandardFormField, StandardButton, StandardModal, StandardBadge } from './StandardUI';

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

  const estimatedYield = amount ? (parseFloat(amount) * parseFloat(getAPY()) / 100).toFixed(4) : '0';
  const isEligibleForNFT = amount ? mintEligibility(parseFloat(amount)) : false;

  return (
    <StandardModal
      isOpen={isOpen}
      onClose={onClose}
      title="Deposit to Vault"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <StandardFormField
          id="amount"
          label="Amount (ETH)"
          type="number"
          placeholder="0.000"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          helperText="Balance: ~3.5 ETH"
          required
          maxButton
          onMaxClick={() => setAmount('3.5')}
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
                  <StandardBadge variant="green">{getAPY()}%</StandardBadge>
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
              onClick={onClose} 
              fullWidth
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
              Deposit ETH
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