import Link from 'next/link'

export default function Home() {
  return (
    <main className="bg-white flex min-h-screen flex-col items-center justify-center">
      <div className="relative flex place-items-center before:absolute ">
        <h1 className="text-2xl text-gray-400 tracking-tight font-semibold ">
        <Link href="github.com/degstn">
          <p className="hover:text-gray-500">Drew Goldstein (Github)</p>
        </Link>
        </h1>
      </div>
    </main>
  )
}