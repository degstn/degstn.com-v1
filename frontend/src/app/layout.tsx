import type { Metadata, Viewport } from 'next'
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { tx02, berkeleymono } from './fonts'
import './globals.css'

export const metadata: Metadata = {
  title: 'Drew Goldstein',
  description: 'my portfolio',
  keywords: ["portfolio", "personal website", "minimal", "tech", "software"],
  openGraph: {
    title: "Drew Goldstein",
    description: "my portfolio",
    url: "https://degstn.com",
    siteName: "degstn.com",
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
    { media: "(prefers-color-scheme: dark)", color: "#1a1a1a" }
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
      <body className={`${tx02.className} antialiased`}>{children}<Analytics/><SpeedInsights/></body>
    </html>
  )
}
