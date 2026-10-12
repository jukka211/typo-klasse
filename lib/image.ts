// Sized image URLs from the Sanity image CDN. `fit=max` never upscales past the
// original, `auto=format` serves AVIF/WebP to browsers that support them.
const WIDTHS = [480, 800, 1200, 1600, 2400, 3200, 3840]
const QUALITY = 90

type Sized = { url: string; width: number }

export function imageUrl(image: Sized, width: number) {
  const w = Math.min(Math.round(width), image.width)
  return `${image.url}?w=${w}&fit=max&auto=format&q=${QUALITY}`
}

function widthsFor(image: Sized) {
  const ws = WIDTHS.filter((w) => w < image.width)
  return [...ws, image.width]
}

export function imageSrcSet(image: Sized) {
  return widthsFor(image)
    .map((w) => `${imageUrl(image, w)} ${w}w`)
    .join(', ')
}

/** Smallest available width that covers `cssWidth` CSS pixels on this screen. */
export function imageUrlFor(image: Sized, cssWidth: number) {
  const needed = cssWidth * (window.devicePixelRatio || 1)
  const w = widthsFor(image).find((w) => w >= needed) ?? image.width
  return imageUrl(image, w)
}
