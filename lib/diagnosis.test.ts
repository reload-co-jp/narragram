import { describe, expect, it } from "vitest"
import {
  Answers,
  assignType,
  chosenBehaviors,
  FactorId,
  ItemBank,
  sanitizeAnswers,
  scoreBigFive,
  TypeRules,
} from "./diagnosis"
import { diagnoses, getDiagnosis } from "./diagnoses"

const { bank, rules, types } = getDiagnosis("dungeon")!
const factors: FactorId[] = [
  "openness",
  "conscientiousness",
  "extraversion",
  "agreeableness",
  "negativeEmotionality",
]
const all = (choiceId: string): Answers =>
  Object.fromEntries(bank.items.map((i) => [i.id, choiceId]))

describe("dungeon data", () => {
  it("has 15 candidate items, none counted in Big Five yet", () => {
    expect(bank.items).toHaveLength(15)
    expect(bank.items.every((i) => !i.scoring.includeInBigFiveScore)).toBe(true)
  })
})

describe.each(diagnoses.map((d) => [d.meta.slug, d] as const))(
  "data integrity: %s",
  (slug, { bank, rules, types }) => {
    it("slug is unique and URL-safe", () => {
      expect(slug).toMatch(/^[a-z0-9-]+$/)
      expect(diagnoses.filter((d) => d.meta.slug === slug)).toHaveLength(1)
    })

    it("item ids are unique", () => {
      const ids = bank.items.map((i) => i.id)
      expect(new Set(ids).size).toBe(ids.length)
    })

    it("rules only reference known items, choices and types", () => {
      const typeIds = new Set(types.map((t) => t.id))
      for (const [itemId, byChoice] of Object.entries(rules.weights)) {
        const item = bank.items.find((i) => i.id === itemId)
        expect(item, itemId).toBeDefined()
        for (const [choiceId, w] of Object.entries(byChoice)) {
          expect(item!.choices.map((c) => c.id)).toContain(choiceId)
          for (const t of Object.keys(w)) expect(typeIds.has(t), t).toBe(true)
        }
      }
      expect(typeIds.has(rules.fallbackTypeId)).toBe(true)
    })
  }
)

describe("sanitizeAnswers", () => {
  it("drops unknown item ids and choice ids", () => {
    expect(sanitizeAnswers({ O1: "A", ZZ: "A", C1: "X", E1: 3 }, bank)).toEqual(
      { O1: "A" }
    )
  })

  it("handles non-object input", () => {
    expect(sanitizeAnswers(null, bank)).toEqual({})
    expect(sanitizeAnswers("x", bank)).toEqual({})
  })
})

describe("assignType", () => {
  it("returns fallback for empty answers", () => {
    const r = assignType({}, bank, rules, types)
    expect(r.status).toBe("insufficient")
    expect(r.primaryTypeId).toBe("wanderer")
    expect(r.answeredCount).toBe(0)
  })

  it("returns fallback when too few answers (missing data)", () => {
    const r = assignType({ O1: "A", O2: "A", O3: "A" }, bank, rules, types)
    expect(r.status).toBe("insufficient")
    expect(r.primaryTypeId).toBe("wanderer")
  })

  it("ignores unknown ids instead of throwing", () => {
    const r = assignType({ ...all("A"), BOGUS: "A" }, bank, rules, types)
    expect(r.status).toBe("ok")
    expect(r.answeredCount).toBe(15)
  })

  it("returns fallback when no rules are configured", () => {
    const r = assignType(all("A"), bank, { ...rules, weights: {} }, types)
    expect(r.primaryTypeId).toBe("wanderer")
  })

  it("is deterministic and records versions", () => {
    const a = assignType(all("B"), bank, rules, types)
    const b = assignType(all("B"), bank, rules, types)
    expect(a).toEqual(b)
    expect(a.ruleVersion).toBe(rules.version)
    expect(a.itemBankVersion).toBe(bank.version)
  })

  it("marks exact ties as composite with deterministic order", () => {
    const tieRules: TypeRules = {
      ...rules,
      minAnsweredItems: 1,
      compositeThreshold: 0,
      weights: { O1: { A: { observer: 1, explorer: 1 }, B: {} } },
    }
    const r = assignType({ O1: "A" }, bank, tieRules, types)
    expect(r.isComposite).toBe(true)
    // types の並び順: explorer が observer より先
    expect(r.primaryTypeId).toBe("explorer")
    expect(r.secondaryTypeId).toBe("observer")
  })

  it("is not composite when the gap exceeds the threshold", () => {
    const r = assignType(
      { O1: "A", O2: "A", O3: "A", E3: "A", N1: "B" },
      bank,
      { ...rules, minAnsweredItems: 1, compositeThreshold: 0.1 },
      types
    )
    expect(r.primaryTypeId).toBe("explorer")
    // 5問すべて一致でも平滑化で (5+1)/(5+2)
    expect(r.scores.explorer).toBeCloseTo(6 / 7)
    expect(r.isComposite).toBe(false)
  })

  it("smoothing prefers more evidence over a single lucky match", () => {
    const obs = { A: { observer: 1 }, B: {} }
    const weights = {
      O1: { A: { explorer: 1 }, B: {} },
      O2: obs,
      O3: obs,
      C1: obs,
      C2: obs,
      E1: obs,
    }
    const answers = { O1: "A", O2: "A", O3: "A", C1: "A", C2: "A", E1: "B" }
    const base = {
      ...rules,
      minAnsweredItems: 1,
      compositeThreshold: 0,
      weights,
    }
    // 比率だけなら explorer 1/1 > observer 4/5
    expect(
      assignType(answers, bank, { ...base, smoothing: 0 }, types).primaryTypeId
    ).toBe("explorer")
    // 平滑化後は explorer 2/3 < observer 5/7
    expect(assignType(answers, bank, base, types).primaryTypeId).toBe(
      "observer"
    )
  })

  it("normalizes scores to 0..1", () => {
    const r = assignType(all("A"), bank, rules, types)
    for (const v of Object.values(r.scores)) {
      expect(v).toBeGreaterThanOrEqual(0)
      expect(v).toBeLessThanOrEqual(1)
    }
  })
})

describe("scoreBigFive", () => {
  it("scores nothing while every item is unvalidated", () => {
    const r = scoreBigFive(all("A"), bank, factors)
    expect(r.every((f) => f.value === null && f.scoredItems === 0)).toBe(true)
  })

  it("excludes unanswered items from the denominator", () => {
    const enabled: ItemBank = {
      ...bank,
      items: bank.items.map((i) =>
        i.scoring.keys
          ? { ...i, scoring: { ...i.scoring, includeInBigFiveScore: true } }
          : i
      ),
    }
    const [o, c] = scoreBigFive({ O1: "A" }, enabled, factors)
    expect(o).toEqual({ factorId: "openness", scoredItems: 1, value: 1 })
    expect(c).toEqual({
      factorId: "conscientiousness",
      scoredItems: 0,
      value: null,
    })
  })
})

describe("chosenBehaviors", () => {
  it("lists behaviors only for valid answers", () => {
    const r = chosenBehaviors({ O1: "B", ZZ: "A" }, bank)
    expect(r).toEqual([
      {
        itemId: "O1",
        scene: "古い石碑",
        behavior: "目的に照らして情報を取捨選択する",
      },
    ])
  })
})
