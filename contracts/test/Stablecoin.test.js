const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Stablecoin", function () {
    let Stablecoin, stablecoin, owner, addr1, addr2;
    const initialSupply = ethers.parseEther("1000000"); // 1,000,000 tokens

    beforeEach(async function () {
        Stablecoin = await ethers.getContractFactory("Stablecoin");
        [owner, addr1, addr2] = await ethers.getSigners();
        stablecoin = await Stablecoin.deploy(initialSupply);
        await stablecoin.deployed();
    });

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            expect(await stablecoin.owner()).to.equal(owner.address);
        });

        it("Should assign the total supply of tokens to the owner", async function () {
            expect(await stablecoin.balanceOf(owner.address)).to.equal(initialSupply);
        });
    });

    describe("Token Transactions", function () {
        it("Should transfer tokens between accounts", async function () {
            await stablecoin.transfer(addr1.address, ethers.utils.parseEther("50"));
            expect(await stablecoin.balanceOf(addr1.address)).to.equal(ethers.utils.parseEther("50"));
        });

        it("Should fail if sender doesn't have enough tokens", async function () {
            await expect(
                stablecoin.connect(addr1).transfer(addr2.address, ethers.utils.parseEther("1"))
            ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
        });
    });
});
