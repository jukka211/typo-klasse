# Typo Klasse – Plakatarchiv

Poster archive of Prof. Kirchschläger's typography class. Next.js (App Router) + Sanity, deployed on Vercel.

- `/` – the archive: fullscreen intro, grid, semester filter, lightbox
- `/studio` – Sanity Studio for adding and editing posters

## Editing posters

Open `/studio` → **Posters**. Each poster has an image, a name, a year and a semester
(SS/2025 or SS/2026). Changes appear on the site within about a minute.
To add a semester option, edit `lib/semesters.ts`.

Upload the largest file you have (ideally 3000 px+ on the long side); the Sanity CDN
serves sized versions automatically.

## Local development

```bash
cp .env.example .env.local   # fill in NEXT_PUBLIC_SANITY_PROJECT_ID
npm install
npm run dev                  # http://localhost:3000, add ?nointro to skip the intro
```

## Importing the original poster files

`posters/` (not committed) holds the original files. To upload them into Sanity once:

```bash
npx sanity login
npx sanity exec scripts/import-posters.ts --with-user-token
```
