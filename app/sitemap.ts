import type { MetadataRoute } from "next"
import { diagnoses } from "@/lib/diagnoses"
import { guides } from "@/lib/guides"
import { SITE_URL } from "@/lib/site"

export const dynamic = "force-static"

const sitemap = (): MetadataRoute.Sitemap => [
  { url: `${SITE_URL}/` },
  ...diagnoses.map((d) => ({ url: `${SITE_URL}/${d.meta.slug}/` })),
  { url: `${SITE_URL}/about/` },
  { url: `${SITE_URL}/methods/` },
  { url: `${SITE_URL}/guide/` },
  ...guides.map((g) => ({ url: `${SITE_URL}/guide/${g.slug}/` })),
]

export default sitemap
