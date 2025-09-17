'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { connectWallet, checkWalletConnection, getWalletBalance } from '../../app/services/contractService';

interface WalletState {
  address: string | null;
  balance: string;
  isConnecting: boolean;
  isConnected: boolean;
  networkId: number | null;
  error: string | null;
}

interface NetworkInfo {
  chainId: number;
  name: string;
  symbol: string;
  rpcUrl: string;
  explorerUrl: string;
  icon: string;
}

const SUPPORTED_NETWORKS: NetworkInfo[] = [
  {
    chainId: 5031,
    name: 'Somnia Mainnet',
    symbol: 'SOMI',
    rpcUrl: 'https://api.infra.mainnet.somnia.network/',
    explorerUrl: 'https://explorer.somnia.network',
    icon: '🌌'
  },
  {
    chainId: 50312,
    name: 'Somnia Testnet',
    symbol: 'STT', 
    rpcUrl: 'https://dream-rpc.somnia.network/',
    explorerUrl: 'https://shannon-explorer.somnia.network/',
    icon: '🧪'
  }
];

export const QuantumWallet: React.FC = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    address: null,
    balance: '0',
    isConnecting: false,
    isConnected: false,
    networkId: null,
    error: null
  });

  const [showNetworkSwitch, setShowNetworkSwitch] = useState(false);
  const [preferredNetwork, setPreferredNetwork] = useState<NetworkInfo>(SUPPORTED_NETWORKS[1]); // Default to testnet

  const checkConnection = useCallback(async () => {
    try {
      const address = await checkWalletConnection();
      if (address) {
        const balance = await getWalletBalance(address);
        const networkId = await (window.ethereum as any)?.request({ method: 'eth_chainId' });
        
        setWalletState({
          address,
          balance: parseFloat(balance).toFixed(6),
          isConnecting: false,
          isConnected: true,
          networkId: parseInt(networkId, 16),
          error: null
        });
      } else {
        setWalletState(prev => ({ 
          ...prev, 
          isConnected: false, 
          address: null,
          balance: '0',
          networkId: null
        }));
      }
    } catch (error: any) {
      console.error('Error checking wallet connection:', error);
      setWalletState(prev => ({ 
        ...prev, 
        error: error.message,
        isConnecting: false 
      }));
    }
  }, []);

  const handleConnect = async () => {
    if (!window.ethereum) {
      setWalletState(prev => ({ 
        ...prev, 
        error: 'Please install MetaMask or another Web3 wallet' 
      }));
      return;
    }

    setWalletState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      const address = await connectWallet();
      const balance = await getWalletBalance(address);
      const networkId = await (window.ethereum as any).request({ method: 'eth_chainId' });
      
      setWalletState({
        address,
        balance: parseFloat(balance).toFixed(6),
        isConnecting: false,
        isConnected: true,
        networkId: parseInt(networkId, 16),
        error: null
      });

      // Auto-switch to preferred network if not already on it
      if (parseInt(networkId, 16) !== preferredNetwork.chainId) {
        setShowNetworkSwitch(true);
      }
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      setWalletState(prev => ({ 
        ...prev, 
        error: error.message,
        isConnecting: false 
      }));
    }
  };

  const switchNetwork = async (network: NetworkInfo) => {
    if (!window.ethereum) return;

    try {
      await (window.ethereum as any).request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${network.chainId.toString(16)}` }],
      });
      
      setPreferredNetwork(network);
      setShowNetworkSwitch(false);
      await checkConnection();
    } catch (switchError: any) {
      // If network doesn't exist, add it
      if (switchError.code === 4902) {
        try {
          await (window.ethereum as any).request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: `0x${network.chainId.toString(16)}`,
              chainName: network.name,
              nativeCurrency: {
                name: network.symbol,
                symbol: network.symbol,
                decimals: 18,
              },
              rpcUrls: [network.rpcUrl],
              blockExplorerUrls: [network.explorerUrl],
            }],
          });
          setPreferredNetwork(network);
          setShowNetworkSwitch(false);
        } catch (addError: any) {
          console.error('Failed to add network:', addError);
          setWalletState(prev => ({ 
            ...prev, 
            error: `Failed to add ${network.name}` 
          }));
        }
      }
    }
  };

  const disconnect = () => {
    setWalletState({
      address: null,
      balance: '0',
      isConnecting: false,
      isConnected: false,
      networkId: null,
      error: null
    });
  };

  const getCurrentNetwork = () => {
    return SUPPORTED_NETWORKS.find(n => n.chainId === walletState.networkId);
  };

  const isWrongNetwork = () => {
    return walletState.isConnected && !SUPPORTED_NETWORKS.some(n => n.chainId === walletState.networkId);
  };

  useEffect(() => {
    checkConnection();

    // Listen for account changes
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect();
      } else {
        checkConnection();
      }
    };

    // Listen for network changes
    const handleChainChanged = () => {
      checkConnection();
    };

    if (window.ethereum) {
      (window.ethereum as any).on('accountsChanged', handleAccountsChanged);
      (window.ethereum as any).on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        (window.ethereum as any).removeListener('accountsChanged', handleAccountsChanged);
        (window.ethereum as any).removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [checkConnection]);

  const currentNetwork = getCurrentNetwork();

  return (
    <div className="quantum-wallet relative">
      {/* Main Wallet Button */}
      {!walletState.isConnected ? (
        <button
          onClick={handleConnect}
          disabled={walletState.isConnecting}
          className="group relative overflow-hidden bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 quantum-button"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center space-x-2">
            {walletState.isConnecting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Initializing Quantum Link...</span>
              </>
            ) : (
              <>
                <span className="text-xl">⚡</span>
                <span>Connect Quantum Wallet</span>
              </>
            )}
          </div>
        </button>
      ) : (
        <div className="flex items-center space-x-4">
          {/* Network Indicator */}
          <div className={`px-3 py-2 rounded-lg flex items-center space-x-2 ${
            isWrongNetwork() 
              ? 'bg-red-500/20 border border-red-500/30' 
              : 'bg-green-500/20 border border-green-500/30'
          }`}>
            <div className={`w-2 h-2 rounded-full animate-pulse ${
              isWrongNetwork() ? 'bg-red-400' : 'bg-green-400'
            }`}></div>
            <span className="text-sm font-medium">
              {currentNetwork ? `${currentNetwork.icon} ${currentNetwork.name}` : '❌ Unknown Network'}
            </span>
          </div>

          {/* Wallet Info */}
          <div className="quantum-card rounded-xl p-4 flex items-center space-x-4">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center animate-pulse">
                <span className="text-xl">👤</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900"></div>
            </div>
            
            <div>
              <div className="text-sm text-gray-400">Quantum Address</div>
              <div className="font-mono text-cyan-400 text-sm">
                {walletState.address?.slice(0, 6)}...{walletState.address?.slice(-4)}
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-gray-400">Balance</div>
              <div className="font-bold text-white">
                {walletState.balance} {currentNetwork?.symbol || 'ETH'}
              </div>
            </div>
            
            <button
              onClick={disconnect}
              className="ml-4 p-2 text-gray-400 hover:text-red-400 transition-colors duration-200"
              title="Disconnect"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Error Display */}
      {walletState.error && (
        <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
          ⚠️ {walletState.error}
        </div>
      )}

      {/* Wrong Network Warning */}
      {isWrongNetwork() && (
        <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-amber-500/20 border border-amber-500/30 rounded-lg">
          <div className="text-amber-400 text-sm mb-2">
            ⚠️ Please switch to a supported network
          </div>
          <div className="space-y-2">
            {SUPPORTED_NETWORKS.map(network => (
              <button
                key={network.chainId}
                onClick={() => switchNetwork(network)}
                className="w-full text-left p-2 bg-slate-800/50 hover:bg-slate-700/50 rounded border border-gray-600/30 hover:border-amber-400/50 transition-all duration-200"
              >
                <div className="flex items-center space-x-2">
                  <span>{network.icon}</span>
                  <span className="text-white text-sm">{network.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Network Switch Modal */}
      {showNetworkSwitch && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="quantum-card p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-4">Switch to Somnia Network</h3>
            <p className="text-gray-300 mb-6">
              For the best experience, please switch to the Somnia network.
            </p>
            
            <div className="space-y-3 mb-6">
              {SUPPORTED_NETWORKS.map(network => (
                <button
                  key={network.chainId}
                  onClick={() => switchNetwork(network)}
                  className="w-full text-left p-4 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg border border-gray-600/30 hover:border-cyan-400/50 transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{network.icon}</span>
                      <div>
                        <div className="text-white font-medium">{network.name}</div>
                        <div className="text-gray-400 text-sm">{network.symbol}</div>
                      </div>
                    </div>
                    <div className="text-cyan-400">→</div>
                  </div>
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setShowNetworkSwitch(false)}
              className="w-full py-2 px-4 text-gray-400 hover:text-white border border-gray-600/30 hover:border-gray-400/50 rounded-lg transition-all duration-200"
            >
              Skip for now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuantumWallet;