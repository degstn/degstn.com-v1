"use client";

import Link from 'next/link'
import { useState, useEffect, type ReactNode } from 'react';
import { projects, pages } from '@/data/projects';
import CvContent from './cv/CvContent';

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

const navItemClass =
  'group inline-flex items-center gap-1 text-lg text-gray-600 tracking-tight font-normal dark:text-gray-50';

const openPillClass =
  'mt-1 inline-flex items-center gap-1.5 rounded-sm border border-international-orange-engineering/40 bg-international-orange-engineering/10 px-2.5 py-0.5 text-xs font-medium tracking-tight text-international-orange-engineering transition-colors duration-200 hover:bg-international-orange-engineering/20 dark:border-international-orange/40 dark:bg-international-orange/10 dark:text-international-orange dark:hover:bg-international-orange/20';

function NavLabel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span className={`group-hover:underline underline-offset-4 ${className}`}>
      {children}
    </span>
  );
}

function HoverHint({ children }: { children: string }) {
  return (
    <span className="hidden text-zinc-500 opacity-50 dark:text-zinc-500 group-hover:inline no-underline">
      {children}
    </span>
  );
}

// Internal urls navigate in-place; external ones open a new tab.
function ProjectLink({ href, className, children }: { href: string; className?: string; children: ReactNode }) {
  if (href.startsWith('/')) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  );
}

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

function ProjectMedia({ project, className = '' }: { project: Project; className?: string }) {
  const mediaSrc = withCacheBust(project.image, ASSET_VERSION);
  const isVideo = project.image.toLowerCase().endsWith('.mov');

  if (!project.image) {
    return (
      <div className={`aspect-[3/2] w-full border border-disabled dark:border-disabled-dark flex items-center justify-center ${className}`}>
        <span className="text-xs tracking-tight text-disabled dark:text-disabled-dark">screenshot soon</span>
      </div>
    );
  }

  return (
    <div
      className={`aspect-[3/2] w-full overflow-hidden flex items-center justify-center ${className}`}
      style={isVideo ? { overflow: 'visible' } : undefined}
    >
      {isVideo ? (
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
  );
}

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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-bgLight dark:bg-[#111111]/95 md:hidden">
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
            <ProjectMedia project={project} className="bg-bgLight dark:bg-[#111111] max-h-[60rem] rounded-2xl md:rounded-3xl" />
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

function ProjectPanel({ project }: { project: Project }) {
  return (
    <aside
      aria-label={`${project.name} details`}
      className="hidden min-w-0 flex-1 px-6 pb-12 md:block md:h-full md:overflow-y-auto md:pt-[9.75rem] lg:px-8 xl:pr-10"
    >
      {project.slug === 'cv' ? (
        <div className="w-full max-w-2xl text-gray-600 dark:text-gray-50">
          <div className="flex flex-col items-start gap-3">
            <h2 className="text-lg md:text-xl font-bold tracking-tight">{project.name}</h2>
            <ProjectLink href={project.url} className={openPillClass}>
              open <span aria-hidden="true">↗</span>
            </ProjectLink>
          </div>
          <div className="mt-8">
            <CvContent />
          </div>
        </div>
      ) : (
        <div className="flex w-full flex-col gap-8 xl:flex-row xl:items-start xl:gap-10">
          <div className="flex w-full max-w-sm shrink-0 flex-col items-start gap-3 text-gray-600 dark:text-gray-50 xl:w-64">
            <h2 className="text-lg md:text-xl font-bold tracking-tight">{project.name}</h2>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag: string, idx: number) => (
                <span key={tag} className="inline-block text-international-orange-engineering dark:text-international-orange text-xs font-semibold">
                  {tag}{idx < project.tags.length - 1 && <span className="mx-1">&bull;</span>}
                </span>
              ))}
            </div>
            <ProjectLink href={project.url} className={openPillClass}>
              open <span aria-hidden="true">↗</span>
            </ProjectLink>
            <p className="mt-2 text-xs md:text-sm">{project.description}</p>
          </div>
          <ProjectLink href={project.url} className="block w-full min-w-0 xl:flex-1">
            <ProjectMedia project={project} className="max-h-[70vh]" />
          </ProjectLink>
        </div>
      )}
    </aside>
  );
}

export default function Home() {
  const [openProject, setOpenProject] = useState<Project | null>(null);

  useEffect(() => {
    // Scroll lock only applies to the mobile modal; the desktop panel is in-page.
    const desktopQuery = window.matchMedia('(min-width: 768px)');
    const applyScrollLock = () => {
      document.body.style.overflow = openProject && !desktopQuery.matches ? 'hidden' : '';
    };
    applyScrollLock();
    desktopQuery.addEventListener('change', applyScrollLock);
    return () => {
      desktopQuery.removeEventListener('change', applyScrollLock);
      document.body.style.overflow = '';
    };
  }, [openProject]);

  useEffect(() => {
    const preloadedImages: HTMLImageElement[] = [];
    const preloadLinks: HTMLLinkElement[] = [];

    [...projects, ...pages].forEach((project) => {
      if (!project.image) return;
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

  const projectItem = (slug: string, label: string, extraClass = '') => {
    const isOpen = openProject?.slug === slug;
    return (
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => {
          if (isOpen) {
            setOpenProject(null);
            return;
          }
          const project = projects.find((p) => p.slug === slug);
          if (project) setOpenProject(project);
        }}
        className={`${navItemClass} text-left${extraClass ? ` ${extraClass}` : ''}`}
      >
        <NavLabel className={isOpen ? 'font-bold' : ''}>{label}</NavLabel>
        <HoverHint>{isOpen ? '[-]' : '[+]'}</HoverHint>
      </button>
    );
  };

  // Page links preview in the panel on desktop; on mobile they navigate as usual.
  const pageItem = (slug: string, label: string, labelClass = '') => {
    const page = pages.find((p) => p.slug === slug);
    if (!page) return null;
    const isOpen = openProject?.slug === slug;
    return (
      <Link
        href={page.url}
        aria-expanded={isOpen}
        onClick={(e) => {
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
          if (!window.matchMedia('(min-width: 768px)').matches) return;
          e.preventDefault();
          setOpenProject(isOpen ? null : page);
        }}
        className={navItemClass}
      >
        <NavLabel className={`${labelClass}${isOpen ? ' font-bold' : ''}`}>{label}</NavLabel>
        <HoverHint>{isOpen ? '[-]' : '[+]'}</HoverHint>
      </Link>
    );
  };

  return (
    <>
      {openProject && <ProjectModal project={openProject} onClose={() => setOpenProject(null)} />}
      <main className={`flex min-h-screen flex-col bg-bgLight dark:bg-[#111111]${openProject ? ' md:h-screen md:overflow-hidden' : ''}`}>
        <div className="flex w-full flex-1 items-start md:min-h-0">
          <div className="flex w-full flex-col items-start px-4 pt-10 pb-8 sm:px-5 md:max-w-xs md:shrink-0 md:px-6 md:pt-12 md:pb-3 lg:pl-8 lg:pr-6 xl:pl-10 text-gray-600 dark:text-gray-50">
            <header className="mb-10 md:mb-12">
              <div className="box-border inline-block w-[5ch] shrink-0 space-y-1 pl-[1ch] text-left tabular-nums text-lg tracking-tight font-normal text-gray-600 dark:text-gray-50">
                <a href="mailto:d@degstn.com" target="_blank" rel="noopener noreferrer" className={navItemClass}>
                  <NavLabel>drew</NavLabel>
                  <HoverHint>[email]</HoverHint>
                </a>
                {pageItem('cv', 'cv')}
              </div>
            </header>

            <div className="flex w-full flex-col gap-6 md:gap-7">
              <section className="flex gap-6 md:gap-8">
                <span className="inline-block w-[5ch] shrink-0 text-right tabular-nums text-lg tracking-tight font-normal text-international-orange-engineering dark:text-international-orange">2026</span>
                <div className="flex min-w-0 flex-col gap-1">
                  {projectItem('locale-center', 'locale.center')}
                  {pageItem('photography', 'photography')}
                  {pageItem('ghorman', 'ghorman')}
                  {pageItem('dg-photos', 'dg.photos')}
                </div>
              </section>

              <section className="flex gap-6 md:gap-8">
                <span className="inline-block w-[5ch] shrink-0 text-right tabular-nums text-lg tracking-tight font-normal text-gray-600 dark:text-gray-50">2025</span>
                <div className="flex min-w-0 flex-col gap-1">
                  {projectItem('starwars-cad', 'CAD')}
                  {projectItem('polyline', 'polyline')}
                  {projectItem('s7em', 's7em')}
                  {pageItem('words', 'words')}
                </div>
              </section>

              <section className="flex gap-6 md:gap-8">
                <span className="inline-block w-[5ch] shrink-0 text-right tabular-nums text-lg tracking-tight font-normal text-gray-600 dark:text-gray-50">2024</span>
                <div className="flex min-w-0 flex-col gap-1">
                  {projectItem('aremac', 'aremac')}
                  {projectItem('limen', 'limen')}
                  {projectItem('stelio', 'stelio')}
                </div>
              </section>

              <section className="flex gap-6 md:gap-8">
                <span className="inline-flex w-[5ch] shrink-0 items-baseline tabular-nums text-lg tracking-tight font-normal text-gray-600 dark:text-gray-50">
                  <span className="inline-flex w-[1ch] shrink-0 justify-end">{'<'}</span>
                  <span className="inline-block w-[4ch] text-right tabular-nums">2023</span>
                </span>
                <div className="flex min-w-0 flex-col gap-1">
                  {projectItem('service-seeker', 'service seeker', 'whitespace-nowrap')}
                  {pageItem('archive', 'archive', 'italic')}
                </div>
              </section>
            </div>
          </div>

          {openProject && <ProjectPanel project={openProject} />}
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