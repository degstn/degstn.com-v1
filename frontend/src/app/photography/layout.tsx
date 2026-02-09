import { Metadata, Viewport } from 'next'
import '../globals.css'
import DarkBg from './DarkBg'

export const metadata: Metadata = {
  title: "Photography - degstn.com",
  description: "Shots from around the globe on degstn.com",
  openGraph: {
    title: "Photography - degstn.com",
    description: "Shots from around the globe on degstn.com",
    url: "https://degstn.com/photography",
    siteName: "degstn.com",
    images: [
      {
        url: "/photography-og.jpg", 
        alt: "A globe representing worldwide photography",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};


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
    <section className="antialiased" style={{ backgroundColor: '#111111', colorScheme: 'dark', minHeight: '100svh' }}>
      <DarkBg />
      {children}
    </section>
  )
}
