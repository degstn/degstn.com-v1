"use client";

import Link from 'next/link'
import { useState } from 'react';
import { projects } from '@/data/projects';
import { otbulbmonoline } from './fonts';

type Project = {
  slug: string;
  name: string;
  url: string;
  image: string;
  description: string;
  tags: string[];
};

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  if (!project) return null;

  function getCTAButtonClass(slug: string) {
    // Vercel-style CTA: pill, border, light bg, dark text, bold, left-aligned
    return 'inline-flex items-center gap-2 px-6 py-2 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-50 font-semibold shadow-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 text-base md:text-lg';
  }

  function getCTAButtonContent(project: Project) {
    return <><span>Visit Site</span><img src="/arrow.svg" alt="Northeast arrow" width={20} height={20} style={{ display: 'inline', marginLeft: '0.3em', verticalAlign: 'middle' }} /></>;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-bgLight dark:bg-bgDark/95">
      <div className="bg-bgLight dark:bg-bgDark border-2 border-disabled dark:border-disabled-dark w-full max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-4 relative mt-10 overflow-y-auto max-h-none">
        <button onClick={onClose} className="absolute top-4 right-4 text-2xl z-10">&times;</button>
        <div className="mt-32 mb-32 flex flex-col md:flex-row gap-8 items-stretch">
          <a href={project.url} target="_blank" rel="noopener noreferrer" className="block md:w-1/2 w-full flex-shrink-0">
            <div className="aspect-[3/2] w-full bg-gray-200 overflow-hidden max-h-[60rem] flex items-center justify-center">
              <img src={project.image} alt={project.name} className="object-contain w-full h-full cursor-pointer" />
            </div>
          </a>
          <div className="flex flex-col justify-center md:w-1/2 w-full p-6 md:p-8">
            <div className="flex items-center mb-2 flex-wrap gap-2">
              <span className="text-lg md:text-xl font-bold mr-2 text-gray-600 dark:text-gray-50">{project.name}</span>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-50 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 border border-disabled dark:border-disabled-dark transition-colors duration-200 text-xs"
              >
                <span>Visit Site</span>
                <span className="text-disabled dark:text-disabled-dark" style={{ display: 'inline-flex', alignItems: 'center', marginLeft: '0.2em' }}>
                  <svg width="10" height="10" viewBox="0 0 21.07 21.07" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline', verticalAlign: 'middle' }} aria-hidden="true">
                    <g>
                      <path d="M1.02,20.05c-.26-.26-.4-.56-.4-.9,0-.38.13-.7.4-.94.26-.24.56-.36.9-.36.38,0,.7.12.94.36.24.24.36.55.36.94,0,.34-.12.64-.36.9-.24.26-.55.4-.94.4-.34,0-.64-.13-.9-.4ZM5.48,15.59c-.26-.26-.4-.56-.4-.9,0-.38.13-.7.4-.94.26-.24.56-.36.9-.36.38,0,.7.12.94.36.24.24.36.55.36.94,0,.34-.12.64-.36.9-.24.26-.55.4-.94.4-.34,0-.64-.13-.9-.4ZM4.63,3.24c-.39-.39-.59-.83-.59-1.33,0-.57.19-1.03.59-1.38.39-.35.83-.53,1.33-.53.57,0,1.03.18,1.38.53.35.36.53.82.53,1.38,0,.5-.18.94-.53,1.33-.36.39-.82.59-1.38.59-.5,0-.94-.19-1.33-.59ZM9.94,11.12c-.26-.26-.4-.56-.4-.9,0-.38.13-.7.4-.94.26-.24.56-.36.9-.36.38,0,.7.12.94.36.24.24.36.55.36.94,0,.34-.12.64-.36.9-.24.26-.55.4-.94.4-.34,0-.64-.13-.9-.4ZM11.23,3.24c-.39-.39-.59-.83-.59-1.33,0-.57.19-1.03.59-1.38.39-.35.83-.53,1.33-.53.57,0,1.03.18,1.38.53.35.36.53.82.53,1.38,0,.5-.18.94-.53,1.33-.36.39-.82.59-1.38.59-.5,0-.94-.19-1.33-.59ZM17.82,3.24c-.39-.39-.59-.83-.59-1.33,0-.57.19-1.03.59-1.38.39-.35.83-.53,1.33-.53.57,0,1.03.18,1.38.53.35.36.53.82.53,1.38,0,.5-.18.94-.53,1.33-.36.39-.82.59-1.38.59-.5,0-.94-.19-1.33-.59ZM17.82,9.84c-.39-.39-.59-.83-.59-1.33,0-.57.19-1.03.59-1.38.39-.35.83-.53,1.33-.53.57,0,1.03.18,1.38.53.35.36.53.82.53,1.38,0,.5-.18.94-.53,1.33-.36.39-.82.59-1.38.59-.5,0-.94-.19-1.33-.59ZM17.82,16.44c-.39-.39-.59-.83-.59-1.33,0-.57.19-1.03.59-1.38.39-.35.83-.53,1.33-.53.57,0,1.03.18,1.38.53.35.36.53.82.53,1.38,0,.5-.18.94-.53,1.33-.36.39-.82.59-1.38.59-.5,0-.94-.19-1.33-.59Z" fill="currentColor"/>
                      <path d="M9.51,11.55c-.39-.39-.59-.83-.59-1.33,0-.57.19-1.03.59-1.38.39-.35.83-.53,1.33-.53.57,0,1.03.18,1.38.53.35.36.53.82.53,1.38,0,.5-.18.94-.53,1.33-.36.39-.82.59-1.38.59-.5,0-.94-.19-1.33-.59Z" fill="currentColor"/>
                      <path d="M5.05,16.02c-.39-.39-.59-.83-.59-1.33,0-.57.19-1.03.59-1.38.39-.35.83-.53,1.33-.53.57,0,1.03.18,1.38.53.35.36.53.82.53,1.38,0,.5-.18.94-.53,1.33-.36.39-.82.59-1.38.59-.5,0-.94-.19-1.33-.59Z" fill="currentColor"/>
                      <path d="M.59,20.48c-.39-.39-.59-.83-.59-1.33,0-.57.19-1.03.59-1.38.39-.35.83-.53,1.33-.53.57,0,1.03.18,1.38.53.35.36.53.82.53,1.38,0,.5-.18.94-.53,1.33-.36.39-.82.59-1.38.59-.5,0-.94-.19-1.33-.59Z" fill="currentColor"/>
                    </g>
                  </svg>
                </span>
              </a>
            </div>
            <p className="mb-4 text-xs md:text-sm text-gray-600 dark:text-gray-50">{project.description}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {project.tags.map((tag: string) => (
                <span key={tag} className="inline-block text-international-orange-engineering dark:text-international-orange text-xs font-semibold">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [openProject, setOpenProject] = useState<Project | null>(null);

  return (
    <>
      {openProject && <ProjectModal project={openProject} onClose={() => setOpenProject(null)} />}
      <main className=" flex min-h-screen bg-bgLight dark:bg-bgDark flex-col items-center justify-center">
        {/* <div className="relative flex place-items-center before:absolute "> */}
        <div className='lg:pt-24 pt-56 '>
          <div className="grid grid-cols-10 lg:ml-10 md:pl-40 lg:px-32 sm:px-0 gap-2 sm:mt-20 mb-16 ">
            <div className=" col-end-3 lg:px-20  ">
              <span className="text-xl text-gray-600 tracking-tight font-normal dark:text-gray-50 ">
                <a href="mailto:d@degstn.com" target="_blank" rel="noopener noreferrer">
                  <p className="hover:underline underline-offset-4">drew</p>
                </a>
              </span>
            </div>
            <div className=" col-end-3 lg:px-20 pb-36 ">
              <span className="text-xl text-gray-600 tracking-tight font-normal dark:text-gray-50 ">
                <Link href="/cv">
                  <p className="hover:underline underline-offset-4">cv</p>
                </Link>
              </span>
            </div>
            <div className=" col-end-3 lg:px-20  ">
              <span className="text-xl bg-clip-text text-transparent text-international-orange-engineering dark:text-international-orange tracking-tight font-[400px]">2025</span>
            </div>
            <div className="col-end-7 col-span-2 lg:px-20 ">
              <span className="text-xl text-gray-600 tracking-tight font-normal dark:text-gray-50">
                <a href="https://starwars.degstn.com/" target="_blank" rel="noopener noreferrer">
                  <p className="hover:underline underline-offset-4">CAD</p>
                </a>
              </span>
            </div>
            <div className="col-end-7 col-span-2 lg:px-20 ">
              <span className="text-xl text-gray-600 tracking-tight font-normal dark:text-gray-50">
                <button onClick={() => {
                  const polylineProject = projects.find(p => p.slug === 'polyline');
                  polylineProject && setOpenProject(polylineProject);
                }}>
                  <p className="hover:underline underline-offset-4">polyline</p>
                </button>
              </span>
            </div>
            <div className="col-end-7 col-span-2 lg:px-20 ">
              <span className="text-xl text-gray-600 tracking-tight font-normal dark:text-gray-50">
                <button onClick={() => {
                  const s7emProject = projects.find(p => p.slug === 's7em');
                  s7emProject && setOpenProject(s7emProject);
                }}>
                  <p className="hover:underline underline-offset-4">s7em</p>
                </button>
              </span>
            </div>
            <div className="col-end-7 col-span-2 lg:px-20 pb-7 ">
              <span className="text-xl text-gray-600 tracking-tight font-normal dark:text-gray-50">
                <Link href="/words">
                  <p className="hover:underline underline-offset-4">words</p>
                </Link>
              </span>
            </div>
            <div className=" col-end-3 lg:px-20  ">
              <span className="text-xl text-gray-600 tracking-tight font-[400px] dark:text-gray-50">2024</span>
            </div>
            <div className="col-end-7 col-span-2 lg:px-20 ">
              <span className="text-xl text-gray-600 tracking-tight font-normal dark:text-gray-50">
                <Link href="/photography">
                  <p className="hover:underline underline-offset-4">photography</p>
                </Link>
              </span>
            </div>
            <div className="col-end-7 col-span-2 lg:px-20 ">
              <span className="text-xl text-gray-600 tracking-tight font-normal dark:text-gray-50">
                <button onClick={() => {
                  const aremacProject = projects.find(p => p.slug === 'aremac');
                  aremacProject && setOpenProject(aremacProject);
                }}>
                  <p className="hover:underline underline-offset-4">aremac</p>
                </button>
              </span>
            </div>
            <div className="col-end-7 col-span-2 lg:px-20 ">
              <span className="text-xl text-gray-600 tracking-tight font-normal dark:text-gray-50">
                <button onClick={() => {
                  const limenProject = projects.find(p => p.slug === 'limen');
                  limenProject && setOpenProject(limenProject);
                }}>
                  <p className="hover:underline underline-offset-4">limen</p>
                </button>
              </span>
            </div>
            <div className="col-end-7 col-span-2 lg:px-20 pb-7 ">
              <span className="text-xl text-gray-600 tracking-tight font-normal dark:text-gray-50">
                <button onClick={() => {
                  const stelioProject = projects.find(p => p.slug === 'stelio');
                  stelioProject && setOpenProject(stelioProject);
                }}>
                  <p className="hover:underline underline-offset-4">stelio</p>
                </button>
              </span>
            </div>
            <div className=" col-end-3 lg:px-20 pb-10 ">
              <span className="text-xl text-gray-600 tracking-tight font-[400px] dark:text-gray-50">2023</span>
            </div>
            <div className="col-end-7 col-span-2 lg:px-20 ">
              <span className="text-xl text-gray-600 tracking-tight font-normal dark:text-gray-50">
                <button onClick={() => {
                  const serviceSeekerProject = projects.find(p => p.slug === 'service-seeker');
                  serviceSeekerProject && setOpenProject(serviceSeekerProject);
                }}>
                  <p className="hover:underline underline-offset-4">service seeker</p>
                </button>
              </span>
            </div>
            <div className="col-end-7 col-span-2 lg:px-20 pb-7 ">
              <span className="text-xl text-gray-600 tracking-tight font-normal dark:text-gray-50">
                <button onClick={() => {
                  const aimazingProject = projects.find(p => p.slug === 'aimazing');
                  aimazingProject && setOpenProject(aimazingProject);
                }}>
                  <p className="hover:underline underline-offset-4">aimazing</p>
                </button>
              </span>
            </div>
            <div className=" col-end-3 lg:px-20 ">
              <span className="text-xl text-gray-600 tracking-tight font-[400px] dark:text-gray-50">2022</span>
            </div>
            <div className="col-end-7 col-span-2 lg:px-20 ">
              <span className="text-xl text-gray-600 tracking-tight font-normal dark:text-gray-50">
                <button onClick={() => {
                  const portfolioArchiveProject = projects.find(p => p.slug === 'portfolio-archive');
                  portfolioArchiveProject && setOpenProject(portfolioArchiveProject);
                }}>
                  <p className="hover:underline underline-offset-4">portfolio archive</p>
                </button>
              </span>
            </div>
          </div>
          <div className="grid grid-cols-10 lg:ml-10 lg:px-32 sm:px-0 gap-5 sm:mt-20 mb-16 ">
            <div className="col-end-3 lg:px-20 pt-1.5">
              <Link
                href="/git"
                aria-label="Changelog"
                className="inline-flex items-center space-x-1 whitespace-nowrap text-international-orange-engineering dark:text-international-orange"
              >
                <svg
                  width={12}
                  height={12}
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M9.5 3.25a2.25 2.25 0 1 1 3 2.122V6A2.5 2.5 0 0 1 10 8.5H6a1 1 0 0 0-1 1v1.128a2.251 2.251 0 1 1-1.5 0V5.372a2.25 2.25 0 1 1 1.5 0v1.836A2.493 2.493 0 0 1 6 7h4a1 1 0 0 0 1-1v-.628A2.25 2.25 0 0 1 9.5 3.25Zm-6 0a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Zm8.25-.75a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5ZM4.25 12a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Z"
                  />
                </svg>
                <span className="text-xs text-international-orange-engineering tracking-tight font-medium dark:text-international-orange">
                  prod
                </span>
                <span className="text-xs text-gray-600 tracking-tight font-medium dark:text-gray-50 pl-1">
                  v{process.env.NEXT_PUBLIC_VERSION}
                </span>
              </Link>
            </div>
            <div className="col-end-7 col-span-2 lg:pl-20">
              <div className='flex flex-row text-gray-600 dark:text-gray-50'>
                <div className="px-5">
                  <Link href="https://github.com/degstn/" aria-label="GitHub profile">
                    <svg
                      width={25}
                      height={25}
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
                <Link href="https://linkedin.com/in/degstn/" aria-label="LinkedIn profile">
                  <svg
                    width={25}
                    height={25}
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
    </>
  );
}