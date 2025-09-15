import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

const ConnectWallet = () => {
  const [account, setAccount] = useState<string | null>(null);

  useEffect(() => {
    const connectWallet = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
      } else {
        console.error('Ethereum provider not found');
      }
    };

    connectWallet();
  }, []);

  return (
    <div>
      {account ? (
        <p>Connected Account: {account}</p>
      ) : (
        <p>Please connect your wallet</p>
      )}
    </div>
  );
};

export default ConnectWallet;