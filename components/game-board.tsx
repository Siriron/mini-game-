"use client"

import { useState, useEffect, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Target, Play, Send } from "lucide-react"
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { base } from "wagmi/chains"
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/contract"
import { useToast } from "@/hooks/use-toast"
import Confetti from "react-confetti"
import { useWindowSize } from "@/hooks/use-window-size"

interface TargetPosition {
  id: number
  x: number
  y: number
}

interface GameBoardProps {
  onScoreSubmitted: () => void
}

export function GameBoard({ onScoreSubmitted }: GameBoardProps) {
  const [gameState, setGameState] = useState<"idle" | "playing" | "finished">("idle")
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [timeLeft, setTimeLeft] = useState(10)
  const [target, setTarget] = useState<TargetPosition | null>(null)
  const [showScorePop, setShowScorePop] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [highScore, setHighScore] = useState(0)

  const { address, isConnected } = useAccount()
  const { toast } = useToast()
  const { width, height } = useWindowSize()

  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const spawnTarget = useCallback(() => {
    const padding = 80
    const newTarget: TargetPosition = {
      id: Date.now(),
      x: Math.random() * (100 - padding) + padding / 2,
      y: Math.random() * (100 - padding) + padding / 2,
    }
    setTarget(newTarget)
  }, [])

  const startGame = () => {
    setGameState("playing")
    setScore(0)
    setStreak(0)
    setTimeLeft(10)
    spawnTarget()
  }

  const handleTargetClick = () => {
    const newStreak = streak + 1
    const multiplier = Math.min(1 + newStreak * 0.1, 2)
    const points = Math.round(1 * multiplier)

    setScore((prev) => prev + points)
    setStreak(newStreak)
    setShowScorePop(true)
    setTimeout(() => setShowScorePop(false), 300)

    spawnTarget()
  }

  const submitScore = async () => {
    if (!isConnected || !address) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to submit scores",
        variant: "destructive",
      })
      return
    }

    try {
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "recordScore",
        args: [BigInt(score)],
        chainId: base.id,
      })
    } catch (error) {
      console.error("Error submitting score:", error)
      toast({
        title: "Submission failed",
        description: "Failed to submit score. Please try again.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "Score submitted! 🎉",
        description: `Your score of ${score} has been recorded on Base blockchain!`,
      })
      onScoreSubmitted()
      if (score > highScore) {
        setHighScore(score)
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 5000)
      }
    }
  }, [isSuccess, score, toast, onScoreSubmitted, highScore])

  useEffect(() => {
    let interval: NodeJS.Timeout
    let targetTimeout: NodeJS.Timeout

    if (gameState === "playing") {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0.1) {
            setGameState("finished")
            setTarget(null)
            return 0
          }
          return prev - 0.1
        })
      }, 100)

      targetTimeout = setTimeout(
        () => {
          if (gameState === "playing") {
            setStreak(0)
            spawnTarget()
          }
        },
        Math.random() * 1000 + 500,
      )
    }

    return () => {
      clearInterval(interval)
      clearTimeout(targetTimeout)
    }
  }, [gameState, target, spawnTarget])

  return (
    <>
      {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={500} />}

      <Card className="p-6 glass-strong border-border/50 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Current Score</div>
            <div className="text-4xl font-bold bg-gradient-to-r from-[#facc15] to-[#ec4899] bg-clip-text text-transparent">
              {score}
            </div>
          </div>
          <div className="space-y-1 text-right">
            <div className="text-sm text-muted-foreground">Time Left</div>
            <div className="text-4xl font-bold text-foreground">{timeLeft.toFixed(1)}s</div>
          </div>
        </div>

        {streak > 2 && (
          <div className="mb-4 text-center">
            <div className="inline-block px-4 py-2 bg-gradient-to-r from-[#10b981] to-[#3b82f6] rounded-full text-sm font-semibold animate-pulse-glow">
              🔥 {streak}x Streak! (+{Math.round((Math.min(1 + streak * 0.1, 2) - 1) * 100)}% bonus)
            </div>
          </div>
        )}

        <div className="relative w-full h-[400px] md:h-[500px] bg-gradient-to-br from-[#4f46e5]/10 via-transparent to-[#ec4899]/10 rounded-xl border-2 border-dashed border-border/30 overflow-hidden">
          {gameState === "idle" && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                onClick={startGame}
                size="lg"
                className="bg-gradient-to-r from-[#4f46e5] to-[#ec4899] hover:from-[#4338ca] hover:to-[#db2777] text-white font-bold text-xl px-8 py-6 rounded-2xl shadow-2xl animate-pulse-glow"
              >
                <Play className="w-6 h-6 mr-2" />
                Start Game
              </Button>
            </div>
          )}

          {gameState === "playing" && target && (
            <button
              onClick={handleTargetClick}
              className="absolute w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-[#ec4899] to-[#f472b6] rounded-full flex items-center justify-center shadow-2xl animate-pulse-glow cursor-pointer hover:scale-110 transition-transform active:scale-95"
              style={{
                left: `${target.x}%`,
                top: `${target.y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <Target className="w-8 h-8 md:w-10 md:h-10 text-white" />
            </button>
          )}

          {showScorePop && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-4xl font-bold text-[#facc15] animate-score-pop">
              +{Math.round(1 * Math.min(1 + streak * 0.1, 2))}
            </div>
          )}

          {gameState === "finished" && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-6 glass-strong p-8 rounded-2xl">
                <div className="text-6xl font-bold bg-gradient-to-r from-[#facc15] via-[#ec4899] to-[#4f46e5] bg-clip-text text-transparent">
                  {score}
                </div>
                <div className="text-xl text-muted-foreground">Final Score</div>
                <div className="flex gap-4">
                  <Button onClick={startGame} size="lg" variant="outline" className="bg-background/50">
                    <Play className="w-5 h-5 mr-2" />
                    Play Again
                  </Button>
                  <Button
                    onClick={submitScore}
                    size="lg"
                    disabled={!isConnected || isPending || isConfirming}
                    className="bg-gradient-to-r from-[#10b981] to-[#3b82f6] hover:from-[#059669] hover:to-[#2563eb] text-white"
                  >
                    {isPending || isConfirming ? (
                      <>Submitting...</>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Submit Score
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {gameState === "finished" && (
          <div className="mt-4 text-center text-sm text-muted-foreground">
            {isConnected
              ? "Submit your score to the Base blockchain to compete on the leaderboard!"
              : "Connect your wallet to submit your score on-chain"}
          </div>
        )}
      </Card>
    </>
  )
}
