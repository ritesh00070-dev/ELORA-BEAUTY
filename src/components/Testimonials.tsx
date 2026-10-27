import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { testimonials } from '../data/content'
import { BloomMark } from './BloomMark'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'

export function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0)
  const testimonial = testimonials[activeIndex]

  const goToPrevious = () => {
    setActiveIndex(
      (current) => (current - 1 + testimonials.length) % testimonials.length,
    )
  }

  const goToNext = () => {
    setActiveIndex((current) => (current + 1) % testimonials.length)
  }

  return (
    <section
      className="section testimonials"
      id="testimonials"
      aria-labelledby="testimonials-title"
    >
      <BloomMark className="testimonials-bloom" />
      <div className="container">
        <Reveal>
          <SectionHeading
            eyebrow="Kind words · imagined"
            headingId="testimonials-title"
            align="center"
            title={
              <>
                The feeling after
                <br />
                the <em>mirror moment.</em>
              </>
            }
            intro={
              <p>
                A few words written for this concept, from a few fictional
                Élora guests.
              </p>
            }
          />
        </Reveal>

        <Reveal className="testimonial-stage" delay={100}>
          <div
            className="testimonial-quote"
            aria-live="polite"
            aria-atomic="true"
          >
            <span className="testimonial-quote__mark" aria-hidden="true">
              “
            </span>
            <blockquote key={testimonial.id}>
              <p>{testimonial.quote}</p>
              <footer>
                <span className="testimonial-stars" aria-hidden="true">
                  ✦ ✦ ✦ ✦ ✦
                </span>
                <cite>
                  {testimonial.name}
                  <span>{testimonial.context}</span>
                </cite>
                <span className="testimonial-demo-label">
                  Sample testimonial · fictional client
                </span>
              </footer>
            </blockquote>
          </div>

          <div className="testimonial-controls">
            <button
              type="button"
              className="round-button"
              onClick={goToPrevious}
              aria-label="Show previous testimonial"
            >
              <ChevronLeft size={20} strokeWidth={1.3} aria-hidden="true" />
            </button>

            <div
              className="testimonial-dots"
              role="group"
              aria-label="Choose a testimonial"
            >
              {testimonials.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  className={index === activeIndex ? 'is-active' : undefined}
                  aria-label={`Show sample testimonial ${index + 1}`}
                  aria-pressed={index === activeIndex}
                  onClick={() => setActiveIndex(index)}
                />
              ))}
            </div>

            <span className="testimonial-counter" aria-hidden="true">
              {String(activeIndex + 1).padStart(2, '0')} /{' '}
              {String(testimonials.length).padStart(2, '0')}
            </span>

            <button
              type="button"
              className="round-button"
              onClick={goToNext}
              aria-label="Show next testimonial"
            >
              <ChevronRight size={20} strokeWidth={1.3} aria-hidden="true" />
            </button>
          </div>
        </Reveal>

        <p className="testimonial-disclaimer">
          These are illustrative testimonials created for this website concept.
          They do not represent reviews of a live business.
        </p>
      </div>
    </section>
  )
}
