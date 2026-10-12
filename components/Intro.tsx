'use client'
/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useRef, useState } from 'react'

import { imageUrlFor } from '@/lib/image'
import type { Poster } from '@/sanity/lib/posters'

const FRAME_MS = 120 // how long each poster flashes
const FRAME_MS_REDUCED = 450 // prefers-reduced-motion: stays under 3 flashes per second
const HOLD_MS = 300 // pause on the last poster before fading out
const FADE_MS = 800 // keep in sync with .intro transition in globals.css
const LOAD_TIMEOUT_MS = 6000 // start with whatever has loaded by then

type Frame = { key: string; src: string }

function shuffle<T>(list: T[]) {
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[list[i], list[j]] = [list[j], list[i]]
  }
  return list
}

export default function Intro({ posters, onDone }: { posters: Poster[]; onDone: () => void }) {
  const [frames, setFrames] = useState<Frame[]>([])
  const [loaded, setLoaded] = useState(0)
  const [active, setActive] = useState(-1)
  const [playing, setPlaying] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const imgRefs = useRef<(HTMLImageElement | null)[]>([])
  const ended = useRef(false)

  const end = useCallback(() => {
    if (ended.current) return
    ended.current = true
    setLeaving(true)
  }, [])

  // Lock scrolling while the intro covers the page; any key skips it.
  useEffect(() => {
    document.body.classList.add('is-intro')
    window.addEventListener('keydown', end)
    return () => {
      document.body.classList.remove('is-intro')
      window.removeEventListener('keydown', end)
    }
  }, [end])

  // Pick a random order and an image size that covers this screen.
  useEffect(() => {
    const vw = window.innerWidth
    const vh = window.innerHeight
    // Client-only: random order and screen size can't be known during server render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFrames(
      shuffle(posters.slice()).map((p) => ({
        key: p.id,
        src: imageUrlFor(p, Math.max(vw, (vh * p.width) / p.height)),
      })),
    )
  }, [posters])

  // Decode every frame up front so the fast cuts never show a blank screen, then play.
  useEffect(() => {
    if (!frames.length) return
    let cancelled = false
    let timer = 0
    const imgs = imgRefs.current.slice(0, frames.length)
    const decoded = imgs.map((img) =>
      (img ? img.decode() : Promise.reject())
        .catch(() => {})
        .then(() => !cancelled && setLoaded((n) => n + 1)),
    )
    const timeout = new Promise((resolve) => setTimeout(resolve, LOAD_TIMEOUT_MS))

    Promise.race([Promise.all(decoded), timeout]).then(() => {
      if (cancelled || ended.current) return
      const playlist = imgs.flatMap((img, i) => (img?.complete && img.naturalWidth > 0 ? [i] : []))
      if (!playlist.length) return end()

      const frameMs = matchMedia('(prefers-reduced-motion: reduce)').matches ? FRAME_MS_REDUCED : FRAME_MS
      setPlaying(true)
      let step = 0
      const tick = () => {
        if (ended.current) return
        setActive(playlist[step])
        const last = step === playlist.length - 1
        step++
        timer = window.setTimeout(last ? end : tick, last ? HOLD_MS : frameMs)
      }
      tick()
    })

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [frames, end])

  // Fade out, then unmount.
  useEffect(() => {
    if (!leaving) return
    document.body.classList.remove('is-intro')
    const timer = setTimeout(onDone, FADE_MS + 50)
    return () => clearTimeout(timer)
  }, [leaving, onDone])

  const total = posters.length
  const pad = (n: number) => String(n).padStart(String(total).length, '0')

  return (
    <div
      className={`intro${leaving ? ' is-leaving' : ''}`}
      aria-hidden="true"
      onClick={end}
      onWheel={end}
      onTouchMove={end}
    >
      <div className="intro__stack">
        {frames.map((f, i) => (
          <img
            key={f.key}
            ref={(el) => {
              imgRefs.current[i] = el
            }}
            src={f.src}
            alt=""
            className={i === active ? 'is-active' : undefined}
          />
        ))}
      </div>
      {!playing && (
        <p className="intro__count">
          {pad(Math.min(loaded, total))}/{total}
        </p>
      )}
    </div>
  )
}
