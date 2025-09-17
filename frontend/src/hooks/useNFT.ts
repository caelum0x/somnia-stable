import { useState, useEffect } from 'react';
import {
  getUserNFTBalance,
  getUserNFTBoost,
  checkWalletConnection
} from '../../app/services/contractService';

export const useNFT = (nftAddress?: string) => {
  const [userAddress, setUserAddress] = useState<string>('');
  const [nftBalance, setNftBalance] = useState<number>(0);
  const [hasNFT, setHasNFT] = useState<boolean>(false);
  const [boostPercentage, setBoostPercentage] = useState<string>('0');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initUserAddress = async () => {
      try {
        const address = await checkWalletConnection();
        if (address) {
          setUserAddress(address);
        }
      } catch (error) {
        console.error('Error getting user address:', error);
      }
    };

    initUserAddress();
  }, []);

  const checkUserNFTs = async () => {
    if (!userAddress) return 0;
    setLoading(true);
    try {
      const balance = await getUserNFTBalance(userAddress);
      const balanceNumber = parseInt(balance);
      setNftBalance(balanceNumber);
      setHasNFT(balanceNumber > 0);
      
      if (balanceNumber > 0) {
        const boost = await getUserNFTBoost(userAddress);
        setBoostPercentage((parseFloat(boost) / 100).toString());
      } else {
        setBoostPercentage('0');
      }
      
      return balanceNumber;
    } catch (error) {
      console.error('Error checking NFT balance:', error);
      return 0;
    } finally {
      setLoading(false);
    }
  };

  const getAPYBoost = () => {
    return hasNFT ? boostPercentage : '0';
  };

  const getNFTMetadata = (tokenId: number) => {
    const nftTypes = [
      { name: 'Genesis Crystal', boost: '2.5%', rarity: 'Legendary', color: '#FFD700' },
      { name: 'Quantum Multiplier', boost: '1.8%', rarity: 'Epic', color: '#9D4EDD' },
      { name: 'Access Node', boost: '1.2%', rarity: 'Rare', color: '#06FFA5' }
    ];
    
    const nftType = nftTypes[tokenId % nftTypes.length];
    
    return {
      tokenId,
      name: `${nftType.name} #${tokenId}`,
      description: `Futuristic ${nftType.rarity} NFT providing ${nftType.boost} APY boost`,
      apyBoost: nftType.boost,
      rarity: nftType.rarity,
      color: nftType.color,
      image: `/nft/${tokenId}.png`
    };
  };

  const mintEligibility = (depositAmount: number) => {
    return depositAmount >= 0.1; // 0.1 ETH minimum
  };

  const refreshData = async () => {
    if (userAddress) {
      await checkUserNFTs();
    }
  };

  useEffect(() => {
    if (userAddress) {
      checkUserNFTs();
    }
  }, [userAddress, checkUserNFTs]);

  return {
    userAddress,
    nftBalance,
    hasNFT,
    loading,
    checkUserNFTs,
    getAPYBoost,
    getNFTMetadata,
    mintEligibility,
    refreshData
  };
};