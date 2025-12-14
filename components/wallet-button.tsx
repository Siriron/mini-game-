"use client"

import { useAccount, useConnect, useDisconnect } from "wagmi"
import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"

export function WalletButton() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  const handleClick = () => {
    if (isConnected) {
      disconnect()
    } else {
      // Connect with the first available connector (injected/MetaMask)
      const connector = connectors[0]
      if (connector) {
        connect({ connector })
      }
    }
  }

  return (
    <Button
      onClick={handleClick}
      size="lg"
      className="bg-gradient-to-r from-[#4f46e5] to-[#3b82f6] hover:from-[#4338ca] hover:to-[#2563eb] text-white font-semibold shadow-lg hover:shadow-xl transition-all"
    >
      <Wallet className="mr-2 h-4 w-4" />
      {isConnected && address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Connect Wallet"}
    </Button>
  )
}
