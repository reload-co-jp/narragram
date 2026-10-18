"use client"
import { ComponentProps } from "react"
import Link from "next/link"
import { track } from "@/lib/analytics"

type Props = ComponentProps<typeof Link> & {
  event: Parameters<typeof track>
}

// サーバーコンポーネントからクリック計測付きのリンクを置くための薄いラッパー
export const TrackedLink = ({ event, onClick, ...props }: Props) => (
  <Link
    {...props}
    onClick={(e) => {
      track(...event)
      onClick?.(e)
    }}
  />
)
