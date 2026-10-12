import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'

const arketa = localFont({
  src: '../fonts/OOArketa-Regular.otf',
  variable: '--font-arketa',
  weight: '400',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Typo Klasse Prof. Kirchschläger – Plakatarchiv',
  description: 'Plakatarchiv der Typo Klasse von Prof. Kirchschläger.',
}

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={arketa.variable}>
      <body>{children}</body>
    </html>
  )
}
