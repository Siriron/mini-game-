"use client"

import { Card } from "@/components/ui/card"
import { Trophy, Zap, Clock } from "lucide-react"
import { useAccount, useReadContract } from "wagmi"
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/contract"

export function ScorePanel() {
  const { address, isConnected } = useAccount()

  const { data: highScore } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getHighScore",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })

  const { data: lastPlayed } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getLastPlayed",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })

  const formatDate = (timestamp: bigint) => {
    if (!timestamp || timestamp === 0n) return "Never"
    const date = new Date(Number(timestamp) * 1000)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  return (
    <div className="space-y-4">
      <Card className="p-6 glass-strong border-border/50 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-gradient-to-br from-[#facc15] to-[#ec4899]">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold">Your High Score</h3>
        </div>
        <div className="text-4xl font-bold bg-gradient-to-r from-[#facc15] to-[#ec4899] bg-clip-text text-transparent">
          {isConnected && highScore ? Number(highScore) : "---"}
        </div>
      </Card>

      <Card className="p-6 glass-strong border-border/50 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-gradient-to-br from-[#3b82f6] to-[#4f46e5]">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold">Last Played</h3>
        </div>
        <div className="text-lg text-muted-foreground">
          {isConnected && lastPlayed ? formatDate(lastPlayed) : "Not yet"}
        </div>
      </Card>

      <Card className="p-6 glass-strong border-border/50 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-gradient-to-br from-[#10b981] to-[#3b82f6]">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold">How to Play</h3>
        </div>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-[#4f46e5] mt-0.5">•</span>
            <span>{"Click targets as they appear"}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#3b82f6] mt-0.5">•</span>
            <span>{"Build streaks for bonus points"}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#10b981] mt-0.5">•</span>
            <span>{"10 seconds per round"}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#ec4899] mt-0.5">•</span>
            <span>{"Submit to compete on-chain"}</span>
          </li>
        </ul>
      </Card>
    </div>
  )
}
