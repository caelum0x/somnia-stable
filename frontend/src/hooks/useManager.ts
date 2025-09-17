import { useState, useEffect } from 'react';
import { 
  getVaultManagerContract,
  getVaultBalance,
  getUserVaultBalance
} from '../../app/services/contractService';

export const useManager = (managerAddress?: string) => {
  const [vaults, setVaults] = useState<string[]>(['0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9']);
  const [totalTVL, setTotalTVL] = useState<string>('0');
  const [userBalance, setUserBalance] = useState<string>('0');
  const [loading, setLoading] = useState(false);

  const getVaults = async () => {
    try {
      const contract = await getVaultManagerContract();
      const vaultAddresses = await contract.getVaults();
      setVaults(vaultAddresses);
      return vaultAddresses;
    } catch (error) {
      console.error('Error getting vaults:', error);
      return vaults;
    }
  };

  const getTotalTVL = async () => {
    try {
      const balance = await getVaultBalance();
      setTotalTVL(balance);
      return balance;
    } catch (error) {
      console.error('Error getting total TVL:', error);
      return '0';
    }
  };

  const getUserBalance = async () => {
    try {
      const balance = await getUserVaultBalance();
      setUserBalance(balance);
      return balance;
    } catch (error) {
      console.error('Error getting user balance:', error);
      return '0';
    }
  };

  const getGlobalAPY = () => {
    const baseAPY = 12.5;
    const tvlMultiplier = parseFloat(totalTVL) > 1000 ? 1.2 : 1.0;
    return (baseAPY * tvlMultiplier).toFixed(1);
  };

  const refreshData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        getVaults(),
        getTotalTVL(),
        getUserBalance()
      ]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  return {
    vaults,
    totalTVL,
    userBalance,
    loading,
    getVaults,
    getTotalTVL,
    getUserBalance,
    getGlobalAPY,
    refreshData
  };
};