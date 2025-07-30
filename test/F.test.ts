import { expect } from "chai";
import { ethers } from "hardhat";
import { F } from "../typechain-types";

describe("F Token Contract", function () {
  let fToken: F;
  let owner: any, addr1: any, addr2: any, stakingContract: any, treasuryContract: any, pair: any;

  beforeEach(async function () {
    [owner, addr1, addr2, stakingContract, treasuryContract, pair] = await ethers.getSigners();
    const FTokenFactory = await ethers.getContractFactory("F");
    fToken = await FTokenFactory.deploy(owner.address, stakingContract.address, treasuryContract.address);
    await fToken.setPancakeSwapPair(pair.address);
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () { expect(await fToken.owner()).to.equal(owner.address); });
    it("Should have the correct name and symbol", async function () {
      expect(await fToken.name()).to.equal("FreedomTest");
      expect(await fToken.symbol()).to.equal("F");
    });
    it("Should mint the total supply to the owner", async function () {
      const ownerBalance = await fToken.balanceOf(owner.address);
      const totalSupply = await fToken.totalSupply();
      expect(ownerBalance).to.equal(totalSupply);
      expect(totalSupply).to.equal(ethers.parseEther("500000000"));
    });
  });

  describe("Transactions and Fees", function () {
    it("Should apply fees on a transfer between regular wallets", async function () {
      const transferAmount = ethers.parseEther("1000");
      await fToken.connect(owner).transfer(addr1.address, transferAmount);
      await fToken.connect(addr1).transfer(addr2.address, transferAmount);
      const feeRate = 252n;
      const expectedAmountReceived = transferAmount - (transferAmount * feeRate / 10000n);
      expect(await fToken.balanceOf(addr2.address)).to.equal(expectedAmountReceived);
    });
  });
});
