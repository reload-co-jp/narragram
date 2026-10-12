// 回答途中の一時保存（sessionStorage、ブラウザ内のみ。サーバーへ送信しない）
import type { Answers, TypeResult } from "./diagnosis"

const PROGRESS_KEY = "narragram:progress"
const RESULT_KEY = "narragram:result"

export type Progress = {
  itemBankVersion: string
  index: number
  answers: Answers
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
export const loadProgress = (itemBankVersion: string): Progress | null => {
  const p = read<Progress>(PROGRESS_KEY)
  return p?.itemBankVersion === itemBankVersion ? p : null
}
export const saveProgress = (p: Progress | null) => write(PROGRESS_KEY, p)
export const loadResult = () => read<StoredResult>(RESULT_KEY)
export const saveResult = (r: StoredResult | null) => write(RESULT_KEY, r)
