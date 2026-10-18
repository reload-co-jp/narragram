// OGP・結果カード画像（ビルド時に静的生成）。日本語フォントは必要な文字だけ Google Fonts から取得する。
import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { ImageResponse } from "next/og"

const ogSize = { width: 1200, height: 630 }

const loadFont = async (text: string) => {
  const css = await (
    await fetch(
      `https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@700&text=${encodeURIComponent(text)}`
    )
  ).text()
  const url = css.match(
    /src: url\((.+?)\) format\('(?:truetype|opentype)'\)/
  )?.[1]
  if (!url) throw new Error("OG font not found")
  return (await fetch(url)).arrayBuffer()
}

const svgDataUri = async (publicPath: string) =>
  `data:image/svg+xml;base64,${(await readFile(join(process.cwd(), "public", publicPath))).toString("base64")}`

export const renderOg = async ({
  eyebrow,
  title,
  sub,
  image,
  accent = "#c8a764",
}: {
  eyebrow: string
  title: string
  sub: string
  image?: string
  accent?: string
}) => {
  const footer = "NARRAGRAM ・ 物語の選択から、あなたを読み解く"
  const font = await loadFont(eyebrow + title + sub + footer)
  const src = image ? await svgDataUri(image) : null
  return new ImageResponse(
    <div
      style={{
        background: `radial-gradient(ellipse at 85% 10%, ${accent}33, transparent 60%), #0d1526`,
        border: "16px solid #0d1526",
        color: "#f1ead9",
        display: "flex",
        fontFamily: "Shippori",
        height: "100%",
        width: "100%",
      }}
    >
      <div
        style={{
          border: "2px solid #8a7444",
          display: "flex",
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 64px",
        }}
      >
        <div style={{ alignItems: "center", display: "flex", gap: 48 }}>
          {src && <img src={src} width={260} height={260} alt="" />}
          <div
            style={{
              display: "flex",
              flex: 1,
              flexDirection: "column",
              gap: 16,
            }}
          >
            <div style={{ color: accent, fontSize: 32 }}>{eyebrow}</div>
            <div
              style={{
                fontSize: title.length > 12 ? 60 : 96,
                lineHeight: 1.25,
              }}
            >
              {title}
            </div>
            <div style={{ color: "#c8a764", fontSize: 36, lineHeight: 1.4 }}>
              {sub}
            </div>
          </div>
        </div>
        <div style={{ color: "#b8b2a3", display: "flex", fontSize: 26 }}>
          {footer}
        </div>
      </div>
    </div>,
    { ...ogSize, fonts: [{ name: "Shippori", data: await font, weight: 700 }] }
  )
}
