import { useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react'
import {
  galleryCategories,
  galleryImages,
  type GalleryCategory,
} from '../data/content'
import { useFocusTrap } from '../hooks/useFocusTrap'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'

export function Gallery() {
  const [activeCategory, setActiveCategory] =
    useState<GalleryCategory>('All')
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const lightboxRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const filteredImages =
    activeCategory === 'All'
      ? galleryImages
      : galleryImages.filter((image) => image.category === activeCategory)

  const activeImage =
    activeIndex === null ? null : filteredImages[activeIndex] ?? null

  const closeLightbox = useCallback(() => setActiveIndex(null), [])

  useFocusTrap(
    activeImage !== null,
    lightboxRef,
    closeLightbox,
    closeButtonRef,
  )

  const goToPrevious = useCallback(() => {
    setActiveIndex((current) => {
      if (current === null) return null
      return (
        (current - 1 + filteredImages.length) % filteredImages.length
      )
    })
  }, [filteredImages.length])

  const goToNext = useCallback(() => {
    setActiveIndex((current) => {
      if (current === null) return null
      return (current + 1) % filteredImages.length
    })
  }, [filteredImages.length])

  useEffect(() => {
    if (activeIndex === null) return

    const handleKeyboard = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        goToPrevious()
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault()
        goToNext()
      }
    }

    document.addEventListener('keydown', handleKeyboard)
    return () => document.removeEventListener('keydown', handleKeyboard)
  }, [activeIndex, goToNext, goToPrevious])

  const handleCategoryChange = (category: GalleryCategory) => {
    setActiveCategory(category)
    setActiveIndex(null)
  }

  const imageCountLabel =
    filteredImages.length === 1
      ? `Showing 1 ${activeCategory === 'All' ? '' : activeCategory.toLowerCase()} image`
      : `Showing ${filteredImages.length} ${
          activeCategory === 'All' ? '' : activeCategory.toLowerCase()
        } images`

  return (
    <section
      className="section gallery"
      id="gallery"
      aria-labelledby="gallery-title"
    >
      <div className="container">
        <Reveal className="gallery-head">
          <SectionHeading
            eyebrow="The lookbook"
            headingId="gallery-title"
            title={
              <>
                A study in light, colour
                <br />
                &amp; quiet <em>glamour.</em>
              </>
            }
          />
          <div className="gallery-head__aside">
            <p>
              A curated moodboard of imagined Élora moments. Open any frame for
              a closer look.
            </p>
            <span className="gallery-count" aria-hidden="true">
              {String(filteredImages.length).padStart(2, '0')} frames
            </span>
          </div>
        </Reveal>

        <Reveal className="gallery-controls" delay={60}>
          <div
            className="gallery-filters"
            role="group"
            aria-label="Filter lookbook images"
          >
            {galleryCategories.map((category) => (
              <button
                key={category}
                type="button"
                className={
                  activeCategory === category ? 'is-active' : undefined
                }
                aria-pressed={activeCategory === category}
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </button>
            ))}
          </div>
          <p className="gallery-demo-label">
            Fictional lookbook · illustrative imagery
          </p>
          <p className="sr-only" role="status" aria-live="polite">
            {imageCountLabel}
          </p>
        </Reveal>

        <div className="gallery-grid">
          {filteredImages.map((image, index) => (
            <button
              key={`${activeCategory}-${image.id}`}
              type="button"
              className={`gallery-card gallery-card--${image.orientation}`}
              style={
                { '--gallery-delay': `${index * 55}ms` } as CSSProperties
              }
              aria-haspopup="dialog"
              onClick={() => setActiveIndex(index)}
            >
              <span className="gallery-card__media">
                <img
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  decoding="async"
                  width="1200"
                  height="1600"
                />
                <span className="gallery-card__shade" aria-hidden="true" />
                <span className="gallery-card__expand" aria-hidden="true">
                  <Expand size={17} strokeWidth={1.4} />
                </span>
                <span className="gallery-card__caption">
                  <span>{image.title}</span>
                  <span>{image.note}</span>
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {activeImage ? (
        <div
          ref={lightboxRef}
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-labelledby="lightbox-title"
        >
          <div
            className="lightbox__backdrop"
            aria-hidden="true"
            onClick={closeLightbox}
          />

          <div className="lightbox__panel">
            <button
              ref={closeButtonRef}
              type="button"
              className="lightbox__close"
              aria-label="Close image viewer"
              onClick={closeLightbox}
            >
              <X size={23} strokeWidth={1.3} aria-hidden="true" />
            </button>

            <div className="lightbox__image-wrap">
              <button
                type="button"
                className="lightbox__arrow lightbox__arrow--prev"
                aria-label="Previous image"
                onClick={goToPrevious}
              >
                <ChevronLeft size={25} strokeWidth={1.2} aria-hidden="true" />
              </button>

              <img
                src={activeImage.src}
                alt={activeImage.alt}
                width="1200"
                height="1600"
                loading="eager"
              />

              <button
                type="button"
                className="lightbox__arrow lightbox__arrow--next"
                aria-label="Next image"
                onClick={goToNext}
              >
                <ChevronRight size={25} strokeWidth={1.2} aria-hidden="true" />
              </button>
            </div>

            <div className="lightbox__caption">
              <div>
                <span>{activeImage.category}</span>
                <h3 id="lightbox-title">{activeImage.title}</h3>
              </div>
              <div className="lightbox__meta">
                <span className="lightbox__note">{activeImage.note}</span>
                <span className="lightbox__counter">
                  {(activeIndex ?? 0) + 1} / {filteredImages.length}
                </span>
                <span className="lightbox__demo">Concept imagery</span>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}
