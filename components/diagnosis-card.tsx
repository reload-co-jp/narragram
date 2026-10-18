import { CSSProperties, FC } from "react"
import Link from "next/link"
import type { Diagnosis } from "@/lib/diagnoses"
import { TrackedLink } from "./tracked-link"

const css = `
.diagnosis-card {
  background:
    radial-gradient(
      ellipse 70% 60% at 100% 0%,
      color-mix(in srgb, var(--accent) 16%, transparent),
      transparent 70%
    ),
    var(--panel);
  border: 1px solid color-mix(in srgb, var(--accent) 35%, var(--panel-border));
  border-radius: 1rem;
  display: grid;
  gap: 1rem;
  padding: 1.25rem;
}
.diagnosis-card-head {
  align-items: center;
  display: flex;
  gap: 1rem;
}
.diagnosis-card-head img {
  flex: none;
  height: auto;
  width: 5.5rem;
}
.diagnosis-card h3 {
  font-size: 1.2rem;
}
.diagnosis-card .muted {
  font-size: 0.9rem;
}
.diagnosis-card-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  list-style: none;
  padding: 0;
}
.diagnosis-card-meta li {
  border: 1px solid color-mix(in srgb, var(--accent) 45%, transparent);
  border-radius: 999px;
  color: var(--accent);
  font-size: 0.75rem;
  padding: 0.1rem 0.65rem;
}
.diagnosis-card-actions {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.25rem;
}
.diagnosis-card-actions .btn {
  flex: 1 1 12rem;
}
.diagnosis-card-actions a:not(.btn) {
  font-size: 0.85rem;
}
`

/** 診断の紹介カード。from は計測用の設置場所（例: "home", "result:dungeon"） */
export const DiagnosisCard: FC<{
  d: Diagnosis
  from: string
  headingLevel?: "h2" | "h3"
}> = ({ d: { meta, bank, types }, from, headingLevel: H = "h3" }) => (
  <article
    className="diagnosis-card"
    style={{ "--accent": meta.accent } as CSSProperties}
    aria-labelledby={`card-${from}-${meta.slug}`}
  >
    <style href="diagnosis-card" precedence="component">
      {css}
    </style>
    <div className="diagnosis-card-head">
      <img src={meta.image} alt="" width={88} height={88} loading="lazy" />
      <div>
        <p className="eyebrow">{meta.shortTitle}</p>
        <H id={`card-${from}-${meta.slug}`}>{meta.title}</H>
      </div>
    </div>
    <p className="muted">{meta.theme}</p>
    <ul className="diagnosis-card-meta" aria-label="診断の概要">
      <li>全{bank.items.length}問</li>
      <li>{meta.estimate}</li>
      <li>{types.length}タイプ</li>
      <li>登録不要</li>
    </ul>
    <div className="diagnosis-card-actions">
      <TrackedLink
        href={`/${meta.slug}/intro/`}
        className="btn"
        event={["diagnosis_card_clicked", { diagnosis: meta.slug, from }]}
      >
        {meta.startLabel}
      </TrackedLink>
      <Link href={`/${meta.slug}/`}>タイプ一覧と詳細</Link>
    </div>
  </article>
)
