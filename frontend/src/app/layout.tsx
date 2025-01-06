import type { Metadata } from 'next'
import { Analytics } from "@vercel/analytics/react"
import { tx02, berkeleymono } from './fonts'
import './globals.css'

export const metadata: Metadata = {
  title: 'Drew',
  description: 'my portfolio',
  openGraph: {
    title: "Drew",
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#e2deda" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#1a1a1a" media="(prefers-color-scheme: dark)" />
      </head>
      <body className={tx02.className}>{children}<Analytics/></body>
    </html>
  )
}
