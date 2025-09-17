'use client';

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import StandardNavbar from '../../src/components/StandardNavbar';
import StandardFooter from '../../src/components/StandardFooter';
import { mintGenesisNFT, mintMultiplierNFT, mintAccessNFT } from '../services/contractService';

const NFTsPage: React.FC = () => {
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mintingNFT, setMintingNFT] = useState<number | null>(null);
  const [txHash, setTxHash] = useState<string>('');
  const [error, setError] = useState<string>('');

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

  const nftCollections = [
    {
      id: 1,
      name: "Elite Booster Genesis",
      price: "0.1 ETH",
      boost: "+2.5% APY",
      supply: "500",
      minted: "247",
      description: "Permanent APY boost for all vault deposits",
      rarity: "Legendary",
      icon: "💎",
      mintFunction: mintGenesisNFT
    },
    {
      id: 2,
      name: "Quantum Multiplier",
      price: "0.05 ETH",
      boost: "+1.2% APY",
      supply: "1000",
      minted: "683",
      description: "Enhanced yield multiplier with stacking benefits",
      rarity: "Epic",
      icon: "⚡",
      mintFunction: mintMultiplierNFT
    },
    {
      id: 3,
      name: "Stellar Access Pass",
      price: "0.03 ETH",
      boost: "VIP Access",
      supply: "2000",
      minted: "1456",
      description: "Exclusive access to premium vaults and features",
      rarity: "Rare",
      icon: "🌟",
      mintFunction: mintAccessNFT
    }
  ];

  const handleMintNFT = async (nft: any) => {
    if (!userAddress) {
      setError('Please connect your wallet first');
      return;
    }

    setMintingNFT(nft.id);
    setError('');
    setTxHash('');

    try {
      const tx = await nft.mintFunction(userAddress);
      setTxHash(tx.hash);
      
      // Reset after showing success
      setTimeout(() => {
        setTxHash('');
        setMintingNFT(null);
      }, 5000);
      
    } catch (error: any) {
      console.error('NFT minting failed:', error);
      setError(error.message || 'Minting failed. Please try again.');
      setMintingNFT(null);
    }
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
            <span className="gradient-text">Elite NFTs</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Mint exclusive NFTs that provide permanent benefits, yield boosts, and VIP access to premium features
          </p>
        </div>

        {/* Global Status Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {txHash && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>NFT minting successful!</span>
            </div>
            <div className="mt-2 text-xs opacity-80">
              Hash: {txHash.slice(0, 10)}...{txHash.slice(-8)}
            </div>
          </div>
        )}

        <div className="nft-benefits-card mb-12">
          <div className="flex items-center mb-4">
            <span className="nft-icon">💎</span>
            <div>
              <h2 className="text-2xl font-bold text-white">NFT Benefits</h2>
              <p className="text-gray-300">Unlock permanent advantages</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400 mb-1">+5% APY</div>
              <div className="text-gray-300 text-sm">Maximum Boost</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400 mb-1">VIP</div>
              <div className="text-gray-300 text-sm">Exclusive Access</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">Forever</div>
              <div className="text-gray-300 text-sm">Permanent Benefits</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {nftCollections.map((nft) => (
            <div key={nft.id} className="cyber-card p-6 group hover:scale-105 transition-transform duration-300">
              <div className="w-full h-48 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <span className="text-6xl">{nft.icon}</span>
              </div>
              
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-bold text-white">{nft.name}</h3>
                <span className={`nft-badge ${
                  nft.rarity === 'Legendary' ? 'bg-yellow-500/20 text-yellow-400' :
                  nft.rarity === 'Epic' ? 'bg-purple-500/20 text-purple-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {nft.rarity}
                </span>
              </div>
              
              <p className="text-gray-300 mb-4 text-sm">{nft.description}</p>
              
              <div className="space-y-2 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Price</span>
                  <span className="text-lg font-bold text-blue-400">{nft.price}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Benefit</span>
                  <span className="text-sm font-semibold text-green-400">{nft.boost}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Supply</span>
                  <span className="text-sm text-gray-300">{nft.minted}/{nft.supply}</span>
                </div>
              </div>
              
              <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(parseInt(nft.minted) / parseInt(nft.supply)) * 100}%` }}
                ></div>
              </div>
              
              {userAddress ? (
                <button 
                  onClick={() => handleMintNFT(nft)}
                  disabled={mintingNFT === nft.id}
                  className="cyber-button-primary w-full py-3 text-base font-bold rounded disabled:opacity-50"
                >
                  {mintingNFT === nft.id ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Minting...</span>
                    </div>
                  ) : (
                    'Mint NFT'
                  )}
                </button>
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
          <h2 className="text-2xl font-bold text-white mb-6">How NFT Boosts Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Mint</h3>
              <p className="text-gray-300">Choose and mint your preferred NFT with unique benefits</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📈</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Boost</h3>
              <p className="text-gray-300">Automatic APY boost applied to all your vault deposits</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">♾️</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Forever</h3>
              <p className="text-gray-300">Keep your NFT benefits permanently across all activities</p>
            </div>
          </div>
        </div>
      </div>

      <StandardFooter />
    </div>
  );
};

export default NFTsPage;