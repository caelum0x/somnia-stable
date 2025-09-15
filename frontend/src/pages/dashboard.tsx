import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Dashboard from '../components/Dashboard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Deployed contract addresses
const CONTRACT_ADDRESSES = {
  MANAGER: '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
  NFT: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
};

const DashboardPage: React.FC = () => {
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

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
        alert('Failed to connect wallet. Please try again.');
      }
    } else {
      alert('Please install MetaMask to use this application!');
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar userAddress={userAddress} onConnect={connectWallet} />
        
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m0 0v2m0-2h2m-2 0h-2m9-6V9a5 5 0 10-10 0v2M7 19h10a2 2 0 002-2v-5a2 2 0 00-2-2H7a2 2 0 00-2 2v5a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Connect Your Wallet
            </h2>
            
            <p className="text-gray-600 mb-6">
              To access your dashboard and manage your vaults, please connect your wallet.
            </p>
            
            <button
              onClick={connectWallet}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Connect Wallet
            </button>
            
            <div className="mt-6 text-sm text-gray-500">
              <p>Make sure you're connected to Somnia Testnet</p>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userAddress={userAddress} onConnect={connectWallet} />
      
      <Dashboard
        managerAddress={CONTRACT_ADDRESSES.MANAGER}
        nftAddress={CONTRACT_ADDRESSES.NFT}
        userAddress={userAddress || ''}
      />

      <Footer />
    </div>
  );
};

export default DashboardPage;