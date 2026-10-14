import type { ReactNode } from "react"
import Link from "next/link"
import { diagnoses } from "@/lib/diagnoses"

export const metadata = {
  title: "診断の設計と根拠｜Narragram",
  description:
    "Narragram の診断で利用している心理学・統計学の考え方と、その出典となる論文・法則の一覧。",
  alternates: { canonical: "/methods/" },
}

type Ref = { text: string; url?: string }

const methods: {
  id?: string
  heading: string
  body: string[]
  extra?: ReactNode
  refs: Ref[]
}[] = [
  {
    heading: "性格の捉え方：Big Five",
    body: [
      "性格特性の整理には、性格を開放性・誠実性・外向性・協調性・否定的情動性の5つの連続的な次元で捉える Big Five を参考にしています。因子名や下位特性は、15の下位特性を持つ BFI-2 と、その日本語版の検証研究に合わせています。",
      "ただし本サイトの設問は独自のもので、これらの尺度の項目ではありません。検証が済むまで Big Five の得点は算出・表示しません。",
    ],
    refs: [
      {
        text: "Goldberg, L. R. (1990). An alternative “description of personality”: The Big-Five factor structure. Journal of Personality and Social Psychology, 59(6), 1216–1229.",
        url: "https://doi.org/10.1037/0022-3514.59.6.1216",
      },
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
    id: "types",
    heading: "性格分類（冒険者タイプ）の考え方",
    body: [
      "心理学では、人を少数の「型」に分けるタイプ論よりも、各特性の強さを連続的な量として捉える特性論が主流です。MBTI のような型による分類は、同じ人が再受検で別の型になりやすいことなどが指摘されており、その内容の多くは Big Five の特性で説明できることも示されています。",
      "一方、大規模データから性格特性の組み合わせを分析し、比較的よく現れるパターン（プロトタイプ）を見いだす研究もあります。ただし、そうした型でも人ははっきり分かれるわけではなく、型の境目付近にいる人が多数います。",
      "本診断の冒険者タイプは、データから導いた型ではなく、BFI-2 の下位特性を着想元にした物語上の分類です。人が型の間にいることを前提に、上位2タイプが近い場合は「複合タイプ」、差がある場合も「補助的な傾向」として2番目のタイプを示します。各タイプの着想元は次のとおりです。",
    ],
    extra: diagnoses.map((d) => (
      <dl key={d.meta.slug}>
        {d.types.map((t) => (
          <div key={t.id}>
            <dt>{t.name}</dt>
            <dd>{t.basis}</dd>
          </div>
        ))}
      </dl>
    )),
    refs: [
      {
        text: "McCrae, R. R., & Costa, P. T., Jr. (1989). Reinterpreting the Myers-Briggs Type Indicator from the perspective of the five-factor model of personality. Journal of Personality, 57(1), 17–40.",
        url: "https://doi.org/10.1111/j.1467-6494.1989.tb00759.x",
      },
      {
        text: "Pittenger, D. J. (2005). Cautionary comments regarding the Myers-Briggs Type Indicator. Consulting Psychology Journal: Practice and Research, 57(3), 210–221.",
        url: "https://doi.org/10.1037/1065-9293.57.3.210",
      },
      {
        text: "Asendorpf, J. B., Borkenau, P., Ostendorf, F., & van Aken, M. A. G. (2001). Carving personality description at its joints: Confirmation of three replicable personality prototypes for both children and adults. European Journal of Personality, 15(3), 169–198.",
        url: "https://doi.org/10.1002/per.408",
      },
      {
        text: "Gerlach, M., Farb, B., Revelle, W., & Nunes Amaral, L. A. (2018). A robust data-driven approach identifies four personality types across four large data sets. Nature Human Behaviour, 2, 735–742.",
        url: "https://doi.org/10.1038/s41562-018-0419-z",
      },
    ],
  },
  {
    heading: "物語の場面での選択から性格を見る",
    body: [
      "オンラインゲームでのプレイ行動と、本人が回答した Big Five の得点に関連が見られたという研究があり、ゲーム内の行動に性格が表れうることが示されています。ゲーム形式の診断と自己回答式の質問紙を比べたメタ分析でも、両者に中程度の対応が見られました。ただし研究ごとのばらつきは大きく、ゲーム形式であれば質問紙と同じように測れるとは言えません。",
      "また、人の行動は特性だけでなく状況によっても大きく変わります。特性は「その人が取りやすい行動の分布」として表れるという考え方から、本診断では1つの選択で性格を判断せず、同じ傾向を狙った複数の場面での選択をまとめて扱い、結果も「今回の選択では」という形で示しています。",
    ],
    refs: [
      {
        text: "Yee, N., Ducheneaut, N., Nelson, L., & Likarish, P. (2011). Introverted elves & conscientious gnomes: The expression of personality in World of Warcraft. Proceedings of the SIGCHI Conference on Human Factors in Computing Systems, 753–762.",
        url: "https://doi.org/10.1145/1978942.1979052",
      },
      {
        text: "Fadillah, Hidayat, & Santoso (2025). Convergent validity of game-based assessment: A meta-analysis. International Journal of Serious Games, 12(4), 5–29.",
        url: "https://doi.org/10.17083/etxn7795",
      },
      {
        text: "Ramos-Villagrasa, P. J., & Fernández-del-Río, E. (2023). Predictive validity, applicant reactions, and influence of personal characteristics of a gamefully designed assessment. Journal of Work and Organizational Psychology, 39(3), 169–178.",
        url: "https://doi.org/10.5093/jwop2023a18",
      },
      {
        text: "Fleeson, W. (2001). Toward a structure- and process-integrated view of personality: Traits as density distributions of states. Journal of Personality and Social Psychology, 80(6), 1011–1027.",
        url: "https://doi.org/10.1037/0022-3514.80.6.1011",
      },
      {
        text: "Mischel, W., & Shoda, Y. (1995). A cognitive-affective system theory of personality. Psychological Review, 102(2), 246–268.",
        url: "https://doi.org/10.1037/0033-295X.102.2.246",
      },
    ],
  },
  {
    heading: "二択（強制選択）形式",
    body: [
      "各場面は、どちらにも合理的な理由がある2つの行動から選ぶ形式です。「はい／いいえ」で答える形式に比べ、何にでも同意してしまう傾向の影響を受けにくい一方、強制選択にしただけで測定の妥当性が保証されるわけではないことがメタ分析で示されています。",
      "また、タイプごとの得点は同じ回答の中での相対的な比較（イプサティブな得点）なので、他の人の得点と比べる用途には使えません。そのためランキングや他ユーザーとの比較は行いません。強制選択の回答から個人間で比較できる得点を推定する手法（サーストン型項目反応理論）もあり、検証が進んだ段階で導入を検討します。",
    ],
    refs: [
      {
        text: "Salgado, J. F., Anderson, N., & Táuriz, G. (2015). The validity of ipsative and quasi-ipsative forced-choice personality inventories for different occupational groups: A comprehensive meta-analysis. Journal of Occupational and Organizational Psychology, 88(4), 797–834.",
        url: "https://doi.org/10.1111/joop.12098",
      },
      {
        text: "Hicks, L. E. (1970). Some properties of ipsative, normative, and forced-choice normative measures. Psychological Bulletin, 74(3), 167–184.",
        url: "https://doi.org/10.1037/h0029780",
      },
      {
        text: "Brown, A., & Maydeu-Olivares, A. (2011). Item response modeling of forced-choice questionnaires. Educational and Psychological Measurement, 71(3), 460–502.",
        url: "https://doi.org/10.1177/0013164410375112",
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
      "4. 基準尺度との比較：利用条件を確認した検証済みの日本語版 Big Five 尺度（日本語版 BFI-2、Big Five 尺度短縮版、日本語版 TIPI など）を同じ参加者に実施し、各設問の選択と因子得点の関連（点双列相関）を調べます。",
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
      {
        text: "Gosling, S. D., Rentfrow, P. J., & Swann, W. B., Jr. (2003). A very brief measure of the Big-Five personality domains. Journal of Research in Personality, 37(6), 504–528.",
        url: "https://doi.org/10.1016/S0092-6566(03)00046-1",
      },
      {
        text: "Oshio, A., Abe, S., & Cutrone, P. (2012). Development, reliability, and validity of the Japanese version of Ten Item Personality Inventory (TIPI-J). The Japanese Journal of Personality, 21(1), 40–52.",
        url: "https://doi.org/10.2132/personality.21.40",
      },
      {
        text: "Toyomoto, R. et al. (2022). Validation of the Japanese Big Five Scale Short Form in a university student sample. Frontiers in Psychology, 13, 862646.",
        url: "https://doi.org/10.3389/fpsyg.2022.862646",
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
      <section key={m.heading} id={m.id} className="stack">
        <h2>{m.heading}</h2>
        {m.body.map((p) => (
          <p key={p}>{p}</p>
        ))}
        {m.extra}
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
