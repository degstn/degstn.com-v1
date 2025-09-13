import { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: 'Photography - degstn.com',
  description: 'Shots from around the globe on degstn.com',
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

export default function PhotographyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#e2deda" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#1a1a1a" media="(prefers-color-scheme: dark)" />
        <meta name="color-scheme" content="light dark" />
      </head>
      <body className="bg-bgDark">
        {children}
      </body>
    </html>
  )
}
