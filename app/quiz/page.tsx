import { ClientOnly } from "@/components/client-only"
import { Quiz } from "@/components/quiz"

export const metadata = { title: "ダンジョン探索｜Narragram" }

const QuizPage = () => (
  <ClientOnly fallback={<p className="muted">読み込み中…</p>}>
    <Quiz />
  </ClientOnly>
)

export default QuizPage
