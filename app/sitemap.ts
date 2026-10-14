import type { MetadataRoute } from "next"
import { diagnoses } from "@/lib/diagnoses"
import { SITE_URL } from "@/lib/site"

export const dynamic = "force-static"

const sitemap = (): MetadataRoute.Sitemap => [
  { url: `${SITE_URL}/` },
  ...diagnoses.map((d) => ({ url: `${SITE_URL}/${d.meta.slug}/` })),
  { url: `${SITE_URL}/about/` },
]

export default sitemap
