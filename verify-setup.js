const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 Verifying StableVault Setup...\n");

  // Check contract addresses
  const addresses = require('./deployment-addresses.json');
  console.log("📋 Contract Addresses:");
  console.log(`   StableVault: ${addresses.StableVault}`);
  console.log(`   VaultManager: ${addresses.VaultManager}`);
  console.log(`   RewardNFT: ${addresses.RewardNFT}`);
  console.log(`   Deployer: ${addresses.deployer}\n`);

  try {
    // Connect to contracts
    const vaultManager = await ethers.getContractAt("VaultManager", addresses.VaultManager);
    const stableVault = await ethers.getContractAt("StableVault", addresses.StableVault);
    const rewardNFT = await ethers.getContractAt("RewardNFT", addresses.RewardNFT);

    // Check vault manager
    const vaults = await vaultManager.getVaults();
    console.log("🏦 VaultManager Status:");
    console.log(`   Managed Vaults: ${vaults.length}`);
    console.log(`   Vaults: ${vaults}`);

    // Check stable vault
    const totalBalance = await stableVault.getTotalBalance();
    const owner = await stableVault.owner();
    console.log("\n💰 StableVault Status:");
    console.log(`   Total Balance: ${ethers.formatEther(totalBalance)} ETH`);
    console.log(`   Owner: ${owner}`);

    // Check NFT contract
    const nftName = await rewardNFT.name();
    const nftSymbol = await rewardNFT.symbol();
    console.log("\n🎁 RewardNFT Status:");
    console.log(`   Name: ${nftName}`);
    console.log(`   Symbol: ${nftSymbol}`);

    console.log("\n✅ All contracts are deployed and functional!");
    console.log("\n🚀 Ready to demo:");
    console.log("   1. Frontend running on: http://localhost:3000");
    console.log("   2. Local blockchain running on: http://127.0.0.1:8545");
    console.log("   3. Connect MetaMask to local network");
    console.log("   4. Import test account with private key from README");
    console.log("   5. Start earning yield and collecting NFTs!");

  } catch (error) {
    console.error("❌ Error verifying setup:", error.message);
    console.log("\n🔧 Make sure:");
    console.log("   1. Hardhat node is running: npx hardhat node");
    console.log("   2. Contracts are deployed: npx hardhat run contracts/scripts/deploy-complete.ts --network localhost");
    console.log("   3. Vaults are setup: npx hardhat run setup-vaults.js --network localhost");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });