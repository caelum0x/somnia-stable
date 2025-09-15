
import { expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Stablecoin } from "../typechain-types/Stablecoin";
import { ethers } from "ethers";

describe("Stablecoin", function () {
  let Stablecoin: ethers.ContractFactory;
  let stablecoin: Stablecoin;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;

  beforeEach(async function () {
    Stablecoin = await ethers.getContractFactory("Stablecoin");
    [owner, addr1, addr2] = await ethers.getSigners();
    stablecoin = (await Stablecoin.deploy(ethers.parseEther("1000000"))) as Stablecoin; // Initial supply of 1,000,000 tokens
    await stablecoin.waitForDeployment();
  });

  it("Should assign the total supply of tokens to the owner", async function () {
    const ownerBalance = await stablecoin.balanceOf(owner.address);
    expect(await stablecoin.totalSupply()).to.equal(ownerBalance);
  });

  it("Should transfer tokens between accounts", async function () {
    // Transfer 50 tokens from owner to addr1
    await stablecoin.transfer(addr1.address, ethers.parseEther("50"));
    const addr1Balance = await stablecoin.balanceOf(addr1.address);
    expect(addr1Balance).to.equal(ethers.parseEther("50"));

    // Transfer 50 tokens from addr1 to addr2
    await stablecoin.connect(addr1).transfer(addr2.address, ethers.parseEther("50"));
    const addr2Balance = await stablecoin.balanceOf(addr2.address);
    expect(addr2Balance).to.equal(ethers.parseEther("50"));
  });

  it("Should fail if sender doesn't have enough tokens", async function () {
    const initialOwnerBalance = await stablecoin.balanceOf(owner.address);

    // Try to send 1 token from addr1 (0 tokens) to owner (1000000 tokens)
    await expect(
      stablecoin.connect(addr1).transfer(owner.address, ethers.parseEther("1"))
    ).to.be.revertedWith("ERC20: transfer amount exceeds balance");

    // Owner balance shouldn't have changed
    expect(await stablecoin.balanceOf(owner.address)).to.equal(initialOwnerBalance);
  });

  it("Should update balances after transfers", async function () {
    const initialOwnerBalance = await stablecoin.balanceOf(owner.address);

    // Transfer 100 tokens from owner to addr1
    await stablecoin.transfer(addr1.address, ethers.parseEther("100"));

    // Transfer another 50 tokens from owner to addr2
    await stablecoin.transfer(addr2.address, ethers.parseEther("50"));

    // Check balances
    const finalOwnerBalance = await stablecoin.balanceOf(owner.address);
    expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(ethers.parseEther("150")));

    const addr1Balance = await stablecoin.balanceOf(addr1.address);
    expect(addr1Balance).to.equal(ethers.parseEther("100"));

    const addr2Balance = await stablecoin.balanceOf(addr2.address);
    expect(addr2Balance).to.equal(ethers.parseEther("50"));
  });
});