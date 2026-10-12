import { cacheLife, cacheTag } from 'next/cache'
import { createClient, defineQuery } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

export type Poster = {
  id: string
  name: string
  year: number
  semester: string
  /** Sanity CDN URL of the original upload; sized variants are requested with ?w= */
  url: string
  width: number
  height: number
}

const POSTERS_QUERY = defineQuery(`
  *[_type == "poster" && defined(image.asset)] | order(year desc, _createdAt asc) {
    "id": _id,
    name,
    year,
    semester,
    "url": image.asset->url,
    "width": image.asset->metadata.dimensions.width,
    "height": image.asset->metadata.dimensions.height
  }
`)

export async function getPosters(): Promise<Poster[]> {
  'use cache'
  cacheLife('minutes') // edits in Sanity show up on the site within about a minute
  cacheTag('posters')

  if (!projectId) {
    console.warn('NEXT_PUBLIC_SANITY_PROJECT_ID is not set — rendering an empty archive.')
    return []
  }

  const client = createClient({ projectId, dataset, apiVersion, useCdn: true })
  return client.fetch<Poster[]>(POSTERS_QUERY)
}
