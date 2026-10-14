// パイロット調査（検証段階B・C）用の項目分析。純粋関数のみで、診断画面からは使わない。
// 判定基準は spec/personality_validation_review.docx §8 の暫定ルールに従う。
import { sanitizeAnswers, type Answers, type ItemBank } from "./diagnosis"

/** 一方の選択肢がこの割合以上なら文言・場面設定を再検討する（暫定基準） */
export const SKEW_THRESHOLD = 0.85

const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length
const variance = (xs: number[]) => {
  const m = mean(xs)
  return mean(xs.map((x) => (x - m) ** 2))
}

/** 設問ごとの選択率。未知ID・未回答は分母から除外する */
export const choiceRates = (responses: Answers[], bank: ItemBank) => {
  const clean = responses.map((r) => sanitizeAnswers(r, bank))
  return bank.items.map((item) => {
    const picked = clean.map((r) => r[item.id]).filter(Boolean)
    const rates = Object.fromEntries(
      item.choices.map((c) => [
        c.id,
        picked.length
          ? picked.filter((p) => p === c.id).length / picked.length
          : 0,
      ])
    )
    return {
      itemId: item.id,
      n: picked.length,
      rates,
      skewed: Object.values(rates).some((r) => r >= SKEW_THRESHOLD),
    }
  })
}

/**
 * KR-20（Kuder & Richardson, 1937）。二値項目の内的一貫性。
 * rows = 回答者、columns = 項目（0/1）。欠損のない行列を渡すこと。
 */
export const kr20 = (rows: number[][]): number | null => {
  const k = rows[0]?.length ?? 0
  if (rows.length < 2 || k < 2) return null
  const pq = Array.from({ length: k }, (_, j) => {
    const p = mean(rows.map((r) => r[j]))
    return p * (1 - p)
  }).reduce((a, b) => a + b, 0)
  const total = variance(rows.map((r) => r.reduce((a, b) => a + b, 0)))
  return total > 0 ? (k / (k - 1)) * (1 - pq / total) : null
}

/** 点双列相関（= 二値変数と連続変数のピアソン相関）。基準尺度得点との関連を見る */
export const pointBiserial = (
  binary: number[],
  scores: number[]
): number | null => {
  if (binary.length !== scores.length || binary.length < 2) return null
  const mx = mean(binary)
  const my = mean(scores)
  const cov = mean(binary.map((x, i) => (x - mx) * (scores[i] - my)))
  const sd = Math.sqrt(variance(binary) * variance(scores))
  return sd > 0 ? cov / sd : null
}
