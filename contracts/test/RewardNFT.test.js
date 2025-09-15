const { expect } = require("chai");

describe("RewardNFT", function () {
  let RewardNFT;
  let rewardNFT;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    RewardNFT = await ethers.getContractFactory("RewardNFT");
    rewardNFT = await RewardNFT.deploy();
  });

  it("Should set the right owner", async function () {
    expect(await rewardNFT.owner()).to.equal(owner.address);
  });

  it("Should mint a new NFT", async function () {
    await rewardNFT.mint(addr1.address, "https://example.com/token/1");
    expect(await rewardNFT.balanceOf(addr1.address)).to.equal(1);
  });

  it("Should not allow non-owner to mint an NFT", async function () {
    await expect(rewardNFT.connect(addr1).mint(addr1.address, "https://example.com/token/1")).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Should transfer an NFT", async function () {
    await rewardNFT.mint(addr1.address, "https://example.com/token/1");
    await rewardNFT.connect(addr1).transferFrom(addr1.address, addr2.address, 1);
    expect(await rewardNFT.balanceOf(addr2.address)).to.equal(1);
  });

  it("Should not allow unauthorized transfer of an NFT", async function () {
    await rewardNFT.mint(addr1.address, "https://example.com/token/1");
    await expect(rewardNFT.transferFrom(addr1.address, addr2.address, 1)).to.be.revertedWith("ERC721: caller is not token owner or approved");
  });
});