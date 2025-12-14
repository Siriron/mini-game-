"use client"

import { useState } from "react"
import { GameBoard } from "@/components/game-board"
import { ScorePanel } from "@/components/score-panel"
import { Leaderboard } from "@/components/leaderboard"
import { WalletButton } from "@/components/wallet-button"
import { Target } from "lucide-react"

export function GameContainer() {
  const [refreshLeaderboard, setRefreshLeaderboard] = useState(0)

  const handleScoreSubmitted = () => {
    setRefreshLeaderboard((prev) => prev + 1)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <header className="text-center mb-8 space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-[#4f46e5] to-[#3b82f6] animate-pulse-glow">
            <Target className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-[#4f46e5] via-[#ec4899] to-[#facc15] bg-clip-text text-transparent">
            Reaction Click Challenge
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {"Test your reaction speed! Click targets as fast as you can and submit your high score on Base blockchain."}
        </p>
        <div className="flex justify-center">
          <WalletButton />
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <GameBoard onScoreSubmitted={handleScoreSubmitted} />
        </div>
        <div className="space-y-6">
          <ScorePanel />
        </div>
      </div>

      <Leaderboard key={refreshLeaderboard} />
    </div>
  )
}
