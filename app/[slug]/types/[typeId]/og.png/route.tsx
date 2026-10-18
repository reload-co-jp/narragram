import { diagnoses, getDiagnosis, getType } from "@/lib/diagnoses"
import { renderOg } from "@/lib/og"

// タイプ別ページのOGP画像。結果ページの「結果カードを保存」でも同じ画像を使う
export const dynamic = "force-static"
export const generateStaticParams = () =>
  diagnoses.flatMap((d) =>
    d.types.map((t) => ({ slug: d.meta.slug, typeId: t.id }))
  )

export const GET = async (
  _: Request,
  { params }: { params: Promise<{ slug: string; typeId: string }> }
) => {
  const { slug, typeId } = await params
  const { meta } = getDiagnosis(slug)!
  const type = getType(slug, typeId)!
  return renderOg({
    eyebrow: `${meta.shortTitle}の結果`,
    title: type.name,
    sub: type.tagline,
    image: type.image,
    accent: meta.accent,
  })
}
