import { FC } from "react"
import Link from "next/link"
import { diagnoses } from "@/lib/diagnoses"

const Page: FC = () => (
  <div className="stack fade-in">
    <header className="site-intro">
      <p className="eyebrow">NARRAGRAM</p>
      <h1>物語の選択から、あなたを読み解く。</h1>
      <p className="muted">
        物語の中で選んだ行動から、あなたのスタイルを描き出す診断集。登録不要・正解なし。
      </p>
    </header>

    <ul className="catalog" aria-label="診断一覧">
      {diagnoses.map(({ meta, bank }) => (
        <li key={meta.slug}>
          <Link href={`/${meta.slug}/`} className="catalog-card">
            <img src={meta.image} alt="" width={96} height={96} />
            <div>
              <p className="eyebrow">{meta.eyebrow}</p>
              <h2>{meta.title}</h2>
              <p className="muted">{meta.lead}</p>
              <p className="catalog-meta">
                全{bank.items.length}問・{meta.estimate}
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  </div>
)

export default Page
