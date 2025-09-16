import { ethers } from 'ethers';
import StablecoinArtifact from '../contracts/Stablecoin.json';
import RewardNFTArtifact from '../contracts/RewardNFT.json';

declare global {
  interface Window {
    ethereum?: unknown;
  }
}

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

export const getStablecoinContract = async (stablecoinAddress: string) => {
  return getContract(stablecoinAddress, StablecoinArtifact.abi);
};

export const getRewardNFTContract = async (rewardNFTAddress: string) => {
  return getContract(rewardNFTAddress, RewardNFTArtifact.abi);
};