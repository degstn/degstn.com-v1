import type { Metadata } from 'next'
import Link from 'next/link'

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
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&rel=0`
  }
  if (channelId) {
    return `https://www.youtube.com/embed/live_stream?channel=${channelId}&autoplay=1&mute=1&rel=0`
  }
  return null
}

export default function GhormanLive() {
  const src = getEmbedSrc()
  const infoImage = process.env.NEXT_PUBLIC_GHORMAN_INFO_IMAGE_URL

  const name = 'Ghorman'
  const speciesCommon = 'Colombian giant redleg tarantula'
  const scientificName = 'Megaphobema robustum'
  const origin = 'Colombia, Brazil'
  const birthdayISO =  '12/27/2025'
  const sex =  'male'
  const enclosure = 'enclosure 1'
  const tempRange = '22–26°C (72–79°F)'
  const humidityRange = '44%'
  const lastMolt = 'estimated 1/16/2026'
  const lastFed = '1/25/2026'

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
      // approximate day adjustment is fine for display
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

  return (
    <main className="min-h-screen flex-grid items-center justify-center bg-bgLight dark:bg-bgDark p-6 md:px-56 px-6 pt-24">
      <div className="text-sm text-gray-600 opacity-50 dark:text-gray-50">
          <Link href="/" className="hover:underline ">
                back
              </Link>
          </div>
      <h1 className="text-normal text-gray-600 dark:text-gray-50">ghorman</h1>

        {src ? (
          <div className="relative w-full max-w-5xl mt-6 pb-[56.25%] bg-black border border-disabled dark:border-disabled-dark">
            <iframe
              src={src}
              title="Ghorman livestream"
              className="absolute inset-0 w-full h-full"
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        ) : (
          <div className="text-sm text-gray-600 dark:text-gray-50 opacity-70 mt-4">
            Set <code className="px-1">NEXT_PUBLIC_GHORMAN_YT_CHANNEL_ID</code> or{' '}
            <code className="px-1">NEXT_PUBLIC_GHORMAN_YT_VIDEO_ID</code> to enable the livestream embed.
          </div>
        )}

        {/* Infobox-style stats */}
        <section className="w-full max-w-5xl mt-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Image or placeholder */}
            <div className="md:col-span-5 p-3">
              <div className="w-full aspect-[4/3] overflow-hidden border border-disabled dark:border-disabled-dark flex items-center justify-center bg-bgLight dark:bg-bgDark">
                {infoImage ? (
                  <img
                    src={infoImage}
                    alt="Ghorman"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-xs text-gray-600 dark:text-gray-50 opacity-70">Picture coming soon</span>
                  </div>
                )}
              </div>
            </div>
            {/* Tailored stats */}
            <div className="md:col-span-7 p-3 md:p-4">
              <div className="text-gray-600 dark:text-gray-50 space-y-6">
                <div>
                  <div className="text-xs uppercase opacity-70">Name</div>
                  <div className="text-lg md:text-xl">{name}</div>
                </div>
                <div>
                  <div className="text-xs uppercase opacity-70">Species</div>
                  <div className="text-base md:text-lg">{speciesCommon}</div>
                </div>
                <div>
                  <div className="text-xs uppercase opacity-70">Scientific name</div>
                  <div className="text-base md:text-lg italic">{scientificName}</div>
                </div>
                <div>
                  <div className="text-xs uppercase opacity-70">Origin</div>
                  <div className="text-base md:text-lg">{origin}</div>
                </div>
                <div>
                  <div className="text-xs uppercase opacity-70">Sex</div>
                  <div className="text-base md:text-lg">{sex}</div>
                </div>
                <div>
                  <div className="text-xs uppercase opacity-70">Birthday</div>
                  <div className="text-base md:text-lg">{birthdayISO || '—'}</div>
                </div>
                <div>
                  <div className="text-xs uppercase opacity-70">Age</div>
                  <div className="text-base md:text-lg">{age}</div>
                </div>
                <div>
                  <div className="text-xs uppercase opacity-70">Enclosure</div>
                  <div className="text-base md:text-lg">{enclosure}</div>
                </div>
                <div>
                  <div className="text-xs uppercase opacity-70">Temperature</div>
                  <div className="text-base md:text-lg">{tempRange}</div>
                </div>
                <div>
                  <div className="text-xs uppercase opacity-70">Humidity</div>
                  <div className="text-base md:text-lg">{humidityRange}</div>
                </div>
                <div>
                  <div className="text-xs uppercase opacity-70">Last molt</div>
                  <div className="text-base md:text-lg">{lastMolt}</div>
                </div>
                <div>
                  <div className="text-xs uppercase opacity-70">Last fed</div>
                  <div className="text-base md:text-lg">{lastFed}</div>
                </div>
              </div>
            </div>
          </div>
        </section>
    </main>
  )
}

