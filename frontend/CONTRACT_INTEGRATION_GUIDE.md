# Contract Integration Guide

## Overview
This guide explains how the smart contracts are integrated with the frontend application.

## Smart Contracts

### 1. VaultManager Contract
- **Address**: `0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9`
- **Functions**:
  - `deposit(amount)` - Deposit ETH into vault
  - `withdraw(amount)` - Withdraw ETH from vault
  - `getTotalBalance()` - Get total vault balance
  - `getUserBalance()` - Get user's vault balance

### 2. StableVault Contract  
- **Address**: `0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9`
- **Functions**:
  - `deposit(amount)` - Internal deposit function
  - `withdraw(amount)` - Internal withdraw function
  - `getTotalBalance()` - Get total balance

### 3. RewardNFT Contract
- **Address**: `0x5FC8d32690cc91D4c39d9d3abcBD16989F875707`
- **Functions**:
  - `mintGenesis(to)` - Mint Genesis NFT (+2.5% APY boost)
  - `mintMultiplier(to)` - Mint Multiplier NFT (+1.2% APY boost)
  - `mintAccess(to)` - Mint Access NFT (VIP access)
  - `balanceOf(user)` - Get user's NFT count
  - `getUserBoost(user)` - Get user's total boost percentage

### 4. Stablecoin Contract
- **Address**: `0x0165878A594ca255338adfa4d48449f69242Eb8F`
- **Functions**: Standard ERC20 functions

## Frontend Integration

### Contract Service (`app/services/contractService.ts`)
Central service that handles all contract interactions:

```typescript
// Vault Operations
depositToVault(amount: string)
withdrawFromVault(amount: string)
getVaultBalance()
getUserVaultBalance()

// NFT Operations  
mintGenesisNFT(to: string)
mintMultiplierNFT(to: string)
mintAccessNFT(to: string)
getUserNFTBalance(userAddress: string)
getUserNFTBoost(userAddress: string)

// Utility Functions
connectWallet()
checkWalletConnection()
getWalletBalance(address: string)
```

### UI Components

#### 1. Deposit Modal (`src/components/DepositModal.tsx`)
- Allows users to deposit ETH into vaults
- Shows transaction status and confirmation
- Calculates estimated yields

#### 2. Withdraw Modal (`src/components/WithdrawModal.tsx`)
- Allows users to withdraw from vaults
- Shows available balance
- Includes warning messages

#### 3. Vault Cards (`app/vaults/page.tsx`)
- Display vault information (APY, TVL, Risk)
- Connect to deposit/withdraw modals
- Show real-time data

#### 4. NFT Cards (`app/nfts/page.tsx`)
- Display NFT collections with minting functionality
- Show boost percentages and rarity
- Handle minting transactions

## How It Works

### 1. Wallet Connection
```typescript
// User connects wallet
const address = await connectWallet();

// Check connection status
const isConnected = await checkWalletConnection();
```

### 2. Vault Interactions
```typescript
// Deposit into vault
await depositToVault("0.5"); // 0.5 ETH

// Withdraw from vault  
await withdrawFromVault("0.2"); // 0.2 ETH

// Check balances
const vaultBalance = await getVaultBalance();
const userBalance = await getUserVaultBalance();
```

### 3. NFT Minting
```typescript
// Mint different NFT types
await mintGenesisNFT(userAddress);      // +2.5% boost
await mintMultiplierNFT(userAddress);   // +1.2% boost  
await mintAccessNFT(userAddress);       // VIP access

// Check user's NFT status
const nftCount = await getUserNFTBalance(userAddress);
const totalBoost = await getUserNFTBoost(userAddress);
```

## Transaction Flow

### Deposit Process
1. User enters amount in DepositModal
2. Frontend calls `depositToVault(amount)`
3. Contract receives ETH and updates balance
4. Transaction hash returned to UI
5. Success message shown to user

### NFT Minting Process
1. User clicks "Mint NFT" button
2. Frontend calls appropriate mint function
3. Contract mints NFT and sets boost
4. Transaction confirmed
5. User receives NFT with permanent benefits

## Error Handling

All contract functions include comprehensive error handling:

```typescript
try {
  const tx = await depositToVault(amount);
  // Show success message
} catch (error) {
  // Show error message to user
  console.error('Transaction failed:', error.message);
}
```

## Network Configuration

- **Network**: Somnia Network (or localhost for development)
- **Chain ID**: Configure in wallet
- **Gas Settings**: Automatically estimated

## Development Setup

1. Start local blockchain:
   ```bash
   npx hardhat node
   ```

2. Deploy contracts:
   ```bash
   node deploy-updated-contracts.js
   ```

3. Update contract addresses in `contractService.ts`

4. Start frontend:
   ```bash
   npm run dev
   ```

## Testing

The application includes built-in transaction testing:
- Deposit/withdraw functionality
- NFT minting for all types
- Balance checking
- Boost calculation

## Security Features

- Input validation on all amounts
- Transaction confirmation UI
- Error handling for failed transactions
- MetaMask integration for secure signing
- Real-time balance updates

---

## Next Steps

1. Deploy updated contracts with `deploy-updated-contracts.js`
2. Update contract addresses in frontend
3. Test all functionality with MetaMask
4. Monitor transactions and user interactions