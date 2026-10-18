import Link from "next/link"
import { notFound } from "next/navigation"
import { choicesForType, contrastTypes } from "@/lib/diagnosis"
import { diagnoses, getDiagnosis, getType, typePath } from "@/lib/diagnoses"
import { SITE_URL } from "@/lib/site"
import { DiagnosisCard } from "@/components/diagnosis-card"
import { TypeGrid } from "@/components/type-grid"
import { TypeHeader } from "@/components/type-header"

type Params = { params: Promise<{ slug: string; typeId: string }> }

export const dynamicParams = false
export const generateStaticParams = async ({
  params,
}: {
  params: { slug: string }
}) => getDiagnosis(params.slug)!.types.map((t) => ({ typeId: t.id }))

export const generateMetadata = async ({ params }: Params) => {
  const { slug, typeId } = await params
  const d = getDiagnosis(slug)
  const type = getType(slug, typeId)
  if (!d || !type) return
  const title = `${type.name}タイプの特徴と強み｜${d.meta.shortTitle}｜Narragram`
  const description = `${d.meta.shortTitle}の「${type.name}」タイプ。${type.tagline}${type.description}`
  const url = typePath(slug, typeId)
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "Narragram",
      locale: "ja_JP",
      type: "article",
      images: `${url}og.png`,
    },
  }
}

const TypePage = async ({ params }: Params) => {
  const { slug, typeId } = await params
  const d = getDiagnosis(slug)
  const type = getType(slug, typeId)
  if (!d || !type) notFound()
  const { meta, bank, rules, types } = d
  const choices = choicesForType(type.id, bank, rules)
  const contrasts = contrastTypes(type.id, rules)
    .slice(0, 2)
    .map((c) => ({ ...c, type: types.find((t) => t.id === c.typeId)! }))
  const others = diagnoses.filter((o) => o.meta.slug !== slug)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { name: "Narragram", path: "/" },
      { name: meta.shortTitle, path: `/${slug}/` },
      { name: `${type.name}タイプ`, path: typePath(slug, type.id) },
    ].map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: b.name,
      item: `${SITE_URL}${b.path}`,
    })),
  }

  return (
    <article className="stack fade-in">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav
        aria-label="パンくずリスト"
        className="muted"
        style={{ fontSize: "0.8rem" }}
      >
        <Link href="/">Narragram</Link> ›{" "}
        <Link href={`/${slug}/`}>{meta.shortTitle}</Link> › {type.name}
      </nav>

      <TypeHeader type={type} label={`${meta.shortTitle}のタイプ`} />

      <section className="panel stack">
        <h2>{type.name}タイプとは</h2>
        <p>{type.description}</p>
      </section>

      <section className="panel stack">
        <h2>物語の中で、このタイプにつながる選択</h2>
        {choices.length > 0 ? (
          <>
            <p className="muted">
              {meta.shortTitle}では、次の場面でこれらの行動を選ぶと「{type.name}
              」の判定に近づきます。
            </p>
            <ul className="scene-list">
              {choices.map((c) => (
                <li key={c.itemId}>
                  <span className="muted">{c.scene}</span>
                  {c.behavior}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p>
            このタイプは、判定に必要な数の回答がそろわなかったときや、特定のタイプに結びつく選択が見られなかったときに表示されます。どの傾向にも偏らず、その場その場で選んだ結果ともいえます。
          </p>
        )}
      </section>

      <section className="panel stack">
        <h2>強み</h2>
        <ul>
          {type.strengths.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <h2>苦手になりやすい状況と、意識したいこと</h2>
        <ul>
          {type.watchouts.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <p className="muted" style={{ fontSize: "0.85rem" }}>
          着想元：{type.basis}（<Link href="/methods/#types">根拠</Link>）
        </p>
      </section>

      {contrasts.length > 0 && (
        <section className="panel stack">
          <h2>対照的なタイプ</h2>
          <p className="muted">
            同じ場面で、別の行動を選んだときに近づくタイプです。
          </p>
          <ul>
            {contrasts.map((c) => (
              <li key={c.typeId}>
                <Link href={typePath(slug, c.typeId)}>{c.type.name}</Link>：
                {c.type.tagline}（{c.count}場面で分かれる）
              </li>
            ))}
          </ul>
        </section>
      )}

      <p style={{ textAlign: "center" }}>
        <Link href={`/${slug}/intro/`} className="btn">
          {meta.startLabel}
        </Link>
      </p>

      <section className="stack" aria-labelledby="other-types">
        <h2 id="other-types">{meta.shortTitle}のほかのタイプ</h2>
        <TypeGrid slug={slug} types={types.filter((t) => t.id !== type.id)} />
      </section>

      {others.map((o) => (
        <DiagnosisCard
          key={o.meta.slug}
          d={o}
          from={`type:${slug}`}
          headingLevel="h2"
        />
      ))}

      <p className="notice">
        エンターテインメント目的の診断です。タイプは物語上の仮分類であり、心理学的に検証された類型ではありません。医療・臨床診断ではありません。
      </p>
    </article>
  )
}

export default TypePage
