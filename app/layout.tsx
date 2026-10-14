import type { Metadata } from "next"
import { Noto_Sans_JP, Shippori_Mincho } from "next/font/google"
import Link from "next/link"
import { SITE_URL } from "@/lib/site"
import { Footer, Header, Main } from "@/components/elements/layout"
import "./reset.css"

const serif = Shippori_Mincho({
  weight: ["500", "700"],
  preload: false,
  variable: "--font-shippori",
})
const sans = Noto_Sans_JP({ preload: false, variable: "--font-noto" })

const title = "Narragram｜物語の選択から、あなたを読み解く"
const description =
  "物語の中で選んだ行動から、あなたのスタイルを描き出す診断集。登録不要。エンターテインメント目的の診断です。"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    title,
    description,
    siteName: "Narragram",
    locale: "ja_JP",
    type: "website",
  },
  twitter: { card: "summary" },
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
