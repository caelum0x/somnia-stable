import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const NFT_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
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
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "ownerOf",
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
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

export const useNFT = (nftAddress: string) => {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [userAddress, setUserAddress] = useState<string>('');
  const [nftBalance, setNftBalance] = useState<number>(0);
  const [hasNFT, setHasNFT] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initContract = async () => {
      if (window.ethereum && nftAddress) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const nftContract = new ethers.Contract(nftAddress, NFT_ABI, signer);
        const address = await signer.getAddress();
        
        setContract(nftContract);
        setUserAddress(address);
      }
    };

    initContract();
  }, [nftAddress]);

  const checkUserNFTs = async () => {
    if (!contract || !userAddress) return;
    try {
      const balance = await contract.balanceOf(userAddress);
      const balanceNumber = Number(balance);
      setNftBalance(balanceNumber);
      setHasNFT(balanceNumber > 0);
      return balanceNumber;
    } catch (error) {
      console.error('Error checking NFT balance:', error);
      return 0;
    }
  };

  const getAPYBoost = () => {
    // Placeholder logic - return boost percentage based on NFT ownership
    if (hasNFT) {
      return '1.5'; // 1.5% boost for NFT holders
    }
    return '0';
  };

  const getNFTMetadata = (tokenId: number) => {
    // Placeholder metadata
    return {
      tokenId,
      name: `Reward NFT #${tokenId}`,
      description: 'Special NFT that provides APY boost',
      apyBoost: '1.5%',
      image: `/nft/${tokenId}.png` // placeholder image path
    };
  };

  const mintEligibility = (depositAmount: number) => {
    // Check if user is eligible to mint NFT (deposit > $100 equivalent)
    return depositAmount > 100;
  };

  useEffect(() => {
    if (contract && userAddress) {
      checkUserNFTs();
    }
  }, [contract, userAddress]);

  return {
    contract,
    userAddress,
    nftBalance,
    hasNFT,
    loading,
    checkUserNFTs,
    getAPYBoost,
    getNFTMetadata,
    mintEligibility
  };
};