import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';

const config: HardhatUserConfig = {
  solidity: '0.8.20',
  networks: {
    localhost: {
      url: 'http://127.0.00.1:8545',
    },
    // Add other networks as needed
  },
  paths: {
    sources: './contracts/contracts',
    tests: './contracts/test',
    cache: './contracts/cache',
    artifacts: './contracts/artifacts',
  },
};

export default config;