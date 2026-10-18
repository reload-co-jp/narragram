import { CSSProperties, ReactNode } from "react"
import { notFound } from "next/navigation"
import { diagnoses, getDiagnosis } from "@/lib/diagnoses"

export type SlugParams = { params: Promise<{ slug: string }> }

export const dynamicParams = false
export const generateStaticParams = () =>
  diagnoses.map((d) => ({ slug: d.meta.slug }))

export const generateMetadata = async ({ params }: SlugParams) => {
  const d = getDiagnosis((await params).slug)
  if (!d) return
  const title = `${d.meta.shortTitle}｜${d.meta.title}｜Narragram`
  const url = `/${d.meta.slug}/`
  return {
    title,
    description: `${d.meta.lead}${d.meta.theme}全${d.bank.items.length}問・${d.meta.estimate}・登録不要。`,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: d.meta.lead,
      url,
      siteName: "Narragram",
      locale: "ja_JP",
      type: "website",
      images: `${url}og.png`,
    },
  }
}

const DiagnosisLayout = async ({
  params,
  children,
}: SlugParams & { children: ReactNode }) => {
  const d = getDiagnosis((await params).slug)
  if (!d) notFound()
  return (
    <div style={{ "--accent": d.meta.accent } as CSSProperties}>{children}</div>
  )
}

export default DiagnosisLayout
