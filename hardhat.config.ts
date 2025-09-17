import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';

const config: HardhatUserConfig = {
  solidity: '0.8.20',
  networks: {
    localhost: {
      url: 'http://127.0.0.1:8545',
    },
    somnia: {
      url: 'https://dream-rpc.somnia.network/',
      chainId: 50312,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 6000000000, // 6 gwei
    },
    somniaMainnet: {
      url: 'https://api.infra.mainnet.somnia.network/',
      chainId: 5031,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 6000000000, // 6 gwei
    },
  },
  paths: {
    sources: './contracts/contracts',
    tests: './contracts/test',
    cache: './contracts/cache',
    artifacts: './contracts/artifacts',
  },
};

export default config;