'use client';

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Link from 'next/link';

const HomePage: React.FC = () => {
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
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
        const provider = new ethers.BrowserProvider(window.ethereum);
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

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 cyber-card border-0 rounded-none backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <h1 className="text-xl font-bold gradient-text">SomniaVault</h1>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-gray-300 hover:text-white px-3 py-1 rounded text-sm font-medium transition-colors hover:bg-white/5">
                Home
              </Link>
              <Link href="/dashboard" className="text-gray-300 hover:text-white px-3 py-1 rounded text-sm font-medium transition-colors hover:bg-white/5">
                Dashboard
              </Link>
              <Link href="/vaults" className="text-gray-300 hover:text-white px-3 py-1 rounded text-sm font-medium transition-colors hover:bg-white/5">
                Vaults
              </Link>
              <Link href="/nfts" className="text-gray-300 hover:text-white px-3 py-1 rounded text-sm font-medium transition-colors hover:bg-white/5">
                NFTs
              </Link>
              <Link href="/analytics" className="text-gray-300 hover:text-white px-3 py-1 rounded text-sm font-medium transition-colors hover:bg-white/5">
                Analytics
              </Link>
            </div>

            {/* Wallet Connection */}
            <div className="flex items-center space-x-3">
              {userAddress ? (
                <div className="flex items-center space-x-2">
                  <div className="bg-gradient-to-r from-green-400/20 to-emerald-400/20 border border-green-400/30 text-green-400 px-3 py-1 rounded text-xs font-medium flex items-center space-x-1">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Connected</span>
                  </div>
                  <div className="font-mono text-xs text-gray-300 bg-white/5 px-2 py-1 rounded border border-white/10">
                    {shortAddress}
                  </div>
                </div>
              ) : (
                <button
                  onClick={connectWallet}
                  disabled={isLoading}
                  className="cyber-button-primary px-4 py-2 text-sm font-semibold rounded"
                >
                  {isLoading ? 'Connecting...' : 'Connect Wallet'}
                </button>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden text-gray-300 hover:text-white p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-3 border-t border-white/10">
              <div className="flex flex-col space-y-1">
                <Link href="/" className="text-gray-300 hover:text-white px-4 py-2 rounded text-sm font-medium transition-colors hover:bg-white/5" onClick={() => setIsMenuOpen(false)}>
                  Home
                </Link>
                <Link href="/dashboard" className="text-gray-300 hover:text-white px-4 py-2 rounded text-sm font-medium transition-colors hover:bg-white/5" onClick={() => setIsMenuOpen(false)}>
                  Dashboard
                </Link>
                <Link href="/vaults" className="text-gray-300 hover:text-white px-4 py-2 rounded text-sm font-medium transition-colors hover:bg-white/5" onClick={() => setIsMenuOpen(false)}>
                  Vaults
                </Link>
                <Link href="/nfts" className="text-gray-300 hover:text-white px-4 py-2 rounded text-sm font-medium transition-colors hover:bg-white/5" onClick={() => setIsMenuOpen(false)}>
                  NFTs
                </Link>
                <Link href="/analytics" className="text-gray-300 hover:text-white px-4 py-2 rounded text-sm font-medium transition-colors hover:bg-white/5" onClick={() => setIsMenuOpen(false)}>
                  Analytics
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

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
      <footer className="border-t border-white/10 bg-gradient-to-b from-transparent to-black/20">
        <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">S</span>
                </div>
                <h2 className="text-xl font-bold gradient-text">SomniaVault</h2>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed max-w-md">
                Next-generation DeFi platform offering quantum-secured vaults, hyper yields, and exclusive NFT rewards.
              </p>
              <div className="mt-6 flex space-x-3">
                <div className="cyber-card px-3 py-1 text-xs">
                  <span className="text-gray-400">TVL:</span>
                  <span className="text-green-400 font-bold ml-1">$47.2M</span>
                </div>
                <div className="cyber-card px-3 py-1 text-xs">
                  <span className="text-gray-400">Users:</span>
                  <span className="text-blue-400 font-bold ml-1">15,847</span>
                </div>
              </div>
            </div>

            {/* Platform Links */}
            <div>
              <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">
                Platform
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/dashboard" className="text-gray-300 hover:text-white text-sm transition-colors block">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/vaults" className="text-gray-300 hover:text-white text-sm transition-colors block">
                    Vaults
                  </Link>
                </li>
                <li>
                  <Link href="/nfts" className="text-gray-300 hover:text-white text-sm transition-colors block">
                    NFT Rewards
                  </Link>
                </li>
                <li>
                  <Link href="/analytics" className="text-gray-300 hover:text-white text-sm transition-colors block">
                    Analytics
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">
                Resources
              </h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors block">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors block">
                    Whitepaper
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors block">
                    Security Audit
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors block">
                    Bug Bounty
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
              <div className="flex flex-col md:flex-row items-center space-y-1 md:space-y-0 md:space-x-4">
                <p className="text-gray-400 text-sm">
                  &copy; 2024 SomniaVault. Built on Somnia Network.
                </p>
                <div className="flex items-center space-x-1 text-xs">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400">Network Online</span>
                </div>
              </div>
              <div className="flex space-x-3">
                <a href="#" className="text-gray-400 hover:text-white transition-colors group">
                  <span className="sr-only">Twitter</span>
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </div>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors group">
                  <span className="sr-only">Discord</span>
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418Z"/>
                    </svg>
                  </div>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors group">
                  <span className="sr-only">GitHub</span>
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-500/20 to-gray-600/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;