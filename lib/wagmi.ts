'use client';

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { coreDao, coreTestnet2 } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "CoreFluidX - Unified Liquidity Protocol",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "2f5a2b1c8d3e4f5a6b7c8d9e0f1a2b3c",
  chains: [coreDao, coreTestnet2],
  ssr: false,
});