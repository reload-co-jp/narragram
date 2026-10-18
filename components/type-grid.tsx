import { FC } from "react"
import Link from "next/link"
import type { AdventurerType } from "@/lib/diagnosis"
import { typePath } from "@/lib/diagnoses"

const css = `
.type-grid {
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 9.5rem), 1fr));
  list-style: none;
  padding: 0;
}
.type-card {
  background: var(--bg-2);
  border: 1px solid var(--panel-border);
  border-radius: 0.75rem;
  color: inherit;
  display: block;
  height: 100%;
  padding: 1rem 0.75rem;
  text-align: center;
  text-decoration: none;
  transition: border-color 0.2s ease, transform 0.2s ease;
}
.type-card:hover {
  border-color: var(--accent);
  color: inherit;
  transform: translateY(-2px);
}
.type-card img {
  height: auto;
  max-width: 6rem;
  width: 70%;
}
.type-card h3 {
  color: var(--accent);
  font-size: 1rem;
  margin-top: 0.5rem;
}
.type-card p {
  color: var(--muted);
  font-size: 0.8rem;
  line-height: 1.6;
  margin-top: 0.25rem;
}
`

export const TypeGrid: FC<{ slug: string; types: AdventurerType[] }> = ({
  slug,
  types,
}) => (
  <>
    <style href="type-grid" precedence="component">
      {css}
    </style>
    <ul className="type-grid">
      {types.map((type) => (
        <li key={type.id}>
          <Link href={typePath(slug, type.id)} className="type-card">
            <img
              src={type.image}
              alt=""
              width={96}
              height={96}
              loading="lazy"
            />
            <h3>{type.name}</h3>
            <p>{type.tagline}</p>
          </Link>
        </li>
      ))}
    </ul>
  </>
)
