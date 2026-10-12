'use client'
/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useRef, useState } from 'react'

import { imageSrcSet, imageUrl, imageUrlFor } from '@/lib/image'
import { introSeen, rememberedSemester } from '@/lib/archive-state'
import type { Poster } from '@/sanity/lib/posters'
import Header from './Header'
import Intro from './Intro'

// Roughly how wide a grid image is on screen, so the browser picks the right srcset entry.
const GRID_SIZES = '(max-width: 820px) 45vw, (max-width: 1200px) 30vw, 22vw'
// Lightbox frame: 18px top, 6px gap, 18px caption, 14px bottom (Figma "Fullscreen")
const LIGHTBOX_CHROME_PX = 56
const RATIO = 455 / 609

export default function Archive({ posters }: { posters: Poster[] }) {
  const [showIntro, setShowIntro] = useState(posters.length > 0 && !introSeen())
  const [semester, setSemester] = useState(rememberedSemester)
  const [current, setCurrent] = useState<number | null>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([])

  // ?nointro skips the intro (handy while editing)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- URL is only readable on the client
    if (new URLSearchParams(window.location.search).has('nointro')) setShowIntro(false)
  }, [])

  const isVisible = (p: Poster) => semester === null || p.semester === semester
  const visibleIndexes = posters.flatMap((p, i) => (isVisible(p) ? [i] : []))

  function openLightbox(index: number) {
    setCurrent(index)
    document.body.classList.add('is-locked')
    dialogRef.current?.showModal()
  }

  function step(direction: 1 | -1) {
    if (current === null || !visibleIndexes.length) return
    const pos = visibleIndexes.indexOf(current)
    setCurrent(visibleIndexes[(pos + direction + visibleIndexes.length) % visibleIndexes.length])
  }

  const closeIntro = useCallback(() => setShowIntro(false), [])

  const poster = current !== null ? posters[current] : null

  return (
    <>
      {showIntro && <Intro posters={posters} onDone={closeIntro} />}

      <Header page="archive" semester={semester} onSemesterChange={setSemester} />

      <main>
        <ul className="grid">
          {posters.map((p, i) => (
            <li key={p.id} hidden={!isVisible(p)}>
              <button
                ref={(el) => {
                  cardRefs.current[i] = el
                }}
                className="card"
                type="button"
                aria-label={`${p.name}, ${p.semester} – vergrößern`}
                onClick={() => openLightbox(i)}
              >
                <span className="frame">
                  <img
                    src={imageUrl(p, 800)}
                    srcSet={imageSrcSet(p)}
                    sizes={GRID_SIZES}
                    width={p.width}
                    height={p.height}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                </span>
                <span className="caption">
                  <span>{p.name}</span>
                  <span>{p.year}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
        {visibleIndexes.length === 0 && (
          <p className="empty">
            {semester ? `Noch keine Arbeiten für ${semester}.` : 'Noch keine Arbeiten.'}
          </p>
        )}
      </main>

      <dialog
        ref={dialogRef}
        className="lightbox"
        aria-label="Plakat"
        onClick={() => dialogRef.current?.close()}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') step(1)
          else if (e.key === 'ArrowLeft') step(-1)
        }}
        onClose={() => {
          document.body.classList.remove('is-locked')
          if (current !== null) cardRefs.current[current]?.focus({ preventScroll: true })
        }}
      >
        {poster && (
          <figure className="lightbox__figure">
            <div className="frame">
              <img
                key={poster.id}
                src={imageUrlFor(poster, lightboxImageWidth())}
                alt={`Plakat von ${poster.name}, ${poster.semester}`}
              />
              {/* Left/right halves of the poster step through; clicks anywhere else close. */}
              <button
                type="button"
                className="lightbox__nav lightbox__nav--prev"
                aria-label="Vorheriges Plakat"
                onClick={(e) => {
                  e.stopPropagation()
                  step(-1)
                }}
              />
              <button
                type="button"
                className="lightbox__nav lightbox__nav--next"
                aria-label="Nächstes Plakat"
                onClick={(e) => {
                  e.stopPropagation()
                  step(1)
                }}
              />
            </div>
            <figcaption className="caption">
              <span>{poster.name}</span>
              <span>{poster.year}</span>
            </figcaption>
          </figure>
        )}
      </dialog>
    </>
  )
}

/** CSS width of the image area inside the lightbox frame (89% of the frame, see .frame img). */
function lightboxImageWidth() {
  const margin = 10 // --margin in globals.css
  const frame = Math.min(window.innerWidth - 2 * margin, (window.innerHeight - LIGHTBOX_CHROME_PX) * RATIO)
  return frame * 0.89
}
