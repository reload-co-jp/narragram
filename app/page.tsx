import { FC } from "react"
import Link from "next/link"
import { HeroArt } from "@/components/hero-art"
import itemBank from "@/data/items.json"

const Page: FC = () => {
  return (
    <section className="hero fade-in">
      <HeroArt />
      <p className="eyebrow">ISEKAI DUNGEON DIAGNOSIS</p>
      <h1>あなたが転生したら、どんな冒険者になる？</h1>
      <p className="muted">選択から読み解く、あなたの異世界冒険スタイル。</p>
      <Link href="/intro/" className="btn">
        冒険を始める
      </Link>
      <ul className="badges">
        <li>全{itemBank.items.length}問・約3分</li>
        <li>登録不要</li>
        <li>正解なし</li>
      </ul>
    </section>
  )
}

export default Page
