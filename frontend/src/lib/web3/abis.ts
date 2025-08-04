// frontend/lib/abi.ts

// Wir importieren die JSON-Dateien, die Truffle im build-Ordner erstellt.
// Der Pfad muss von hier aus zum Hauptverzeichnis zurückgehen.
import FTokenArtifact from "../../../../build/contracts/F.json";
import TreasuryArtifact from "../../../../build/contracts/Treasury.json";
import StakingArtifact from "../../../../build/contracts/Staking.json";


// Wir exportieren nur die reinen ABIs zur Verwendung in der App.
export const F_TOKEN_ABI = FTokenArtifact.abi;
export const TREASURY_ABI = TreasuryArtifact.abi;
export const STAKING_ABI = StakingArtifact.abi;
