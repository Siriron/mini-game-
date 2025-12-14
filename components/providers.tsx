"use client"

import type React from "react"
import { WagmiProvider, createConfig, http, fallback } from "wagmi"
import { base } from "wagmi/chains"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { injected } from "wagmi/connectors"

// Using only injected connector (MetaMask, Coinbase Wallet, etc.)
const config = createConfig({
  chains: [base],
  connectors: [injected()],
  transports: {
    [base.id]: fallback([
      http("https://base.gateway.tenderly.co"),
      http("https://base-rpc.publicnode.com"),
      http("https://base.meowrpc.com"),
      http("https://mainnet.base.org"),
    ]),
  },
  ssr: true,
})

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
