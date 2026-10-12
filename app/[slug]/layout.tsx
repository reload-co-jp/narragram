import { ReactNode } from "react"
import { notFound } from "next/navigation"
import { diagnoses, getDiagnosis } from "@/lib/diagnoses"

export type SlugParams = { params: Promise<{ slug: string }> }

export const dynamicParams = false
export const generateStaticParams = () =>
  diagnoses.map((d) => ({ slug: d.meta.slug }))

export const generateMetadata = async ({ params }: SlugParams) => {
  const d = getDiagnosis((await params).slug)
  return d && { title: `${d.meta.title}｜Narragram`, description: d.meta.lead }
}

const DiagnosisLayout = async ({
  params,
  children,
}: SlugParams & { children: ReactNode }) => {
  if (!getDiagnosis((await params).slug)) notFound()
  return children
}

export default DiagnosisLayout
