import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy Stablecoin
  const Stablecoin = await ethers.getContractFactory("Stablecoin");
  const stablecoin = await Stablecoin.deploy(ethers.parseEther("1000000")); // Initial supply of 1,000,000 tokens
  await stablecoin.waitForDeployment();
  console.log("Stablecoin deployed to:", await stablecoin.getAddress());

  // Deploy RewardNFT
  const RewardNFT = await ethers.getContractFactory("RewardNFT");
  const rewardNFT = await RewardNFT.deploy();
  await rewardNFT.waitForDeployment();
  console.log("RewardNFT deployed to:", await rewardNFT.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });