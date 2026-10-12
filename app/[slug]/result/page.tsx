import { ClientOnly } from "@/components/client-only"
import { Result } from "@/components/result"
import type { SlugParams } from "../layout"

const ResultPage = async ({ params }: SlugParams) => (
  <ClientOnly fallback={<p className="muted">読み込み中…</p>}>
    <Result slug={(await params).slug} />
  </ClientOnly>
)

export default ResultPage
