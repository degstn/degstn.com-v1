"use client";
import Link from 'next/link'
import CvContent from './CvContent'

export default function CV() {
  return (
    <main className="min-h-screen bg-bgLight dark:bg-bgDark p-6 px-4 pt-10 sm:px-5 md:px-6 md:pt-12 lg:px-8 xl:pl-10">
      <div className="text-sm text-gray-600 opacity-50 dark:text-gray-50">
        <Link href="/" className="hover:underline ">
          back
        </Link>
      </div>
      <div className="mt-10 w-full max-w-2xl">
        <CvContent />
      </div>
    </main>
  )
}
