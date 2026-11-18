import { Metadata, Viewport } from 'next'
import '../globals.css'
import DarkBg from './DarkBg'
import { SITE_DOMAIN, SITE_NAME } from '@/data/site'

export const metadata: Metadata = {
  title: {
    default: "Photography",
    // A layout that sets a title drops the inherited template for the routes
    // below it, so restate it for /photography/* pages.
    template: `%s - ${SITE_NAME}`,
  },
  description: `Shots from around the globe on ${SITE_DOMAIN}`,
  openGraph: {
    url: "/photography",
    siteName: SITE_NAME,
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
  themeColor: '#111111',
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
