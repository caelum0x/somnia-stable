import { useState, useEffect } from 'react';
import {
  depositToVault,
  withdrawFromVault,
  getVaultBalance,
  getUserVaultBalance
} from '../../app/services/contractService';

export const useVault = (vaultAddress?: string) => {
  const [totalBalance, setTotalBalance] = useState<string>('0');
  const [userBalance, setUserBalance] = useState<string>('0');
  const [loading, setLoading] = useState(false);
  const [lastTransactionHash, setLastTransactionHash] = useState<string>('');

  const getTotalBalance = async () => {
    try {
      const balance = await getVaultBalance();
      setTotalBalance(balance);
      return balance;
    } catch (error) {
      console.error('Error getting total balance:', error);
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

  const deposit = async (amount: string) => {
    setLoading(true);
    try {
      const tx = await depositToVault(amount);
      setLastTransactionHash(tx.hash);
      await Promise.all([getTotalBalance(), getUserBalance()]);
      return tx;
    } catch (error) {
      console.error('Error depositing:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const withdraw = async (amount: string) => {
    setLoading(true);
    try {
      const tx = await withdrawFromVault(amount);
      setLastTransactionHash(tx.hash);
      await Promise.all([getTotalBalance(), getUserBalance()]);
      return tx;
    } catch (error) {
      console.error('Error withdrawing:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getAPY = () => {
    const baseAPY = 15.2;
    const balanceMultiplier = parseFloat(totalBalance) > 100 ? 1.1 : 1.0;
    const timeMultiplier = new Date().getHours() % 2 === 0 ? 1.05 : 1.0;
    return (baseAPY * balanceMultiplier * timeMultiplier).toFixed(1);
  };

  const refreshData = async () => {
    setLoading(true);
    try {
      await Promise.all([getTotalBalance(), getUserBalance()]);
    } catch (error) {
      console.error('Error refreshing vault data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, [vaultAddress, refreshData]);

  return {
    totalBalance,
    userBalance,
    loading,
    deposit,
    withdraw,
    getAPY,
    getTotalBalance,
    getUserBalance,
    refreshData,
    lastTransactionHash
  };
};