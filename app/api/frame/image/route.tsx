import { ImageResponse } from "next/og"

export const runtime = "edge"

export async function GET() {
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #ec4899 100%)",
        fontFamily: "system-ui",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
          marginBottom: "40px",
        }}
      >
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "20px",
            background: "linear-gradient(135deg, #4f46e5, #3b82f6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ fontSize: "48px" }}>🎯</div>
        </div>
        <h1
          style={{
            fontSize: "72px",
            fontWeight: "bold",
            color: "white",
            margin: 0,
          }}
        >
          Reaction Click Challenge
        </h1>
      </div>
      <p
        style={{
          fontSize: "32px",
          color: "rgba(255, 255, 255, 0.9)",
          margin: "0 0 60px 0",
          textAlign: "center",
          maxWidth: "800px",
        }}
      >
        {"Test your reaction speed on Base blockchain!"}
      </p>
      <div
        style={{
          display: "flex",
          gap: "30px",
        }}
      >
        <div
          style={{
            padding: "30px 40px",
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "20px",
            backdropFilter: "blur(10px)",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "48px", fontWeight: "bold", color: "#facc15" }}>⚡</div>
          <div style={{ fontSize: "24px", color: "white", marginTop: "10px" }}>Fast-Paced</div>
        </div>
        <div
          style={{
            padding: "30px 40px",
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "20px",
            backdropFilter: "blur(10px)",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "48px", fontWeight: "bold", color: "#10b981" }}>🏆</div>
          <div style={{ fontSize: "24px", color: "white", marginTop: "10px" }}>Compete</div>
        </div>
        <div
          style={{
            padding: "30px 40px",
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "20px",
            backdropFilter: "blur(10px)",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "48px", fontWeight: "bold", color: "#3b82f6" }}>⛓️</div>
          <div style={{ fontSize: "24px", color: "white", marginTop: "10px" }}>On-Chain</div>
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  )
}
