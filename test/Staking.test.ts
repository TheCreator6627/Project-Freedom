import { expect } from "chai";
import { ethers } from "hardhat";
import { F, Staking } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("Staking Contract", function () {
  let fToken: F;
  let staking: Staking;
  let owner: HardhatEthersSigner, addr1: HardhatEthersSigner;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    const StakingFactory = await ethers.getContractFactory("Staking");
    const FTokenFactory = await ethers.getContractFactory("F");
    
    // Deploy F Token first
    fToken = await FTokenFactory.deploy(owner.address, ethers.ZeroAddress, ethers.ZeroAddress);
    
    // Deploy Staking Contract with the real F-Token address
    staking = await StakingFactory.deploy(await fToken.getAddress(), owner.address);

    await fToken.connect(owner).setFeeExempt(await staking.getAddress(), true);
    await fToken.connect(owner).transfer(await staking.getAddress(), ethers.parseEther("100000"));
    await fToken.connect(owner).transfer(addr1.address, ethers.parseEther("10000"));
  });

  it("Should allow a user to stake and unstake correctly", async function () {
    const stakeAmount = ethers.parseEther("1000");
    await fToken.connect(addr1).approve(await staking.getAddress(), stakeAmount);
    await staking.connect(addr1).stake(stakeAmount, 30);
    expect((await staking.stakers(addr1.address)).amount).to.equal(stakeAmount);
    
    await ethers.provider.send("evm_increaseTime", [30 * 24 * 60 * 60]);
    await ethers.provider.send("evm_mine", []);

    const initialBalance = await fToken.balanceOf(addr1.address);
    await staking.connect(addr1).unstake();
    const reward = (stakeAmount * 50n) / 10000n;
    expect(await fToken.balanceOf(addr1.address)).to.equal(initialBalance + stakeAmount + reward);
  });
});
