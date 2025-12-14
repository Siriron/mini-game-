"use client"

import { Card } from "@/components/ui/card"
import { Trophy, Medal, Award, ExternalLink } from "lucide-react"
import { usePublicClient } from "wagmi"
import { base } from "wagmi/chains"
import { CONTRACT_ADDRESS } from "@/lib/contract"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

interface LeaderboardEntry {
  address: string
  score: number
  timestamp: number
}

export function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const publicClient = usePublicClient({ chainId: base.id })

  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!publicClient) return

      try {
        const blockNumber = await publicClient.getBlockNumber()
        const fromBlock = blockNumber > 10000n ? blockNumber - 10000n : 0n

        const logs = await publicClient.getLogs({
          address: CONTRACT_ADDRESS,
          event: {
            type: "event",
            name: "ScoreRecorded",
            inputs: [
              { type: "address", indexed: true, name: "player" },
              { type: "uint256", indexed: false, name: "score" },
              { type: "uint256", indexed: false, name: "timestamp" },
            ],
          },
          fromBlock,
          toBlock: "latest",
        })

        const playerScores = new Map<string, LeaderboardEntry>()

        logs.forEach((log: any) => {
          const { player, score, timestamp } = log.args
          const existing = playerScores.get(player)

          if (!existing || Number(score) > existing.score) {
            playerScores.set(player, {
              address: player,
              score: Number(score),
              timestamp: Number(timestamp),
            })
          }
        })

        const sortedEntries = Array.from(playerScores.values())
          .sort((a, b) => b.score - a.score)
          .slice(0, 10)

        setEntries(sortedEntries)
        setError(null)
      } catch (error) {
        console.error("Error fetching leaderboard:", error)
        setError("Unable to load leaderboard. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()

    const interval = setInterval(fetchLeaderboard, 30000)
    return () => clearInterval(interval)
  }, [publicClient])

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-6 h-6 text-[#facc15]" />
      case 1:
        return <Medal className="w-6 h-6 text-[#d1d5db]" />
      case 2:
        return <Award className="w-6 h-6 text-[#f59e0b]" />
      default:
        return <span className="text-lg font-bold text-muted-foreground">{index + 1}</span>
    }
  }

  const shareToFarcaster = (score: number, rank: number) => {
    const text = `I just ranked #${rank + 1} on Reaction Click Challenge with a score of ${score}! 🎯\n\nThink you can beat me? Try it now on Base!`
    const url = `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}`
    window.open(url, "_blank")
  }

  return (
    <Card className="p-6 glass-strong border-border/50 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-[#facc15] to-[#ec4899] animate-pulse-glow">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold">Global Leaderboard</h2>
        </div>
        <a
          href={`https://basescan.org/address/${CONTRACT_ADDRESS}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          View Contract
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading leaderboard...</div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Retry
          </Button>
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No scores yet. Be the first to play!</div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry, index) => (
            <div
              key={entry.address}
              className="flex items-center gap-4 p-4 rounded-xl bg-background/30 hover:bg-background/50 transition-all border border-border/30 group"
            >
              <div className="flex-shrink-0 w-10 flex items-center justify-center">{getRankIcon(index)}</div>
              <div className="flex-1 min-w-0">
                <div className="font-mono text-sm truncate">
                  {entry.address.slice(0, 6)}...{entry.address.slice(-4)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(entry.timestamp * 1000).toLocaleDateString()}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-2xl font-bold bg-gradient-to-r from-[#facc15] to-[#ec4899] bg-clip-text text-transparent">
                  {entry.score}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => shareToFarcaster(entry.score, index)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Share
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-[#4f46e5]/10 to-[#ec4899]/10 border border-border/30">
        <p className="text-sm text-center text-muted-foreground">
          {"All scores are permanently recorded on Base blockchain"}
        </p>
      </div>
    </Card>
  )
}
