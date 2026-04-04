import type { Metadata } from 'next'
import Link from 'next/link'
import GhormanLiveMeta from './GhormanLiveMeta'

export const metadata: Metadata = {
  title: 'Ghorman Livestream — degstn.com',
  description: 'Live stream for Ghorman (spider cam)',
  openGraph: {
    title: 'Ghorman Livestream — degstn.com',
    description: 'Live stream for Ghorman (spider cam)',
    url: 'https://degstn.com/ghorman',
    siteName: 'degstn.com',
    images: [
      {
        url: '/main-og.jpg',
        alt: 'degstn.com',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}

function getEmbedSrc(): string | null {
  const channelId = process.env.NEXT_PUBLIC_GHORMAN_YT_CHANNEL_ID
  const videoId = process.env.NEXT_PUBLIC_GHORMAN_YT_VIDEO_ID

  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&rel=0&controls=0&modestbranding=1&playsinline=1`
  }
  if (channelId) {
    return `https://www.youtube.com/embed/live_stream?channel=${channelId}&autoplay=1&mute=1&rel=0&controls=0&modestbranding=1&playsinline=1`
  }
  return null
}

function getWatchUrl(): string | null {
  const channelId = process.env.NEXT_PUBLIC_GHORMAN_YT_CHANNEL_ID
  const videoId = process.env.NEXT_PUBLIC_GHORMAN_YT_VIDEO_ID

  if (videoId) {
    return `https://www.youtube.com/watch?v=${videoId}`
  }
  if (channelId) {
    return `https://www.youtube.com/channel/${channelId}/live`
  }
  return null
}

export default function GhormanLive() {
  const src = getEmbedSrc()
  const watchUrl = getWatchUrl()

  const name = 'Ghorman'
  const speciesCommon = 'Colombian giant redleg tarantula'
  const scientificName = 'Megaphobema robustum'
  const origin = 'Colombia, Brazil'
  const birthdayISO = '2025-06-11'
  const sex = 'male'

  function formatAge(iso: string): string {
    if (!iso) return '—'
    const birth = new Date(iso)
    if (Number.isNaN(birth.getTime())) return '—'
    const now = new Date()
    let years = now.getFullYear() - birth.getFullYear()
    let months = now.getMonth() - birth.getMonth()
    let days = now.getDate() - birth.getDate()
    if (days < 0) {
      months -= 1
      days += 30
    }
    if (months < 0) {
      years -= 1
      months += 12
    }
    if (years <= 0 && months <= 0) return `${Math.max(0, days)}d`
    if (years <= 0) return `${months}mo`
    if (months === 0) return `${years}y`
    return `${years}y ${months}mo`
  }
  const age = formatAge(birthdayISO)
  const birthdayDisplay = new Date(birthdayISO).toLocaleDateString("en-US")

  const stats: { label: string; value: string; italic?: boolean }[] = [
    { label: 'Name', value: name },
    { label: 'Species', value: speciesCommon },
    { label: 'Scientific name', value: scientificName, italic: true },
    { label: 'Origin', value: origin },
    { label: 'Sex', value: sex },
    { label: 'Birthday', value: birthdayDisplay || '—' },
    { label: 'Age', value: age },
  ]

  return (
    <main className="min-h-screen bg-bgLight dark:bg-bgDark p-6 md:px-56 px-6 pt-24">
      <div className="text-sm text-gray-600 opacity-50 dark:text-gray-50">
          <Link href="/" className="hover:underline ">
                back
              </Link>
          </div>
      <h1 className="text-normal text-gray-600 dark:text-gray-50">ghorman</h1>

        <section className="w-full max-w-5xl mt-6">
          <GhormanLiveMeta isLive={Boolean(src)} />
        </section>

        {src ? (
          <section className="-mx-6 md:mx-0 mt-2">
            <div className="relative w-full pb-[56.25%] max-w-5xl md:mx-0 bg-black md:border border-disabled dark:border-disabled-dark">
              <iframe
                src={src}
                title="Ghorman livestream"
                className="absolute inset-0 w-full h-full"
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="absolute inset-0 z-10 md:hidden" />
            </div>
            <div className="flex items-center gap-1.5 mt-2 px-6 md:hidden">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600 dark:text-gray-50 opacity-30 flex-shrink-0"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
              <span className="text-[10px] text-gray-600 dark:text-gray-50 opacity-30 tracking-wide">Pinch to zoom</span>
            </div>
          </section>
        ) : (
          <section className="w-full max-w-5xl mt-2">
            <div className="text-sm text-gray-600 dark:text-gray-50 opacity-70">
              Set <code className="px-1">NEXT_PUBLIC_GHORMAN_YT_CHANNEL_ID</code> or{" "}
              <code className="px-1">NEXT_PUBLIC_GHORMAN_YT_VIDEO_ID</code> to enable the livestream embed.
            </div>
          </section>
        )}

        <div className="w-full max-w-5xl mt-4 md:mt-8 border-t border-disabled/30 dark:border-disabled-dark/30" />

        <section className="w-full max-w-5xl mt-4 md:mt-6">
          <div className="text-gray-600 dark:text-gray-50 grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 md:gap-x-6 md:gap-y-4">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="text-[10px] md:text-xs uppercase tracking-wider opacity-50">{s.label}</div>
                <div className={`text-sm md:text-base ${s.italic ? 'italic' : ''}`}>{s.value}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 md:mt-6">
            {watchUrl && (
              <a
                href={watchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-international-orange-engineering dark:text-international-orange hover:underline underline-offset-4"
              >
                <span>Watch on YouTube</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70"><path d="M7 17L17 7M17 7H7M17 7v10" /></svg>
              </a>
            )}
            <a
              href="https://discord.gg/wMjcYGBvjR"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-international-orange-engineering dark:text-international-orange hover:underline underline-offset-4"
            >
              <span>Get movement alerts</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70"><path d="M7 17L17 7M17 7H7M17 7v10" /></svg>
            </a>
          </div>
        </section>
    </main>
  )
}
