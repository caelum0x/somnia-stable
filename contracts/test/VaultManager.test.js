const { expect } = require("chai");

describe("VaultManager", function () {
  let VaultManager;
  let vaultManager;
  let StableVault;
  let stableVault;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    StableVault = await ethers.getContractFactory("StableVault");
    stableVault = await StableVault.deploy();

    VaultManager = await ethers.getContractFactory("VaultManager");
    vaultManager = await VaultManager.deploy(stableVault.address);
  });

  it("Should set the right owner", async function () {
    expect(await vaultManager.owner()).to.equal(owner.address);
  });

  it("Should allow the owner to add a vault", async function () {
    await vaultManager.addVault(stableVault.address);
    expect(await vaultManager.isVault(stableVault.address)).to.be.true;
  });

  it("Should not allow non-owner to add a vault", async function () {
    await expect(vaultManager.connect(addr1).addVault(stableVault.address)).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Should allow the owner to remove a vault", async function () {
    await vaultManager.addVault(stableVault.address);
    await vaultManager.removeVault(stableVault.address);
    expect(await vaultManager.isVault(stableVault.address)).to.be.false;
  });

  it("Should not allow non-owner to remove a vault", async function () {
    await vaultManager.addVault(stableVault.address);
    await expect(vaultManager.connect(addr1).removeVault(stableVault.address)).to.be.revertedWith("Ownable: caller is not the owner");
  });
});