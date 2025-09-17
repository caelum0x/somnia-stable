import { ethers } from "hardhat";
import * as fs from "fs";

async function main() {
  console.log("🚀 DEPLOYING TO SOMNIA TESTNET");
  console.log("=" * 50);
  
  const signers = await ethers.getSigners();
  if (signers.length === 0) {
    throw new Error("No signers available. Please check your PRIVATE_KEY in .env file");
  }
  
  const deployer = signers[0];
  const network = await ethers.provider.getNetwork();

  console.log("\n📋 Deployment Information:");
  console.log(`Network: ${network.name} (Chain ID: ${network.chainId})`);
  console.log(`Deployer: ${deployer.address}`);
  
  // Check balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`Balance: ${ethers.formatEther(balance)} STT`);
  
  if (balance < ethers.parseEther("0.1")) {
    console.log("⚠️  Warning: Low balance! Get more STT from https://testnet.somnia.network/");
  }

  // Get gas price
  const feeData = await ethers.provider.getFeeData();
  console.log(`Gas Price: ${ethers.formatUnits(feeData.gasPrice || 0, "gwei")} gwei`);

  console.log("\n🔨 Starting Contract Deployment...");

  // Deploy StableVault
  console.log("\n1️⃣ Deploying StableVault...");
  const StableVault = await ethers.getContractFactory("StableVault");
  const stableVault = await StableVault.deploy({
    gasPrice: feeData.gasPrice,
  });
  await stableVault.waitForDeployment();
  const stableVaultAddress = await stableVault.getAddress();
  console.log(`✅ StableVault deployed to: ${stableVaultAddress}`);

  // Deploy VaultManager
  console.log("\n2️⃣ Deploying VaultManager...");
  const VaultManager = await ethers.getContractFactory("VaultManager");
  const vaultManager = await VaultManager.deploy(stableVaultAddress, {
    gasPrice: feeData.gasPrice,
  });
  await vaultManager.waitForDeployment();
  const vaultManagerAddress = await vaultManager.getAddress();
  console.log(`✅ VaultManager deployed to: ${vaultManagerAddress}`);

  // Deploy RewardNFT
  console.log("\n3️⃣ Deploying RewardNFT...");
  const RewardNFT = await ethers.getContractFactory("RewardNFT");
  const rewardNFT = await RewardNFT.deploy({
    gasPrice: feeData.gasPrice,
  });
  await rewardNFT.waitForDeployment();
  const rewardNFTAddress = await rewardNFT.getAddress();
  console.log(`✅ RewardNFT deployed to: ${rewardNFTAddress}`);

  // Deploy Stablecoin
  console.log("\n4️⃣ Deploying Stablecoin...");
  const Stablecoin = await ethers.getContractFactory("Stablecoin");
  const stablecoin = await Stablecoin.deploy(ethers.parseEther("1000000"), {
    gasPrice: feeData.gasPrice,
  });
  await stablecoin.waitForDeployment();
  const stablecoinAddress = await stablecoin.getAddress();
  console.log(`✅ Stablecoin deployed to: ${stablecoinAddress}`);

  // Test contract interactions
  console.log("\n🧪 Testing Contract Interactions...");
  
  try {
    // Test VaultManager
    const totalBalance = await vaultManager.getTotalBalance();
    console.log(`✅ VaultManager.getTotalBalance(): ${ethers.formatEther(totalBalance)} ETH`);
    
    // Test RewardNFT
    const nftTotalSupply = await rewardNFT.totalSupply();
    console.log(`✅ RewardNFT.totalSupply(): ${nftTotalSupply.toString()}`);
    
    // Test Stablecoin
    const coinTotalSupply = await stablecoin.totalSupply();
    console.log(`✅ Stablecoin.totalSupply(): ${ethers.formatEther(coinTotalSupply)} tokens`);
    
  } catch (error: any) {
    console.log(`⚠️  Contract interaction test failed: ${error.message}`);
  }

  // Save deployment addresses
  const addresses = {
    StableVault: stableVaultAddress,
    VaultManager: vaultManagerAddress,
    RewardNFT: rewardNFTAddress,
    Stablecoin: stablecoinAddress,
    network: "somniaTestnet",
    chainId: Number(network.chainId),
    deployer: deployer.address,
    blockExplorer: "https://shannon-explorer.somnia.network/",
    deployedAt: new Date().toISOString()
  };

  // Save to both locations
  fs.writeFileSync(
    "deployment-addresses.json",
    JSON.stringify(addresses, null, 2)
  );
  
  fs.writeFileSync(
    "frontend/app/services/deployed-contracts.json",
    JSON.stringify(addresses, null, 2)
  );

  console.log("\n📝 Deployment addresses saved to:");
  console.log("- deployment-addresses.json");
  console.log("- frontend/app/services/deployed-contracts.json");

  console.log("\n🎉 DEPLOYMENT SUCCESSFUL!");
  console.log("=" * 50);
  console.log("\n📋 Contract Addresses (Somnia Testnet):");
  console.log(`StableVault:  ${stableVaultAddress}`);
  console.log(`VaultManager: ${vaultManagerAddress}`);
  console.log(`RewardNFT:    ${rewardNFTAddress}`);
  console.log(`Stablecoin:   ${stablecoinAddress}`);
  
  console.log("\n🔗 Verify contracts at:");
  console.log(`https://shannon-explorer.somnia.network/address/${stableVaultAddress}`);
  console.log(`https://shannon-explorer.somnia.network/address/${vaultManagerAddress}`);
  console.log(`https://shannon-explorer.somnia.network/address/${rewardNFTAddress}`);
  console.log(`https://shannon-explorer.somnia.network/address/${stablecoinAddress}`);
  
  console.log("\n🚀 Next Steps:");
  console.log("1. Update frontend contract addresses");
  console.log("2. Test deposit/withdraw functionality");
  console.log("3. Test NFT minting");
  console.log("4. Run end-to-end tests");
  
  console.log("\n✅ Ready for production testing!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });