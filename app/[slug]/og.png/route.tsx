import { diagnoses, getDiagnosis } from "@/lib/diagnoses"
import { renderOg } from "@/lib/og"

export const dynamic = "force-static"
export const generateStaticParams = () =>
  diagnoses.map((d) => ({ slug: d.meta.slug }))

export const GET = async (
  _: Request,
  { params }: { params: Promise<{ slug: string }> }
) => {
  const { meta, bank } = getDiagnosis((await params).slug)!
  return renderOg({
    eyebrow: meta.shortTitle,
    title: meta.title,
    sub: `全${bank.items.length}問・${meta.estimate}・登録不要`,
    image: meta.image,
    accent: meta.accent,
  })
}
