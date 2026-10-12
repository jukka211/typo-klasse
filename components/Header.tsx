'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { markIntroSeen, rememberSemester, rememberedSemester } from '@/lib/archive-state'
import { SEMESTERS } from '@/lib/semesters'

type Props = {
  page: 'archive' | 'info'
  /** Defaults to the remembered filter (info page). */
  semester?: string | null
  /** Archive only; on the info page a filter click goes back to the archive with that filter. */
  onSemesterChange?: (semester: string | null) => void
}

export default function Header({ page, semester = rememberedSemester(), onSemesterChange }: Props) {
  const router = useRouter()

  // Whichever page a visit starts on, later visits to the archive skip the intro.
  useEffect(() => {
    markIntroSeen()
  }, [])

  function choose(s: string) {
    const next = semester === s ? null : s
    rememberSemester(next)
    if (onSemesterChange) onSemesterChange(next)
    else router.push('/')
  }

  return (
    <header className="bar">
      <h1 className="bar__title">Typo Klasse Prof. Kirchschläger</h1>
      <nav className="bar__nav">
        {page === 'archive' ? (
          <Link className="chip" href="/info">Info</Link>
        ) : (
          <Link className="chip" href="/">Back</Link>
        )}
      </nav>
      <div className="filter" role="group" aria-label="Nach Semester filtern">
        <span>Filter:</span>
        <div className="filter__chips">
          {SEMESTERS.map((s) => (
            <button
              key={s}
              type="button"
              className="chip"
              aria-pressed={semester === s}
              onClick={() => choose(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </header>
  )
}
