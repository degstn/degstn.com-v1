import { Metadata, Viewport } from 'next'
import '../globals.css'

export const metadata: Metadata = {
  title: 'Photography - degstn.com',
  description: 'Shots from around the globe on degstn.com',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#1a1a1a',
}

export default function PhotographyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section className="bg-bgDark antialiased">
      {children}
    </section>
  )
}
