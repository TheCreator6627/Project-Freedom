// frontend/lib/contracts.ts

// 1. Importiere die kompletten Artefakt-Dateien
//    Stelle sicher, dass der Pfad zu deinem `build`-Ordner korrekt ist.
import FTokenArtifact from "../../build/contracts/F.json";
import StakingArtifact from "../../build/contracts/Staking.json";
import TreasuryArtifact from "../../build/contracts/Treasury.json";

// 2. Definiere die Netzwerk-ID für das BSC Testnet
const bscTestnetId = "97";

// 3. Exportiere die ABIs (unverändert)
export const F_TOKEN_ABI = FTokenArtifact.abi;
export const STAKING_ABI = StakingArtifact.abi;
export const TREASURY_ABI = TreasuryArtifact.abi;

// 4. Exportiere die Adressen DYNAMISCH aus den Artefakten
//    Truffle speichert die Adresse unter der Netzwerk-ID.
//    Die `as` Anweisung sorgt für korrekte Typen für wagmi/viem.
export const F_TOKEN_ADDRESS = FTokenArtifact.networks[bscTestnetId]
  ?.address as `0x${string}`;
export const STAKING_ADDRESS = StakingArtifact.networks[bscTestnetId]
  ?.address as `0x${string}`;
export const TREASURY_ADDRESS = TreasuryArtifact.networks[bscTestnetId]
  ?.address as `0x${string}`;

// 5. Ein kleiner Check, um Fehler frühzeitig zu erkennen
if (!F_TOKEN_ADDRESS || !STAKING_ADDRESS || !TREASURY_ADDRESS) {
  throw new Error(
    "Eine oder mehrere Vertragsadressen wurden in den Artefakt-Dateien nicht gefunden. Stelle sicher, dass du die Verträge auf dem BSC Testnet (ID 97) deployed hast."
  );
}
