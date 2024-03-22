import type { Metadata } from 'next'
import { Analytics } from "@vercel/analytics/react"
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Drew Goldstein',
  description: 'portfolio',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}<Analytics/></body>
    </html>
  )
}
