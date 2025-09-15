const { expect } = require("chai");

describe("StableVault", function () {
  let StableVault;
  let stableVault;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    StableVault = await ethers.getContractFactory("StableVault");
    [owner, addr1, addr2] = await ethers.getSigners();
    stableVault = await StableVault.deploy();
  });

  it("Should set the right owner", async function () {
    expect(await stableVault.owner()).to.equal(owner.address);
  });

  it("Should allow the owner to deposit funds", async function () {
    const depositAmount = ethers.utils.parseEther("1");
    await stableVault.deposit({ value: depositAmount });
    expect(await ethers.provider.getBalance(stableVault.address)).to.equal(depositAmount);
  });

  it("Should not allow non-owner to withdraw funds", async function () {
    const depositAmount = ethers.utils.parseEther("1");
    await stableVault.deposit({ value: depositAmount });
    await expect(stableVault.connect(addr1).withdraw(depositAmount)).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Should allow the owner to withdraw funds", async function () {
    const depositAmount = ethers.utils.parseEther("1");
    await stableVault.deposit({ value: depositAmount });
    const initialOwnerBalance = await ethers.provider.getBalance(owner.address);
    await stableVault.withdraw(depositAmount);
    const finalOwnerBalance = await ethers.provider.getBalance(owner.address);
    expect(finalOwnerBalance.sub(initialOwnerBalance)).to.be.closeTo(depositAmount, ethers.utils.parseEther("0.01"));
  });
});