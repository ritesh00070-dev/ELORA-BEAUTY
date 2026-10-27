const marqueeItems = [
  'Bridal artistry',
  'Skin rituals',
  'Hair couture',
  'Hand & nail care',
  'Saree styling',
  'Private appointments',
]

export function Marquee() {
  const repeatedItems = [...marqueeItems, ...marqueeItems]

  return (
    <div className="marquee-band" aria-hidden="true">
      <div className="marquee-track">
        {[0, 1].map((group) => (
          <div className="marquee-group" key={group}>
            {repeatedItems.map((item, index) => (
              <span key={`${group}-${item}-${index}`}>
                {item}
                <span className="marquee-star">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
