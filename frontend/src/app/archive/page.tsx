import Link from 'next/link'
import type { CSSProperties } from 'react'

const CHIP_CHAMFER: CSSProperties = {
  clipPath:
    'polygon(4px 0, calc(100% - 4px) 0, calc(100% - 4px) 4px, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 4px calc(100% - 4px), 0 calc(100% - 4px), 0 4px, 4px 4px)',
}

const BAR_CHAMFER: CSSProperties = {
  clipPath:
    'polygon(2px 0, calc(100% - 2px) 0, calc(100% - 2px) 2px, 100% 2px, 100% calc(100% - 2px), calc(100% - 2px) calc(100% - 2px), calc(100% - 2px) 100%, 2px 100%, 2px calc(100% - 2px), 0 calc(100% - 2px), 0 2px, 2px 2px)',
}

export default function ArchivePage() {
  return (
    <main className="min-h-screen flex-grid items-center justify-center bg-bgLight dark:bg-bgDark p-6 md:px-56 px-6 pt-24">
      <div className="text-sm text-gray-600 opacity-50 dark:text-gray-50">
        <Link href="/" className="hover:underline ">
          back
        </Link>
      </div>
      <h1 className="text-lg font-bold tracking-tight text-gray-600 dark:text-gray-50">archive</h1>

      <section className="mt-10 flex w-full max-w-md flex-col items-start gap-5">
        <span
          className="inline-flex items-center bg-international-orange-engineering/80 px-3 py-1 text-xs font-semibold tracking-tight text-gray-50 dark:bg-international-orange/80 dark:text-bgDark"
          style={CHIP_CHAMFER}
        >
          in progress
        </span>

        <p className="text-sm text-gray-600 dark:text-gray-50">
          older projects coming soon<span className="blink-cursor" aria-hidden="true">▌</span>
        </p>

        <div
          className="relative h-3 w-full overflow-hidden bg-disabled/40 dark:bg-disabled-dark/40"
          style={BAR_CHAMFER}
          aria-hidden="true"
        >
          <div className="archive-scan absolute left-0 top-0 h-full w-1/3 bg-international-orange-engineering dark:bg-international-orange" />
        </div>

        <p className="text-xs text-gray-600 opacity-70 dark:text-gray-50">
          im currently gathering everything pre-2023 from old drives and forgotten repos. check back soon.
        </p>
      </section>
    </main>
  )
}
