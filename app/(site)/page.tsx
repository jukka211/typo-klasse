import Archive from '@/components/Archive'
import { getPosters } from '@/sanity/lib/posters'

export default async function HomePage() {
  const posters = await getPosters()
  return <Archive posters={posters} />
}
