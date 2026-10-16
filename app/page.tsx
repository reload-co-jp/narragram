import { FC } from "react"
import Link from "next/link"
import { diagnoses } from "@/lib/diagnoses"
import { TypeGrid } from "@/components/type-grid"

const Page: FC = () => (
  <div className="stack fade-in">
    <header className="site-intro">
      <p className="eyebrow">NARRAGRAM</p>
      <h1>物語の選択から、あなたを読み解く。</h1>
      <p className="muted">
        物語の中で選んだ行動から、あなたのスタイルを描き出す診断集。登録不要・正解なし。
      </p>
    </header>

    {diagnoses.map(({ meta, bank, types }) => (
      <section
        key={meta.slug}
        className="catalog-group"
        aria-labelledby={`group-${meta.slug}`}
      >
        <header className="catalog-group-head">
          <img src={meta.image} alt="" width={96} height={96} />
          <div>
            <p className="eyebrow">{meta.eyebrow}</p>
            <h2 id={`group-${meta.slug}`}>{meta.title}</h2>
            <p className="muted">{meta.lead}</p>
            <p className="catalog-meta">
              全{bank.items.length}問・{meta.estimate}・{types.length}タイプ
            </p>
          </div>
          <Link href={`/${meta.slug}/`} className="btn">
            診断する
          </Link>
        </header>

        <TypeGrid types={types} />
      </section>
    ))}
  </div>
)

export default Page
