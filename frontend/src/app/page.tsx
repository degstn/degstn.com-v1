import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="bg-white flex min-h-screen flex-col items-start justify-center">
      {/* <div className="relative flex place-items-center before:absolute "> */}
      <div className='lg:pt-64 pt-96'>
          <div className="grid grid-cols-10 lg:ml-10 md:pl-40 lg:px-32 sm:px-0 gap-5 sm:mt-20 mb-32 ">
          
          <div className=" col-end-3 lg:px-20  ">
          <span className="text-3xl bg-clip-text text-transparent bg-gradient-to-r from-rose-400 to-orange-300 tracking-tight font-normal">2023</span>
          </div>
          <div className="col-end-7 col-span-2 lg:px-20 ">
            <span className="text-3xl text-gray-400 tracking-tight font-normal">
            <Link href="https://github.com/degstn/">
                    <p className="hover:underline underline-offset-4">Inertia</p>
                  </Link>
            </span>
          </div>
          <div className="col-end-7 col-span-2 lg:px-20 ">
            <span className="text-3xl text-gray-400 tracking-tight font-normal">
            <Link href="https://spatialwaypoints.com/">
                    <p className="hover:underline underline-offset-4">Limen</p>
                  </Link>
            </span>
          </div>
          <div className="col-end-7 col-span-2 lg:px-20 pb-10 ">
            <span className="text-3xl text-gray-400 tracking-tight font-normal">
              <Link href="https://www.stelio.ai/">
                    <p className="hover:underline underline-offset-4">Stelio</p>
                  </Link>
            </span>
          </div>
          <div className=" col-end-3 lg:px-20 pb-10 ">
          <span className="text-3xl text-gray-400 tracking-tight font-normal">2023</span>
          </div>
          <div className="col-end-7 col-span-2 lg:px-20 ">
            <span className="text-3xl text-gray-400 tracking-tight font-normal">
            <Link href="https://docs.google.com/presentation/d/1HR3efx1HpUI6DvxthVhOzCj9JLPVE0YNZ744-EnUHAc/edit?usp=sharing">
                    <p className="hover:underline underline-offset-4">Service Seeker</p>
                  </Link>
            </span>
          </div>
          <div className="col-end-7 col-span-2 lg:px-20 pb-10 ">
            <span className="text-3xl text-gray-400 tracking-tight font-normal">
            <Link href="https://aimazing.shop/">
                    <p className="hover:underline underline-offset-4">AImazing</p>
                  </Link>
            </span>
          </div>
          <div className=" col-end-3 lg:px-20 ">
          <span className="text-3xl text-gray-400 tracking-tight font-normal">2022</span>
          </div>
          <div className="col-end-7 col-span-2 lg:px-20 ">
            <span className="text-3xl text-gray-400 tracking-tight font-normal">
            <Link href="https://github.com/degstn/">
                    <p className="hover:underline underline-offset-4">redacted</p>
              </Link>
            </span>
          </div>
        </div>
        <div className="grid grid-cols-10 lg:ml-10 lg:px-32 sm:px-0 gap-5 sm:mt-20 mb-32 ">
          
          <div className="col-end-7 col-span-2  lg:pl-20">
            <span className="text-xl text-gray-400 tracking-tight font-normal">
            <Link href="https://github.com/degstn/">

                    <picture>
                <Image
                    src="/github2.svg"
                    alt="GitHub Icon"
                    width={30}
                    height={30}
                />
              </picture>
                  </Link>
            </span>
          </div>
        </div>
      </div>
    </main>
  )
}