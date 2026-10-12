import Link from "next/link"

export const metadata = { title: "プロローグ｜Narragram" }

const IntroPage = () => (
  <article className="stack fade-in">
    <p className="eyebrow">PROLOGUE</p>
    <h1>目覚めると、そこは見知らぬ世界だった。</h1>
    <p>
      石造りの広間に、淡く光る魔法陣。気づけばあなたは、冒険者として新しい生を受けていた。
      目の前には、まだ誰も踏破していないダンジョンの入口が口を開けている。
    </p>
    <p>
      これから出会う場面で、あなたならどう動くかを選んでください。どちらの選択肢にも
      <strong>正解・不正解はありません</strong>。直感で選んで大丈夫です。
    </p>
    <p className="notice">
      回答はこのブラウザ内でのみ処理され、サーバーには送信・保存されません。途中の進行状況はタブを閉じると消えます。
      本診断はエンターテインメント目的で、設問と採点は検証段階です。
    </p>
    <hr className="ornament" />
    <p style={{ textAlign: "center" }}>
      <Link href="/quiz/" className="btn">
        ダンジョンへ踏み出す
      </Link>
    </p>
  </article>
)

export default IntroPage
