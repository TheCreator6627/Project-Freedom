import {
  fTokenAbi,
  stakingAbi,
  rewardManagerAbi,
  treasuryAbi,
  tokenVestingAbi // Annahme, dass du diese ABI auch in abis.ts hast
} from './abis';

// Definiere die neuen, verifizierten Adressen an einem Ort
const addresses = {
  fToken: '0xe93BCD441452E75D7ED88174a205a9DcCc6FAc36',
  staking: '0x938C0EAD6aEF71Da9827194C81E6EaDE4D12D273',
  rewardManager: '0x96Febf5384B0C5c2A6800170865bfdE1864c8F0c',
  treasury: '0xC07a2D56CcD1aaFD23a1611c9a3022E478B6fd0',
  tokenVesting: '0x4FA12941f9A8F3C7ca146c8c3903d9eAba770AEc',
} as const;

// Erstelle und exportiere die fertigen Vertrags-Objekte
export const fTokenContract = {
  address: addresses.fToken,
  abi: fTokenAbi,
};

export const stakingContract = {
  address: addresses.staking,
  abi: stakingAbi,
};

export const rewardManagerContract = {
  address: addresses.rewardManager,
  abi: rewardManagerAbi,
};

export const treasuryContract = {
  address: addresses.treasury,
  abi: treasuryAbi,
};

export const tokenVestingContract = {
  address: addresses.tokenVesting,
  abi: tokenVestingAbi,
};