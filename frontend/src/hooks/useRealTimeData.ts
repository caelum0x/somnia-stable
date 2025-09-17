'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getVaultBalance,
  getUserVaultBalance,
  getWalletBalance,
  getUserNFTBalance,
  getUserNFTBoost,
  getTotalNFTSupply,
  checkWalletConnection
} from '../../app/services/contractService';

export interface VaultData {
  totalBalance: string;
  userBalance: string;
  apy: number;
  isLoading: boolean;
}

export interface UserData {
  address: string | null;
  walletBalance: string;
  vaultBalance: string;
  nftBalance: string;
  nftBoost: string;
  isLoading: boolean;
}

export interface ProtocolData {
  totalValueLocked: string;
  totalNFTs: string;
  activeUsers: number;
  averageAPY: number;
  isLoading: boolean;
}

export const useRealTimeData = () => {
  const [userData, setUserData] = useState<UserData>({
    address: null,
    walletBalance: '0',
    vaultBalance: '0',
    nftBalance: '0',
    nftBoost: '0',
    isLoading: true
  });

  const [vaultData, setVaultData] = useState<VaultData>({
    totalBalance: '0',
    userBalance: '0',
    apy: 15.2,
    isLoading: true
  });

  const [protocolData, setProtocolData] = useState<ProtocolData>({
    totalValueLocked: '0',
    totalNFTs: '0',
    activeUsers: 0,
    averageAPY: 15.2,
    isLoading: true
  });

  const [error, setError] = useState<string | null>(null);

  const fetchUserData = useCallback(async (address: string) => {
    try {
      setUserData(prev => ({ ...prev, isLoading: true }));

      const [walletBal, vaultBal, nftBal, nftBoost] = await Promise.allSettled([
        getWalletBalance(address),
        getUserVaultBalance(),
        getUserNFTBalance(address),
        getUserNFTBoost(address)
      ]);

      setUserData({
        address,
        walletBalance: walletBal.status === 'fulfilled' ? walletBal.value : '0',
        vaultBalance: vaultBal.status === 'fulfilled' ? vaultBal.value : '0',
        nftBalance: nftBal.status === 'fulfilled' ? nftBal.value : '0',
        nftBoost: nftBoost.status === 'fulfilled' ? (parseFloat(nftBoost.value) / 100).toString() : '0',
        isLoading: false
      });

      setError(null);
    } catch (err: any) {
      console.error('Error fetching user data:', err);
      setError(err.message);
      setUserData(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const fetchVaultData = useCallback(async () => {
    try {
      setVaultData(prev => ({ ...prev, isLoading: true }));

      const [totalBal, userBal] = await Promise.allSettled([
        getVaultBalance(),
        userData.address ? getUserVaultBalance() : Promise.resolve('0')
      ]);

      setVaultData({
        totalBalance: totalBal.status === 'fulfilled' ? totalBal.value : '0',
        userBalance: userBal.status === 'fulfilled' ? userBal.value : '0',
        apy: 15.2, // Could be dynamic based on contract
        isLoading: false
      });

      setError(null);
    } catch (err: any) {
      console.error('Error fetching vault data:', err);
      setError(err.message);
      setVaultData(prev => ({ ...prev, isLoading: false }));
    }
  }, [userData.address]);

  const fetchProtocolData = useCallback(async () => {
    try {
      setProtocolData(prev => ({ ...prev, isLoading: true }));

      const [vaultBal, nftSupply] = await Promise.allSettled([
        getVaultBalance(),
        getTotalNFTSupply()
      ]);

      const totalValueLocked = vaultBal.status === 'fulfilled' ? vaultBal.value : '0';
      const totalNFTs = nftSupply.status === 'fulfilled' ? nftSupply.value : '0';

      setProtocolData({
        totalValueLocked,
        totalNFTs,
        activeUsers: Math.floor(parseFloat(totalNFTs) * 1.5) || 0, // Estimate based on NFT holders
        averageAPY: 15.2,
        isLoading: false
      });

      setError(null);
    } catch (err: any) {
      console.error('Error fetching protocol data:', err);
      setError(err.message);
      setProtocolData(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const checkConnection = useCallback(async () => {
    try {
      const address = await checkWalletConnection();
      if (address && address !== userData.address) {
        await fetchUserData(address);
      } else if (!address) {
        setUserData({
          address: null,
          walletBalance: '0',
          vaultBalance: '0',
          nftBalance: '0',
          nftBoost: '0',
          isLoading: false
        });
      }
    } catch (err: any) {
      console.error('Error checking connection:', err);
      setError(err.message);
    }
  }, [userData.address, fetchUserData]);

  const refreshData = useCallback(async () => {
    await Promise.all([
      checkConnection(),
      fetchVaultData(),
      fetchProtocolData()
    ]);
  }, [checkConnection, fetchVaultData, fetchProtocolData]);

  // Initial data fetch
  useEffect(() => {
    refreshData();
  }, []);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(refreshData, 30000);
    return () => clearInterval(interval);
  }, [refreshData]);

  return {
    userData,
    vaultData,
    protocolData,
    error,
    refreshData,
    isConnected: !!userData.address
  };
};

export default useRealTimeData;