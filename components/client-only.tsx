"use client"
import { ReactNode, useSyncExternalStore } from "react"

const subscribe = () => () => {}

// sessionStorage を使う画面は静的書き出し時に描画できないため、ブラウザでのみ描画する
export const ClientOnly = ({
  children,
  fallback = null,
}: {
  children: ReactNode
  fallback?: ReactNode
}) => {
  const isClient = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  )
  return isClient ? children : fallback
}
