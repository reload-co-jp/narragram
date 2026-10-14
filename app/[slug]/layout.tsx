import { ReactNode } from "react"
import { notFound } from "next/navigation"
import { diagnoses, getDiagnosis } from "@/lib/diagnoses"

export type SlugParams = { params: Promise<{ slug: string }> }

export const dynamicParams = false
export const generateStaticParams = () =>
  diagnoses.map((d) => ({ slug: d.meta.slug }))

export const generateMetadata = async ({ params }: SlugParams) => {
  const d = getDiagnosis((await params).slug)
  if (!d) return
  const title = `${d.meta.title}｜Narragram`
  const url = `/${d.meta.slug}/`
  return {
    title,
    description: d.meta.lead,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: d.meta.lead,
      url,
      siteName: "Narragram",
      locale: "ja_JP",
      type: "website",
    },
  }
}

const DiagnosisLayout = async ({
  params,
  children,
}: SlugParams & { children: ReactNode }) => {
  if (!getDiagnosis((await params).slug)) notFound()
  return children
}

export default DiagnosisLayout
