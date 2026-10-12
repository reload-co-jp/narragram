"use client"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import itemBankJson from "@/data/items.json"
import rulesJson from "@/data/type-rules.json"
import typesJson from "@/data/adventurer-types.json"
import {
  assignType,
  ItemBank,
  sanitizeAnswers,
  TypeRules,
} from "@/lib/diagnosis"
import { loadProgress, Progress, saveProgress, saveResult } from "@/lib/session"
import { track } from "@/lib/analytics"

const bank = itemBankJson as ItemBank
const total = bank.items.length
const pad = (n: number) => String(n).padStart(2, "0")

const initialProgress = (): Progress => {
  const saved = loadProgress(bank.version)
  const index = Math.min(Math.max(Number(saved?.index) || 0, 0), total - 1)
  return {
    itemBankVersion: bank.version,
    index,
    answers: sanitizeAnswers(saved?.answers, bank),
  }
}

export const Quiz = () => {
  const router = useRouter()
  const [progress, setProgress] = useState(initialProgress)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const isFirstRender = useRef(true)
  const finished = useRef(false)
  const item = bank.items[progress.index]

  useEffect(() => {
    if (Object.keys(progress.answers).length === 0) track("quiz_started", {})
    // 初回のみ
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    saveProgress(progress)
  }, [progress])

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
      if (!finished.current) track("quiz_abandoned", { itemId: item.id })
    }
    window.addEventListener("pagehide", onLeave)
    return () => window.removeEventListener("pagehide", onLeave)
  }, [item])

  if (!item) {
    return (
      <div className="panel stack" role="alert">
        <p>設問データを読み込めませんでした。</p>
        <Link href="/">トップへ戻る</Link>
      </div>
    )
  }

  const selected = progress.answers[item.id]
  const isLast = progress.index === total - 1

  const select = (choiceId: string) => {
    setProgress((p) => ({
      ...p,
      answers: { ...p.answers, [item.id]: choiceId },
    }))
    track("question_answered", { itemId: item.id, choiceId })
  }

  const go = (delta: number) =>
    setProgress((p) => ({ ...p, index: p.index + delta }))

  const finish = () => {
    finished.current = true
    const result = assignType(
      progress.answers,
      bank,
      rulesJson as TypeRules,
      typesJson.types
    )
    saveResult({
      answers: progress.answers,
      result,
      completedAt: new Date().toISOString(),
    })
    saveProgress(null)
    track("quiz_completed", {
      typeId: result.primaryTypeId,
      ruleVersion: result.ruleVersion,
    })
    router.push("/result/")
  }

  return (
    <form
      className="stack"
      onSubmit={(e) => {
        e.preventDefault()
        if (!selected) return
        if (isLast) finish()
        else go(1)
      }}
    >
      <div className="progress-row">
        <span aria-hidden="true">
          {pad(progress.index + 1)} / {pad(total)}
        </span>
        <progress
          value={progress.index + 1}
          max={total}
          aria-label={`${total}問中${progress.index + 1}問目`}
        />
      </div>

      <div key={item.id} className="stack fade-in">
        <p className="eyebrow">SCENE {pad(progress.index + 1)}</p>
        <h1 ref={headingRef} tabIndex={-1}>
          {item.scene}
        </h1>
        <p>{item.prompt}</p>
        <fieldset className="choices">
          <legend className="muted" style={{ marginBottom: "0.75rem" }}>
            {item.question}
          </legend>
          {item.choices.map((choice) => (
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

      <div className="nav-row">
        <button
          type="button"
          className="btn btn-ghost"
          disabled={progress.index === 0}
          onClick={() => go(-1)}
        >
          戻る
        </button>
        <button type="submit" className="btn" disabled={!selected}>
          {isLast ? "結果を見る" : "次へ"}
        </button>
      </div>
    </form>
  )
}
