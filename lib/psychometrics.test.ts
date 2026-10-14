import { describe, expect, it } from "vitest"
import { choiceRates, kr20, pointBiserial } from "./psychometrics"
import { getDiagnosis } from "./diagnoses"

const { bank } = getDiagnosis("dungeon")!

describe("choiceRates", () => {
  it("flags skewed items and ignores missing/unknown answers", () => {
    const responses = [
      ...Array.from({ length: 9 }, () => ({ O1: "A", O2: "A" })),
      { O1: "A", O2: "B" },
      { O1: "Z" },
    ]
    const [o1, o2] = choiceRates(responses, bank)
    expect(o1).toMatchObject({ n: 10, rates: { A: 1, B: 0 }, skewed: true })
    expect(o2.rates.A).toBeCloseTo(0.9)
    expect(choiceRates(responses, bank)[2]).toMatchObject({
      n: 0,
      skewed: false,
    })
  })
})

describe("kr20", () => {
  it("is 1 for perfectly consistent items and null when undefined", () => {
    expect(
      kr20([
        [1, 1],
        [0, 0],
        [1, 1],
        [0, 0],
      ])
    ).toBeCloseTo(1)
    expect(
      kr20([
        [1, 1],
        [1, 1],
      ])
    ).toBeNull()
    expect(kr20([[1, 0]])).toBeNull()
  })

  it("matches a hand-computed value", () => {
    // p = [.75,.5,.25], Σpq = .625, 合計得点 [3,2,1,0] の分散 = 1.25
    const rows = [
      [1, 1, 1],
      [1, 1, 0],
      [1, 0, 0],
      [0, 0, 0],
    ]
    expect(kr20(rows)).toBeCloseTo(1.5 * (1 - 0.625 / 1.25))
  })
})

describe("pointBiserial", () => {
  it("returns Pearson r and handles degenerate input", () => {
    expect(pointBiserial([0, 0, 1, 1], [1, 2, 3, 4])).toBeCloseTo(0.894, 3)
    expect(pointBiserial([1, 1], [1, 2])).toBeNull()
    expect(pointBiserial([1], [1, 2])).toBeNull()
  })
})
