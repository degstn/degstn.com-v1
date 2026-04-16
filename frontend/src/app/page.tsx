"use client";

import Link from 'next/link'
import { useState, useEffect } from 'react';
import { projects } from '@/data/projects';

type Project = {
  slug: string;
  name: string;
  url: string;
  image: string;
  description: string;
  tags: string[];
};

// Auto-bust media cache each page load so same-name S3 uploads refresh without manual versioning.
const ASSET_VERSION = Date.now().toString();

function withCacheBust(url: string, version?: string) {
  if (!version) return url;
  try {
    const parsed = new URL(url);
    parsed.searchParams.set('v', version);
    return parsed.toString();
  } catch {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}v=${encodeURIComponent(version)}`;
  }
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  if (!project) return null;
  const mediaSrc = withCacheBust(project.image, ASSET_VERSION);

  function getCTAButtonClass(slug: string) {
    // Vercel-style CTA: pill, border, light bg, dark text, bold, left-aligned
    return 'inline-flex items-center gap-2 px-6 py-2 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-50 font-semibold shadow-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 text-base md:text-lg';
  }

  function getCTAButtonContent(project: Project) {
    return <><span>Visit Site</span><img src="/arrow.svg" alt="Northeast arrow" width={20} height={20} style={{ display: 'inline', marginLeft: '0.3em', verticalAlign: 'middle' }} /></>;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-bgLight dark:bg-[#111111]/95">
      <div className="bg-bgLight dark:bg-[#111111] border-2 border-disabled dark:border-disabled-dark w-full max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-4 relative mt-10 overflow-y-auto max-h-none">
        <button
          onClick={onClose}
          className="fixed md:absolute top-6 right-6 z-20 px-4 py-2 rounded-full text-base font-semibold transition-colors duration-200
            bg-transparent text-gray-600 dark:text-gray-50 hover:text-gray-700 dark:hover:text-gray-100 shadow-none"
          style={{ pointerEvents: 'auto' }}
        >
          Close
        </button>
        <div className="mt-32 mb-32 flex flex-col md:flex-row gap-8 items-stretch">
          <a href={project.url} target="_blank" rel="noopener noreferrer" className="block md:w-1/2 w-full flex-shrink-0">
            <div
              className="aspect-[3/2] w-full bg-bgLight dark:bg-[#111111] overflow-hidden max-h-[60rem] flex items-center justify-center rounded-2xl md:rounded-3xl"
              style={project.image.toLowerCase().endsWith('.mov') ? { overflow: 'visible' } : undefined}
            >
              {project.image.toLowerCase().endsWith('.mov') ? (
                <div className="relative w-full h-full" style={{ overflow: 'visible' }}>
                  <img
                    src="https://cdn.degstn.com/aremac.png"
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
                  />
                  <video
                    src={mediaSrc}
                    muted
                    autoPlay
                    loop
                    playsInline
                    preload="auto"
                    controls={false}
                    controlsList="nodownload noplaybackrate nofullscreen noremoteplayback"
                    disablePictureInPicture
                    onContextMenu={(e) => e.preventDefault()}
                    className="object-cover w-full h-full"
                    style={{ pointerEvents: 'none', backgroundColor: 'transparent', clipPath: 'inset(3.6% 4% 7.4% 4% round 13px)' }}
                  />
                </div>
              ) : (
                <img src={mediaSrc} alt={project.name} className="object-contain w-full h-full cursor-pointer" />
              )}
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
              {project.tags.map((tag: string, idx: number) => (
                <span key={tag} className="inline-block text-international-orange-engineering dark:text-international-orange text-xs font-semibold">
                  {tag}{idx < project.tags.length - 1 && <span className="mx-1">&bull;</span>}
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

  useEffect(() => {
    if (openProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [openProject]);

  useEffect(() => {
    const preloadedImages: HTMLImageElement[] = [];
    const preloadLinks: HTMLLinkElement[] = [];

    projects.forEach((project) => {
      const src = withCacheBust(project.image, ASSET_VERSION);

      if (project.image.toLowerCase().endsWith('.mov')) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'video';
        link.href = src;
        document.head.appendChild(link);
        preloadLinks.push(link);
        return;
      }

      const image = new Image();
      image.src = src;
      preloadedImages.push(image);
    });

    return () => {
      preloadLinks.forEach((link) => link.remove());
    };
  }, []);

  return (
    <>
      {openProject && <ProjectModal project={openProject} onClose={() => setOpenProject(null)} />}
      <main className="flex min-h-screen flex-col bg-bgLight dark:bg-[#111111]">
        <div className="flex w-full flex-col items-start px-4 pt-10 pb-8 sm:px-5 md:max-w-lg md:px-6 md:pt-12 md:pb-3 lg:pl-8 lg:pr-6 xl:pl-10 text-gray-600 dark:text-gray-50">
          <header className="mb-10 md:mb-12">
            <div className="box-border inline-block w-[5ch] shrink-0 space-y-1 pl-[1ch] text-left tabular-nums text-lg tracking-tight font-normal text-gray-600 dark:text-gray-50">
              <a href="mailto:d@degstn.com" target="_blank" rel="noopener noreferrer" className="block hover:underline underline-offset-4">
                drew
              </a>
              <Link href="/cv" className="block hover:underline underline-offset-4">
                cv
              </Link>
            </div>
          </header>

          <div className="flex w-full flex-col gap-6 md:gap-7">
            <section className="flex gap-6 md:gap-8">
              <span className="inline-block w-[5ch] shrink-0 text-right tabular-nums text-lg tracking-tight font-normal text-international-orange-engineering dark:text-international-orange">2026</span>
              <div className="flex min-w-0 flex-col gap-1">
                <button type="button" onClick={() => {
                  const localeCenterProject = projects.find(p => p.slug === 'locale-center');
                  localeCenterProject && setOpenProject(localeCenterProject);
                }} className="text-left text-lg text-gray-600 tracking-tight font-normal dark:text-gray-50 hover:underline underline-offset-4">
                  locale.center
                </button>
                <Link href="/photography" className="text-lg text-gray-600 tracking-tight font-normal dark:text-gray-50 hover:underline underline-offset-4">photography</Link>
                <Link href="/ghorman" className="text-lg text-gray-600 tracking-tight font-normal dark:text-gray-50 hover:underline underline-offset-4">ghorman</Link>
                <a href="https://dg.photos" target="_blank" rel="noopener noreferrer" className="text-lg text-gray-600 tracking-tight font-normal dark:text-gray-50 hover:underline underline-offset-4">dg.photos</a>
              </div>
            </section>

            <section className="flex gap-6 md:gap-8">
              <span className="inline-block w-[5ch] shrink-0 text-right tabular-nums text-lg tracking-tight font-normal text-gray-600 dark:text-gray-50">2025</span>
              <div className="flex min-w-0 flex-col gap-1">
                <button type="button" onClick={() => {
                  const starwarsProject = projects.find(p => p.slug === 'starwars-cad');
                  starwarsProject && setOpenProject(starwarsProject);
                }} className="text-left text-lg text-gray-600 tracking-tight font-normal dark:text-gray-50 hover:underline underline-offset-4">
                  CAD
                </button>
                <button type="button" onClick={() => {
                  const polylineProject = projects.find(p => p.slug === 'polyline');
                  polylineProject && setOpenProject(polylineProject);
                }} className="text-left text-lg text-gray-600 tracking-tight font-normal dark:text-gray-50 hover:underline underline-offset-4">
                  polyline
                </button>
                <button type="button" onClick={() => {
                  const s7emProject = projects.find(p => p.slug === 's7em');
                  s7emProject && setOpenProject(s7emProject);
                }} className="text-left text-lg text-gray-600 tracking-tight font-normal dark:text-gray-50 hover:underline underline-offset-4">
                  s7em
                </button>
                <Link href="/words" className="text-lg text-gray-600 tracking-tight font-normal dark:text-gray-50 hover:underline underline-offset-4">words</Link>
              </div>
            </section>

            <section className="flex gap-6 md:gap-8">
              <span className="inline-block w-[5ch] shrink-0 text-right tabular-nums text-lg tracking-tight font-normal text-gray-600 dark:text-gray-50">2024</span>
              <div className="flex min-w-0 flex-col gap-1">
                <button type="button" onClick={() => {
                  const aremacProject = projects.find(p => p.slug === 'aremac');
                  aremacProject && setOpenProject(aremacProject);
                }} className="text-left text-lg text-gray-600 tracking-tight font-normal dark:text-gray-50 hover:underline underline-offset-4">
                  aremac
                </button>
                <button type="button" onClick={() => {
                  const limenProject = projects.find(p => p.slug === 'limen');
                  limenProject && setOpenProject(limenProject);
                }} className="text-left text-lg text-gray-600 tracking-tight font-normal dark:text-gray-50 hover:underline underline-offset-4">
                  limen
                </button>
                <button type="button" onClick={() => {
                  const stelioProject = projects.find(p => p.slug === 'stelio');
                  stelioProject && setOpenProject(stelioProject);
                }} className="text-left text-lg text-gray-600 tracking-tight font-normal dark:text-gray-50 hover:underline underline-offset-4">
                  stelio
                </button>
              </div>
            </section>

            <section className="flex gap-6 md:gap-8">
              <span className="inline-flex w-[5ch] shrink-0 items-baseline tabular-nums text-lg tracking-tight font-normal text-gray-600 dark:text-gray-50">
                <span className="inline-flex w-[1ch] shrink-0 justify-end">{'<'}</span>
                <span className="inline-block w-[4ch] text-right tabular-nums">2023</span>
              </span>
              <div className="flex min-w-0 flex-col gap-1">
                <button type="button" onClick={() => {
                  const serviceSeekerProject = projects.find(p => p.slug === 'service-seeker');
                  serviceSeekerProject && setOpenProject(serviceSeekerProject);
                }} className="text-left text-lg text-gray-600 tracking-tight font-normal dark:text-gray-50 hover:underline underline-offset-4 whitespace-nowrap">
                  service seeker
                </button>
                <Link href="/archive" className="text-lg italic text-gray-600 tracking-tight font-normal dark:text-gray-50 hover:underline underline-offset-4">
                  archive
                </Link>
              </div>
            </section>
          </div>
        </div>

        <footer className="mt-auto flex w-full flex-col gap-4 px-4 pb-12 pt-4 sm:px-5 md:max-w-lg md:flex-row md:items-center md:gap-8 md:px-6 md:pt-2 md:pb-16 lg:pl-8 lg:pr-6 xl:pl-10 text-gray-600 dark:text-gray-50">
          <Link
            href="/git"
            aria-label="Changelog"
            className="inline-flex min-w-0 flex-row flex-nowrap items-center gap-1 text-international-orange-engineering dark:text-international-orange"
          >
            <svg width={12} height={12} viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
              <path
                fill="currentColor"
                fillRule="evenodd"
                d="M9.5 3.25a2.25 2.25 0 1 1 3 2.122V6A2.5 2.5 0 0 1 10 8.5H6a1 1 0 0 0-1 1v1.128a2.251 2.251 0 1 1-1.5 0V5.372a2.25 2.25 0 1 1 1.5 0v1.836A2.493 2.493 0 0 1 6 7h4a1 1 0 0 0 1-1v-.628A2.25 2.25 0 0 1 9.5 3.25Zm-6 0a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Zm8.25-.75a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5ZM4.25 12a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Z"
              />
            </svg>
            <span className="whitespace-nowrap text-xs text-international-orange-engineering tracking-tight font-medium dark:text-international-orange">
              prod <span className="text-gray-600 dark:text-gray-50">v{process.env.NEXT_PUBLIC_VERSION}</span>
            </span>
          </Link>
          <div className="flex flex-row flex-wrap items-center gap-x-5 gap-y-1 text-lg tracking-tight font-normal text-gray-600 dark:text-gray-50 md:text-xs md:font-medium">
            <Link href="https://github.com/degstn/" className="hover:underline underline-offset-4">
              github
            </Link>
            <Link href="https://linkedin.com/in/degstn/" className="hover:underline underline-offset-4">
              linkedin
            </Link>
          </div>
        </footer>
      </main>
    </>
  );
}