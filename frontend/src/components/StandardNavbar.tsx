import React, { useState } from 'react';
import Link from 'next/link';

interface NavbarProps {
  userAddress: string | null;
  onConnect: () => void;
  isLoading?: boolean;
}

const StandardNavbar: React.FC<NavbarProps> = ({ 
  userAddress, 
  onConnect, 
  isLoading = false 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const shortAddress = userAddress
    ? `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`
    : '';

  return (
    <nav className="fixed top-0 w-full z-50 bg-gradient-to-r from-indigo-900/80 to-purple-900/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110 duration-300">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <h1 className="text-2xl font-bold gradient-text">SomniaVault</h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center md:space-x-0.5 lg:space-x-2">
            <Link href="/" className="text-gray-300 hover:text-white px-2 py-2 lg:px-4 lg:py-2 rounded-lg text-sm lg:text-base font-medium transition-all duration-300 hover:bg-white/10">
              Home
            </Link>
            <Link href="/dashboard" className="text-gray-300 hover:text-white px-2 py-2 lg:px-4 lg:py-2 rounded-lg text-sm lg:text-base font-medium transition-all duration-300 hover:bg-white/10">
              Dashboard
            </Link>
            <Link href="/vaults" className="text-gray-300 hover:text-white px-2 py-2 lg:px-4 lg:py-2 rounded-lg text-sm lg:text-base font-medium transition-all duration-300 hover:bg-white/10">
              Vaults
            </Link>
            <Link href="/nfts" className="hidden lg:inline-block text-gray-300 hover:text-white px-2 py-2 lg:px-4 lg:py-2 rounded-lg text-sm lg:text-base font-medium transition-all duration-300 hover:bg-white/10">
              NFTs
            </Link>
            <Link href="/analytics" className="text-gray-300 hover:text-white px-2 py-2 lg:px-4 lg:py-2 rounded-lg text-sm lg:text-base font-medium transition-all duration-300 hover:bg-white/10">
              Analytics
            </Link>
          </div>

          {/* Wallet Connection */}
          <div className="flex items-center space-x-4">
            {userAddress ? (
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-green-400/20 to-emerald-400/20 border border-green-400/30 text-green-400 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-2 shadow-glow-green">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Connected</span>
                </div>
                <div className="font-mono text-xs text-gray-300 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 transition-colors">
                  {shortAddress}
                </div>
              </div>
            ) : (
              <button
                onClick={onConnect}
                disabled={isLoading}
                className="cyber-button-primary px-4 py-2 text-sm font-semibold rounded-lg hover:shadow-glow-blue transition-all duration-300 flex items-center justify-center min-w-[120px]"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Connecting...</span>
                  </div>
                ) : (
                  'Connect Wallet'
                )}
              </button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-300 hover:text-white p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10 animate-slideDown">
            <div className="flex flex-col space-y-2">
              <Link 
                href="/" 
                className="text-gray-300 hover:text-white px-4 py-3 rounded-lg text-lg font-medium transition-colors hover:bg-white/10"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/dashboard" 
                className="text-gray-300 hover:text-white px-4 py-3 rounded-lg text-lg font-medium transition-colors hover:bg-white/10"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                href="/vaults" 
                className="text-gray-300 hover:text-white px-4 py-3 rounded-lg text-lg font-medium transition-colors hover:bg-white/10"
                onClick={() => setIsMenuOpen(false)}
              >
                Vaults
              </Link>
              <Link 
                href="/nfts" 
                className="text-gray-300 hover:text-white px-4 py-3 rounded-lg text-lg font-medium transition-colors hover:bg-white/10"
                onClick={() => setIsMenuOpen(false)}
              >
                NFTs
              </Link>
              <Link 
                href="/analytics" 
                className="text-gray-300 hover:text-white px-4 py-3 rounded-lg text-lg font-medium transition-colors hover:bg-white/10"
                onClick={() => setIsMenuOpen(false)}
              >
                Analytics
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default StandardNavbar;