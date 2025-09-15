import { ethers } from 'ethers';
import { Web3Provider } from '@ethersproject/providers';
import StablecoinArtifact from '../contracts/Stablecoin.json';
import RewardNFTArtifact from '../contracts/RewardNFT.json';

declare global {
  interface Window {
    ethereum?: any;
  }
}

const getContract = async (contractAddress: string, artifact: any) => {
  if (!window.ethereum) {
    throw new Error('Ethereum provider not found');
  }
  const provider = new Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, artifact.abi, signer);
  return contract;
};

export const getStablecoinContract = async (stablecoinAddress: string) => {
  return getContract(stablecoinAddress, StablecoinArtifact);
};

export const getRewardNFTContract = async (rewardNFTAddress: string) => {
  return getContract(rewardNFTAddress, RewardNFTArtifact);
};