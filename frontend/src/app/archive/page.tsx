import Link from 'next/link'

export default function ArchivePage() {
  return (
    <main className="min-h-screen flex-grid items-center justify-center bg-bgLight dark:bg-bgDark p-6 md:px-56 px-6 pt-24">
      <div className="text-sm text-gray-600 opacity-50 dark:text-gray-50">
        <Link href="/" className="hover:underline ">
          back
        </Link>
      </div>
      <h1 className="text-normal text-gray-600 dark:text-gray-50">archive</h1>

      <section className="w-full max-w-2xl mt-4 mb-6">
        <div className="text-xs text-gray-600 dark:text-gray-50">
          <p className="mb-2">im tired and dont feel like building this rn</p>
        </div>
      </section>
    </main>
  )
}
