import { Noto_Sans_JP, Shippori_Mincho } from "next/font/google"
import Link from "next/link"
import { Footer, Header, Main } from "@/components/elements/layout"
import "./reset.css"

const serif = Shippori_Mincho({
  weight: ["500", "700"],
  preload: false,
  variable: "--font-shippori",
})
const sans = Noto_Sans_JP({ preload: false, variable: "--font-noto" })

export const metadata = {
  title: "Narragram｜物語の選択から、あなたを読み解く",
  description:
    "物語の中で選んだ行動から、あなたのスタイルを描き出す診断集。登録不要。エンターテインメント目的の診断です。",
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="ja" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <Header>
          <Link href="/" className="site-logo">
            NARRAGRAM
          </Link>
        </Header>
        <Main>{children}</Main>
        <Footer>
          <nav aria-label="サイト情報">
            <Link href="/about/">この診断について・プライバシー</Link>
          </nav>
          <p>
            エンターテインメント目的の診断です。医療・臨床診断ではありません。
          </p>
        </Footer>
      </body>
    </html>
  )
}
export default RootLayout
