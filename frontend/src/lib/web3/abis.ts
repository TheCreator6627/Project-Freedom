// frontend/src/lib/web3/abis.ts

import FTokenArtifact from  "@/lib/artifacts/F.json";
import TreasuryArtifact from "@/lib/artifacts/Treasury.json";
import StakingArtifact from "@/lib/artifacts/Staking.json";

export { FTokenArtifact, TreasuryArtifact, StakingArtifact };

export const F_TOKEN_ABI = FTokenArtifact.abi;
export const TREASURY_ABI = TreasuryArtifact.abi;
export const STAKING_ABI = StakingArtifact.abi;
