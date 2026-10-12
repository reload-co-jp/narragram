"use client"
import { useState } from "react"
import Link from "next/link"
import itemBankJson from "@/data/items.json"
import typesJson from "@/data/adventurer-types.json"
import bigFiveJson from "@/data/big-five.json"
import {
  AdventurerType,
  chosenBehaviors,
  FactorId,
  ItemBank,
  scoreBigFive,
} from "@/lib/diagnosis"
import { loadResult, saveResult, StoredResult } from "@/lib/session"
import { track } from "@/lib/analytics"

const bank = itemBankJson as ItemBank
const types: AdventurerType[] = typesJson.types
const factors = bigFiveJson.factors as {
  id: FactorId
  name: string
  en: string
  description: string
}[]

const findType = (id: string | null) =>
  types.find((t) => t.id === id) ?? types.find((t) => t.id === "wanderer")!

const TypeHeader = ({
  type,
  label,
}: {
  type: AdventurerType
  label: string
}) => (
  <header className="type-hero stack">
    <p className="eyebrow">{label}</p>
    <img src={type.image} alt="" width={144} height={144} />
    <h1>{type.name}</h1>
    <p style={{ color: "var(--gold)" }}>{type.tagline}</p>
  </header>
)

const Notes = ({ versions }: { versions?: string }) => (
  <aside className="notice stack" aria-label="診断の性質と限界">
    <p>本診断はエンターテインメント目的です。医療・臨床診断ではありません。</p>
    <p>
      冒険者タイプは物語上の仮分類であり、心理学的に検証された類型ではありません。性格傾向の分析は研究・検証段階のもので、設問と採点の妥当性は確認されていません。
    </p>
    {versions && <p>{versions}</p>}
    <p>
      <Link href="/about/">この診断について</Link>
    </p>
  </aside>
)

const SharedView = ({ type }: { type: AdventurerType }) => (
  <article className="stack fade-in">
    <TypeHeader type={type} label="共有された冒険スタイル" />
    <section className="panel">
      <p>{type.description}</p>
    </section>
    <p style={{ textAlign: "center" }}>
      <Link href="/intro/" className="btn">
        自分も冒険してみる
      </Link>
    </p>
    <Notes />
  </article>
)

const ShareButton = ({ typeId }: { typeId: string }) => {
  const [message, setMessage] = useState("")
  const share = async () => {
    // 共有URLにはタイプIDのみを含める。回答や因子情報は含めない。
    const url = `${location.origin}/result/?type=${encodeURIComponent(typeId)}`
    const text = `異世界での私の冒険スタイルは「${findType(typeId).name}」でした`
    try {
      if (navigator.share) {
        await navigator.share({ title: "Narragram", text, url })
        track("result_shared", { typeId, method: "share" })
      } else {
        await navigator.clipboard.writeText(`${text} ${url}`)
        track("result_shared", { typeId, method: "copy" })
        setMessage("共有用のURLをコピーしました")
      }
    } catch {
      setMessage("共有をキャンセルしました")
    }
  }
  return (
    <>
      <button type="button" className="btn btn-ghost" onClick={share}>
        結果を共有する
      </button>
      <p role="status" className="muted" style={{ fontSize: "0.85rem" }}>
        {message}
      </p>
    </>
  )
}

const OwnResultView = ({ stored }: { stored: StoredResult }) => {
  const { result, answers } = stored
  const type = findType(result.primaryTypeId)
  const secondary = result.secondaryTypeId
    ? types.find((t) => t.id === result.secondaryTypeId)
    : undefined
  const behaviors = chosenBehaviors(answers, bank)
  const factorScores = scoreBigFive(
    answers,
    bank,
    factors.map((f) => f.id)
  )

  return (
    <article className="stack fade-in">
      <TypeHeader
        type={type}
        label={
          result.isComposite && secondary
            ? `複合タイプ：${type.name} × ${secondary.name}`
            : "あなたの冒険者タイプ"
        }
      />

      <section className="panel stack">
        <h2>あなたの冒険スタイル</h2>
        <p>{type.description}</p>
        {secondary && !result.isComposite && (
          <p className="muted">
            補助的な傾向として「{secondary.name}」に近い選択も見られました。
          </p>
        )}
      </section>

      {behaviors.length > 0 && (
        <section className="panel stack">
          <h2>今回の選択に見られた行動</h2>
          <p className="muted">
            ダンジョンの各場面で、あなたは次のような行動を選びました。
          </p>
          <ul className="chip-list">
            {behaviors.map((b) => (
              <li key={b.itemId}>{b.behavior}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="panel stack">
        <h2>性格特性の5つの観点（参考）</h2>
        <p className="muted">
          心理学で広く用いられる Big Five
          の考え方を参考にしています。現在の設問は、各因子を測定できるかを検証している段階です。そのため、因子の得点や高低は表示していません。冒険者タイプは、この5因子とは別の物語上の分類です。
        </p>
        <ul className="factor-list">
          {factors.map((f) => {
            const score = factorScores.find((s) => s.factorId === f.id)
            const scenes = bank.items
              .filter((i) => i.traitHypotheses.includes(f.id))
              .map((i) => i.scene)
            return (
              <li key={f.id}>
                <h3 style={{ fontSize: "1rem" }}>
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
      </section>

      <section className="panel stack">
        <h2>冒険での強み</h2>
        <ul>
          {type.strengths.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <h2>状況によって意識したいこと</h2>
        <ul>
          {type.watchouts.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </section>

      <div className="nav-row">
        <Link
          href="/quiz/"
          className="btn btn-ghost"
          onClick={() => saveResult(null)}
        >
          診断をやり直す
        </Link>
        <div style={{ flex: 1, display: "grid" }}>
          <ShareButton typeId={type.id} />
        </div>
      </div>

      <Notes
        versions={`設問 v${result.itemBankVersion} / タイプ判定ルール v${result.ruleVersion}・回答数 ${result.answeredCount}`}
      />
    </article>
  )
}

export const Result = () => {
  const sharedTypeId = new URLSearchParams(location.search).get("type")
  if (sharedTypeId) return <SharedView type={findType(sharedTypeId)} />

  const stored = loadResult()
  if (!stored?.result) {
    return (
      <div className="panel stack" role="alert">
        <p>
          表示できる結果が見つかりませんでした。結果はこのタブの中だけに一時保存されます。
        </p>
        <Link href="/intro/" className="btn">
          冒険を始める
        </Link>
      </div>
    )
  }
  return <OwnResultView stored={stored} />
}
