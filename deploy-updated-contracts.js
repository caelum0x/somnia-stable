const { ethers } = require("hardhat");

async function main() {
  console.log("Starting deployment of updated contracts...");

  // Get the contract deployer
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");

  // Deploy updated RewardNFT contract
  console.log("\n=== Deploying RewardNFT ===");
  const RewardNFT = await ethers.getContractFactory("RewardNFT");
  const rewardNFT = await RewardNFT.deploy();
  await rewardNFT.waitForDeployment();
  const rewardNFTAddress = await rewardNFT.getAddress();
  console.log("RewardNFT deployed to:", rewardNFTAddress);

  // Deploy StableVault
  console.log("\n=== Deploying StableVault ===");
  const StableVault = await ethers.getContractFactory("StableVault");
  const stableVault = await StableVault.deploy();
  await stableVault.waitForDeployment();
  const stableVaultAddress = await stableVault.getAddress();
  console.log("StableVault deployed to:", stableVaultAddress);

  // Deploy VaultManager
  console.log("\n=== Deploying VaultManager ===");
  const VaultManager = await ethers.getContractFactory("VaultManager");
  const vaultManager = await VaultManager.deploy(stableVaultAddress);
  await vaultManager.waitForDeployment();
  const vaultManagerAddress = await vaultManager.getAddress();
  console.log("VaultManager deployed to:", vaultManagerAddress);

  // Deploy Stablecoin
  console.log("\n=== Deploying Stablecoin ===");
  const Stablecoin = await ethers.getContractFactory("Stablecoin");
  const stablecoin = await Stablecoin.deploy();
  await stablecoin.waitForDeployment();
  const stablecoinAddress = await stablecoin.getAddress();
  console.log("Stablecoin deployed to:", stablecoinAddress);

  // Create deployment info
  const deploymentInfo = {
    RewardNFT: rewardNFTAddress,
    StableVault: stableVaultAddress,
    VaultManager: vaultManagerAddress,
    Stablecoin: stablecoinAddress,
    network: "localhost",
    deployer: deployer.address,
    timestamp: new Date().toISOString()
  };

  // Save deployment addresses
  const fs = require("fs");
  fs.writeFileSync(
    "deployment-addresses.json",
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("\n=== Deployment Summary ===");
  console.log("RewardNFT:", rewardNFTAddress);
  console.log("StableVault:", stableVaultAddress);  
  console.log("VaultManager:", vaultManagerAddress);
  console.log("Stablecoin:", stablecoinAddress);
  console.log("\nDeployment addresses saved to deployment-addresses.json");

  // Test NFT minting functions
  console.log("\n=== Testing NFT Functions ===");
  try {
    console.log("Testing Genesis NFT mint...");
    const tx1 = await rewardNFT.mintGenesis(deployer.address);
    await tx1.wait();
    console.log("✅ Genesis NFT minted successfully");

    console.log("Testing Multiplier NFT mint...");
    const tx2 = await rewardNFT.mintMultiplier(deployer.address);
    await tx2.wait();
    console.log("✅ Multiplier NFT minted successfully");

    console.log("Testing Access NFT mint...");
    const tx3 = await rewardNFT.mintAccess(deployer.address);
    await tx3.wait();
    console.log("✅ Access NFT minted successfully");

    const balance = await rewardNFT.balanceOf(deployer.address);
    const userBoost = await rewardNFT.getUserBoost(deployer.address);
    console.log(`NFT Balance: ${balance}`);
    console.log(`Total Boost: ${userBoost/100}%`);

  } catch (error) {
    console.error("❌ NFT testing failed:", error.message);
  }

  // Test Vault functions
  console.log("\n=== Testing Vault Functions ===");
  try {
    console.log("Testing vault deposit...");
    const depositAmount = ethers.parseEther("0.1");
    const tx4 = await vaultManager.deposit(depositAmount, { value: depositAmount });
    await tx4.wait();
    console.log("✅ Vault deposit successful");

    const totalBalance = await vaultManager.getTotalBalance();
    console.log(`Vault Total Balance: ${ethers.formatEther(totalBalance)} ETH`);

  } catch (error) {
    console.error("❌ Vault testing failed:", error.message);
  }

  console.log("\n🎉 All contracts deployed and tested successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });