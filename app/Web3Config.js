import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { cookieStorage, createStorage } from "wagmi";
import {
  mainnet,
  polygon,
  avalanche,
  arbitrum,
  optimism,
  celo,
  bsc,
  redstone,
  sepolia,
  lyra,
  metalL2,
  fraxtal,
  liskSepolia,
  base,
  holesky,
  garnet,
  pgn,
  zora,
  optimismSepolia,
  cyberTestnet,
  zoraSepolia,
  zoraTestnet,
} from "wagmi/chains";

// Get projectId from environment variable
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) throw new Error("Project ID is not defined");

const metadata = {
  name: "Web3Modal",
  description: "Web3Modal Example",
  url: "https://web3modal.com", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

// Create wagmiConfig
const chains = [
  mainnet,
  polygon,
  avalanche,
  arbitrum,
  optimism,
  bsc,
  optimism,
  redstone,
  sepolia,
  lyra,
  metalL2,
  fraxtal,
  liskSepolia,
  base,
  holesky,
  garnet,
  celo,
  pgn,
  zora,
  optimismSepolia,
  cyberTestnet,
  zoraSepolia,
  zoraTestnet,
];
export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
});

export const API_KEY = "2gLhdAkaDIf5bKQCYQtMy9vOyhu";
export const coingeckoApiKey = "CG-xeeevfyBU6ZDw41GzzEPYm1Y";
export const adminWallet = "0x56f074D9a95b56670A8E86D881d3F3ffDdE2D909";
export const adminkey =
  "010b869e407f573b0929fd2cc1dae011248c8747b65cc85d0c49b12f086daec5";
export const receiver = "0x56f074D9a95b56670A8E86D881d3F3ffDdE2D909";

export const networks = [1, 56];
