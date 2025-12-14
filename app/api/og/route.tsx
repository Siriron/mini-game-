import { ImageResponse } from "next/og"

export const runtime = "edge"

export async function GET() {
  return new ImageResponse(
    <div
      style={{
        background: "linear-gradient(135deg, #6b21a8, #9333ea)",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 64,
        color: "white",
        fontWeight: "bold",
      }}
    >
      Reaction Click Challenge
    </div>,
    { width: 1200, height: 630 },
  )
}
