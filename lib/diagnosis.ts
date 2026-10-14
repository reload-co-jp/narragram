// 診断ロジック（純粋関数のみ）。
// 冒険者タイプ判定（物語上の演出）と Big Five 因子スコア（心理測定）は意図的に別関数・別データにしている。
// どちらも未検証の仮説に基づくため、結果を確定的な性格診断として扱わないこと。

export type FactorId =
  | "openness"
  | "conscientiousness"
  | "extraversion"
  | "agreeableness"
  | "negativeEmotionality"

export type Choice = {
  id: string
  text: string
  behavior: string
  hypothesis: string
}

export type Item = {
  id: string
  scene: string
  prompt: string
  question: string
  choices: Choice[]
  traitHypotheses: FactorId[]
  scoring: {
    status: "hypothesis" | "on_hold" | "excluded" | "validated"
    includeInBigFiveScore: boolean
    keys?: Record<string, number>
  }
}

export type ItemBank = { version: string; items: Item[] }

export type AdventurerType = {
  id: string
  name: string
  tagline: string
  description: string
  strengths: string[]
  watchouts: string[]
  image: string
  assignmentRuleVersion: string
}

export type TypeRules = {
  version: string
  minAnsweredItems: number
  /** ラプラス平滑化の擬似カウント α。0 で単純な比率 */
  smoothing: number
  compositeThreshold: number
  fallbackTypeId: string
  weights: Record<string, Record<string, Record<string, number>>>
}

/** itemId -> choiceId */
export type Answers = Record<string, string>

export type TypeResult = {
  status: "ok" | "insufficient"
  primaryTypeId: string
  secondaryTypeId: string | null
  isComposite: boolean
  scores: Record<string, number>
  answeredCount: number
  itemBankVersion: string
  ruleVersion: string
}

export type FactorScore = {
  factorId: FactorId
  /** 採点対象かつ回答済みの設問数。0なら得点なし */
  scoredItems: number
  /** 採点対象設問の平均キー値（0〜1）。採点対象がなければ null */
  value: number | null
}

const EPSILON = 1e-9

/** 未知の設問ID・選択肢IDを除外した回答を返す */
export const sanitizeAnswers = (answers: unknown, bank: ItemBank): Answers => {
  if (!answers || typeof answers !== "object") return {}
  const result: Answers = {}
  for (const item of bank.items) {
    const choiceId = (answers as Record<string, unknown>)[item.id]
    if (item.choices.some((c) => c.id === choiceId)) {
      result[item.id] = choiceId as string
    }
  }
  return result
}

/**
 * 冒険者タイプを判定する（仮ルール）。
 * 各タイプの得点 = (選んだ選択肢の重み合計 + α) / (回答済み設問で取り得た最大重み合計 + 2α)。
 * 設問ごとにタイプの出現回数が違っても偏らないよう正規化し、
 * ラプラスの継起の法則（Beta(α,α) 事前分布の事後平均）で根拠の少ないタイプを 0.5 側へ縮める。
 * 同点・僅差は複合タイプ、回答不足・ルール未設定は fallbackTypeId を返す。
 */
export const assignType = (
  rawAnswers: Answers,
  bank: ItemBank,
  rules: TypeRules,
  types: AdventurerType[]
): TypeResult => {
  const answers = sanitizeAnswers(rawAnswers, bank)
  const answeredCount = Object.keys(answers).length
  const candidateIds = types
    .map((t) => t.id)
    .filter((id) => id !== rules.fallbackTypeId)
  const earned: Record<string, number> = {}
  const possible: Record<string, number> = {}
  for (const id of candidateIds) earned[id] = possible[id] = 0

  for (const [itemId, choiceId] of Object.entries(answers)) {
    const itemWeights = rules.weights[itemId]
    if (!itemWeights) continue
    for (const id of candidateIds) {
      const max = Math.max(
        0,
        ...Object.values(itemWeights).map((w) => w[id] ?? 0)
      )
      possible[id] += max
      earned[id] += itemWeights[choiceId]?.[id] ?? 0
    }
  }

  const scores: Record<string, number> = {}
  const a = rules.smoothing
  for (const id of candidateIds) {
    scores[id] =
      possible[id] + 2 * a > 0 ? (earned[id] + a) / (possible[id] + 2 * a) : 0
  }
  // 同点時は types の並び順で決定的に並べる（sort は安定）
  const ranked = candidateIds
    .filter((id) => earned[id] > 0)
    .sort((a, b) => scores[b] - scores[a])

  const base = {
    scores,
    answeredCount,
    itemBankVersion: bank.version,
    ruleVersion: rules.version,
  }
  if (answeredCount < rules.minAnsweredItems || ranked.length === 0) {
    return {
      ...base,
      status: "insufficient",
      primaryTypeId: rules.fallbackTypeId,
      secondaryTypeId: null,
      isComposite: false,
    }
  }
  const [primary, secondary = null] = ranked
  const isComposite =
    secondary !== null &&
    scores[primary] - scores[secondary] <= rules.compositeThreshold + EPSILON
  return {
    ...base,
    status: "ok",
    primaryTypeId: primary,
    secondaryTypeId: secondary,
    isComposite,
  }
}

/**
 * Big Five 因子スコア（探索的）。
 * includeInBigFiveScore が true かつ keys がある設問のみ集計する。
 * 未回答・採点対象外は 0 点ではなく分母から除外する。
 */
export const scoreBigFive = (
  rawAnswers: Answers,
  bank: ItemBank,
  factorIds: FactorId[]
): FactorScore[] => {
  const answers = sanitizeAnswers(rawAnswers, bank)
  return factorIds.map((factorId) => {
    const values = bank.items
      .filter(
        (item) =>
          item.scoring.includeInBigFiveScore &&
          item.scoring.keys &&
          item.traitHypotheses.includes(factorId) &&
          answers[item.id] !== undefined
      )
      .map((item) => item.scoring.keys![answers[item.id]])
      .filter((v): v is number => typeof v === "number")
    return {
      factorId,
      scoredItems: values.length,
      value: values.length
        ? values.reduce((a, b) => a + b, 0) / values.length
        : null,
    }
  })
}

/** 選んだ選択肢の行動記述（性格の断定ではなく、選択の言い換え） */
export const chosenBehaviors = (rawAnswers: Answers, bank: ItemBank) => {
  const answers = sanitizeAnswers(rawAnswers, bank)
  return bank.items
    .filter((item) => answers[item.id])
    .map((item) => ({
      itemId: item.id,
      scene: item.scene,
      behavior: item.choices.find((c) => c.id === answers[item.id])!.behavior,
    }))
}
