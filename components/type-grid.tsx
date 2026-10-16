import { FC } from "react"
import type { AdventurerType } from "@/lib/diagnosis"

export const TypeGrid: FC<{ types: AdventurerType[] }> = ({ types }) => (
  <ul className="type-grid">
    {types.map((type) => (
      <li key={type.id} className="type-card">
        <img src={type.image} alt="" width={120} height={120} />
        <h3>{type.name}</h3>
        <p className="muted">{type.tagline}</p>
      </li>
    ))}
  </ul>
)
