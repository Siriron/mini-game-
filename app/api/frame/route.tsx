export async function GET() {
  return new Response(
    `<!DOCTYPE html>
<html>
  <head>
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_URL || "https://reactionchallenge.app"}/api/frame/image" />
    <meta property="fc:frame:button:1" content="Play Now 🎯" />
    <meta property="fc:frame:button:1:action" content="link" />
    <meta property="fc:frame:button:1:target" content="${process.env.NEXT_PUBLIC_URL || "https://reactionchallenge.app"}" />
    <meta property="fc:frame:button:2" content="View Leaderboard" />
    <meta property="fc:frame:button:2:action" content="link" />
    <meta property="fc:frame:button:2:target" content="https://basescan.org/address/0x5aed8e851408a6e01fb6d5d06e2970d0dad7b29b" />
  </head>
</html>`,
    {
      headers: {
        "Content-Type": "text/html",
      },
    },
  )
}
