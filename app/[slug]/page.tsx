import Link from "next/link"
import { getDiagnosis } from "@/lib/diagnoses"
import { TypeGrid } from "@/components/type-grid"
import type { SlugParams } from "./layout"

const DiagnosisTop = async ({ params }: SlugParams) => {
  const { meta, bank, types } = getDiagnosis((await params).slug)!
  return (
    <div className="fade-in">
      <section className="hero">
        <img src={meta.image} alt="" className="hero-art" />
        <p className="eyebrow">{meta.eyebrow}</p>
        <h1>{meta.title}</h1>
        <p className="muted">{meta.lead}</p>
        <Link href={`/${meta.slug}/intro/`} className="btn">
          {meta.startLabel}
        </Link>
        <ul className="badges">
          <li>
            全{bank.items.length}問・{meta.estimate}
          </li>
          <li>登録不要</li>
          <li>正解なし</li>
        </ul>
      </section>
      <section className="type-section" aria-labelledby="types-heading">
        <h2 id="types-heading">{types.length}つのタイプ</h2>
        <TypeGrid types={types} />
      </section>
    </div>
  )
}

export default DiagnosisTop
