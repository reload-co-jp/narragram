import { CSSProperties, FC } from "react"
import Link from "next/link"
import { diagnoses } from "@/lib/diagnoses"
import { guides } from "@/lib/guides"
import { DiagnosisCard } from "@/components/diagnosis-card"
import { TypeGrid } from "@/components/type-grid"

const css = `
.site-main:has(.home) {
  max-width: 64rem;
}
.home > section + section {
  border-top: 1px solid var(--panel-border);
  margin-top: 3rem;
  padding-top: 3rem;
}
.home h2 {
  font-size: clamp(1.3rem, 4vw, 1.6rem);
  margin-bottom: 1.25rem;
}
.home-hero {
  display: grid;
  gap: 1.25rem;
  padding-block: clamp(1rem, 6vh, 4rem) 0;
  text-align: center;
}
.home-hero h1 {
  font-size: clamp(1.8rem, 7vw, 3rem);
  letter-spacing: 0.04em;
}
.home-hero > p {
  margin-inline: auto;
  max-width: 34rem;
}
.home-hero .btn {
  justify-self: center;
  min-width: min(100%, 18rem);
}
.home-cards {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 22rem), 1fr));
}
.home-preview {
  display: grid;
  gap: 2rem;
}
.home-preview h3 {
  font-size: 1rem;
  margin-bottom: 0.75rem;
}
.home-steps {
  counter-reset: step;
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 15rem), 1fr));
  list-style: none;
  padding: 0;
}
.home-steps li {
  border-top: 2px solid var(--gold-dim);
  counter-increment: step;
  padding-top: 0.75rem;
}
.home-steps li::before {
  color: var(--gold);
  content: "0" counter(step);
  font-family: var(--font-serif);
  font-size: 1.4rem;
  font-weight: 700;
}
.home-steps h3 {
  font-size: 1.05rem;
}
.home-steps p,
.home-links {
  color: var(--muted);
  font-size: 0.9rem;
}
.home-links {
  display: grid;
  gap: 0.5rem;
  padding-left: 1.25rem;
}
`

// 現在の診断はすべて同じ問数・タイプ数。異なる診断を追加したら表現を見直す
const { bank, types, meta } = diagnoses[0]

const Page: FC = () => (
  <div className="home fade-in">
    <style href="home" precedence="page">
      {css}
    </style>

    <section className="home-hero" aria-labelledby="home-title">
      <p className="eyebrow">NARRATIVE DIAGNOSIS</p>
      <h1 id="home-title">
        物語の選択から、
        <br />
        あなたを読み解く。
      </h1>
      <p className="muted">
        異世界の冒険や、予定のない休日。物語の場面で「あなたならどうする？」を選んでいくと、選択の傾向からあなたのスタイルをタイプとして描き出します。
      </p>
      <ul className="badges" aria-label="診断の特徴">
        <li>登録不要</li>
        <li>
          {meta.estimate}・全{bank.items.length}問
        </li>
        <li>正解のない選択</li>
      </ul>
      <a href="#diagnoses" className="btn">
        診断を選ぶ
      </a>
    </section>

    <section id="diagnoses" aria-labelledby="diagnoses-heading">
      <h2 id="diagnoses-heading">診断を選ぶ</h2>
      <div className="home-cards">
        {diagnoses.map((d) => (
          <DiagnosisCard key={d.meta.slug} d={d} from="home" />
        ))}
      </div>
    </section>

    <section aria-labelledby="preview-heading">
      <h2 id="preview-heading">こんなタイプが待っています</h2>
      <div className="home-preview">
        {diagnoses.map(({ meta, types }) => (
          <div
            key={meta.slug}
            style={{ "--accent": meta.accent } as CSSProperties}
          >
            <h3>
              {meta.shortTitle}（全{types.length}タイプから）
            </h3>
            <TypeGrid slug={meta.slug} types={types.slice(0, 3)} />
          </div>
        ))}
      </div>
    </section>

    <section aria-labelledby="how-heading">
      <h2 id="how-heading">診断のしくみ</h2>
      <ol className="home-steps">
        <li>
          <h3>物語の場面を読む</h3>
          <p>
            短い場面が{bank.items.length}
            回登場します。登場人物になったつもりで読んでください。
          </p>
        </li>
        <li>
          <h3>2つの行動から選ぶ</h3>
          <p>
            どちらにも正解・不正解はありません。回答はブラウザ内だけで処理されます。
          </p>
        </li>
        <li>
          <h3>選択の傾向からタイプを判定</h3>
          <p>
            どの行動を多く選んだかで、{types.length}
            つのタイプのいずれかを表示します。タイプは物語上の分類で、心理学的に検証された類型ではありません。
          </p>
        </li>
      </ol>
    </section>

    <section aria-labelledby="learn-heading">
      <h2 id="learn-heading">診断の設計と、性格心理学の解説</h2>
      <p className="muted">
        設問は性格心理学の Big Five
        を参考に作っていますが、得点の妥当性は検証段階です。設計方針と根拠は「
        <Link href="/methods/">診断の設計と根拠</Link>
        」で公開しています。
      </p>
      <ul className="home-links">
        {guides.slice(0, 4).map((g) => (
          <li key={g.slug}>
            <Link href={`/guide/${g.slug}/`}>{g.title}</Link>
          </li>
        ))}
        <li>
          <Link href="/guide/">解説記事の一覧</Link>
        </li>
      </ul>
    </section>
  </div>
)

export default Page
