// frontend/src/lib/web3/contracts.ts

// 1. Importiere die Artefakte
import FTokenArtifact from "@/lib/artifacts/F.json";
import StakingArtifact from "@/lib/artifacts/Staking.json";
import TreasuryArtifact from "@/lib/artifacts/Treasury.json";
import RewardManagerArtifact from "@/lib/artifacts/RewardManager.json";

// 2. Definiere die Netzwerk-ID
const BscTestnetId = "97";

// Hilfstyp, um "as any" zu vermeiden
type NetworkArtifacts = {
  [networkId: string]: { address: string };
};

// --- EINZELNE EXPORTE (TYPENSICHER) ---
// Wir exportieren die ABIs und Adressen einzeln für Flexibilität
export const fTokenAddress = (FTokenArtifact.networks as NetworkArtifacts)[
  BscTestnetId
]?.address as `0x${string}`;
export const stakingAddress = (StakingArtifact.networks as NetworkArtifacts)[
  BscTestnetId
]?.address as `0x${string}`;
export const treasuryAddress = (TreasuryArtifact.networks as NetworkArtifacts)[
  BscTestnetId
]?.address as `0x${string}`;
export const rewardManagerAddress = (
  RewardManagerArtifact.networks as NetworkArtifacts
)[BscTestnetId]?.address as `0x${string}`;

export const fTokenAbi = FTokenArtifact.abi;
export const stakingAbi = StakingArtifact.abi;
export const treasuryAbi = TreasuryArtifact.abi;
export const rewardManagerAbi = RewardManagerArtifact.abi;

// --- TYPSICHERE KONFIGURATIONSOBJEKTE (DER SCHLÜSSEL ZUR LÖSUNG) ---
// Wir erstellen hier NEUE OBJEKTE. Auf diese OBJEKT-LITERAL-Erstellung kann 'as const'
// syntaktisch korrekt angewendet werden. Das gibt Wagmi die volle Typsicherheit.

export const fTokenContractConfig = {
  address: fTokenAddress,
  abi: fTokenAbi,
} as const;
export const stakingContractConfig = {
  address: stakingAddress,
  abi: stakingAbi,
} as const;
export const treasuryContractConfig = {
  address: treasuryAddress,
  abi: treasuryAbi,
} as const;
export const rewardManagerContractConfig = {
  address: rewardManagerAddress,
  abi: rewardManagerAbi,
} as const;

// --- Validierungs-Check ---
if (
  !fTokenAddress ||
  !stakingAddress ||
  !treasuryAddress ||
  !rewardManagerAddress
) {
  throw new Error(
    "Eine oder mehrere Vertragsadressen wurden nicht gefunden. Stellen Sie sicher, dass ALLE Verträge auf dem BSC Testnet (ID 97) deployed und die Artefakte aktuell sind."
  );
}
