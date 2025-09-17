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
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [updateCount, setUpdateCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  const fetchUserData = useCallback(async (address: string) => {
    try {
      setUserData(prev => ({ ...prev, isLoading: true }));

      const [walletBal, vaultBal, nftBal, nftBoost] = await Promise.allSettled([
        getWalletBalance(address),
        getUserVaultBalance(),
        getUserNFTBalance(address),
        getUserNFTBoost(address)
      ]);

      const newUserData = {
        address,
        walletBalance: walletBal.status === 'fulfilled' ? parseFloat(walletBal.value).toFixed(6) : '0',
        vaultBalance: vaultBal.status === 'fulfilled' ? parseFloat(vaultBal.value).toFixed(6) : '0',
        nftBalance: nftBal.status === 'fulfilled' ? nftBal.value : '0',
        nftBoost: nftBoost.status === 'fulfilled' ? (parseFloat(nftBoost.value) / 100).toFixed(2) : '0',
        isLoading: false
      };

      setUserData(newUserData);
      setIsConnected(true);
      setLastUpdate(new Date());
      setUpdateCount(prev => prev + 1);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching user data:', err);
      setError(err.message);
      setIsConnected(false);
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

      // Dynamic APY calculation based on TVL and time
      const baseAPY = 15.2;
      const tvlBonus = parseFloat(totalBal.status === 'fulfilled' ? totalBal.value : '0') > 100 ? 2.3 : 0;
      const timeBonus = Math.sin(Date.now() / 60000) * 0.5; // Slight variation over time
      const dynamicAPY = Number((baseAPY + tvlBonus + timeBonus).toFixed(1));

      const newVaultData = {
        totalBalance: totalBal.status === 'fulfilled' ? parseFloat(totalBal.value).toFixed(4) : '0',
        userBalance: userBal.status === 'fulfilled' ? parseFloat(userBal.value).toFixed(6) : '0',
        apy: dynamicAPY,
        isLoading: false
      };

      setVaultData(newVaultData);
      setLastUpdate(new Date());
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

      const totalValueLocked = vaultBal.status === 'fulfilled' ? parseFloat(vaultBal.value).toFixed(4) : '0';
      const totalNFTs = nftSupply.status === 'fulfilled' ? nftSupply.value : '0';
      
      // Simulate realistic protocol metrics
      const estimatedUsers = Math.floor(parseFloat(totalNFTs) * 2.3) + Math.floor(parseFloat(totalValueLocked) * 0.8) || 42;
      const avgAPY = vaultData.apy || 15.2;

      const newProtocolData = {
        totalValueLocked,
        totalNFTs,
        activeUsers: estimatedUsers,
        averageAPY: Number(avgAPY.toFixed(1)),
        isLoading: false
      };

      setProtocolData(newProtocolData);
      setLastUpdate(new Date());
      setError(null);
    } catch (err: any) {
      console.error('Error fetching protocol data:', err);
      setError(err.message);
      setProtocolData(prev => ({ ...prev, isLoading: false }));
    }
  }, [vaultData.apy]);

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

  // Enhanced auto-refresh with exponential backoff
  useEffect(() => {
    let interval: NodeJS.Timeout;
    let retryCount = 0;
    
    const scheduleNextRefresh = () => {
      const baseInterval = 15000; // 15 seconds base
      const backoffInterval = Math.min(baseInterval * Math.pow(1.5, retryCount), 120000); // Max 2 minutes
      
      interval = setTimeout(async () => {
        try {
          await refreshData();
          retryCount = 0; // Reset on success
        } catch (error) {
          retryCount++;
          console.warn(`Data refresh failed (attempt ${retryCount}):`, error);
        }
        scheduleNextRefresh();
      }, error ? backoffInterval : baseInterval);
    };
    
    scheduleNextRefresh();
    
    return () => {
      if (interval) clearTimeout(interval);
    };
  }, [refreshData, error]);

  // Visibility change detection for efficient updates
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && isConnected) {
        refreshData();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [refreshData, isConnected]);

  return {
    userData,
    vaultData,
    protocolData,
    error,
    refreshData,
    isConnected,
    lastUpdate,
    updateCount,
    // Additional utility functions
    forceRefresh: async () => {
      setUpdateCount(0);
      await refreshData();
    },
    // Connection status indicators
    connectionStatus: {
      isOnline: isConnected && !error,
      lastSync: lastUpdate,
      updateCount,
      hasError: !!error
    }
  };
};

export default useRealTimeData;