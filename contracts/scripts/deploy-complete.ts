import { ethers } from "hardhat";
import * as fs from "fs";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // Deploy StableVault
  console.log("\n🔨 Deploying StableVault...");
  const StableVault = await ethers.getContractFactory("StableVault");
  const stableVault = await StableVault.deploy();
  await stableVault.waitForDeployment();
  const stableVaultAddress = await stableVault.getAddress();
  console.log("✅ StableVault deployed to:", stableVaultAddress);

  // Deploy VaultManager
  console.log("\n🔨 Deploying VaultManager...");
  const VaultManager = await ethers.getContractFactory("VaultManager");
  const vaultManager = await VaultManager.deploy(stableVaultAddress);
  await vaultManager.waitForDeployment();
  const vaultManagerAddress = await vaultManager.getAddress();
  console.log("✅ VaultManager deployed to:", vaultManagerAddress);

  // Deploy RewardNFT
  console.log("\n🔨 Deploying RewardNFT...");
  const RewardNFT = await ethers.getContractFactory("RewardNFT");
  const rewardNFT = await RewardNFT.deploy();
  await rewardNFT.waitForDeployment();
  const rewardNFTAddress = await rewardNFT.getAddress();
  console.log("✅ RewardNFT deployed to:", rewardNFTAddress);

  // Deploy Stablecoin (if needed)
  console.log("\n🔨 Deploying Stablecoin...");
  const Stablecoin = await ethers.getContractFactory("Stablecoin");
  const stablecoin = await Stablecoin.deploy(ethers.parseEther("1000000")); // 1M initial supply
  await stablecoin.waitForDeployment();
  const stablecoinAddress = await stablecoin.getAddress();
  console.log("✅ Stablecoin deployed to:", stablecoinAddress);

  // Save deployment addresses
  const addresses = {
    StableVault: stableVaultAddress,
    VaultManager: vaultManagerAddress,
    RewardNFT: rewardNFTAddress,
    Stablecoin: stablecoinAddress,
    network: "localhost",
    deployer: deployer.address
  };

  fs.writeFileSync(
    "deployment-addresses.json",
    JSON.stringify(addresses, null, 2)
  );

  console.log("\n📝 Deployment addresses saved to deployment-addresses.json");
  console.log("\n🎉 All contracts deployed successfully!");
  console.log("\nContract Addresses:");
  console.log("==================");
  console.log(`StableVault: ${stableVaultAddress}`);
  console.log(`VaultManager: ${vaultManagerAddress}`);
  console.log(`RewardNFT: ${rewardNFTAddress}`);
  console.log(`Stablecoin: ${stablecoinAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });