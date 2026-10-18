import Link from "next/link"
import { diagnoses, getDiagnosis } from "@/lib/diagnoses"
import { DiagnosisCard } from "@/components/diagnosis-card"
import { TypeGrid } from "@/components/type-grid"
import type { SlugParams } from "./layout"

const css = `
.hero {
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding-block: 1rem 2rem;
  text-align: center;
}
.hero-art {
  height: auto;
  max-width: 14rem;
  width: 60%;
}
.hero h1 {
  font-size: clamp(1.6rem, 6vw, 2.3rem);
}
.hero .btn {
  min-width: min(100%, 18rem);
}
.diagnosis-section {
  border-top: 1px solid var(--panel-border);
  padding-top: 2rem;
}
.diagnosis-section h2 {
  font-size: 1.3rem;
}
`

const DiagnosisTop = async ({ params }: SlugParams) => {
  const { meta, bank, types } = getDiagnosis((await params).slug)!
  const others = diagnoses.filter((d) => d.meta.slug !== meta.slug)
  return (
    <div className="stack fade-in">
      <style href="diagnosis-top" precedence="page">
        {css}
      </style>
      <section className="hero">
        <img
          src={meta.image}
          alt=""
          className="hero-art"
          width={224}
          height={224}
        />
        <p className="eyebrow">{meta.eyebrow}</p>
        <h1>{meta.title}</h1>
        <p className="muted">
          {meta.lead}
          <br />
          {meta.theme}
        </p>
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

      <section
        className="diagnosis-section stack"
        aria-labelledby="types-heading"
      >
        <h2 id="types-heading">{types.length}つのタイプ</h2>
        <p className="muted">
          各タイプの特徴や、物語の中でどの選択がそのタイプにつながるかを紹介しています。
        </p>
        <TypeGrid slug={meta.slug} types={types} />
      </section>

      {others.length > 0 && (
        <section
          className="diagnosis-section stack"
          aria-labelledby="others-heading"
        >
          <h2 id="others-heading">ほかの診断</h2>
          {others.map((d) => (
            <DiagnosisCard key={d.meta.slug} d={d} from={`top:${meta.slug}`} />
          ))}
        </section>
      )}

      <p className="notice">
        エンターテインメント目的の診断です。設問の考え方は「
        <Link href="/methods/">診断の設計と根拠</Link>」、性格心理学の基礎は「
        <Link href="/guide/big-five/">Big Five とは</Link>」で解説しています。
      </p>
    </div>
  )
}

export default DiagnosisTop
