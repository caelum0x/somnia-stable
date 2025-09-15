import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { useVault } from '../../hooks/useVault';
import { useNFT } from '../../hooks/useNFT';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import DepositModal from '../../components/DepositModal';
import WithdrawModal from '../../components/WithdrawModal';

// Deployed contract addresses
const CONTRACT_ADDRESSES = {
  NFT: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
};

const VaultDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const vaultAddress = id || '';

  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const { totalBalance, getAPY, loading } = useVault(vaultAddress);
  const { hasNFT, getAPYBoost } = useNFT(CONTRACT_ADDRESSES.NFT);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          setUserAddress(accounts[0].address);
          setIsConnected(true);
        }
      } catch (error) {
        console.error('Error checking connection:', error);
      }
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setUserAddress(address);
        setIsConnected(true);
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    }
  };

  const apy = getAPY();
  const apyBoost = getAPYBoost();
  const effectiveAPY = hasNFT 
    ? (parseFloat(apy) + parseFloat(apyBoost)).toFixed(1)
    : apy;

  const shortAddress = vaultAddress 
    ? `${vaultAddress.slice(0, 6)}...${vaultAddress.slice(-4)}`
    : 'Loading...';

  if (!vaultAddress) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading vault details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userAddress={userAddress} onConnect={connectWallet} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="mb-4 text-blue-600 hover:text-blue-700 font-medium flex items-center"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Vault Details</h1>
          <p className="text-gray-600 mt-2">Contract: {shortAddress}</p>
        </div>

        {/* Vault Overview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Current APY
              </p>
              <div className="mt-2 flex items-baseline justify-center">
                <p className="text-3xl font-bold text-green-600">{effectiveAPY}%</p>
                {hasNFT && (
                  <span className="ml-2 text-sm text-green-500 font-medium">
                    (+{apyBoost}% boost)
                  </span>
                )}
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Total Value Locked
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{totalBalance} ETH</p>
            </div>

            <div className="text-center">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Status
              </p>
              <p className="mt-2 text-3xl font-bold text-blue-600">Active</p>
            </div>
          </div>
        </div>

        {/* NFT Boost Info */}
        {hasNFT && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-purple-900 mb-2">🎉 NFT Holder Benefits</h3>
            <p className="text-purple-700">
              You're earning an additional {apyBoost}% APY boost thanks to your Reward NFT!
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Vault Actions</h2>
          
          {isConnected ? (
            <div className="flex space-x-4">
              <button
                onClick={() => setShowDepositModal(true)}
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                {loading ? 'Loading...' : 'Deposit'}
              </button>
              <button
                onClick={() => setShowWithdrawModal(true)}
                disabled={loading}
                className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                {loading ? 'Loading...' : 'Withdraw'}
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">Connect your wallet to interact with this vault</p>
              <button
                onClick={connectWallet}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                Connect Wallet
              </button>
            </div>
          )}
        </div>

        {/* Vault Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Vault Information</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Contract Address:</span>
              <span className="font-mono text-sm">{vaultAddress}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Deposit Token:</span>
              <span className="font-semibold">ETH</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Strategy:</span>
              <span className="font-semibold">Yield Farming</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Risk Level:</span>
              <span className="font-semibold text-green-600">Low</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <DepositModal
        isOpen={showDepositModal}
        onClose={() => setShowDepositModal(false)}
        vaultAddress={vaultAddress}
        nftAddress={CONTRACT_ADDRESSES.NFT}
      />
      
      <WithdrawModal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        vaultAddress={vaultAddress}
      />

      <Footer />
    </div>
  );
};

export default VaultDetailPage;