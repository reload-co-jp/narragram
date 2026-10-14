// 回答途中の一時保存（sessionStorage、ブラウザ内のみ。サーバーへ送信しない）
import type { Answers, TypeResult } from "./diagnosis"

// 診断ごとに保存領域を分ける
const progressKey = (slug: string) => `narragram:${slug}:progress`
const resultKey = (slug: string) => `narragram:${slug}:result`

export type Progress = {
  itemBankVersion: string
  index: number
  answers: Answers
  /** 選択肢の表示順を逆にした設問ID（順序効果の相殺用。採点には影響しない） */
  reversed?: string[]
}
export type StoredResult = {
  answers: Answers
  result: TypeResult
  completedAt: string
}

const read = <T>(key: string): T | null => {
  try {
    const raw = sessionStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

const write = (key: string, value: unknown) => {
  try {
    if (value === null) sessionStorage.removeItem(key)
    else sessionStorage.setItem(key, JSON.stringify(value))
  } catch {
    // プライベートモード等で保存できなくても診断は続行できる
  }
}

/** 設問バンクのバージョンが変わった進捗は破棄する */
export const loadProgress = (
  slug: string,
  itemBankVersion: string
): Progress | null => {
  const p = read<Progress>(progressKey(slug))
  return p?.itemBankVersion === itemBankVersion ? p : null
}
export const saveProgress = (slug: string, p: Progress | null) =>
  write(progressKey(slug), p)
export const loadResult = (slug: string) => read<StoredResult>(resultKey(slug))
export const saveResult = (slug: string, r: StoredResult | null) =>
  write(resultKey(slug), r)
