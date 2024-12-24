"use client";
import Link from 'next/link'
import { berkeleymono } from '../fonts' // Update this import path as needed

export default function Page() {
  

  return (
    <main className="min-h-screen flex-grid items-center justify-center bg-bgLight dark:bg-bgDark p-6">
      <div className={berkeleymono.className}>
          <div className="font-mono text-gray-600 dark:text-gray-50">
            cv <span className="text-international-orange-engineering dark:text-international-orange">[down for maintenance]</span>
          </div>
          <div className="font-mono text-gray-600 dark:text-gray-50">
          <Link href="/" className="hover:underline ">
                back
              </Link>
          </div>
          </div>

          
    </main>
  )
}