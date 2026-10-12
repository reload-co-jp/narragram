import Link from "next/link"
import { getDiagnosis } from "@/lib/diagnoses"
import type { SlugParams } from "../layout"

const IntroPage = async ({ params }: SlugParams) => {
  const { meta } = getDiagnosis((await params).slug)!
  return (
    <article className="stack fade-in">
      <p className="eyebrow">{meta.intro.eyebrow}</p>
      <h1>{meta.intro.heading}</h1>
      {meta.intro.paragraphs.map((p) => (
        <p key={p}>{p}</p>
      ))}
      <p className="notice">
        回答はこのブラウザ内でのみ処理され、サーバーには送信・保存されません。途中の進行状況はタブを閉じると消えます。
        本診断はエンターテインメント目的で、設問と採点は検証段階です。
      </p>
      <hr className="ornament" />
      <p style={{ textAlign: "center" }}>
        <Link href={`/${meta.slug}/quiz/`} className="btn">
          {meta.intro.cta}
        </Link>
      </p>
    </article>
  )
}

export default IntroPage
