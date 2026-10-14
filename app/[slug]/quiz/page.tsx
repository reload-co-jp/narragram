import { ClientOnly } from "@/components/client-only"
import { Quiz } from "@/components/quiz"
import type { SlugParams } from "../layout"

export const metadata = { robots: { index: false } }

const QuizPage = async ({ params }: SlugParams) => (
  <ClientOnly fallback={<p className="muted">読み込み中…</p>}>
    <Quiz slug={(await params).slug} />
  </ClientOnly>
)

export default QuizPage
