import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { Footer, Header, Main } from "./layout"

describe("Header", () => {
  it("renders children inside a header element", () => {
    render(
      <Header>
        <span>content</span>
      </Header>
    )
    const header = screen.getByText("content").closest("header")
    expect(header).not.toBeNull()
  })
})

describe("Main", () => {
  it("renders children inside a main element", () => {
    render(
      <Main>
        <span>body</span>
      </Main>
    )
    expect(screen.getByRole("main")).toHaveTextContent("body")
  })
})

describe("Footer", () => {
  it("renders children inside a footer element", () => {
    render(
      <Footer>
        <p>&copy; My organization</p>
      </Footer>
    )
    expect(screen.getByText("© My organization")).toBeInTheDocument()
  })
})
