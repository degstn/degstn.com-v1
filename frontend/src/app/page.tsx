import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <main className=" flex min-h-screen flex-col items-center justify-center">
      {/* <div className="relative flex place-items-center before:absolute "> */}
      <meta name="theme-color" content="#f9fafb dark:#718096"></meta>

      <div className='lg:pt-64 pt-96 font-serif'>
          <div className="grid grid-cols-10 lg:ml-10 md:pl-40 lg:px-32 sm:px-0 gap-5 sm:mt-20 mb-32 ">
          
          <div className=" col-end-3 lg:px-20  ">
          <span className="text-3xl bg-clip-text text-transparent bg-gradient-to-r from-rose-600 to-orange-300 tracking-tight font-light">2024</span>
          </div>
          <div className="col-end-7 col-span-2 lg:px-20 ">
          <span className="text-3xl text-gray-600 tracking-tight font-normal dark:text-gray-50">
            <Link href="https://aremac.tech/">
                    <p className="hover:underline underline-offset-4">aremac</p>
                  </Link>
            </span>
          </div>
          <div className="col-end-7 col-span-2 lg:px-20 ">
            <span className="text-3xl text-gray-600 tracking-tight font-normal dark:text-gray-50">
            <Link href="https://spatialwaypoints.com/">
                    <p className="hover:underline underline-offset-4">limen</p>
                  </Link>
            </span>
          </div>
          <div className="col-end-7 col-span-2 lg:px-20 pb-10 ">
            <span className="text-3xl text-gray-600 tracking-tight font-normal dark:text-gray-50">
              <Link href="https://stelio.ai/">
                    <p className="hover:underline underline-offset-4">stelio</p>
                  </Link>
            </span>
          </div>
          <div className=" col-end-3 lg:px-20 pb-10 ">
          <span className="text-3xl text-gray-600 tracking-tight font-light dark:text-gray-50">2023</span>
          </div>
          <div className="col-end-7 col-span-2 lg:px-20 ">
            <span className="text-3xl text-gray-600 tracking-tight font-normal dark:text-gray-50">
            <Link href="https://docs.google.com/presentation/d/1HR3efx1HpUI6DvxthVhOzCj9JLPVE0YNZ744-EnUHAc/edit?usp=sharing">
                    <p className="hover:underline underline-offset-4">service seeker</p>
                  </Link>
            </span>
          </div>
          <div className="col-end-7 col-span-2 lg:px-20 pb-10 ">
            <span className="text-3xl text-gray-600 tracking-tight font-normal dark:text-gray-50">
            <Link href="https://aimazing.shop/">
                    <p className="hover:underline underline-offset-4">aimazing</p>
                  </Link>
            </span>
          </div>
          <div className=" col-end-3 lg:px-20 ">
          <span className="text-3xl text-gray-600 tracking-tight font-light dark:text-gray-50">2022</span>
          </div>
          <div className="col-end-7 col-span-2 lg:px-20 ">
            <span className="text-3xl text-gray-600 tracking-tight font-normal dark:text-gray-50">
            <Link href="https://web.archive.org/web/goldy.design">
                    <p className="hover:underline underline-offset-4">portfolio archive</p>
              </Link>
            </span>
          </div>
        </div>
        <div className="grid grid-cols-10 lg:ml-10 lg:px-32 sm:px-0 gap-5 sm:mt-20 mb-32 ">
          
        <div className="col-end-7 col-span-2 lg:pl-20">
  <div className='flex flex-row text-gray-600 dark:text-gray-50'>
    <div className="px-5">
      <Link href="https://github.com/degstn/">
        <svg
          width={30}
          height={30}
          viewBox="0 0 45.8 44.67"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M22.9,0C10.25,0,0,10.25,0,22.9c0,10.13,6.55,18.69,15.66,21.73,1.15.2,1.57-.49,1.57-1.09,0-.54-.03-2.35-.03-4.26-5.75,1.06-7.24-1.4-7.7-2.69-.26-.66-1.37-2.69-2.35-3.23-.8-.43-1.95-1.49-.03-1.52,1.8-.03,3.09,1.66,3.52,2.35,2.06,3.46,5.35,2.49,6.67,1.89.2-1.49.8-2.49,1.46-3.06-5.1-.57-10.42-2.55-10.42-11.31,0-2.49.89-4.55,2.35-6.15-.23-.57-1.03-2.92.23-6.07,0,0,1.92-.6,6.3,2.35,1.83-.52,3.78-.77,5.72-.77s3.89.26,5.72.77c4.38-2.98,6.3-2.35,6.3-2.35,1.26,3.15.46,5.5.23,6.07,1.46,1.6,2.35,3.64,2.35,6.15,0,8.79-5.35,10.73-10.45,11.31.83.72,1.55,2.09,1.55,4.24,0,3.06-.03,5.52-.03,6.3,0,.6.43,1.32,1.57,1.09,4.55-1.53,8.5-4.46,11.29-8.35,2.8-3.9,4.3-8.57,4.31-13.37C45.8,10.25,35.55,0,22.9,0Z"
          />
        </svg>
      </Link>
    </div>
    <Link href="https://linkedin.com/in/degstn/">
      <svg
        width={30}
        height={30}
        viewBox="0 0 44.92 44.92"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="currentColor"
          fillRule="evenodd"
          d="M44.92,25.96v18.96h-9.23v-15.72c0-4.31-1.64-6.72-5.05-6.72-3.71,0-5.65,2.51-5.65,6.72v15.72h-8.9V14.97h8.9v4.03s2.68-4.95,9.03-4.95,10.9,3.88,10.9,11.9Z"
        />
        <rect x=".89" y="14.97" width="9.28" height="29.95" fill="currentColor" />
        <path
          fill="currentColor"
          fillRule="evenodd"
          d="M10.97,5.53c0,3.05-2.45,5.52-5.49,5.52S0,8.58,0,5.53,2.45,0,5.49,0s5.49,2.47,5.49,5.53Z"
        />
      </svg>
    </Link>
  </div>
</div>
        </div>
      </div>
    </main>
  )
}