import { ethers } from "hardhat";

async function main() {
  console.log("Starte finales Deployment-Skript...");

  // 1. Hole den Deployer-Account und definiere Adressen
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying contracts with the account: ${deployer.address}`);

  const initialOwner = deployer.address;
  const royaltyReceiver = deployer.address;
  const beneficiary = deployer.address;

  // 2. Deploye die Verträge in der richtigen Reihenfolge
  // Zuerst die Verträge, die von nichts abhängen oder deren Abhängigkeiten bekannt sind.

  // Da F_Token die Adressen von Staking und Treasury im Konstruktor benötigt,
  // müssen wir diese zuerst deployen.
  console.log("\nDeploying Staking Contract...");
  const StakingFactory = await ethers.getContractFactory("Staking");
  const staking = await StakingFactory.deploy(ethers.ZeroAddress, initialOwner); // Temporäre Token-Adresse
  await staking.waitForDeployment();
  const stakingAddress = await staking.getAddress();
  console.log(`-> Staking Contract deployed to: ${stakingAddress}`);

  console.log("\nDeploying Treasury Contract...");
  const TreasuryFactory = await ethers.getContractFactory("Treasury");
  const treasury = await TreasuryFactory.deploy(
    ethers.ZeroAddress, // Temporäre Token-Adresse
    ethers.ZeroAddress, // Platzhalter für Stablecoin
    ethers.ZeroAddress, // Platzhalter für Router
    ethers.ZeroAddress, // Platzhalter für Chainlink Feed
    stakingAddress,
    initialOwner
  );
  await treasury.waitForDeployment();
  const treasuryAddress = await treasury.getAddress();
  console.log(`-> Treasury Contract deployed to: ${treasuryAddress}`);

  // Jetzt deployen wir den F-Token mit den echten Adressen von Staking und Treasury
  console.log("\nDeploying F Token...");
  const FTokenFactory = await ethers.getContractFactory("F");
  const fToken = await FTokenFactory.deploy(
    initialOwner,
    stakingAddress,
    treasuryAddress
  );
  await fToken.waitForDeployment();
  const fTokenAddress = await fToken.getAddress();
  console.log(`-> F Token deployed to: ${fTokenAddress}`);

  // HINWEIS: Für ein MAINNET-DEPLOYMENT müssten wir Staking und Treasury jetzt
  // noch die korrekte fTokenAddress mitteilen. Da unsere Verträge immutable sind,
  // ist die aktuelle Architektur für ein Mainnet-Deployment nicht ideal.
  // Für das Testen auf der lokalen Hardhat-Blockchain funktioniert dieser Ansatz.

  console.log("\nDeploying RewardManager Contract...");
  const RewardManagerFactory = await ethers.getContractFactory("RewardManager");
  const rewardManager = await RewardManagerFactory.deploy(
    "ipfs://...",
    initialOwner,
    royaltyReceiver
  );
  await rewardManager.waitForDeployment();
  console.log(
    `-> RewardManager deployed to: ${await rewardManager.getAddress()}`
  );

  console.log("\nDeploying TokenVesting Contract...");
  const VestingFactory = await ethers.getContractFactory("TokenVesting");
  const vesting = await VestingFactory.deploy(
    fTokenAddress,
    beneficiary,
    initialOwner
  );
  await vesting.waitForDeployment();
  const vestingAddress = await vesting.getAddress();
  console.log(`-> TokenVesting Contract deployed to: ${vestingAddress}`);

  console.log("\n--- ✅ Deployment abgeschlossen ---");
  console.log("\n--- 🔵 Starte Konfiguration ---");

  // 3. Konfigurationen nach dem Deployment
  console.log("Setze Verträge auf die Limit-Ausnahmeliste...");
  let tx = await fToken.setLimitExempt(vestingAddress, true);
  await tx.wait();
  console.log("-> Vesting Contract von Limits befreit.");

  const vestingAmount = ethers.parseEther("50000000");
  console.log(
    `\nErteile Erlaubnis für ${ethers.formatEther(
      vestingAmount
    )} $F an Vesting Contract...`
  );
  tx = await fToken.approve(vestingAddress, vestingAmount);
  await tx.wait();

  console.log("Löse Einzahlung im Vesting-Vertrag aus...");
  tx = await vesting.depositVestingTokens(vestingAmount);
  await tx.wait();
  console.log("-> Einzahlung im Vesting-Vertrag bestätigt.");

  console.log("\n--- ✅ Konfiguration abgeschlossen ---");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
