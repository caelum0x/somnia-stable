'use client';

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Link from 'next/link';
import StandardNavbar from '../src/components/StandardNavbar';
import StandardFooter from '../src/components/StandardFooter';

const HomePage: React.FC = () => {
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <StandardNavbar 
        userAddress={userAddress}
        onConnect={connectWallet}
        isLoading={isLoading}
      />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center pt-20 pb-16">
            <h1 className="text-3xl sm:text-4xl md:text-5xl tracking-tight font-extrabold mb-6">
              <span className="gradient-text">Next-Gen DeFi</span>{' '}
              <span className="text-white">Yield Platform</span>
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
              Maximize your stablecoin returns with our advanced vaults, earn exclusive NFT rewards, and participate in the future of decentralized finance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard" className="cyber-button-primary px-6 py-3 text-base font-bold rounded inline-flex items-center justify-center">
                {userAddress ? 'Enter Dashboard' : 'Connect Wallet'}
              </Link>
              <a
                href="#features"
                className="cyber-button px-6 py-3 text-base font-semibold rounded inline-flex items-center justify-center"
              >
                Explore Features
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-xs font-semibold tracking-wide uppercase gradient-text mb-2">Platform Features</h2>
            <h3 className="text-2xl lg:text-3xl font-extrabold text-white mb-4">
              Advanced DeFi Infrastructure
            </h3>
            <p className="text-base text-gray-300 max-w-2xl mx-auto">
              Experience the next generation of decentralized finance with our cutting-edge features.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="cyber-card p-6 text-center group">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <div className="text-2xl">🏛️</div>
              </div>
              <h4 className="text-lg font-bold text-white mb-3">Quantum Vaults</h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                Military-grade smart contracts with multi-signature security and real-time monitoring.
              </p>
            </div>

            <div className="cyber-card p-6 text-center group">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <div className="text-2xl">⚡</div>
              </div>
              <h4 className="text-lg font-bold text-white mb-3">Hyper Yields</h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                Earn up to 15% APY through advanced yield strategies and automated compound interest.
              </p>
            </div>

            <div className="cyber-card p-6 text-center group sm:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <div className="text-2xl">💎</div>
              </div>
              <h4 className="text-lg font-bold text-white mb-3">Elite NFTs</h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                Unlock exclusive NFT rewards that provide permanent APY boosts and premium features.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-800/10 via-blue-800/10 to-cyan-800/10"></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-extrabold text-white mb-4">
              Powering the DeFi Revolution
            </h2>
            <p className="text-base text-gray-300">Real-time protocol statistics</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="stats-card text-center">
              <div className="text-2xl lg:text-3xl font-bold gradient-text mb-1">
                $47.2M
              </div>
              <div className="text-gray-300 text-sm font-medium">
                Total Value Locked
              </div>
            </div>
            <div className="stats-card text-center">
              <div className="text-2xl lg:text-3xl font-bold text-green-400 mb-1">
                15,847
              </div>
              <div className="text-gray-300 text-sm font-medium">
                Active Users
              </div>
            </div>
            <div className="stats-card text-center">
              <div className="text-2xl lg:text-3xl font-bold text-purple-400 mb-1">
                3,291
              </div>
              <div className="text-gray-300 text-sm font-medium">
                Elite NFTs
              </div>
            </div>
            <div className="stats-card text-center">
              <div className="text-2xl lg:text-3xl font-bold text-cyan-400 mb-1">
                12.4%
              </div>
              <div className="text-gray-300 text-sm font-medium">
                Average APY
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-12">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl lg:text-3xl font-extrabold text-white mb-6">
            Ready to <span className="gradient-text">Maximize</span> Your Yields?
          </h2>
          <p className="text-base text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of users earning passive income with our advanced DeFi platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard" className="cyber-button-primary px-8 py-3 text-base font-bold rounded inline-flex items-center justify-center">
              Launch App
            </Link>
            <Link href="/analytics" className="cyber-button px-8 py-3 text-base font-semibold rounded inline-flex items-center justify-center">
              View Analytics
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <StandardFooter />
    </div>
  );
};

export default HomePage;