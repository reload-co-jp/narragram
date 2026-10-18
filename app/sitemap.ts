import type { MetadataRoute } from "next"
import { diagnoses, typePath } from "@/lib/diagnoses"
import { guides } from "@/lib/guides"
import { SITE_URL } from "@/lib/site"

export const dynamic = "force-static"

const sitemap = (): MetadataRoute.Sitemap => [
  { url: `${SITE_URL}/` },
  ...diagnoses.flatMap((d) => [
    { url: `${SITE_URL}/${d.meta.slug}/` },
    ...d.types.map((t) => ({
      url: `${SITE_URL}${typePath(d.meta.slug, t.id)}`,
    })),
  ]),
  { url: `${SITE_URL}/about/` },
  { url: `${SITE_URL}/methods/` },
  { url: `${SITE_URL}/guide/` },
  ...guides.map((g) => ({ url: `${SITE_URL}/guide/${g.slug}/` })),
]

export default sitemap
