'use client';

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import StandardNavbar from '../../src/components/StandardNavbar';
import StandardFooter from '../../src/components/StandardFooter';
import DepositModal from '../../src/components/DepositModal';
import WithdrawModal from '../../src/components/WithdrawModal';

const VaultsPage: React.FC = () => {
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [selectedVault, setSelectedVault] = useState<any>(null);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum as any);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          setUserAddress(accounts[0].address);
        }
      } catch (error) {
        console.error('Error checking connection:', error);
      }
    }
  };

  const connectWallet = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      setIsLoading(true);
      try {
        const provider = new ethers.BrowserProvider(window.ethereum as any);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setUserAddress(address);
      } catch (error) {
        console.error('Error connecting wallet:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  const vaults = [
    {
      id: 1,
      name: "Quantum Vault Alpha",
      apy: "15.2%",
      tvl: "$2.4M",
      description: "High-yield stablecoin vault with automated rebalancing",
      risk: "Medium",
      icon: "🏛️"
    },
    {
      id: 2,
      name: "Stellar Vault Beta",
      apy: "12.8%",
      tvl: "$1.8M",
      description: "Conservative yield strategy with multi-asset exposure",
      risk: "Low",
      icon: "⭐"
    },
    {
      id: 3,
      name: "Nebula Vault Gamma",
      apy: "18.5%",
      tvl: "$956K",
      description: "Advanced DeFi strategies with higher returns",
      risk: "High",
      icon: "🌌"
    }
  ];

  const handleDeposit = (vault: any) => {
    setSelectedVault(vault);
    setShowDepositModal(true);
  };

  const handleWithdraw = (vault: any) => {
    setSelectedVault(vault);
    setShowWithdrawModal(true);
  };

  const handleTransactionSuccess = () => {
    // Refresh data or show success message
    console.log('Transaction successful!');
  };

  return (
    <div className="min-h-screen">
      <StandardNavbar 
        userAddress={userAddress}
        onConnect={connectWallet}
        isLoading={isLoading}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            <span className="gradient-text">Quantum Vaults</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Discover our advanced yield-generating vaults powered by cutting-edge DeFi strategies
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {vaults.map((vault) => (
            <div key={vault.id} className="cyber-card p-6 group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl">{vault.icon}</span>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-3">{vault.name}</h3>
              <p className="text-gray-300 mb-4">{vault.description}</p>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">APY</span>
                  <span className="text-2xl font-bold text-green-400">{vault.apy}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">TVL</span>
                  <span className="text-lg font-semibold text-blue-400">{vault.tvl}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Risk Level</span>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    vault.risk === 'Low' ? 'bg-green-500/20 text-green-400' :
                    vault.risk === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {vault.risk}
                  </span>
                </div>
              </div>
              
              {userAddress ? (
                <div className="space-y-3">
                  <button 
                    onClick={() => handleDeposit(vault)}
                    className="cyber-button-primary w-full py-3 text-base font-bold rounded"
                  >
                    Deposit
                  </button>
                  <button 
                    onClick={() => handleWithdraw(vault)}
                    className="cyber-button w-full py-2 text-sm font-semibold rounded"
                  >
                    Withdraw
                  </button>
                </div>
              ) : (
                <button 
                  onClick={connectWallet}
                  className="cyber-button w-full py-3 text-base font-semibold rounded"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="cyber-card p-8">
          <h2 className="text-2xl font-bold text-white mb-6">How Vaults Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Deposit</h3>
              <p className="text-gray-300">Deposit your stablecoins into our quantum-secured vaults</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Earn</h3>
              <p className="text-gray-300">Our AI-powered strategies maximize your yield automatically</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Withdraw</h3>
              <p className="text-gray-300">Withdraw your principal plus earned yield anytime</p>
            </div>
          </div>
        </div>
      </div>

      <StandardFooter />
      
      {/* Modals */}
      <DepositModal
        isOpen={showDepositModal}
        onClose={() => setShowDepositModal(false)}
        onSuccess={handleTransactionSuccess}
        vaultName={selectedVault?.name}
        userAddress={userAddress || undefined}
      />
      
      <WithdrawModal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        onSuccess={handleTransactionSuccess}
        vaultName={selectedVault?.name}
        userAddress={userAddress || undefined}
      />
    </div>
  );
};

export default VaultsPage;