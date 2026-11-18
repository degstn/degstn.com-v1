import type { Metadata, Viewport } from 'next'
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { tx02, berkeleymono } from './fonts'
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, structuredData } from '@/data/site'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    // Pages set only their own name ("cv"); the site name is appended here so
    // no two pages share a title.
    template: `%s - ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: ["portfolio", "personal website", "minimal", "tech", "software"],
  // "./" resolves against each route's own path, so every page declares itself
  // canonical on SITE_URL regardless of which domain served the request.
  alternates: {
    canonical: './',
  },
  // No title/description here: Next fills them from each page's own metadata.
  openGraph: {
    url: './',
    siteName: SITE_NAME,
    images: [
      {
        url: "/main-og.jpg", 
        alt: "portfolio banner image",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  manifest: '/site.webmanifest',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#e2deda" },
    { media: "(prefers-color-scheme: dark)", color: "#111111" }
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${tx02.variable}`}>
      <head>
        <meta name="color-scheme" content="light dark" />
      </head>
      <body className={`${tx02.className} antialiased`}>
        <script
          type="application/ld+json"
          // Escape "<" so the JSON can never close the script tag.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }}
        />
        {children}
        <Analytics/>
        <SpeedInsights/>
      </body>
    </html>
  )
}
