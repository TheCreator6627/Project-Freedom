import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import 'dotenv/config';
const PRIVATE_KEY = process.env.PRIVATE_KEY || '';
const RPC_URL = process.env.RPC_URL || '';
const EXPLORER_API = process.env.EXPLORER_API || '';
const config: HardhatUserConfig = {
  solidity: '0.8.20',
  networks: {
    bsctestnet: { url: RPC_URL, chainId: 97, accounts: [PRIVATE_KEY] },
  },
  etherscan: { apiKey: EXPLORER_API },
};
export default config;
