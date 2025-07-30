import { expect } from "chai";
import { ethers } from "hardhat";
import { RewardManager } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";

describe("RewardManager Contract", function () {
  let rewardManager: RewardManager;
  let owner: HardhatEthersSigner, user: HardhatEthersSigner;
  
  it("Should allow a valid user to claim an NFT", async function () {
    [owner, user] = await ethers.getSigners();
    const whitelist = [owner.address, user.address];
    const leaves = whitelist.map(addr => ethers.solidityPackedKeccak256(['address'], [addr]));
    const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
    const root = tree.getHexRoot();

    const RewardManagerFactory = await ethers.getContractFactory("RewardManager");
    rewardManager = await RewardManagerFactory.deploy("ipfs://...", owner.address, owner.address);

    await rewardManager.connect(owner).setMerkleRoot(1, root);

    const leaf = ethers.solidityPackedKeccak256(['address'], [user.address]);
    const proof = tree.getHexProof(leaf);

    await rewardManager.connect(user).claimNFT(1, proof);
    expect(await rewardManager.balanceOf(user.address, 1)).to.equal(1);
  });
});
