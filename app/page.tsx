import { CSSProperties, FC } from "react"
import Link from "next/link"
import { diagnoses } from "@/lib/diagnoses"
import { guides } from "@/lib/guides"
import { TrackedLink } from "@/components/tracked-link"
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
.home-spotlights {
  display: grid;
  gap: 2.5rem;
}
.spotlight {
  background:
    radial-gradient(
      ellipse 80% 70% at 0% 0%,
      color-mix(in srgb, var(--accent) 20%, transparent),
      transparent 70%
    ),
    var(--panel);
  border: 1px solid color-mix(in srgb, var(--accent) 40%, var(--panel-border));
  border-radius: 1.5rem;
  display: grid;
  gap: 2rem;
  padding: clamp(1.25rem, 5vw, 3rem);
}
.spotlight-intro {
  align-items: center;
  display: grid;
  gap: 1.5rem;
  justify-items: center;
  text-align: center;
}
.spotlight-intro > img {
  filter: drop-shadow(0 0.75rem 2rem color-mix(in srgb, var(--accent) 35%, transparent));
  height: auto;
  width: min(60%, 15rem);
}
.spotlight-body {
  display: grid;
  gap: 1rem;
}
.spotlight-num {
  color: var(--accent);
  font-family: var(--font-serif);
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1;
  opacity: 0.6;
}
.home .spotlight h2 {
  font-size: clamp(1.5rem, 5vw, 2.2rem);
  margin-bottom: 0;
}
.spotlight .badges li {
  border-color: color-mix(in srgb, var(--accent) 50%, transparent);
  color: var(--accent);
}
.spotlight-actions {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.5rem;
  justify-content: center;
}
.spotlight-actions .btn {
  min-width: min(100%, 16rem);
}
.spotlight h3 {
  font-size: 1rem;
  margin-bottom: 0.75rem;
}
@media (min-width: 48rem) {
  .spotlight-intro {
    grid-template-columns: 2fr 3fr;
    justify-items: start;
    text-align: start;
  }
  .spotlight-intro > img {
    justify-self: center;
    width: min(100%, 16rem);
  }
  .spotlight .badges,
  .spotlight-actions {
    justify-content: start;
  }
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

    <section id="diagnoses" className="home-spotlights" aria-label="診断一覧">
      {diagnoses.map(({ meta, bank, types }, i) => (
        <article
          key={meta.slug}
          className="spotlight"
          style={{ "--accent": meta.accent } as CSSProperties}
          aria-labelledby={`spotlight-${meta.slug}`}
        >
          <div className="spotlight-intro">
            <img
              src={meta.image}
              alt=""
              width={240}
              height={240}
              loading={i === 0 ? "eager" : "lazy"}
            />
            <div className="spotlight-body">
              <p className="spotlight-num" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </p>
              <p className="eyebrow">{meta.shortTitle}</p>
              <h2 id={`spotlight-${meta.slug}`}>{meta.title}</h2>
              <p className="muted">{meta.theme}</p>
              <ul className="badges" aria-label="診断の概要">
                <li>全{bank.items.length}問</li>
                <li>{meta.estimate}</li>
                <li>{types.length}タイプ</li>
              </ul>
              <div className="spotlight-actions">
                <TrackedLink
                  href={`/${meta.slug}/intro/`}
                  className="btn"
                  event={[
                    "diagnosis_card_clicked",
                    { diagnosis: meta.slug, from: "home" },
                  ]}
                >
                  {meta.startLabel}
                </TrackedLink>
                <Link href={`/${meta.slug}/`}>タイプ一覧と詳細</Link>
              </div>
            </div>
          </div>
          <div>
            <h3>こんなタイプが待っています（全{types.length}タイプから）</h3>
            <TypeGrid slug={meta.slug} types={types.slice(0, 3)} />
          </div>
        </article>
      ))}
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
