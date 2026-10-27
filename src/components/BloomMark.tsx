type BloomMarkProps = {
  className?: string
}

export function BloomMark({ className = '' }: BloomMarkProps) {
  return (
    <svg
      className={`bloom-mark ${className}`.trim()}
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <g stroke="currentColor" strokeWidth="0.85" strokeLinecap="round">
        <path d="M60 60C45 44 43 27 54 11c13 14 17 31 6 49Z" />
        <path d="M60 60c14-17 31-21 47-12-12 15-28 21-47 12Z" />
        <path d="M60 60c18 10 24 26 18 43-17-9-24-24-18-43Z" />
        <path d="M60 60C48 76 31 83 14 76c10-17 26-24 46-16Z" />
        <path d="M60 60C43 56 32 43 34 25c18 4 29 16 26 35Z" />
        <path d="M60 60c2-19 13-31 32-33-1 19-12 32-32 33Z" />
        <path d="M60 60c19 4 29 17 28 36-18-6-28-18-28-36Z" />
        <path d="M60 60c-17 9-33 7-45-5 12-13 28-14 45 5Z" />
      </g>
      <circle cx="60" cy="60" r="4.5" stroke="currentColor" strokeWidth="0.85" />
      <circle cx="60" cy="60" r="1.4" fill="currentColor" />
    </svg>
  )
}
