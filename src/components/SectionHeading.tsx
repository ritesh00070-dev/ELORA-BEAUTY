import type { ReactNode } from 'react'

type SectionHeadingProps = {
  eyebrow: string
  title: ReactNode
  intro?: ReactNode
  headingId: string
  align?: 'left' | 'center'
  tone?: 'light' | 'dark'
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  headingId,
  align = 'left',
  tone = 'light',
  className = '',
}: SectionHeadingProps) {
  return (
    <header
      className={`section-heading section-heading--${align} section-heading--${tone} ${className}`.trim()}
    >
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={headingId} className="section-title">
        {title}
      </h2>
      {intro ? <div className="section-intro">{intro}</div> : null}
    </header>
  )
}
