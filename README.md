# Narragram

異世界転生・ダンジョン型の冒険スタイル診断（MVP）。仕様は `spec/coding_agent.md`。

> 冒険者タイプはエンターテインメント上の仮分類です。Big Five を参考にしていますが、設問と採点は**未検証**です。医療・臨床診断ではありません。

## 起動

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm test       # Vitest
pnpm lint
pnpm typecheck
pnpm build      # 静的書き出し（/out）。main への push で GitHub Pages にデプロイ
```

## 構成

```
app/
  page.tsx                 トップ（診断一覧）
  [slug]/page.tsx          各診断のトップ
  [slug]/intro/page.tsx    導入
  [slug]/quiz/page.tsx     診断（1画面1問）
  [slug]/result/page.tsx   結果（?type=<id> で共有ビュー）
  about/page.tsx           この診断について・プライバシー
components/                quiz.tsx / result.tsx など
lib/diagnoses.ts           診断の登録簿
lib/diagnosis.ts           判定ロジック（純粋関数）とテスト
lib/session.ts             sessionStorage での一時保存（診断ごとに別キー）
lib/analytics.ts           計測イベント定義（現在は外部送信なし）
data/diagnoses/<slug>/     診断ごとのデータ（下記）
public/diagnoses/<slug>/   診断ごとの画像（仮のSVG）
```

回答はブラウザ内でのみ処理し、サーバーへ送信しません。共有URLに含まれるのはタイプIDのみです。

## 診断を追加する

1. `data/diagnoses/<slug>/` に `meta.json`・`items.json`・`type-rules.json`・`adventurer-types.json`・`big-five.json` を置く（`dungeon` をコピーして編集）。`slug` は英小文字・数字・ハイフン。
2. 画像を `public/diagnoses/<slug>/` に置く。
3. `lib/diagnoses.ts` の `diagnoses` 配列に登録する。
4. `pnpm test`（全診断のデータ整合性を検査）→ `pnpm build`。

トップの一覧と `/<slug>/` 以下のページは登録内容から自動生成されます。`meta.json` には一覧カード・診断トップ・導入文・結果見出しの文言を書きます。

以下、パスは `data/diagnoses/dungeon/` を例にします。

## 設問の編集 — `data/diagnoses/<slug>/items.json`

- `items[]` の順に出題されます。`id` は採点ルール・保存データと紐づくため、文面を変えても安易に変更しないでください。
- `scene`（場面タイトル）、`prompt`（状況）、`question`、`choices[].text` が画面表示。
- `choices[].behavior` は結果画面「今回の選択に見られた行動」に出る行動記述。性格の断定表現にしないこと。
- `choices[].hypothesis`、`traitHypotheses`、`facet`、`risk`、`scoring.note` は `spec/item_bank.csv` 由来の**仮説**メモ。
- 設問を変えたら `version` を上げてください。バージョンが変わると、途中保存された進捗は破棄されます。

## Big Five 採点の変更 — `data/diagnoses/<slug>/items.json` の `scoring`

- `status`: `hypothesis`（採点案あり）/ `on_hold`（保留）/ `excluded`（得点に使わない）/ `validated`
- `includeInBigFiveScore`: **現在は全問 `false`**。そのため因子得点は計算されず、結果画面には因子の説明のみが表示されます。
- `keys`: 選択肢ごとのキー値（例 `{"A": 1, "B": 0}`）。`includeInBigFiveScore: true` かつ `keys` がある設問のみ集計され、未回答は分母から除外されます。
- 検証（基準尺度との比較など）の根拠なしに `true` にしないこと。`true` にしても結果画面は「探索的な傾向」として件数のみを表示し、偏差値・百分率は出しません。
- 因子名・説明は `data/diagnoses/<slug>/big-five.json`。

## 冒険者タイプの編集 — `data/diagnoses/<slug>/adventurer-types.json`

`id`, `name`, `tagline`, `description`, `strengths`, `watchouts`, `image`, `assignmentRuleVersion`。画像は `public/` 以下に置き、`image` にパスを書きます。`wanderer` は回答不足時のフォールバックで、削除しないでください（`type-rules.json` の `fallbackTypeId`）。

## タイプ判定ルールの変更 — `data/diagnoses/<slug>/type-rules.json`

Big Five とは独立した、物語演出用の仮ルールです。

- `weights[設問ID][選択肢ID] = { タイプID: 重み }`
- タイプ得点 = 選んだ重みの合計 ÷ 回答済み設問で取り得た最大重みの合計（0〜1）。タイプごとの出題数の偏りを打ち消します。
- 1位と2位の差が `compositeThreshold` 以下なら複合タイプ（同点時は `adventurer-types.json` の並び順で決定）。
- 回答数が `minAnsweredItems` 未満、またはルール未設定なら `fallbackTypeId`。
- ルールを変えたら `version` を上げてください。結果には設問・ルールのバージョンが保存・表示されます。
- 変更後は `pnpm test` を実行（未知のID参照はテストで検出されます）。

## 計測

`lib/analytics.ts` に `quiz_started` / `question_answered` / `quiz_completed` / `quiz_abandoned` / `result_shared` を定義済み。現在は開発時の `console.debug` のみで外部送信しません。サービスを導入する場合はこのファイルを差し替え、`app/about/page.tsx` のプライバシー記載を更新してください。
