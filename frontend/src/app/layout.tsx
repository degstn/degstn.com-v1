import type { Metadata } from 'next'
import { Analytics } from "@vercel/analytics/react"
import { tx02 } from './fonts'
import './globals.css'

export const metadata: Metadata = {
  title: 'Drew',
  description: 'my portfolio',
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
