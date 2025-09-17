# Somnia Testnet Deployment Guide

## Prerequisites ✅

1. **Network Configuration**: Updated hardhat.config.ts with Somnia testnet settings
2. **Contracts**: All contracts are ready and compiled
3. **Deployment Script**: Available at `contracts/scripts/deploy-complete.ts`

## Somnia Testnet Details

- **Network Name**: Somnia Testnet
- **Chain ID**: 50312  
- **RPC URL**: https://dream-rpc.somnia.network/
- **Block Explorer**: https://shannon-explorer.somnia.network/
- **Symbol**: STT (Somnia Test Tokens)
- **Faucet**: https://testnet.somnia.network/

## Deployment Steps

### 1. Get Test Tokens
1. Visit https://testnet.somnia.network/
2. Connect your MetaMask wallet
3. Click "Request Tokens" in the "Get STT" section
4. Wait for tokens to arrive in your wallet

### 2. Set Up Environment Variables
Create a `.env` file in the project root:
```bash
PRIVATE_KEY=your_wallet_private_key_here
```

### 3. Add Somnia Testnet to MetaMask
- Network Name: Somnia Testnet
- RPC URL: https://dream-rpc.somnia.network/
- Chain ID: 50312
- Currency Symbol: STT
- Block Explorer URL: https://shannon-explorer.somnia.network/

### 4. Deploy Contracts
Run the deployment command:
```bash
npx hardhat run contracts/scripts/deploy-complete.ts --network somnia
```

### 5. Update Frontend Configuration
After deployment, update the contract addresses in:
- `frontend/app/services/contractService.ts`
- `deployment-addresses.json`

## Expected Results

The deployment will create:
- ✅ StableVault Contract
- ✅ VaultManager Contract  
- ✅ RewardNFT Contract
- ✅ Stablecoin Contract

All addresses will be saved to `deployment-addresses.json`

## Verification

After deployment, verify contracts on the Somnia block explorer:
https://shannon-explorer.somnia.network/

## Next Steps

1. Test deposit/withdraw functionality
2. Test NFT minting
3. Verify all frontend integrations work with deployed contracts
4. Run comprehensive end-to-end tests