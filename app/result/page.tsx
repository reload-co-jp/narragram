import { ClientOnly } from "@/components/client-only"
import { Result } from "@/components/result"

export const metadata = { title: "冒険の記録｜Narragram" }

const ResultPage = () => (
  <ClientOnly fallback={<p className="muted">読み込み中…</p>}>
    <Result />
  </ClientOnly>
)

export default ResultPage
