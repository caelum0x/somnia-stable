const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  
  // Contract addresses from deployment
  const VAULT_MANAGER_ADDRESS = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";
  const STABLE_VAULT_ADDRESS = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
  
  console.log("Setting up vaults with account:", deployer.address);
  
  // Connect to VaultManager
  const vaultManager = await ethers.getContractAt("VaultManager", VAULT_MANAGER_ADDRESS);
  
  // Add the StableVault to the manager
  console.log("Adding StableVault to VaultManager...");
  const tx = await vaultManager.addVault(STABLE_VAULT_ADDRESS);
  await tx.wait();
  
  console.log("✅ StableVault added to VaultManager successfully!");
  
  // Verify it was added
  const vaults = await vaultManager.getVaults();
  console.log("Current vaults in manager:", vaults);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });