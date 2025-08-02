// frontend/src/lib/contracts.ts

// 1. Importiere die Artefakte aus dem lokalen, kopierten Ordner
import FTokenArtifact from "@/lib/artifacts/F.json";
import StakingArtifact from "@/lib/artifacts/Staking.json";
import TreasuryArtifact from "@/lib/artifacts/Treasury.json";
import RewardManagerArtifact from "@/lib/artifacts/RewardManager.json";


// 2. Definiere die Netzwerk-ID für das BSC Testnet
const bsctestnetId = '97';

// --- ABIs ---
// Daran ändert sich nichts
export const fTokenAbi = FTokenArtifact.abi;
export const stakingAbi = StakingArtifact.abi;
export const treasuryAbi = TreasuryArtifact.abi;
export const rewardManagerAbi = RewardManagerArtifact.abi;

// --- Adressen ---
// Dieser Teil ist korrigiert, um den TypeScript-Fehler zu beheben
export const fTokenAddress = (FTokenArtifact.networks as any)["bscTestnetId"]?.address as `0x${string}`;
export const stakingAddress = (StakingArtifact.networks as any)["bscTestnetId"]?.address as `0x${string}`;
export const treasuryAddress = (TreasuryArtifact.networks as any)["bscTestnetId"]?.address as `0x${string}`;
export const rewardManagerAddress = (RewardManagerArtifact.networks as any)["bscTestnetId"]?.address as `0x${string}`;


// --- Validierungs-Check ---
if (
  !fTokenAddress ||
  !stakingAddress ||
  !treasuryAddress ||
  !rewardManagerAddress
) {
  console.error(
    "Eine oder mehrere Vertragsadressen wurden nicht gefunden. Stelle sicher, dass ALLE Verträge auf dem BSC Testnet (ID 97) deployed und die `build/contracts`-Dateien aktuell sind."
  );
}
