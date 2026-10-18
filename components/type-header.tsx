import { FC } from "react"
import type { AdventurerType } from "@/lib/diagnosis"

const css = `
.type-hero {
  display: grid;
  gap: 0.5rem;
  justify-items: center;
  padding-block: 0.5rem 1rem;
  text-align: center;
}
.type-hero img {
  filter: drop-shadow(0 0 2rem color-mix(in srgb, var(--accent) 35%, transparent));
  height: auto;
  width: 9rem;
}
.type-hero h1 {
  font-size: clamp(2rem, 8vw, 2.6rem);
  letter-spacing: 0.06em;
}
.type-hero-tagline {
  color: var(--gold);
  font-family: var(--font-serif);
  font-size: 1.1rem;
}
.scene-list {
  display: grid;
  gap: 0.5rem;
  list-style: none;
  padding: 0;
}
.scene-list li {
  background: var(--bg-2);
  border-left: 3px solid var(--accent);
  border-radius: 0.25rem;
  display: grid;
  padding: 0.5rem 0.75rem;
}
.scene-list .muted {
  font-size: 0.75rem;
}
`

export const TypeHeader: FC<{ type: AdventurerType; label: string }> = ({
  type,
  label,
}) => (
  <header className="type-hero">
    <style href="type-header" precedence="component">
      {css}
    </style>
    <p className="eyebrow">{label}</p>
    <img src={type.image} alt="" width={144} height={144} />
    <h1>{type.name}</h1>
    <p className="type-hero-tagline">{type.tagline}</p>
  </header>
)
