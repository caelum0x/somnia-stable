import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const VAULT_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "deposit",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTotalBalance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export const useVault = (vaultAddress: string) => {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [totalBalance, setTotalBalance] = useState<string>('0');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initContract = async () => {
      if (window.ethereum && vaultAddress) {
        const browserProvider = new ethers.BrowserProvider(window.ethereum as any);
        const userSigner = await browserProvider.getSigner();
        const vaultContract = new ethers.Contract(vaultAddress, VAULT_ABI, userSigner);
        
        setProvider(browserProvider);
        setSigner(userSigner);
        setContract(vaultContract);
      }
    };

    initContract();
  }, [vaultAddress]);

  const getTotalBalance = async () => {
    if (!contract) return;
    try {
      const balance = await contract.getTotalBalance();
      setTotalBalance(ethers.formatEther(balance));
    } catch (error) {
      console.error('Error getting total balance:', error);
    }
  };

  const deposit = async (amount: string) => {
    if (!contract) return;
    setLoading(true);
    try {
      const amountWei = ethers.parseEther(amount);
      const tx = await contract.deposit(amountWei, { value: amountWei });
      await tx.wait();
      await getTotalBalance();
      return tx;
    } catch (error) {
      console.error('Error depositing:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const withdraw = async (amount: string) => {
    if (!contract) return;
    setLoading(true);
    try {
      const amountWei = ethers.parseEther(amount);
      const tx = await contract.withdraw(amountWei);
      await tx.wait();
      await getTotalBalance();
      return tx;
    } catch (error) {
      console.error('Error withdrawing:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getAPY = () => {
    // Placeholder logic - return static 5% APY
    return '5.0';
  };

  useEffect(() => {
    if (contract) {
      getTotalBalance();
    }
  }, [contract]);

  return {
    contract,
    provider,
    signer,
    totalBalance,
    loading,
    deposit,
    withdraw,
    getAPY,
    getTotalBalance
  };
};