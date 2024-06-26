import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="bg-white flex min-h-screen flex-col items-start justify-center">
      {/* <div className="relative flex place-items-center before:absolute "> */}
      <div className='lg:pt-64 pt-96 font-serif'>
          <div className="grid grid-cols-10 lg:ml-10 md:pl-40 lg:px-32 sm:px-0 gap-5 sm:mt-20 mb-32 ">
          
          <div className=" col-end-3 lg:px-20  ">
          <span className="text-3xl bg-clip-text text-transparent bg-gradient-to-r from-rose-600 to-orange-300 tracking-tight font-light">2024</span>
          </div>
          <div className="col-end-7 col-span-2 lg:px-20 ">
            <span className="text-3xl text-gray-600 tracking-tight font-normal">
            <Link href="https://aremac.tech/">
                    <p className="hover:underline underline-offset-4">aremac</p>
                  </Link>
            </span>
          </div>
          <div className="col-end-7 col-span-2 lg:px-20 ">
            <span className="text-3xl text-gray-600 tracking-tight font-normal">
            <Link href="https://spatialwaypoints.com/">
                    <p className="hover:underline underline-offset-4">limen</p>
                  </Link>
            </span>
          </div>
          <div className="col-end-7 col-span-2 lg:px-20 pb-10 ">
            <span className="text-3xl text-gray-600 tracking-tight font-normal">
              <Link href="https://stelio.ai/">
                    <p className="hover:underline underline-offset-4">stelio</p>
                  </Link>
            </span>
          </div>
          <div className=" col-end-3 lg:px-20 pb-10 ">
          <span className="text-3xl text-gray-600 tracking-tight font-light">2023</span>
          </div>
          <div className="col-end-7 col-span-2 lg:px-20 ">
            <span className="text-3xl text-gray-600 tracking-tight font-normal">
            <Link href="https://docs.google.com/presentation/d/1HR3efx1HpUI6DvxthVhOzCj9JLPVE0YNZ744-EnUHAc/edit?usp=sharing">
                    <p className="hover:underline underline-offset-4">service seeker</p>
                  </Link>
            </span>
          </div>
          <div className="col-end-7 col-span-2 lg:px-20 pb-10 ">
            <span className="text-3xl text-gray-600 tracking-tight font-normal">
            <Link href="https://aimazing.shop/">
                    <p className="hover:underline underline-offset-4">aimazing</p>
                  </Link>
            </span>
          </div>
          <div className=" col-end-3 lg:px-20 ">
          <span className="text-3xl text-gray-600 tracking-tight font-light">2022</span>
          </div>
          <div className="col-end-7 col-span-2 lg:px-20 ">
            <span className="text-3xl text-gray-600 tracking-tight font-normal">
            <Link href="https://web.archive.org/web/goldy.design">
                    <p className="hover:underline underline-offset-4">portfolio archive</p>
              </Link>
            </span>
          </div>
        </div>
        <div className="grid grid-cols-10 lg:ml-10 lg:px-32 sm:px-0 gap-5 sm:mt-20 mb-32 ">
          
          <div className="col-end-7 col-span-2  lg:pl-20">
            <div className='flex flex-row'>
              <div className="px-5">
            <Link href="https://github.com/degstn/">

                    <picture>
                <Image
                    src="/github600.svg"
                    alt="GitHub"
                    width={30}
                    height={30}
                />
              </picture>
                  </Link>
                  </div>
            <Link href="https://linkedin.com/in/degstn/">

                    <picture>
                <Image
                    src="/in600.svg"
                    alt="LinkedIn"
                    width={30}
                    height={30}
                />
              </picture>
                  </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}