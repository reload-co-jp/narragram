import { FC, ReactNode } from "react"

export const Header: FC<{ children: ReactNode }> = ({ children }) => (
  <header className="site-header">{children}</header>
)

export const Main: FC<{ children: ReactNode }> = ({ children }) => (
  <main className="site-main">{children}</main>
)

export const Footer: FC<{ children: ReactNode }> = ({ children }) => (
  <footer className="site-footer">{children}</footer>
)
