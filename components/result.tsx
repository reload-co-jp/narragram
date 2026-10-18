"use client"
import { CSSProperties, useEffect, useState } from "react"
import Link from "next/link"
import {
  AdventurerType,
  chosenBehaviors,
  scoreBigFive,
  typeTally,
} from "@/lib/diagnosis"
import { diagnoses, Diagnosis, getDiagnosis, typePath } from "@/lib/diagnoses"
import { loadResult, saveResult, StoredResult } from "@/lib/session"
import { track } from "@/lib/analytics"
import { TypeHeader } from "./type-header"
import { TrackedLink } from "./tracked-link"

const css = `
.tally {
  display: grid;
  gap: 0.6rem;
  list-style: none;
  padding: 0;
}
.tally li {
  display: grid;
  gap: 0.25rem;
  font-size: 0.9rem;
}
.tally-row {
  display: flex;
  justify-content: space-between;
}
.tally-bar {
  background: var(--panel-border);
  border-radius: 999px;
  height: 0.4rem;
  overflow: hidden;
}
.tally-bar span {
  background: var(--accent);
  display: block;
  height: 100%;
}
.tally li[data-primary] .tally-row {
  color: var(--accent);
  font-weight: 700;
}
.share-card {
  border: 1px solid var(--panel-border);
  border-radius: 0.5rem;
  display: block;
  height: auto;
  width: 100%;
}
.share-actions {
  display: grid;
  gap: 0.5rem;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 10rem), 1fr));
}
.share-actions .btn {
  font-size: 0.95rem;
  padding-inline: 0.75rem;
}
.factor-list {
  display: grid;
  gap: 0.75rem;
  list-style: none;
  padding: 0;
}
.factor-list h3 {
  font-size: 1rem;
}
`

const Styles = () => (
  <style href="result" precedence="component">
    {css}
  </style>
)

const Notes = ({ versions }: { versions?: string }) => (
  <aside className="notice stack" aria-label="診断の性質と限界">
    <p>本診断はエンターテインメント目的です。医療・臨床診断ではありません。</p>
    <p>
      タイプは物語上の仮分類であり、心理学的に検証された類型ではありません。性格傾向の分析は研究・検証段階のもので、設問と採点の妥当性は確認されていません。
    </p>
    {versions && <p>{versions}</p>}
    <p>
      <Link href="/about/">この診断について</Link>
      {" / "}
      <Link href="/methods/">診断の設計と根拠</Link>
    </p>
  </aside>
)

/** 別の診断への導線 */
const OtherDiagnoses = ({ d }: { d: Diagnosis }) => {
  const others = diagnoses.filter((o) => o.meta.slug !== d.meta.slug)
  if (others.length === 0) return null
  return (
    <section className="stack" aria-labelledby="others-heading">
      <h2 id="others-heading">ほかの診断も試す</h2>
      {others.map((o) => (
        <div
          key={o.meta.slug}
          className="panel stack"
          style={{ "--accent": o.meta.accent } as CSSProperties}
        >
          <p className="eyebrow">{o.meta.shortTitle}</p>
          <h3>{o.meta.title}</h3>
          <p className="muted">{o.meta.theme}</p>
          <TrackedLink
            href={`/${o.meta.slug}/intro/`}
            className="btn"
            event={[
              "other_diagnosis_clicked",
              { diagnosis: d.meta.slug, from: d.meta.slug, to: o.meta.slug },
            ]}
          >
            {o.meta.startLabel}
          </TrackedLink>
        </div>
      ))}
    </section>
  )
}

const SharedView = ({ d, type }: { d: Diagnosis; type: AdventurerType }) => {
  useEffect(() => {
    track("result_viewed", {
      diagnosis: d.meta.slug,
      typeId: type.id,
      shared: true,
    })
  }, [d, type])
  return (
    <article className="stack fade-in">
      <TypeHeader type={type} label={`共有された結果｜${d.meta.shortTitle}`} />
      <section className="panel stack">
        <p>{type.description}</p>
        <p>
          <Link href={typePath(d.meta.slug, type.id)}>
            {type.name}タイプの特徴をくわしく見る
          </Link>
        </p>
      </section>
      <p style={{ textAlign: "center" }}>
        <Link href={`/${d.meta.slug}/intro/`} className="btn">
          自分も診断してみる
        </Link>
      </p>
      <Notes />
    </article>
  )
}

const ShareSection = ({ d, type }: { d: Diagnosis; type: AdventurerType }) => {
  const [message, setMessage] = useState("")
  const slug = d.meta.slug
  // 共有URLはタイプ別ページ。回答や因子情報は含めない。
  const path = typePath(slug, type.id)
  const url = `${location.origin}${path}`
  const text = `${d.meta.shortTitle}の結果は「${type.name}」でした。${type.tagline}`
  const xUrl = `https://x.com/intent/post?${new URLSearchParams({ text, url, hashtags: "Narragram" })}`

  const share = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: "Narragram", text, url })
        track("result_shared", {
          diagnosis: slug,
          typeId: type.id,
          method: "share",
        })
      } else {
        await navigator.clipboard.writeText(`${text} ${url}`)
        track("result_shared", {
          diagnosis: slug,
          typeId: type.id,
          method: "copy",
        })
        setMessage("共有用のテキストとURLをコピーしました")
      }
    } catch {
      setMessage("共有をキャンセルしました")
    }
  }

  return (
    <section className="panel stack" aria-labelledby="share-heading">
      <h2 id="share-heading">結果をシェアする</h2>
      <img
        src={`${path}og.png`}
        alt={`結果カード：${d.meta.shortTitle}の結果は「${type.name}」。${type.tagline}`}
        width={1200}
        height={630}
        loading="lazy"
        className="share-card"
      />
      <p className="muted" style={{ fontSize: "0.8rem" }}>
        共有されるのはタイプ名とタイプの紹介ページのみです。あなたの回答内容は含まれません。
      </p>
      <div className="share-actions">
        <a
          href={xUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn"
          onClick={() =>
            track("result_shared", {
              diagnosis: slug,
              typeId: type.id,
              method: "x",
            })
          }
        >
          Xでポスト
        </a>
        <button type="button" className="btn btn-ghost" onClick={share}>
          リンクを共有
        </button>
        <a
          href={`${path}og.png`}
          download={`narragram-${slug}-${type.id}.png`}
          className="btn btn-ghost"
          onClick={() =>
            track("result_card_saved", { diagnosis: slug, typeId: type.id })
          }
        >
          結果カードを保存
        </a>
      </div>
      <p role="status" className="muted" style={{ fontSize: "0.85rem" }}>
        {message}
      </p>
    </section>
  )
}

const OwnResultView = ({
  d,
  stored,
}: {
  d: Diagnosis
  stored: StoredResult
}) => {
  const { bank, rules, types, factors, meta } = d
  const { result, answers } = stored
  const type =
    types.find((t) => t.id === result.primaryTypeId) ??
    types.find((t) => t.id === rules.fallbackTypeId)!
  const secondary = result.secondaryTypeId
    ? types.find((t) => t.id === result.secondaryTypeId)
    : undefined
  const behaviors = chosenBehaviors(answers, bank)
  const tally = typeTally(answers, bank, rules)
  const tallyRows = types
    .filter((t) => tally[t.id])
    .sort((a, b) => tally[b.id] - tally[a.id])
  const factorScores = scoreBigFive(
    answers,
    bank,
    factors.map((f) => f.id)
  )

  useEffect(() => {
    track("result_viewed", {
      diagnosis: meta.slug,
      typeId: type.id,
      shared: false,
    })
  }, [meta.slug, type.id])

  return (
    <article className="stack fade-in">
      <TypeHeader
        type={type}
        label={
          result.isComposite && secondary
            ? `複合タイプ：${type.name} × ${secondary.name}`
            : meta.resultLabel
        }
      />

      <section className="panel stack">
        <h2>{meta.styleHeading}</h2>
        <p>{type.description}</p>
        {secondary && !result.isComposite && (
          <p className="muted">
            補助的な傾向として「{secondary.name}」に近い選択も見られました。
          </p>
        )}
      </section>

      <section className="panel stack">
        <h2>強み</h2>
        <ul>
          {type.strengths.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <h2>苦手になりやすい状況と、意識したいこと</h2>
        <ul>
          {type.watchouts.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </section>

      {tallyRows.length > 0 && (
        <section className="panel stack">
          <h2>あなたの選択に表れた傾向</h2>
          <p className="muted">
            {result.answeredCount}
            場面での選択が、どのタイプにつながる行動だったかの内訳です。タイプの判定は、タイプごとに関わる場面数の違いを考慮した割合で行うため、この順位と一致しないことがあります。
          </p>
          <ul className="tally">
            {tallyRows.map((t) => (
              <li key={t.id} data-primary={t.id === type.id || undefined}>
                <span className="tally-row">
                  <Link href={typePath(meta.slug, t.id)}>{t.name}</Link>
                  <span>{tally[t.id]}場面</span>
                </span>
                <span className="tally-bar" aria-hidden="true">
                  <span
                    style={{
                      width: `${(tally[t.id] / result.answeredCount) * 100}%`,
                    }}
                  />
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {behaviors.length > 0 && (
        <section className="panel stack">
          <h2>今回の選択に見られた行動</h2>
          <ul className="scene-list">
            {behaviors.map((b) => (
              <li key={b.itemId}>
                <span className="muted">{b.scene}</span>
                {b.behavior}
              </li>
            ))}
          </ul>
        </section>
      )}

      <ShareSection d={d} type={type} />

      <section className="panel stack">
        <h2>性格特性の5つの観点（参考）</h2>
        <p className="muted">
          心理学で広く用いられる Big Five
          の考え方を参考にしています。現在の設問は、各因子を測定できるかを検証している段階です。そのため、因子の得点や高低は表示していません。結果のタイプは、この5因子とは別の物語上の分類です。
        </p>
        <ul className="factor-list">
          {factors.map((f) => {
            const score = factorScores.find((s) => s.factorId === f.id)
            const scenes = bank.items
              .filter((i) => i.traitHypotheses.includes(f.id))
              .map((i) => i.scene)
            return (
              <li key={f.id}>
                <h3>
                  {f.name}
                  <span className="muted" style={{ fontSize: "0.8rem" }}>
                    {" "}
                    {f.en}
                  </span>
                </h3>
                <p style={{ fontSize: "0.9rem" }}>{f.description}</p>
                <p className="muted" style={{ fontSize: "0.8rem" }}>
                  {score && score.value !== null
                    ? `探索的な傾向：採点対象の${score.scoredItems}場面のうち、仮説上この因子に関連づけた選択が${Math.round(score.value * score.scoredItems)}場面ありました（未検証）。`
                    : `関連を検証中の場面：${scenes.join("、")}（得点には未使用）`}
                </p>
              </li>
            )
          })}
        </ul>
        <p className="muted" style={{ fontSize: "0.85rem" }}>
          タイプの着想元：{type.basis}（<Link href="/methods/#types">根拠</Link>
          ）
        </p>
      </section>

      <section className="stack" aria-labelledby="next-heading">
        <h2 id="next-heading">次はどうする？</h2>
        <div className="nav-row" style={{ flexWrap: "wrap" }}>
          <Link
            href={`/${meta.slug}/quiz/`}
            className="btn btn-ghost"
            onClick={() => saveResult(meta.slug, null)}
          >
            もう一度診断する
          </Link>
          <Link href={typePath(meta.slug, type.id)} className="btn btn-ghost">
            {type.name}タイプの解説
          </Link>
        </div>
        <p className="muted" style={{ fontSize: "0.9rem" }}>
          <Link href={`/${meta.slug}/#types-heading`}>
            {meta.shortTitle}の全{types.length}タイプを見る
          </Link>
          {" / "}
          <Link href="/#diagnoses">診断一覧へ戻る</Link>
        </p>
      </section>

      <OtherDiagnoses d={d} />

      <Notes
        versions={`設問 v${result.itemBankVersion} / タイプ判定ルール v${result.ruleVersion}・回答数 ${result.answeredCount}`}
      />
    </article>
  )
}

export const Result = ({ slug }: { slug: string }) => {
  const d = getDiagnosis(slug)!
  const sharedTypeId = new URLSearchParams(location.search).get("type")

  if (sharedTypeId !== null) {
    // 旧形式の共有URL（?type=）。存在しないIDは推測で別タイプを出さない
    const type = d.types.find((t) => t.id === sharedTypeId)
    return (
      <>
        <Styles />
        {type ? (
          <SharedView d={d} type={type} />
        ) : (
          <div className="panel stack" role="alert">
            <p>
              共有された結果が見つかりませんでした。URLが正しいかご確認ください。
            </p>
            <Link href={`/${slug}/`} className="btn">
              {d.meta.shortTitle}のタイプ一覧へ
            </Link>
          </div>
        )}
      </>
    )
  }

  const stored = loadResult(slug)
  if (!stored?.result) {
    return (
      <div className="panel stack" role="alert">
        <p>
          表示できる結果が見つかりませんでした。結果はこのタブの中だけに一時保存されます。
        </p>
        <Link href={`/${slug}/intro/`} className="btn">
          {d.meta.startLabel}
        </Link>
      </div>
    )
  }
  return (
    <>
      <Styles />
      <OwnResultView d={d} stored={stored} />
    </>
  )
}
