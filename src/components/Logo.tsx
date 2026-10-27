type LogoProps = {
  light?: boolean
  onClick?: () => void
}

export function Logo({ light = false, onClick }: LogoProps) {
  return (
    <a
      className={`brand-logo ${light ? 'brand-logo--light' : ''}`.trim()}
      href="#home"
      onClick={onClick}
    >
      <span className="brand-logo__mark" aria-hidden="true">
        É
      </span>
      <span className="brand-logo__text">
        <span className="brand-logo__name">ÉLORA</span>
        <span className="brand-logo__sub">Beauty Studio</span>
      </span>
      <span className="sr-only"> — back to top</span>
    </a>
  )
}
