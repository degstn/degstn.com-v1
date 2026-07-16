"use client";

import Link from 'next/link'
import { useState, useEffect, type ReactNode, type CSSProperties } from 'react';
import { projects, pages } from '@/data/projects';
import CvContent from './cv/CvContent';

type Project = {
  slug: string;
  name: string;
  url: string;
  image: string;
  images?: (string | { src: string; border?: boolean })[];
  description: string;
  tags: string[];
};

const findBySlug = (slug: string): Project | null =>
  projects.find((p) => p.slug === slug) ?? pages.find((p) => p.slug === slug) ?? null;

// Auto-bust media cache each page load so same-name S3 uploads refresh without manual versioning.
const ASSET_VERSION = Date.now().toString();

// Pixel-chamfered corners — chunkier take on the /git language bar treatment.
const PIXEL_CHAMFER_STYLE: CSSProperties = {
  clipPath:
    'polygon(4px 0, calc(100% - 4px) 0, calc(100% - 4px) 4px, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 4px calc(100% - 4px), 0 calc(100% - 4px), 0 4px, 4px 4px)',
};

// Mobile: full-width rows, label left and hint pushed to the column's right
// edge so hints stack on one vertical rail. Desktop (md+): rows shrink to
// content and the hint sits right beside the label, revealed on hover.
const navItemClass =
  'group flex w-full items-center justify-between gap-1 text-lg text-gray-600 tracking-tight font-normal dark:text-gray-50 md:w-auto md:self-start md:justify-start';

// Footer links — add entries here and they flow into the footer row.
const footerLinks: { label: string; href: string; hint?: string }[] = [
  { label: 'github', href: 'https://github.com/degstn/' },
  { label: 'linkedin', href: 'https://linkedin.com/in/degstn/' },
  { label: 'x', href: 'https://x.com/aegstn/' },
];

function NavLabel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <span className={className}>{children}</span>;
}

// Always visible on mobile (no hover there); revealed on hover from md up.
// Space is reserved even while hidden (visibility, not display) so nothing on
// the page shifts when a hint appears.
function HoverHint({ children }: { children: string }) {
  return (
    <span className="shrink-0 whitespace-nowrap text-gray-600 opacity-50 dark:text-gray-50 no-underline md:invisible md:group-hover:visible">
      {children}
    </span>
  );
}

function ArrowUpRightDots({ className = '', size = 10 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 21.07 21.07" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <g>
        <path d="M1.02,20.05c-.26-.26-.4-.56-.4-.9,0-.38.13-.7.4-.94.26-.24.56-.36.9-.36.38,0,.7.12.94.36.24.24.36.55.36.94,0,.34-.12.64-.36.9-.24.26-.55.4-.94.4-.34,0-.64-.13-.9-.4ZM5.48,15.59c-.26-.26-.4-.56-.4-.9,0-.38.13-.7.4-.94.26-.24.56-.36.9-.36.38,0,.7.12.94.36.24.24.36.55.36.94,0,.34-.12.64-.36.9-.24.26-.55.4-.94.4-.34,0-.64-.13-.9-.4ZM4.63,3.24c-.39-.39-.59-.83-.59-1.33,0-.57.19-1.03.59-1.38.39-.35.83-.53,1.33-.53.57,0,1.03.18,1.38.53.35.36.53.82.53,1.38,0,.5-.18.94-.53,1.33-.36.39-.82.59-1.38.59-.5,0-.94-.19-1.33-.59ZM9.94,11.12c-.26-.26-.4-.56-.4-.9,0-.38.13-.7.4-.94.26-.24.56-.36.9-.36.38,0,.7.12.94.36.24.24.36.55.36.94,0,.34-.12.64-.36.9-.24.26-.55.4-.94.4-.34,0-.64-.13-.9-.4ZM11.23,3.24c-.39-.39-.59-.83-.59-1.33,0-.57.19-1.03.59-1.38.39-.35.83-.53,1.33-.53.57,0,1.03.18,1.38.53.35.36.53.82.53,1.38,0,.5-.18.94-.53,1.33-.36.39-.82.59-1.38.59-.5,0-.94-.19-1.33-.59ZM17.82,3.24c-.39-.39-.59-.83-.59-1.33,0-.57.19-1.03.59-1.38.39-.35.83-.53,1.33-.53.57,0,1.03.18,1.38.53.35.36.53.82.53,1.38,0,.5-.18.94-.53,1.33-.36.39-.82.59-1.38.59-.5,0-.94-.19-1.33-.59ZM17.82,9.84c-.39-.39-.59-.83-.59-1.33,0-.57.19-1.03.59-1.38.39-.35.83-.53,1.33-.53.57,0,1.03.18,1.38.53.35.36.53.82.53,1.38,0,.5-.18.94-.53,1.33-.36.39-.82.59-1.38.59-.5,0-.94-.19-1.33-.59ZM17.82,16.44c-.39-.39-.59-.83-.59-1.33,0-.57.19-1.03.59-1.38.39-.35.83-.53,1.33-.53.57,0,1.03.18,1.38.53.35.36.53.82.53,1.38,0,.5-.18.94-.53,1.33-.36.39-.82.59-1.38.59-.5,0-.94-.19-1.33-.59Z" fill="currentColor"/>
        <path d="M9.51,11.55c-.39-.39-.59-.83-.59-1.33,0-.57.19-1.03.59-1.38.39-.35.83-.53,1.33-.53.57,0,1.03.18,1.38.53.35.36.53.82.53,1.38,0,.5-.18.94-.53,1.33-.36.39-.82.59-1.38.59-.5,0-.94-.19-1.33-.59Z" fill="currentColor"/>
        <path d="M5.05,16.02c-.39-.39-.59-.83-.59-1.33,0-.57.19-1.03.59-1.38.39-.35.83-.53,1.33-.53.57,0,1.03.18,1.38.53.35.36.53.82.53,1.38,0,.5-.18.94-.53,1.33-.36.39-.82.59-1.38.59-.5,0-.94-.19-1.33-.59Z" fill="currentColor"/>
        <path d="M.59,20.48c-.39-.39-.59-.83-.59-1.33,0-.57.19-1.03.59-1.38.39-.35.83-.53,1.33-.53.57,0,1.03.18,1.38.53.35.36.53.82.53,1.38,0,.5-.18.94-.53,1.33-.36.39-.82.59-1.38.59-.5,0-.94-.19-1.33-.59Z" fill="currentColor"/>
      </g>
    </svg>
  );
}

// Internal urls navigate in-place; external ones open a new tab.
function ProjectLink({ href, className, style, children }: { href: string; className?: string; style?: CSSProperties; children: ReactNode }) {
  if (href.startsWith('/')) {
    return (
      <Link href={href} className={className} style={style}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className} style={style}>
      {children}
    </a>
  );
}

function OpenCta({ href }: { href: string }) {
  return (
    <ProjectLink
      href={href}
      className="mt-2 inline-flex items-center gap-2 bg-international-orange-engineering/80 px-4 py-1.5 text-sm font-semibold tracking-tight text-gray-50 transition-colors duration-200 hover:bg-international-orange-engineering dark:bg-international-orange/80 dark:text-bgDark dark:hover:bg-international-orange"
      style={PIXEL_CHAMFER_STYLE}
    >
      open
      <ArrowUpRightDots size={12} />
    </ProjectLink>
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

// One media source: "" placeholder, video composite (.mp4/.mov), or plain screenshot.
// Everything gets the 1px border by default; { border: false } in the data opts out.
const isVideoSource = (src: string) => /\.(mp4|mov)$/i.test(src);

function MediaContent({ src, name, bordered }: { src: string; name: string; bordered: boolean }) {
  if (!src) {
    return (
      <div className="w-full h-full border border-disabled dark:border-disabled-dark flex items-center justify-center">
        <span className="text-xs tracking-tight text-disabled dark:text-disabled-dark">screenshot soon</span>
      </div>
    );
  }

  const mediaSrc = withCacheBust(src, ASSET_VERSION);

  if (isVideoSource(src)) {
    return (
      <div
        className={`relative w-full h-full${bordered ? ' border border-disabled dark:border-disabled-dark' : ''}`}
        style={{ overflow: 'visible' }}
      >
        <img
          src="https://cdn.degstn.com/aremacv2.png"
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
    );
  }

  return (
    <img
      src={mediaSrc}
      alt={name}
      className={`max-w-full max-h-full object-contain cursor-pointer${bordered ? ' border border-disabled dark:border-disabled-dark' : ''}`}
    />
  );
}

function ProjectMedia({ project, className = '' }: { project: Project; className?: string }) {
  const isVideo = isVideoSource(project.image);

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
      <MediaContent src={project.image} name={project.name} bordered />
    </div>
  );
}

// Media area for the panel/modal. All screenshots render stacked vertically at
// the same size and flow with the panel's own scroll (no arrows, no nested
// scroller). Every slide gets the 1px border unless it opts out with
// { border: false } (for device-bezel shots).
function ProjectMediaStack({
  project,
  linkHref,
  className = '',
  mediaClassName = '',
}: {
  project: Project;
  linkHref?: string;
  className?: string;
  mediaClassName?: string;
}) {
  const extras = (project.images ?? []).map((entry) =>
    typeof entry === 'string' ? { src: entry, border: true } : { src: entry.src, border: entry.border ?? true }
  );

  if (extras.length === 0) {
    if (linkHref) {
      return (
        <ProjectLink href={linkHref} className={`block ${className}`}>
          <ProjectMedia project={project} className={mediaClassName} />
        </ProjectLink>
      );
    }
    return (
      <div className={className}>
        <ProjectMedia project={project} className={mediaClassName} />
      </div>
    );
  }

  const slides = [{ src: project.image, border: true }, ...extras];

  return (
    <div className={`flex min-w-0 flex-col gap-4 md:gap-6 ${className}`}>
      {slides.map(({ src, border }, i) => {
        const frame = (
          <div className={`aspect-[3/2] w-full overflow-hidden flex items-center justify-center ${mediaClassName}`}>
            <MediaContent src={src} name={`${project.name} screenshot ${i + 1}`} bordered={border} />
          </div>
        );
        return linkHref && src ? (
          <ProjectLink key={i} href={linkHref} className="block w-full">
            {frame}
          </ProjectLink>
        ) : (
          <div key={i} className="w-full">
            {frame}
          </div>
        );
      })}
    </div>
  );
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-bgLight dark:bg-[#111111] md:hidden">
      <div className="flex min-h-full w-full flex-col px-4 pt-10 pb-16 sm:px-5 text-gray-600 dark:text-gray-50">
        <button
          type="button"
          onClick={onClose}
          className="self-start text-sm text-gray-600 opacity-50 dark:text-gray-50 hover:underline"
        >
          back
        </button>
        {project.slug === 'cv' ? (
          <div className="mt-10 w-full">
            <h2 className="text-lg font-bold tracking-tight">{project.name}</h2>
            <div className="mt-8">
              <CvContent />
            </div>
          </div>
        ) : (
          <>
            <div className="mt-10 flex w-full flex-col items-start gap-3">
              <h2 className="text-lg font-bold tracking-tight">{project.name}</h2>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag: string, idx: number) => (
                  <span key={tag} className="inline-block text-international-orange-engineering dark:text-international-orange text-xs font-semibold">
                    {tag}{idx < project.tags.length - 1 && <span className="mx-1">&bull;</span>}
                  </span>
                ))}
              </div>
              {project.slug !== 'archive' && <OpenCta href={project.url} />}
              <p className="mt-2 text-xs">{project.description}</p>
            </div>
            <ProjectMediaStack
              project={project}
              linkHref={project.slug !== 'archive' ? project.url : undefined}
              className="mt-8 w-full"
            />
          </>
        )}
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
          <h2 className="text-lg md:text-xl font-bold tracking-tight">{project.name}</h2>
          <div className="mt-8">
            <CvContent />
          </div>
        </div>
      ) : (
        <div className="flex w-full flex-col gap-8 xl:flex-row xl:items-start xl:gap-10">
          {/* Sticky so details stay put while the screenshots scroll by. */}
          <div className="flex w-full max-w-sm shrink-0 flex-col items-start gap-3 text-gray-600 dark:text-gray-50 xl:w-64 xl:sticky xl:top-0">
            <h2 className="text-lg md:text-xl font-bold tracking-tight">{project.name}</h2>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag: string, idx: number) => (
                <span key={tag} className="inline-block text-international-orange-engineering dark:text-international-orange text-xs font-semibold">
                  {tag}{idx < project.tags.length - 1 && <span className="mx-1">&bull;</span>}
                </span>
              ))}
            </div>
            {project.slug !== 'archive' && <OpenCta href={project.url} />}
            <p className="mt-2 text-xs md:text-sm">{project.description}</p>
          </div>
          <ProjectMediaStack
            project={project}
            linkHref={project.slug !== 'archive' ? project.url : undefined}
            className="w-full min-w-0 xl:flex-1"
            mediaClassName="max-h-[70vh]"
          />
        </div>
      )}
    </aside>
  );
}

export default function Home() {
  const [openProject, setOpenProject] = useState<Project | null>(null);

  // Open/close the panel and mirror it into the URL hash so panels are
  // deep-linkable (degstn.com/#limen) and the back button closes them.
  const openPanel = (project: Project | null) => {
    setOpenProject(project);
    window.history.pushState(null, '', project ? `#${project.slug}` : window.location.pathname);
  };

  useEffect(() => {
    const syncFromHash = () => {
      const slug = decodeURIComponent(window.location.hash.slice(1));
      setOpenProject(slug ? findBySlug(slug) : null);
    };
    syncFromHash();
    window.addEventListener('popstate', syncFromHash);
    return () => window.removeEventListener('popstate', syncFromHash);
  }, []);

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
      const extraSources = (project.images ?? []).map((m) => (typeof m === 'string' ? m : m.src));
      [project.image, ...extraSources].forEach((source) => {
        if (!source) return;
        const src = withCacheBust(source, ASSET_VERSION);

        if (isVideoSource(source)) {
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
            openPanel(null);
            return;
          }
          const project = projects.find((p) => p.slug === slug);
          if (project) openPanel(project);
        }}
        className={`${navItemClass} text-left${extraClass ? ` ${extraClass}` : ''}`}
      >
        <NavLabel className={isOpen ? 'font-bold' : ''}>{label}</NavLabel>
        <HoverHint>{isOpen ? '[-]' : '[+]'}</HoverHint>
      </button>
    );
  };

  // Page links preview inline (panel on desktop, modal on mobile) instead of navigating.
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
          e.preventDefault();
          openPanel(isOpen ? null : page);
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
      {openProject && <ProjectModal project={openProject} onClose={() => openPanel(null)} />}
      <main className={`flex min-h-screen flex-col bg-bgLight dark:bg-[#111111]${openProject ? ' md:h-screen md:overflow-hidden' : ''}`}>
        <div className="flex w-full flex-1 md:min-h-0">
          <div className="no-scrollbar flex w-full flex-col items-start px-4 pt-10 sm:px-5 md:max-w-xs md:shrink-0 md:min-h-0 md:overflow-y-auto md:px-6 md:pt-12 lg:pl-8 lg:pr-6 xl:pl-10 text-gray-600 dark:text-gray-50">
            <header className="mb-10 w-full md:mb-12">
              <div className="flex w-full flex-col gap-1 pl-[1ch] text-left tabular-nums text-lg tracking-tight font-normal text-gray-600 dark:text-gray-50">
                <a href="mailto:d@degstn.com" target="_blank" rel="noopener noreferrer" className={`${navItemClass} whitespace-nowrap`}>
                  <NavLabel>drew goldstein</NavLabel>
                  <HoverHint>[email]</HoverHint>
                </a>
                {pageItem('cv', 'cv')}
              </div>
            </header>

            <div className="flex w-full flex-col gap-6 md:gap-7">
              <section className="flex gap-6 md:gap-8">
                <span className="inline-block w-[5ch] shrink-0 text-right tabular-nums text-lg tracking-tight font-normal text-international-orange-engineering dark:text-international-orange">2026</span>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  {projectItem('locale-center', 'locale.center')}
                  {pageItem('photography', 'photography')}
                  {pageItem('ghorman', 'ghorman')}
                  {pageItem('dg-photos', 'dg.photos')}
                </div>
              </section>

              <section className="flex gap-6 md:gap-8">
                <span className="inline-block w-[5ch] shrink-0 text-right tabular-nums text-lg tracking-tight font-normal text-gray-600 dark:text-gray-50">2025</span>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  {projectItem('cad', 'cad')}
                  {projectItem('polyline', 'polyline')}
                  {projectItem('s7em', 's7em')}
                  {pageItem('words', 'words')}
                </div>
              </section>

              <section className="flex gap-6 md:gap-8">
                <span className="inline-block w-[5ch] shrink-0 text-right tabular-nums text-lg tracking-tight font-normal text-gray-600 dark:text-gray-50">2024</span>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
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
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  {projectItem('service-seeker', 'service seeker', 'whitespace-nowrap')}
                  {pageItem('archive', 'archive', 'italic')}
                </div>
              </section>
            </div>

            <footer className="mt-auto flex w-full flex-col gap-1 pb-12 pt-12 md:pt-5 md:pb-16 text-gray-600 dark:text-gray-50">
              {footerLinks.map((link) => (
                <ProjectLink
                  key={link.label}
                  href={link.href}
                  className="group flex w-full items-center justify-between gap-1 text-sm tracking-tight font-normal text-gray-600 dark:text-gray-50 md:w-auto md:self-start md:justify-start md:text-xs md:font-medium"
                >
                  <NavLabel>{link.label}</NavLabel>
                  <HoverHint>{link.hint ?? '[↗]'}</HoverHint>
                </ProjectLink>
              ))}
              <Link
                href="/git"
                aria-label="Changelog"
                className="group mt-2 flex w-full min-w-0 items-center justify-between gap-1 text-international-orange-engineering dark:text-international-orange md:mt-1 md:w-auto md:self-start md:justify-start"
              >
                <span className="inline-flex min-w-0 items-center gap-1">
                  <svg width={12} height={12} viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                    <path
                      fill="currentColor"
                      fillRule="evenodd"
                      d="M9.5 3.25a2.25 2.25 0 1 1 3 2.122V6A2.5 2.5 0 0 1 10 8.5H6a1 1 0 0 0-1 1v1.128a2.251 2.251 0 1 1-1.5 0V5.372a2.25 2.25 0 1 1 1.5 0v1.836A2.493 2.493 0 0 1 6 7h4a1 1 0 0 0 1-1v-.628A2.25 2.25 0 0 1 9.5 3.25Zm-6 0a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Zm8.25-.75a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5ZM4.25 12a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Z"
                    />
                  </svg>
                <span className="whitespace-nowrap text-xs text-international-orange-engineering tracking-tight font-medium dark:text-international-orange">
                  {process.env.NEXT_PUBLIC_GIT_BRANCH || 'local'} <span className="text-gray-600 dark:text-gray-50">v{process.env.NEXT_PUBLIC_VERSION}</span>
                </span>
                </span>
                <HoverHint>[changelog]</HoverHint>
              </Link>
            </footer>
          </div>

          {openProject && <ProjectPanel project={openProject} />}
        </div>
      </main>
    </>
  );
}