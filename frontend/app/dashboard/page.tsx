'use client';

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Link from 'next/link';

const CONTRACT_ADDRESSES = {
  MANAGER: '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
  NFT: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
};

const DashboardPage: React.FC = () => {
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const shortAddress = userAddress
    ? `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`
    : '';

  if (!userAddress) {
    return (
      <div className="min-h-screen pt-20">
        {/* Navbar */}
        <nav className="fixed top-0 w-full z-50 cyber-card border-0 rounded-none backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">S</span>
                </div>
                <h1 className="text-2xl font-bold gradient-text">SomniaVault</h1>
              </Link>
              <button
                onClick={connectWallet}
                disabled={isLoading}
                className="cyber-button-primary px-6 py-3 text-lg font-semibold rounded-lg"
              >
                {isLoading ? 'Connecting...' : 'Connect Wallet'}
              </button>
            </div>
          </div>
        </nav>

        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center floating-animation">
              <div className="text-6xl">🔗</div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Connect Your Wallet</h1>
            <p className="text-xl text-gray-300 mb-8 max-w-md mx-auto">
              Connect your wallet to access the dashboard and start earning yield on your assets.
            </p>
            <button
              onClick={connectWallet}
              disabled={isLoading}
              className="cyber-button-primary px-8 py-4 text-lg font-bold rounded-lg"
            >
              {isLoading ? 'Connecting...' : 'Connect Wallet'}
            </button>
            <div className="mt-6 text-gray-400">
              <p>Make sure you&apos;re connected to Somnia Network</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 cyber-card border-0 rounded-none backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <h1 className="text-2xl font-bold gradient-text">SomniaVault</h1>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-300 hover:text-white px-4 py-2 rounded-lg text-lg font-medium transition-colors hover:bg-white/5">
                Home
              </Link>
              <Link href="/dashboard" className="text-white bg-white/10 px-4 py-2 rounded-lg text-lg font-medium">
                Dashboard
              </Link>
              <Link href="/vaults" className="text-gray-300 hover:text-white px-4 py-2 rounded-lg text-lg font-medium transition-colors hover:bg-white/5">
                Vaults
              </Link>
              <Link href="/nfts" className="text-gray-300 hover:text-white px-4 py-2 rounded-lg text-lg font-medium transition-colors hover:bg-white/5">
                NFTs
              </Link>
              <Link href="/analytics" className="text-gray-300 hover:text-white px-4 py-2 rounded-lg text-lg font-medium transition-colors hover:bg-white/5">
                Analytics
              </Link>
            </div>

            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-green-400/20 to-emerald-400/20 border border-green-400/30 text-green-400 px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Connected</span>
              </div>
              <div className="font-mono text-sm text-gray-300 bg-white/5 px-3 py-2 rounded-lg border border-white/10">
                {shortAddress}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Welcome back, <span className="gradient-text">DeFi Master</span>
          </h1>
          <p className="text-xl text-gray-300">
            Monitor your portfolio and maximize your returns
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="stats-card group hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-300">Total Portfolio</h3>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-blue-400">💰</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-2">$7,118</div>
            <div className="text-sm text-green-400">+15.7% this month</div>
          </div>

          <div className="stats-card group hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-300">Your Balance</h3>
              <div className="w-8 h-8 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-green-400">🏦</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-2">2.5 ETH</div>
            <div className="text-sm text-gray-400">Available to invest</div>
          </div>

          <div className="stats-card group hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-300">Global APY</h3>
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-purple-400">📈</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-2">12.4%</div>
          </div>

          <div className="stats-card group hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-300">Elite NFTs</h3>
              <div className="w-8 h-8 bg-gradient-to-br from-pink-500/20 to-rose-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-pink-400">💎</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-2">1</div>
            <div className="text-sm text-gray-400">Owned</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Link href="/vaults" className="cyber-card p-8 group hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform floating-animation">
              <span className="text-3xl">🏛️</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Explore Vaults</h3>
            <p className="text-gray-300 text-lg">
              Discover quantum-secured investment opportunities with military-grade security.
            </p>
            <div className="mt-4 text-blue-400 font-medium">View All Vaults →</div>
          </Link>

          <Link href="/nfts" className="cyber-card p-8 group hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform floating-animation" style={{animationDelay: '0.5s'}}>
              <span className="text-3xl">💎</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Elite NFTs</h3>
            <p className="text-gray-300 text-lg">
              Mint exclusive NFTs that provide permanent APY boosts and VIP access.
            </p>
            <div className="mt-4 text-purple-400 font-medium">Mint NFTs →</div>
          </Link>

          <Link href="/analytics" className="cyber-card p-8 group hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform floating-animation" style={{animationDelay: '1s'}}>
              <span className="text-3xl">📊</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Analytics Hub</h3>
            <p className="text-gray-300 text-lg">
              Advanced analytics, real-time metrics, and AI-powered insights.
            </p>
            <div className="mt-4 text-green-400 font-medium">View Analytics →</div>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="cyber-card p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                  <span className="text-green-400">✅</span>
                </div>
                <div>
                  <div className="text-white font-medium">Successful Deposit</div>
                  <div className="text-gray-400 text-sm">Quantum Vault Alpha</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-medium">+2.5 ETH</div>
                <div className="text-gray-400 text-sm">2 hours ago</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <span className="text-purple-400">💎</span>
                </div>
                <div>
                  <div className="text-white font-medium">Elite NFT Minted</div>
                  <div className="text-gray-400 text-sm">Booster Genesis #247</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-medium">+2.5% APY</div>
                <div className="text-gray-400 text-sm">1 day ago</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <span className="text-blue-400">💰</span>
                </div>
                <div>
                  <div className="text-white font-medium">Yield Harvested</div>
                  <div className="text-gray-400 text-sm">Auto-compound enabled</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-medium">+0.125 ETH</div>
                <div className="text-gray-400 text-sm">3 days ago</div>
              </div>
            </div>
          </div>
        </div>

        {/* Protocol Stats */}
        <div className="cyber-card p-8">
          <h2 className="text-2xl font-bold text-white mb-8">Protocol Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold gradient-text mb-2">$47.2M</div>
              <div className="text-gray-300 text-lg">Total Value Locked</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">15,847</div>
              <div className="text-gray-300 text-lg">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">3,291</div>
              <div className="text-gray-300 text-lg">Elite NFTs</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-cyan-400 mb-2">12.4%</div>
              <div className="text-gray-300 text-lg">Your APY</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;