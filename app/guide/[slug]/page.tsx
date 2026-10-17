import Link from "next/link"
import { notFound } from "next/navigation"
import { diagnoses } from "@/lib/diagnoses"
import { getGuide, guides } from "@/lib/guides"
import { SITE_URL } from "@/lib/site"

type Params = { params: Promise<{ slug: string }> }

export const dynamicParams = false
export const generateStaticParams = () => guides.map((g) => ({ slug: g.slug }))

export const generateMetadata = async ({ params }: Params) => {
  const g = getGuide((await params).slug)
  if (!g) return
  const title = `${g.title}｜Narragram`
  const url = `/guide/${g.slug}/`
  return {
    title,
    description: g.description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: g.description,
      url,
      siteName: "Narragram",
      locale: "ja_JP",
      type: "article",
      publishedTime: g.published,
    },
  }
}

const GuidePage = async ({ params }: Params) => {
  const g = getGuide((await params).slug)
  if (!g) notFound()
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: g.title,
    description: g.description,
    datePublished: g.published,
    inLanguage: "ja",
    mainEntityOfPage: `${SITE_URL}/guide/${g.slug}/`,
    publisher: { "@type": "Organization", name: "Narragram" },
  }
  return (
    <article className="stack">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1>{g.title}</h1>
      <p className="muted">{g.description}</p>

      {g.sections.map((s) => (
        <section key={s.heading} className="stack">
          <h2>{s.heading}</h2>
          {s.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </section>
      ))}

      <section className="stack">
        <h2>参考文献</h2>
        <ul className="muted">
          {g.refs.map((r) => (
            <li key={r.text}>
              {r.text}{" "}
              {r.url && (
                <a href={r.url} target="_blank" rel="noopener noreferrer">
                  {r.url.replace("https://", "")}
                </a>
              )}
            </li>
          ))}
        </ul>
      </section>

      <hr className="ornament" />

      <section className="stack">
        <h2>診断を試してみる</h2>
        <ul>
          {diagnoses.map((d) => (
            <li key={d.meta.slug}>
              <Link href={`/${d.meta.slug}/`}>{d.meta.title}</Link>
            </li>
          ))}
        </ul>
        <h2>ほかの解説</h2>
        <ul>
          {guides
            .filter((o) => o.slug !== g.slug)
            .map((o) => (
              <li key={o.slug}>
                <Link href={`/guide/${o.slug}/`}>{o.title}</Link>
              </li>
            ))}
        </ul>
      </section>

      <p>
        <Link href="/methods/">診断の設計と根拠</Link>
        {" ／ "}
        <Link href="/guide/">解説一覧</Link>
      </p>
    </article>
  )
}

export default GuidePage
