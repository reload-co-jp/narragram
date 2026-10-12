// 計測イベント設計（spec 9章）。
// 現時点では外部送信しない。計測サービスを導入する場合はここだけを差し替え、プライバシーページを更新すること。
// 回答本文・個人を特定できる情報は payload に含めない。

type Events = {
  quiz_started: Record<string, never>
  question_answered: { itemId: string; choiceId: string }
  quiz_completed: { typeId: string; ruleVersion: string }
  quiz_abandoned: { itemId: string }
  result_shared: { typeId: string; method: "share" | "copy" }
}

export const track = <K extends keyof Events>(event: K, payload: Events[K]) => {
  if (process.env.NODE_ENV === "development") {
    console.debug("[track]", event, payload)
  }
}
