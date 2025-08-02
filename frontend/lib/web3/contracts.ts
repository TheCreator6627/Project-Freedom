// frontend/lib/contracts.ts

// 1. Importiere die kompletten Artefakt-Dateien von Truffle
import FTokenArtifact from "../../build/contracts/F.json";
import StakingArtifact from "../../build/contracts/Staking.json";
import TreasuryArtifact from "../../build/contracts/Treasury.json";
import RewardManagerArtifact from "../../build/contracts/RewardManager.json";

// 2. Definiere die Netzwerk-ID für das BSC Testnet
const bscTestnetId = "97";

// --- ABIs ---
// Einheitliche Benennung (camelCase) für sauberen Code
export const fTokenAbi = FTokenArtifact.abi;
export const stakingAbi = StakingArtifact.abi;
export const treasuryAbi = TreasuryArtifact.abi;
export const rewardManagerAbi = RewardManagerArtifact.abi;

// --- Adressen (dynamisch aus den Build-Dateien gelesen) ---
export const fTokenAddress = FTokenArtifact.networks[bscTestnetId]
  ?.address as `0x${string}`;
export const stakingAddress = StakingArtifact.networks[bscTestnetId]
  ?.address as `0x${string}`;
export const treasuryAddress = TreasuryArtifact.networks[bscTestnetId]
  ?.address as `0x${string}`;
export const rewardManagerAddress = RewardManagerArtifact.networks[bscTestnetId]
  ?.address as `0x${string}`;

// --- Validierungs-Check ---
// Stellt sicher, dass alle Verträge auf dem Testnet deployt wurden
if (
  !fTokenAddress ||
  !stakingAddress ||
  !treasuryAddress ||
  !rewardManagerAddress
) {
  throw new Error(
    "Eine oder mehrere Vertragsadressen wurden nicht gefunden. Stelle sicher, dass ALLE Verträge auf dem BSC Testnet (ID 97) deployed wurden."
  );
}
