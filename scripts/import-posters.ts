/**
 * One-off import of the original poster files in posters/ into Sanity.
 *
 *   npx sanity exec scripts/import-posters.ts --with-user-token
 *
 * Uploads the full-resolution originals (the Sanity CDN resizes them on demand) and
 * creates one Poster document each with placeholder name/year/semester to edit in
 * the Studio. Safe to re-run: documents use fixed ids and are only created once.
 */
import { createReadStream } from 'node:fs'
import { join } from 'node:path'
import { getCliClient } from 'sanity/cli'

// Order on the site (same as the static version / Figma)
const FILES = [
  'Bildschirmfoto 2026-06-17 um 10.31.07.png',
  '2nd session.jpg',
  'Bildschirmfoto 2026-06-17 um 10.33.13.png',
  'letter_experiment.png',
  'words_experiment.png',
  '06.jpg',
  'Bildschirmfoto 2026-06-17 um 10.31.41.png',
  'Bildschirmfoto 2026-06-17 um 10.37.19.png',
  'Снимок экрана 2026-06-17 в 10.24.53.png',
  'Снимок экрана 2026-06-17 в 10.25.08.png',
  'Снимок экрана 2026-06-17 в 10.25.17.png',
  'firstFonts.jpg',
  'onlineFont.png',
  'brushes_experiment.png',
  'Bildschirmfoto 2026-06-17 um 10.34.43.png',
  'Bildschirmfoto 2026-06-17 um 10.35.08.png',
  'Bildschirmfoto 2026-06-17 um 10.35.23.png',
  'Bildschirmfoto 2026-06-17 um 10.35.49.png',
  'Bildschirmfoto 2026-06-17 um 10.36.04.png',
]

const client = getCliClient({ apiVersion: '2026-10-01' })
const dir = join(process.cwd(), 'posters')

for (const [i, file] of FILES.entries()) {
  const _id = `poster-import-${String(i + 1).padStart(2, '0')}`
  if (await client.getDocument(_id)) {
    console.log(`skip  ${file} (already imported)`)
    continue
  }
  const asset = await client.assets.upload('image', createReadStream(join(dir, file)), { filename: file })
  await client.create({
    _id,
    _type: 'poster',
    image: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } },
    name: 'Name Nachname',
    year: 2026,
    semester: 'SS/2026',
  })
  console.log(`added ${file}`)
}
