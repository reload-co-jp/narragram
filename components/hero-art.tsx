// 装飾用：ダンジョン入口・魔法陣・冒険者のシルエット（既存作品の意匠は使わない）
export const HeroArt = () => (
  <svg viewBox="0 0 200 200" className="hero-art" aria-hidden="true">
    <defs>
      <radialGradient id="glow" cx="50%" cy="45%" r="50%">
        <stop offset="0%" stopColor="#5fd4c4" stopOpacity="0.55" />
        <stop offset="100%" stopColor="#5fd4c4" stopOpacity="0" />
      </radialGradient>
    </defs>
    <circle cx="100" cy="95" r="90" fill="url(#glow)" />
    <g fill="none" stroke="#d2b26a" strokeOpacity="0.7">
      <circle cx="100" cy="95" r="80" />
      <circle cx="100" cy="95" r="70" strokeDasharray="2 6" />
      <polygon points="100,25 161,130 39,130" />
      <polygon points="100,165 39,60 161,60" />
    </g>
    <path
      d="M65 180 V95 a35 35 0 0 1 70 0 V180 Z"
      fill="#0a0d1a"
      stroke="#8a7444"
      strokeWidth="3"
    />
    <path d="M75 180 V98 a25 25 0 0 1 50 0 V180 Z" fill="#13283a" />
    <g fill="#05070f">
      <circle cx="100" cy="128" r="7" />
      <path d="M90 180 l3-40 h14 l3 40 Z" />
      <path d="M108 142 l14 -24 l2 1 l-12 25 Z" />
    </g>
    <line x1="20" y1="180" x2="180" y2="180" stroke="#8a7444" />
  </svg>
)
