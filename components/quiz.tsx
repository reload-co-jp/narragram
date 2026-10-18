"use client"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { assignType, sanitizeAnswers } from "@/lib/diagnosis"
import { Diagnosis, getDiagnosis } from "@/lib/diagnoses"
import { loadProgress, Progress, saveProgress, saveResult } from "@/lib/session"
import { track } from "@/lib/analytics"

const pad = (n: number) => String(n).padStart(2, "0")

const css = `
.progress {
  display: grid;
  gap: 0.5rem;
}
.progress-row {
  display: flex;
  font-size: 0.85rem;
  font-variant-numeric: tabular-nums;
  justify-content: space-between;
}
/* Safari は accent-color を無視するため、トラックと塗りを自前で描く */
.progress progress {
  appearance: none;
  background: var(--panel-border);
  border: 0;
  border-radius: 999px;
  height: 0.5rem;
  overflow: hidden;
  width: 100%;
}
.progress progress::-webkit-progress-bar {
  background: var(--panel-border);
}
.progress progress::-webkit-progress-value {
  background: linear-gradient(90deg, var(--accent), var(--gold));
  border-radius: 999px;
  transition: width 0.3s ease;
}
.progress progress::-moz-progress-bar {
  background: linear-gradient(90deg, var(--accent), var(--gold));
  border-radius: 999px;
}
.quiz-scene h1 {
  font-size: clamp(1.4rem, 5vw, 1.8rem);
}
.quiz-prompt {
  font-size: 1.05rem;
}
.choices {
  border: 0;
  counter-reset: choice;
  display: grid;
  gap: 0.75rem;
  padding: 0;
}
.choices legend {
  color: var(--muted);
  margin-bottom: 0.75rem;
}
.choice {
  align-items: center;
  background: var(--panel);
  border: 2px solid var(--panel-border);
  border-radius: 0.75rem;
  counter-increment: choice;
  cursor: pointer;
  display: flex;
  gap: 0.75rem;
  min-height: 4rem;
  padding: 1rem;
  transition: border-color 0.15s ease, background 0.15s ease;
}
.choice:hover {
  border-color: color-mix(in srgb, var(--accent) 60%, var(--panel-border));
}
/* ラジオボタンは視覚的に隠し、A/B のバッジで選択状態を示す */
.choice input {
  opacity: 0;
  position: absolute;
  pointer-events: none;
}
.choice::before {
  align-items: center;
  border: 1px solid var(--gold-dim);
  border-radius: 50%;
  color: var(--gold);
  content: counter(choice, upper-alpha);
  display: flex;
  flex: none;
  font-family: var(--font-serif);
  font-weight: 700;
  height: 2rem;
  justify-content: center;
  width: 2rem;
}
.choice:has(input:checked) {
  background: color-mix(in srgb, var(--accent) 14%, var(--panel));
  border-color: var(--accent);
}
.choice:has(input:checked)::before {
  background: var(--accent);
  border-color: var(--accent);
  color: var(--bg);
  content: "✓";
}
.choice:has(input:focus-visible) {
  outline: 3px solid var(--focus);
  outline-offset: 2px;
}
/* 片手で操作できるよう、戻る・次へは画面下に固定する */
.quiz-nav {
  background: linear-gradient(transparent, var(--bg) 30%);
  bottom: 0;
  padding-block: 1.5rem 0.75rem;
  position: sticky;
}
.quiz-restart {
  background: none;
  border: 0;
  color: var(--muted);
  cursor: pointer;
  font: inherit;
  font-size: 0.8rem;
  display: block;
  margin-inline: auto;
  padding: 0.5rem;
  text-decoration: underline;
}
`

const initialProgress = ({ meta, bank }: Diagnosis): Progress => {
  const total = bank.items.length
  const saved = loadProgress(meta.slug, bank.version)
  const index = Math.min(Math.max(Number(saved?.index) || 0, 0), total - 1)
  return {
    itemBankVersion: bank.version,
    index,
    answers: sanitizeAnswers(saved?.answers, bank),
    // 選択肢の順序効果（初頭効果）を相殺するため、設問ごとに表示順を無作為に反転する。
    // 再読み込みで順序が入れ替わらないよう進捗と一緒に保存する。
    reversed: Array.isArray(saved?.reversed)
      ? saved.reversed
      : bank.items.filter(() => Math.random() < 0.5).map((i) => i.id),
  }
}

export const Quiz = ({ slug }: { slug: string }) => {
  const diagnosis = getDiagnosis(slug)!
  const { bank, rules, types } = diagnosis
  const total = bank.items.length
  const router = useRouter()
  const [progress, setProgress] = useState(() => initialProgress(diagnosis))
  const [confirmRestart, setConfirmRestart] = useState(false)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const isFirstRender = useRef(true)
  const finished = useRef(false)
  const item = bank.items[progress.index]

  useEffect(() => {
    if (Object.keys(progress.answers).length === 0)
      track("quiz_started", { diagnosis: slug })
    // 初回のみ
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    saveProgress(slug, progress)
  }, [slug, progress])

  // 設問切り替え時、スクリーンリーダー向けに見出しへフォーカスを移す
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    headingRef.current?.focus()
  }, [progress.index])

  useEffect(() => {
    if (!item) return
    const onLeave = () => {
      if (!finished.current)
        track("quiz_abandoned", { diagnosis: slug, itemId: item.id })
    }
    window.addEventListener("pagehide", onLeave)
    return () => window.removeEventListener("pagehide", onLeave)
  }, [item, slug])

  if (!item) {
    return (
      <div className="panel stack" role="alert">
        <p>設問データを読み込めませんでした。</p>
        <Link href="/">トップへ戻る</Link>
      </div>
    )
  }

  const selected = progress.answers[item.id]
  const choices = progress.reversed?.includes(item.id)
    ? [...item.choices].reverse()
    : item.choices
  const isLast = progress.index === total - 1
  const answered = Object.keys(progress.answers).length
  const percent = Math.round((answered / total) * 100)

  const select = (choiceId: string) => {
    setProgress((p) => ({
      ...p,
      answers: { ...p.answers, [item.id]: choiceId },
    }))
    track("question_answered", { diagnosis: slug, itemId: item.id, choiceId })
  }

  const restart = () => {
    setConfirmRestart(false)
    setProgress({ ...progress, index: 0, answers: {} })
    track("quiz_started", { diagnosis: slug })
  }

  const go = (delta: number) =>
    setProgress((p) => ({ ...p, index: p.index + delta }))

  const finish = () => {
    finished.current = true
    const result = assignType(progress.answers, bank, rules, types)
    saveResult(slug, {
      answers: progress.answers,
      result,
      completedAt: new Date().toISOString(),
    })
    saveProgress(slug, null)
    track("quiz_completed", {
      diagnosis: slug,
      typeId: result.primaryTypeId,
      ruleVersion: result.ruleVersion,
    })
    router.push(`/${slug}/result/`)
  }

  return (
    <form
      className="stack"
      aria-label="診断の設問"
      onSubmit={(e) => {
        e.preventDefault()
        if (!selected) return
        if (isLast) finish()
        else go(1)
      }}
    >
      <style href="quiz" precedence="component">
        {css}
      </style>
      <div className="progress">
        <div className="progress-row" aria-hidden="true">
          <span>
            {pad(progress.index + 1)} / {pad(total)}
          </span>
          <span className="muted">
            {percent}% · 残り{total - answered}問
          </span>
        </div>
        <progress
          value={answered}
          max={total}
          aria-label={`${total}問中${progress.index + 1}問目、回答済み${answered}問`}
        />
      </div>

      <div key={item.id} className="stack fade-in quiz-scene">
        <p className="eyebrow">SCENE {pad(progress.index + 1)}</p>
        <h1 ref={headingRef} tabIndex={-1}>
          {item.scene}
        </h1>
        <p className="quiz-prompt">{item.prompt}</p>
        <fieldset className="choices">
          <legend>{item.question}</legend>
          {choices.map((choice) => (
            <label key={choice.id} className="choice">
              <input
                type="radio"
                name={item.id}
                value={choice.id}
                checked={selected === choice.id}
                onChange={() => select(choice.id)}
              />
              <span>{choice.text}</span>
            </label>
          ))}
        </fieldset>
      </div>

      <div className="nav-row quiz-nav">
        <button
          type="button"
          className="btn btn-ghost"
          disabled={progress.index === 0}
          onClick={() => go(-1)}
        >
          戻る
        </button>
        <button type="submit" className="btn" disabled={!selected}>
          {isLast ? "結果を見る" : "次の場面へ"}
        </button>
      </div>
      {answered > 0 &&
        (confirmRestart ? (
          <p
            role="group"
            aria-label="やり直しの確認"
            style={{ textAlign: "center", fontSize: "0.85rem" }}
          >
            回答をすべて消して最初に戻りますか？
            <button
              type="button"
              className="quiz-restart"
              style={{ display: "inline" }}
              onClick={restart}
            >
              最初に戻る
            </button>
            <button
              type="button"
              className="quiz-restart"
              style={{ display: "inline" }}
              onClick={() => setConfirmRestart(false)}
            >
              続ける
            </button>
          </p>
        ) : (
          <button
            type="button"
            className="quiz-restart"
            onClick={() => setConfirmRestart(true)}
          >
            最初からやり直す
          </button>
        ))}
    </form>
  )
}
