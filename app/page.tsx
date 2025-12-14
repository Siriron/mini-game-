"use client"

import { useEffect } from "react"
import { sdk } from "@farcaster/frame-sdk"
import { GameContainer } from "@/components/game-container"
import { ParticleBackground } from "@/components/particle-background"

export default function Home() {
  useEffect(() => {
    sdk.actions.ready()
  }, [])

  return (
    <main className="min-h-screen relative overflow-hidden">
      <ParticleBackground />
      <div className="relative z-10">
        <GameContainer />
      </div>
    </main>
  )
}
