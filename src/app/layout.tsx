import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Scyra - Know What Your Niche Is Talking About',
  description: 'Discover trending content ideas powered by real discussions across Reddit, blogs, forums, and the web.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
