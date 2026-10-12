// 診断の登録簿。新しい診断は data/diagnoses/<slug>/ にJSONを置き、ここに1行追加する。
import dungeonMeta from "@/data/diagnoses/dungeon/meta.json"
import dungeonItems from "@/data/diagnoses/dungeon/items.json"
import dungeonRules from "@/data/diagnoses/dungeon/type-rules.json"
import dungeonTypes from "@/data/diagnoses/dungeon/adventurer-types.json"
import dungeonBigFive from "@/data/diagnoses/dungeon/big-five.json"
import type { AdventurerType, FactorId, ItemBank, TypeRules } from "./diagnosis"

export type DiagnosisMeta = typeof dungeonMeta

export type Diagnosis = {
  meta: DiagnosisMeta
  bank: ItemBank
  rules: TypeRules
  types: AdventurerType[]
  factors: { id: FactorId; name: string; en: string; description: string }[]
}

export const diagnoses: Diagnosis[] = [
  {
    meta: dungeonMeta,
    bank: dungeonItems as ItemBank,
    rules: dungeonRules as TypeRules,
    types: dungeonTypes.types,
    factors: dungeonBigFive.factors as Diagnosis["factors"],
  },
]

export const getDiagnosis = (slug: string) =>
  diagnoses.find((d) => d.meta.slug === slug)
