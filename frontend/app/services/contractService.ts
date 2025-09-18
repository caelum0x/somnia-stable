import { ethers } from 'ethers';
import StablecoinArtifact from '../contracts/Stablecoin.json';
import RewardNFTArtifact from '../contracts/RewardNFT.json';
import VaultManagerArtifact from '../contracts/VaultManager.json';
import StableVaultArtifact from '../contracts/StableVault.json';

declare global {
  interface Window {
    ethereum?: unknown;
  }
}

// Somnia Network Configuration
export const SOMNIA_NETWORK = {
  MAINNET: {
    chainId: 5031,
    name: 'Somnia Mainnet',
    symbol: 'SOMI',
    rpcUrl: 'https://api.infra.mainnet.somnia.network/',
    explorerUrl: 'https://explorer.somnia.network'
  },
  TESTNET: {
    chainId: 50312,
    name: 'Somnia Testnet',
    symbol: 'STT',
    rpcUrl: 'https://dream-rpc.somnia.network/',
    explorerUrl: 'https://shannon-explorer.somnia.network/',
    faucetUrl: 'https://testnet.somnia.network/'
  }
};

// Load contract addresses from deployment
let CONTRACT_ADDRESSES = {
  STABLECOIN: '0x0165878A594ca255338adfa4d48449f69242Eb8F',
  REWARD_NFT: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
  VAULT_MANAGER: '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
  STABLE_VAULT: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
};

// Try to load deployed addresses if available
try {
  const deployedContracts = await import('./deployed-contracts.json');
  if (deployedContracts.network === 'somniaTestnet') {
    CONTRACT_ADDRESSES = {
      STABLECOIN: deployedContracts.Stablecoin,
      REWARD_NFT: deployedContracts.RewardNFT,
      VAULT_MANAGER: deployedContracts.VaultManager,
      STABLE_VAULT: deployedContracts.StableVault,
    };
    console.log('✅ Using deployed contract addresses from Somnia testnet');
  }
} catch {
  console.log('📝 Using default contract addresses - deploy contracts to update');
}

export { CONTRACT_ADDRESSES };

const getContract = async (contractAddress: string, abi: any[]) => {
  if (!window.ethereum) {
    throw new Error('Ethereum provider not found');
  }
  const provider = new ethers.BrowserProvider(window.ethereum as any);
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(contractAddress, abi, signer);
  return contract;
};

const getProvider = () => {
  if (!window.ethereum) {
    throw new Error('Ethereum provider not found');
  }
  return new ethers.BrowserProvider(window.ethereum as any);
};

export const getStablecoinContract = async () => {
  return getContract(CONTRACT_ADDRESSES.STABLECOIN, StablecoinArtifact.abi);
};

export const getRewardNFTContract = async () => {
  return getContract(CONTRACT_ADDRESSES.REWARD_NFT, RewardNFTArtifact.abi);
};

export const getVaultManagerContract = async () => {
  return getContract(CONTRACT_ADDRESSES.VAULT_MANAGER, VaultManagerArtifact.abi);
};

export const getStableVaultContract = async () => {
  return getContract(CONTRACT_ADDRESSES.STABLE_VAULT, StableVaultArtifact.abi);
};

// Vault interaction functions
export const depositToVault = async (amount: string) => {
  try {
    const vaultManager = await getVaultManagerContract();
    const amountWei = ethers.parseEther(amount);
    
    const tx = await vaultManager.deposit(amountWei, {
      value: amountWei
    });
    
    return await tx.wait();
  } catch (error) {
    console.error('Error depositing to vault:', error);
    throw error;
  }
};

export const withdrawFromVault = async (amount: string) => {
  try {
    const vaultManager = await getVaultManagerContract();
    const amountWei = ethers.parseEther(amount);
    
    const tx = await vaultManager.withdraw(amountWei);
    return await tx.wait();
  } catch (error) {
    console.error('Error withdrawing from vault:', error);
    throw error;
  }
};

export const getVaultBalance = async () => {
  try {
    const vaultManager = await getVaultManagerContract();
    const balance = await vaultManager.getTotalBalance();
    return ethers.formatEther(balance);
  } catch (error) {
    console.error('Error getting vault balance:', error);
    throw error;
  }
};

export const getUserVaultBalance = async () => {
  try {
    const vaultManager = await getVaultManagerContract();
    const balance = await vaultManager.getUserBalance();
    return ethers.formatEther(balance);
  } catch (error) {
    console.error('Error getting user vault balance:', error);
    throw error;
  }
};

// NFT functions
export const mintGenesisNFT = async (to: string) => {
  try {
    const rewardNFT = await getRewardNFTContract();
    const tx = await rewardNFT.mintGenesis(to);
    return await tx.wait();
  } catch (error) {
    console.error('Error minting Genesis NFT:', error);
    throw error;
  }
};

export const mintMultiplierNFT = async (to: string) => {
  try {
    const rewardNFT = await getRewardNFTContract();
    const tx = await rewardNFT.mintMultiplier(to);
    return await tx.wait();
  } catch (error) {
    console.error('Error minting Multiplier NFT:', error);
    throw error;
  }
};

export const mintAccessNFT = async (to: string) => {
  try {
    const rewardNFT = await getRewardNFTContract();
    const tx = await rewardNFT.mintAccess(to);
    return await tx.wait();
  } catch (error) {
    console.error('Error minting Access NFT:', error);
    throw error;
  }
};

export const getUserNFTBalance = async (userAddress: string) => {
  try {
    const rewardNFT = await getRewardNFTContract();
    const balance = await rewardNFT.balanceOf(userAddress);
    return balance.toString();
  } catch (error) {
    console.error('Error getting NFT balance:', error);
    throw error;
  }
};

export const getUserNFTBoost = async (userAddress: string) => {
  try {
    const rewardNFT = await getRewardNFTContract();
    const boost = await rewardNFT.getUserBoost(userAddress);
    return boost.toString();
  } catch (error) {
    console.error('Error getting user NFT boost:', error);
    throw error;
  }
};

export const getTotalNFTSupply = async () => {
  try {
    const rewardNFT = await getRewardNFTContract();
    const supply = await rewardNFT.totalSupply();
    return supply.toString();
  } catch (error) {
    console.error('Error getting total NFT supply:', error);
    throw error;
  }
};

// Utility functions
export const getWalletBalance = async (address: string) => {
  try {
    const provider = getProvider();
    const balance = await provider.getBalance(address);
    return ethers.formatEther(balance);
  } catch (error) {
    console.error('Error getting wallet balance:', error);
    throw error;
  }
};

export const connectWallet = async () => {
  try {
    if (!window.ethereum) {
      throw new Error('MetaMask not found');
    }
    
    const provider = getProvider();
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    
    return address;
  } catch (error) {
    console.error('Error connecting wallet:', error);
    throw error;
  }
};

export const checkWalletConnection = async () => {
  try {
    if (!window.ethereum) {
      return null;
    }
    
    const provider = getProvider();
    const accounts = await provider.listAccounts();
    
    if (accounts.length > 0) {
      return accounts[0].address;
    }
    
    return null;
  } catch (error) {
    console.error('Error checking wallet connection:', error);
    return null;
  }
};