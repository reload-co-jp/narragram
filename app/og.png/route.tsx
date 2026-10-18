import { renderOg } from "@/lib/og"

export const dynamic = "force-static"

export const GET = () =>
  renderOg({
    eyebrow: "NARRATIVE DIAGNOSIS",
    title: "物語の選択から、あなたを読み解く。",
    sub: "異世界冒険スタイル診断・休日スタイル診断",
  })
