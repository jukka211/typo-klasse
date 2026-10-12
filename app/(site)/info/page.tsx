import type { Metadata } from 'next'

import Header from '@/components/Header'

export const metadata: Metadata = {
  title: 'Info – Typo Klasse Prof. Kirchschläger',
}

export default function InfoPage() {
  return (
    <>
      <Header page="info" />
      <main className="info">
        <p>
          In this course, we treat typography the way we do in the studio: as the foundation of a
          design, not its finishing touch. Type gives a design its structure, its rhythm and its
          character, and the course shows how to use it with intention.
        </p>
        <p>
          We start with the basics: letterforms, spacing, hierarchy and the grid. From there we move
          toward larger questions. How does a typeface carry an identity? How do a few clear rules
          turn into a recognizable visual language? And how much freedom does a system need to stay
          alive?
        </p>
        <p>
          Short inputs alternate with hands-on exercises. Along the way we look at experimental type
          systems, editorial design and typography-driven identities, with examples from the
          studio’s own work and from the wider field.
        </p>
        <p>
          The course is for designers, students and anyone working in visual communication who wants
          to understand typography as a way of building systems, not just styling text.
        </p>
      </main>
    </>
  )
}
