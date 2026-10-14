import Link from "next/link"

export const metadata = {
  title: "診断の設計と根拠｜Narragram",
  description:
    "Narragram の診断で利用している心理学・統計学の考え方と、その出典となる論文・法則の一覧。",
  alternates: { canonical: "/methods/" },
}

type Ref = { text: string; url?: string }

const methods: { heading: string; body: string[]; refs: Ref[] }[] = [
  {
    heading: "性格の捉え方：Big Five",
    body: [
      "性格特性の整理には、性格を開放性・誠実性・外向性・協調性・否定的情動性の5つの連続的な次元で捉える Big Five を参考にしています。因子名や下位特性は、15の下位特性を持つ BFI-2 と、その日本語版の検証研究に合わせています。",
      "ただし本サイトの設問は独自のもので、これらの尺度の項目ではありません。検証が済むまで Big Five の得点は算出・表示しません。",
    ],
    refs: [
      {
        text: "Soto, C. J., & John, O. P. (2017). The next Big Five Inventory (BFI-2). Journal of Personality and Social Psychology, 113(1), 117–143.",
        url: "https://doi.org/10.1037/pspp0000096",
      },
      {
        text: "Yoshino, S. et al. (2022). A validation of the Japanese adaptation of the Big Five Inventory-2. Frontiers in Psychology, 13, 924351.",
        url: "https://doi.org/10.3389/fpsyg.2022.924351",
      },
      {
        text: "並川努ほか (2012). Big Five尺度短縮版の開発と信頼性と妥当性の検討. 心理学研究, 83(2), 91–99.",
        url: "https://doi.org/10.4992/jjpsy.83.91",
      },
    ],
  },
  {
    heading: "二択（強制選択）形式",
    body: [
      "各場面は、どちらにも合理的な理由がある2つの行動から選ぶ形式です。「はい／いいえ」で答える形式に比べ、何にでも同意してしまう傾向の影響を受けにくい一方、強制選択にしただけで測定の妥当性が保証されるわけではないことがメタ分析で示されています。",
      "また、タイプごとの得点は同じ回答の中での相対的な比較（イプサティブな得点）なので、他の人の得点と比べる用途には使えません。そのためランキングや他ユーザーとの比較は行いません。",
    ],
    refs: [
      {
        text: "Salgado, J. F. et al. (2015). The validity of ipsative and quasi-ipsative forced-choice personality inventories for different occupational groups: A comprehensive meta-analysis. Journal of Occupational and Organizational Psychology, 88(4), 797–834.",
        url: "https://doi.org/10.1111/joop.12098",
      },
      {
        text: "Hicks, L. E. (1970). Some properties of ipsative, normative, and forced-choice normative measures. Psychological Bulletin, 74(3), 167–184.",
        url: "https://doi.org/10.1037/h0029780",
      },
    ],
  },
  {
    heading: "選択肢の表示順のランダム化（順序効果）",
    body: [
      "画面で先に示された選択肢が選ばれやすくなる「初頭効果」などの順序効果が知られています。本診断では設問ごとに選択肢の上下を無作為に入れ替え、特定の選択肢が表示位置のせいで有利にならないようにしています。表示順は回答途中の再読み込みでは変わりません。",
    ],
    refs: [
      {
        text: "Krosnick, J. A., & Alwin, D. F. (1987). An evaluation of a cognitive theory of response-order effects in survey measurement. Public Opinion Quarterly, 51(2), 201–219.",
        url: "https://doi.org/10.1086/269029",
      },
    ],
  },
  {
    heading: "冒険者タイプの判定：ラプラスの継起の法則",
    body: [
      "冒険者タイプの得点は、そのタイプに結びつく選択をした割合です。ただし設問によって関係するタイプの数が異なるため、単純な割合だと「1問中1問」のように根拠の少ないタイプが「5問中4問」のタイプより高くなってしまいます。",
      "そこで、ラプラスの継起の法則（ベイズ統計でいう一様な事前分布 Beta(1,1) の事後平均）を用い、得点を（一致した数＋1）÷（関係する設問数＋2）として計算しています。根拠が少ないほど得点が中間へ寄るため、より多くの選択に裏付けられたタイプが選ばれます。上位2タイプの差が小さい場合は「複合タイプ」として表示します。",
      "なお、冒険者タイプは物語上の分類で、心理学的に確立された類型ではありません。",
    ],
    refs: [
      {
        text: "Laplace, P.-S. (1814). Essai philosophique sur les probabilités. Paris: Courcier.",
      },
    ],
  },
  {
    heading: "未回答の扱い",
    body: [
      "未回答や採点対象外の設問は「0点」として扱わず、集計の分母から除外しています。回答していないことを特定の傾向の低さとみなさないためです。一定数以上の回答がない場合はタイプを判定しません。",
    ],
    refs: [],
  },
  {
    heading: "結果文の書き方：バーナム効果への配慮",
    body: [
      "誰にでも当てはまる曖昧な記述を「自分のことだ」と感じてしまう現象は、フォアラー効果（バーナム効果）として知られています。結果ページでは、一般的な性格描写だけでなく、あなたが実際に選んだ行動を言い換えて示し、選択と説明の対応が分かるようにしています。また「協調性が低い」のような断定的な表現は避けています。",
    ],
    refs: [
      {
        text: "Forer, B. R. (1949). The fallacy of personal validation: A classroom demonstration of gullibility. Journal of Abnormal and Social Psychology, 44(1), 118–123.",
        url: "https://doi.org/10.1037/h0059240",
      },
    ],
  },
  {
    heading: "今後の検証で用いる手法",
    body: [
      "設問を性格の測定に使えるか確かめるため、次の手順を予定しています。",
      "1. 認知インタビュー：少人数に設問を読んでもらい、どう解釈し、なぜその選択肢を選んだかを聞き取ります。",
      "2. 選択率の確認：一方の選択肢が85%以上選ばれる設問は、文言や場面設定を見直します（本プロジェクトの暫定基準）。",
      "3. 内的一貫性：同じ特性を狙った二択の設問がまとまって機能しているかを KR-20 で確認します。",
      "4. 基準尺度との比較：利用条件を確認した検証済みの日本語版 Big Five 尺度を同じ参加者に実施し、各設問の選択と因子得点の関連（点双列相関）を調べます。",
      "これらの基準を満たした設問だけを、段階的に Big Five の得点に用いる予定です。",
    ],
    refs: [
      {
        text: "Willis, G. B. (2005). Cognitive Interviewing: A Tool for Improving Questionnaire Design. Thousand Oaks, CA: Sage.",
      },
      {
        text: "Kuder, G. F., & Richardson, M. W. (1937). The theory of the estimation of test reliability. Psychometrika, 2(3), 151–160.",
        url: "https://doi.org/10.1007/BF02288391",
      },
    ],
  },
]

const MethodsPage = () => (
  <article className="stack">
    <h1>診断の設計と根拠</h1>
    <p>
      Narragram
      の診断で取り入れている心理学・統計学の考え方と、その出典を紹介します。いずれも「設計上の工夫」であり、診断結果の正確さを保証するものではありません。本診断はエンターテインメントであり、医療・臨床診断ではありません。
    </p>

    {methods.map((m) => (
      <section key={m.heading} className="stack">
        <h2>{m.heading}</h2>
        {m.body.map((p) => (
          <p key={p}>{p}</p>
        ))}
        {m.refs.length > 0 && (
          <ul className="muted">
            {m.refs.map((r) => (
              <li key={r.text}>
                {r.text}{" "}
                {r.url && (
                  <a href={r.url} target="_blank" rel="noopener noreferrer">
                    {r.url.replace("https://", "")}
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    ))}

    <p className="muted">
      論文の尺度項目は転載・改変していません。各文献の内容は原典をご確認ください。
    </p>
    <p>
      <Link href="/about/">この診断について・プライバシー</Link>
      {" ／ "}
      <Link href="/">トップへ戻る</Link>
    </p>
  </article>
)

export default MethodsPage
