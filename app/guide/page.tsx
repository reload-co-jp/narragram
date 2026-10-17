import Link from "next/link"
import { guides } from "@/lib/guides"

export const metadata = {
  title: "性格心理学の解説｜Narragram",
  description:
    "Big Five（ビッグファイブ）、MBTIとの違い、バーナム効果、性格の変化など、性格診断にまつわる心理学をわかりやすく解説します。",
  alternates: { canonical: "/guide/" },
}

const GuideIndex = () => (
  <article className="stack">
    <h1>性格心理学の解説</h1>
    <p>性格診断をもっと楽しむための、心理学の基礎知識をまとめています。</p>
    <ul className="stack">
      {guides.map((g) => (
        <li key={g.slug}>
          <Link href={`/guide/${g.slug}/`}>{g.title}</Link>
          <p className="muted">{g.description}</p>
        </li>
      ))}
    </ul>
    <p>
      <Link href="/">トップへ戻る</Link>
    </p>
  </article>
)

export default GuideIndex
