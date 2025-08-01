// frontend/lib/contracts.ts

// ABIs aus den Truffle-Artefakten importieren
import FTokenArtifact from "../../build/contracts/F.json";
import StakingArtifact from "../../build/contracts/Staking.json";
import TreasuryArtifact from "../../build/contracts/Treasury.json";

// --- HIER DEINE DEPLOYTEN ADRESSEN EINTRAGEN ---
export const F_TOKEN_ADDRESS = "0xDeine_FToken_Adresse_hier";
export const STAKING_ADDRESS = "0xDeine_Staking_Adresse_hier";
export const TREASURY_ADDRESS = "0xDeine_Treasury_Adresse_hier";
// ---------------------------------------------

// ABIs für die App exportieren
export const F_TOKEN_ABI = FTokenArtifact.abi;
export const STAKING_ABI = StakingArtifact.abi;
export const TREASURY_ABI = TreasuryArtifact.abi;
