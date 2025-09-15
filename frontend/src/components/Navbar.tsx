import React, { useState } from 'react';
import Link from 'next/link';

interface NavbarProps {
  userAddress: string | null;
  onConnect: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ userAddress, onConnect }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const shortAddress = userAddress
    ? `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`
    : '';

  return (
    <nav className="fixed top-0 w-full z-50 cyber-card border-0 rounded-none backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <h1 className="text-2xl font-bold gradient-text">SomniaVault</h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-300 hover:text-white px-4 py-2 rounded-lg text-lg font-medium transition-colors hover:bg-white/5">
              Home
            </Link>
            <Link href="/dashboard" className="text-gray-300 hover:text-white px-4 py-2 rounded-lg text-lg font-medium transition-colors hover:bg-white/5">
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

          {/* Wallet Connection */}
          <div className="flex items-center space-x-4">
            {userAddress ? (
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-green-400/20 to-emerald-400/20 border border-green-400/30 text-green-400 px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Connected</span>
                </div>
                <div className="font-mono text-sm text-gray-300 bg-white/5 px-3 py-2 rounded-lg border border-white/10">
                  {shortAddress}
                </div>
              </div>
            ) : (
              <button
                onClick={onConnect}
                className="cyber-button-primary px-6 py-3 text-lg font-semibold rounded-lg"
              >
                Connect Wallet
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
          <div className="md:hidden py-4 border-t border-white/10">
            <div className="flex flex-col space-y-2">
              <Link href="/" className="text-gray-300 hover:text-white px-4 py-3 rounded-lg text-lg font-medium transition-colors hover:bg-white/5">
                Home
              </Link>
              <Link href="/dashboard" className="text-gray-300 hover:text-white px-4 py-3 rounded-lg text-lg font-medium transition-colors hover:bg-white/5">
                Dashboard
              </Link>
              <Link href="/vaults" className="text-gray-300 hover:text-white px-4 py-3 rounded-lg text-lg font-medium transition-colors hover:bg-white/5">
                Vaults
              </Link>
              <Link href="/nfts" className="text-gray-300 hover:text-white px-4 py-3 rounded-lg text-lg font-medium transition-colors hover:bg-white/5">
                NFTs
              </Link>
              <Link href="/analytics" className="text-gray-300 hover:text-white px-4 py-3 rounded-lg text-lg font-medium transition-colors hover:bg-white/5">
                Analytics
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;