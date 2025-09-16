import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const MANAGER_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_stableVaultAddress",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_vaultAddress",
        "type": "address"
      }
    ],
    "name": "addVault",
    "outputs": [],
    "stateMutability": "nonpayable",
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
    "name": "getUserBalance",
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
    "name": "getVaults",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
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
  }
];

export const useManager = (managerAddress: string) => {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [vaults, setVaults] = useState<string[]>([]);
  const [totalTVL, setTotalTVL] = useState<string>('0');
  const [userBalance, setUserBalance] = useState<string>('0');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initContract = async () => {
      if (window.ethereum && managerAddress) {
        const provider = new ethers.BrowserProvider(window.ethereum as any);
        const signer = await provider.getSigner();
        const managerContract = new ethers.Contract(managerAddress, MANAGER_ABI, signer);
        
        setContract(managerContract);
      }
    };

    initContract();
  }, [managerAddress]);

  const getVaults = async () => {
    if (!contract) return;
    try {
      const vaultAddresses = await contract.getVaults();
      setVaults(vaultAddresses);
      return vaultAddresses;
    } catch (error) {
      console.error('Error getting vaults:', error);
      return [];
    }
  };

  const getTotalTVL = async () => {
    if (!contract) return;
    try {
      const balance = await contract.getTotalBalance();
      setTotalTVL(ethers.formatEther(balance));
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Error getting total TVL:', error);
      return '0';
    }
  };

  const getUserBalance = async () => {
    if (!contract) return;
    try {
      const balance = await contract.getUserBalance();
      setUserBalance(ethers.formatEther(balance));
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Error getting user balance:', error);
      return '0';
    }
  };

  const addVault = async (vaultAddress: string) => {
    if (!contract) return;
    setLoading(true);
    try {
      const tx = await contract.addVault(vaultAddress);
      await tx.wait();
      await getVaults();
      return tx;
    } catch (error) {
      console.error('Error adding vault:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getGlobalAPY = () => {
    // Placeholder logic - calculate weighted average APY
    return '4.5';
  };

  useEffect(() => {
    if (contract) {
      getVaults();
      getTotalTVL();
      getUserBalance();
    }
  }, [contract]);

  return {
    contract,
    vaults,
    totalTVL,
    userBalance,
    loading,
    getVaults,
    getTotalTVL,
    getUserBalance,
    addVault,
    getGlobalAPY
  };
};