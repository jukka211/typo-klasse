// Semesters editors can choose in Sanity and visitors can filter by on the site.
// Add a new one here (e.g. 'WS/2026') and it shows up in both places.
export const SEMESTERS = ['SS/2025', 'SS/2026'] as const

export type Semester = (typeof SEMESTERS)[number]
