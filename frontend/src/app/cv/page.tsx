"use client";
import Link from 'next/link'
import CvContent from './CvContent'

export default function CV() {
  return (
    <main className="min-h-screen flex-grid items-center justify-center bg-bgLight dark:bg-bgDark p-6 md:px-56 px-6 pt-24 ">
      <div className="text-sm text-gray-600 opacity-50 dark:text-gray-50">
        <Link href="/" className="hover:underline ">
          back
        </Link>
      </div>
      <CvContent />
    </main>
  )
}
