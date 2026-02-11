"use client";
import Link from "next/link";
import { GeistPixelSquare, GeistPixelGrid, GeistPixelCircle, GeistPixelTriangle, GeistPixelLine } from 'geist/font/pixel';
import React, { useEffect, useState } from "react";

// We'll fetch 10 commits at a time
const PER_PAGE = 10;
const PIXEL_CHAMFER_STYLE: React.CSSProperties = {
  clipPath:
    "polygon(2px 0, calc(100% - 2px) 0, calc(100% - 2px) 2px, 100% 2px, 100% calc(100% - 2px), calc(100% - 2px) calc(100% - 2px), calc(100% - 2px) 100%, 2px 100%, 2px calc(100% - 2px), 0 calc(100% - 2px), 0 2px, 2px 2px)",
};

// Helper for picking color classes based on language name
// Replace the old pickLangColor function with this:
function pickLangColor(langName: string) {
    switch (langName.toLowerCase()) {
      case "typescript":
        // Primary orange tone (theme-aware)
        return "bg-international-orange-engineering dark:bg-international-orange";
      case "css":
        // Secondary orange tone
        return "bg-international-orange-engineering/75 dark:bg-international-orange/80";
      case "javascript":
        // Tertiary orange tone (solid to keep marker/bar visually identical)
        return "bg-[#b06b47] dark:bg-[#d48f6a]";
      default:
        // Fallback keeps orange palette consistent
        return "bg-international-orange-engineering/35 dark:bg-international-orange/45";
    }
  }

  /** Text color for each language label in the legend. */
function pickLangTextColor(lang: string) {
    switch (lang.toLowerCase()) {
      case "typescript":
        return "text-international-orange-engineering dark:text-international-orange";
      case "css":
        return "text-international-orange-engineering/80 dark:text-international-orange/80";
      case "javascript":
        return "text-[#b06b47] dark:text-[#d48f6a]";
      default:
        return "text-international-orange-engineering/55 dark:text-international-orange/55";
    }
  }

function pickLangMarkerColor(lang: string) {
    switch (lang.toLowerCase()) {
      case "typescript":
        return "text-international-orange-engineering dark:text-international-orange";
      case "css":
        return "text-international-orange-engineering/75 dark:text-international-orange/80";
      case "javascript":
        return "text-[#b06b47] dark:text-[#d48f6a]";
      default:
        return "text-international-orange-engineering/35 dark:text-international-orange/45";
    }
  }

function formatRelativeTime(value?: string | number | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  const now = Date.now();
  const diff = now - date.getTime();
  const mins = Math.floor(diff / (1000 * 60));
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(months / 12);
  return `${years}y ago`;
}

function daysSince(value?: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  const days = Math.max(0, Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24)));
  return String(days);
}

function formatDurationMs(value?: number | null): string {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return "—";
  const totalSec = Math.round(value / 1000);
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
}

const LANGUAGE_DETAILS: Record<
  string,
  {
    creator: string;
    description: string;
    implementationNotes: string;
  }
> = {
  typescript: {
    creator: "Anders Hejlsberg / Microsoft",
    description:
      "TypeScript is the language that gives this codebase strong types while still running as JavaScript in the browser and on Node.js.",
    implementationNotes:
      "In this portfolio, TypeScript is used for page components and API handlers so refactors stay safe as features evolve. It is especially useful in data-heavy pages like /git and /photography, where nested API payloads (commit stats, deployment records, photo metadata) can easily drift without explicit typing.",
  },
  css: {
    creator: "Håkon Wium Lie (CERN proposal) / W3C standard",
    description:
      "CSS controls layout, spacing, typography, color, animation, and responsive behavior across the site.",
    implementationNotes:
      "This project combines global CSS for shared tokens and browser-level behavior with page-level styling patterns for specific experiences. The photography route uses dedicated module styles for globe pins, modals, and viewer controls, while shared pages use utility-driven styling for speed and consistency.",
  },
  javascript: {
    creator: "Brendan Eich / Netscape",
    description:
      "JavaScript is the runtime language that powers interactivity, state updates, async data fetching, and API execution.",
    implementationNotes:
      "Even with TypeScript authoring, all logic executes as JavaScript at runtime. It drives hover behavior in the changelog, language/distribution calculations, dynamic UI state transitions, and server-side request orchestration for GitHub and Vercel metrics.",
  },
};

const TOOL_DETAILS: Array<{
  name: string;
  creator: string;
  description: string;
  implementationNotes: string;
}> = [
  {
    name: "Next.js",
    creator: "Vercel",
    description:
      "React framework used for routing, server rendering, static generation, metadata, and API routes in a single codebase.",
    implementationNotes:
      "This portfolio uses the App Router structure, where each route under src/app maps directly to a page experience. API routes in src/app/api aggregate GitHub and Vercel data so the client UI stays lightweight and consistent.",
  },
  {
    name: "React",
    creator: "Meta",
    description:
      "Component model for building interactive UI with stateful and declarative rendering.",
    implementationNotes:
      "The /git page uses React state and effects to stream commit lists, fetch status details, and drive the selected commit preview panel. The same approach powers interaction-heavy pages like /photography where hover, modal, and viewer states need to stay synchronized.",
  },
  {
    name: "Tailwind CSS",
    creator: "Tailwind Labs",
    description:
      "Utility-first CSS framework for rapid, consistent layout and visual composition.",
    implementationNotes:
      "Tailwind handles spacing scale, typography rhythm, responsive breakpoints, and interaction states (hover, opacity, transitions) across route UIs. In practice this keeps visual parity between /git, /ghorman, and the index page while still allowing route-specific components to layer in specialized behavior.",
  },
  {
    name: "Vercel",
    creator: "Vercel",
    description:
      "Hosting and deployment platform for build pipelines, production releases, and deployment telemetry.",
    implementationNotes:
      "Deployment and runtime hosting are managed on Vercel. The /git observability panel reads Vercel deployment APIs (token/project scoped) to surface success windows, median deployment duration, failure recency, and production share without requiring manual logging infrastructure.",
  },
  {
    name: "GitHub APIs",
    creator: "GitHub",
    description:
      "Repository, commit, deployment, and workflow data source used to power the changelog dashboard.",
    implementationNotes:
      "Server-side route handlers aggregate repository metadata, commit status checks, deployment records, release context, and language byte distribution. The frontend consumes normalized payloads so operational signals remain stable even if upstream GitHub responses vary.",
  },
  {
    name: "AWS S3 + CloudFront",
    creator: "Amazon Web Services",
    description:
      "Object storage and CDN delivery layer used for media assets, especially photography content.",
    implementationNotes:
      "Photography assets are stored in S3 and served through CloudFront URLs for global low-latency delivery. The photography system reads bucket structure at runtime using API routes, maps folder paths to areas/regions, and emits CDN-ready asset URLs so new uploads appear without redeploying application code.",
  },
  {
    name: "AWS SDK for JavaScript v3",
    creator: "Amazon Web Services",
    description:
      "Typed client SDK for querying S3 and other AWS services from server-side handlers.",
    implementationNotes:
      "Next.js API routes use @aws-sdk/client-s3 to list objects, resolve region folders, and produce structured photography manifests consumed by the globe UI. This keeps AWS credentials server-side while exposing only normalized JSON to the browser.",
  },
  {
    name: "globe.gl + three.js + Turf.js",
    creator: "Vasturiano / Three.js authors / Turf maintainers",
    description:
      "Visualization stack used for the /photography geospatial interface and point rendering.",
    implementationNotes:
      "globe.gl and three.js drive the interactive globe rendering pipeline, while Turf.js is used for geospatial sampling logic that supports the dot-matrix landmass treatment. This stack enables pin interaction, hover telemetry, and area-driven modal loading on a single route without custom WebGL plumbing.",
  },
  {
    name: "EXIF.js",
    creator: "Jacob Seidelin and community maintainers",
    description:
      "Client-side EXIF parsing utility for camera metadata extraction from image files.",
    implementationNotes:
      "The photography viewer uses EXIF extraction to surface capture metadata (camera, lens, shutter, focal length, ISO) as contextual technical data alongside images. This preserves image storytelling while exposing capture-level details for users who care about gear and settings.",
  },
];

export default function GitPage() {
  const [commits, setCommits] = useState<any[]>([]);
  const [commitChecks, setCommitChecks] = useState<Record<string, string>>({});
  const [error, setError] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [hoveredCommitSha, setHoveredCommitSha] = useState<string | null>(null);

  const [deployments, setDeployments] = useState<any[]>([]);
  const [vercelSummary, setVercelSummary] = useState<any | null>(null);
  const [languages, setLanguages] = useState<Record<string, number>>({});
  const [overview, setOverview] = useState<any | null>(null);
  const [workflowRuns, setWorkflowRuns] = useState<any[]>([]);
  const [commitStats, setCommitStats] = useState<Record<string, { additions: number; deletions: number; files: number; preview?: { filename: string; lines: { t: 'add' | 'del' | 'ctx'; c: string }[] } }>>({});

  async function loadCommits(newPage: number) {
    try {
      const url = `/api/github/commits?per_page=${PER_PAGE}&page=${newPage}`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`GitHub API returned status ${res.status}`);
      }
      const data = await res.json();
      if (Array.isArray(data)) {
        if (data.length < PER_PAGE) {
          setHasMore(false);
        }
        setCommits((prev) => [...prev, ...data]);
      }
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function loadStatusForCommit(sha: string) {
    // We'll use the "statuses" API endpoint.
    const url = `/api/github/commit/${sha}/status`;
    try {
      const res = await fetch(url);
      if (!res.ok) {
        // Possibly no checks for this commit
        return "none";
      }
      const data = await res.json();
      // data.state could be "success", "failure", "pending", etc.
      return data.state as string;
    } catch {
      return "none";
    }
  }

  async function loadStatsForCommit(sha: string) {
    const url = `/api/github/commit/${sha}`;
    try {
      const res = await fetch(url);
      if (!res.ok) return null;
      const data = await res.json();
      const additions = data?.stats?.additions ?? 0;
      const deletions = data?.stats?.deletions ?? 0;
      const filesArr = Array.isArray(data?.files) ? data.files : [];

      // Build a small preview from the first file that has a patch
      let preview: { filename: string; lines: { t: 'add' | 'del' | 'ctx'; c: string }[] } | undefined;
      for (const f of filesArr) {
        if (f?.patch) {
          const rawLines = String(f.patch).split('\n');
          const lines: { t: 'add' | 'del' | 'ctx'; c: string }[] = [];
          for (const line of rawLines) {
            if (line.startsWith('@@') || line.startsWith('+++') || line.startsWith('---')) continue;
            let t: 'add' | 'del' | 'ctx' = 'ctx';
            let content = line;
            if (line.startsWith('+')) {
              t = 'add';
              content = line.slice(1);
            } else if (line.startsWith('-')) {
              t = 'del';
              content = line.slice(1);
            }
            // Prefer non-context lines; include a few context lines if needed
            if (t === 'ctx' && lines.length === 0) continue;
            lines.push({ t, c: content });
            if (lines.length >= 6) break;
          }
          preview = { filename: f.filename, lines };
          break;
        }
      }

      return { additions, deletions, files: filesArr.length, preview };
    } catch {
      return null;
    }
  }

  async function loadDeployments() {
    try {
      const res = await fetch("https://api.github.com/repos/degstn/degstn.com-v1/deployments");
      if (!res.ok) {
        return [];
      }
      return await res.json();
    } catch {
      return [];
    }
  }

  async function loadLanguages() {
    try {
      const res = await fetch("https://api.github.com/repos/degstn/degstn.com-v1/languages");
      if (!res.ok) {
        return {};
      }
      return await res.json();
    } catch {
      return {};
    }
  }

  useEffect(() => {
    // load first page of commits
    loadCommits(page);

    // load aggregated GitHub data from our API
    fetch("/api/github")
      .then((r) => r.json())
      .then((data) => {
        if (data?.overview) setOverview(data.overview);
        if (data?.languages) setLanguages(data.languages);
        if (data?.deployments) setDeployments(data.deployments);
        if (data?.workflow_runs) setWorkflowRuns(data.workflow_runs);
        if (data?.vercel) setVercelSummary(data.vercel);
      })
      .catch(() => {});
  }, []);

  // Whenever "page" changes (beyond the initial), fetch more commits
  useEffect(() => {
    if (page === 1) return; // already fetched on mount
    loadCommits(page);
  }, [page]);

  useEffect(() => {
    commits.forEach((c) => {
      if (!commitChecks[c.sha]) {
        loadStatusForCommit(c.sha).then((status) => {
          setCommitChecks((prev) => ({ ...prev, [c.sha]: status }));
        });
      }
    });
  }, [commits]);

  useEffect(() => {
    if (commits.length === 0 || hoveredCommitSha) return;
    const firstSha = commits[0].sha;
    setHoveredCommitSha(firstSha);
    ensureStats(firstSha);
  }, [commits, hoveredCommitSha]);

  function ensureStats(sha: string) {
    if (commitStats[sha]) return;
    loadStatsForCommit(sha).then((stats) => {
      if (stats) setCommitStats((prev) => ({ ...prev, [sha]: stats }));
    });
  }

  function handleLoadMore() {
    setPage((prev) => prev + 1);
  }

  // Compute an array of { name, bytes, percent } from the languages object
  const langEntries = Object.entries(languages) as [string, number][];
const totalBytes = langEntries.reduce((sum, [, bytes]) => sum + bytes, 0);

// Sort languages by largest to smallest
const sorted = [...langEntries].sort((a, b) => b[1] - a[1]);

// Compute precise percentages and correct cumulative rounding by assigning the remainder to the last segment
let cumulative = 0;
const langArray = sorted.map(([name, bytes], idx) => {
  if (idx < sorted.length - 1) {
    const rawPercent = totalBytes > 0 ? (bytes / totalBytes) * 100 : 0;
    const percent = Math.round(rawPercent * 10) / 10; // 0.1% precision
    cumulative += percent;
    return { name, bytes, percent };
  } else {
    const leftover = Math.max(0, 100 - cumulative);
    return { name, bytes, percent: leftover };
  }
});

  return (
    <main className="min-h-screen flex-grid items-center justify-center bg-bgLight dark:bg-bgDark p-6 md:px-56 px-6 pt-24">
      <div className="text-sm text-gray-600 opacity-50 dark:text-gray-50">
          <Link href="/" className="hover:underline ">
                back
              </Link>
          </div>
      <h1 className="text-normal text-gray-600 dark:text-gray-50">git</h1>

      {error && (
        <p className="text-red-400 mb-4">Error loading commits: {error}</p>
      )}

      {/* Overview section (from API) */}
      {overview && (
        <section className="w-full max-w-2xl mt-4 mb-6">
          <div className="text-xs text-gray-600 dark:text-gray-50 flex flex-wrap gap-x-4 gap-y-1">
            <a href={overview.html_url} className="underline hover:opacity-80">{overview.full_name}</a>
            {overview.homepage && (
              <a href={overview.homepage} className="underline hover:opacity-80">site</a>
            )}
            <span>branch: <span className="text-international-orange-engineering dark:text-international-orange">{overview.default_branch}</span></span>
            <span>stars: {overview.stars_count}</span>
            <span>forks: {overview.forks_count}</span>
            <span>watchers: {overview.watchers_count}</span>
            <span>open PRs: {overview.open_prs_count}</span>
            <span>open issues: {overview.open_issues_via_search}</span>
            {overview.license && <span>license: {overview.license}</span>}
            {overview.topics?.length > 0 && (
              <span>topics: {overview.topics.slice(0,6).join(", ")}</span>
            )}
            <span>repo age: {daysSince(overview.created_at)} days</span>
            <span>last push: {formatRelativeTime(overview.pushed_at)}</span>
            {overview.size_kb && <span>size: {(overview.size_kb / 1024).toFixed(1)} MB</span>}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-50 mt-2">
            {overview.latest_workflow_run && (
              <div>
                ci: <span className="text-international-orange-engineering dark:text-international-orange">{overview.latest_workflow_run.conclusion ?? overview.latest_workflow_run.status}</span>
                {overview.latest_workflow_run.html_url && (
                  <a className="ml-2 underline" href={overview.latest_workflow_run.html_url}>details</a>
                )}
              </div>
            )}
            {overview.latest_release && (
              <div>
                release: <span className="text-international-orange-engineering dark:text-international-orange">{overview.latest_release.tag_name}</span>
                {overview.latest_release.published_at && (
                  <span className="opacity-60"> ({overview.latest_release.published_at.slice(0,10)})</span>
                )}
              </div>
            )}
            {overview.last_commit && (
              <div>
                last commit: <span className="text-international-orange-engineering dark:text-international-orange">{overview.last_commit.sha.slice(0,7)}</span>
                <span className="opacity-60"> by {overview.last_commit.author} on {new Date(overview.last_commit.date).toLocaleString()}</span>
                {overview.last_commit.html_url && (
                  <a className="ml-2 underline" href={overview.last_commit.html_url}>view</a>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Deployments */}
      <section className="w-full max-w-xs mt-4 mb-8">
        <h2 className="text-sm font-semibold uppercase mb-2 text-gray-600 dark:text-gray-50">Deployments</h2>
        {deployments.length === 0 ? (
          <p className="text-xs italic text-gray-600 dark:text-gray-50">No recent deployments found.</p>
        ) : (
          <ul className="space-y-1">
            {/* Show only first 3 for brevity */}
            {deployments.slice(0, 3).map((dep: any) => (
              <li key={dep.id} className="flex flex-row space-x-2 text-xs">
                <span
                  className={
                    dep.status === "success"
                      ? "text-green-500"
                      : dep.status === "failure" || dep.status === "error"
                        ? "text-red-500"
                        : dep.status === "pending" || dep.status === "in_progress"
                          ? "text-yellow-500"
                          : "text-gray-500"
                  }
                >
                  ●
                </span>
                <span className="text-gray-600 dark:text-gray-50">
                  {dep.environment}
                  {dep.status ? <span className="opacity-70"> · {dep.status}</span> : null}{" "}
                  <span className="text-gray-600 dark:text-gray-50 opacity-25">
                    ({formatRelativeTime(dep.created_at)})
                  </span>
                </span>
                {dep.target_url && (
                  <a href={dep.target_url} className="underline opacity-70 hover:opacity-100" target="_blank" rel="noreferrer">
                    details
                  </a>
                )}
              </li>
            ))}
            {deployments.length > 3 && (
              <li>
                <a
                  href="https://github.com/degstn/degstn.com-v1/deployments"
                  className="text-xs text-international-orange-engineering dark:text-international-orange hover:underline"
                >
                  +{deployments.length - 3} deployments
                </a>
              </li>
            )}
          </ul>
        )}
      </section>

      {vercelSummary && (
        <section className="w-full max-w-xs mb-8">
          <h2 className="text-sm font-semibold uppercase mb-2 text-gray-600 dark:text-gray-50">Vercel</h2>
          <div className="text-xs text-gray-600 dark:text-gray-50 space-y-1">
            <div>
              deploy success (7d):{" "}
              <span className="text-international-orange-engineering dark:text-international-orange">
                {vercelSummary.successRate7d == null ? "—" : `${vercelSummary.successRate7d}%`}
              </span>
            </div>
            <div>
              deploy success (30d):{" "}
              <span className="text-international-orange-engineering dark:text-international-orange">
                {vercelSummary.successRate30d == null ? "—" : `${vercelSummary.successRate30d}%`}
              </span>
            </div>
            <div>
              median deploy duration:{" "}
              <span className="text-international-orange-engineering dark:text-international-orange">
                {formatDurationMs(vercelSummary.medianDurationMs)}
              </span>
            </div>
            <div>
              last deploy failure:{" "}
              <span className="text-international-orange-engineering dark:text-international-orange">
                {vercelSummary.lastFailureAt ? formatRelativeTime(vercelSummary.lastFailureAt) : "none in sample"}
              </span>
            </div>
            <div>
              recent mix: ready <span className="text-green-500">{vercelSummary.states?.ready ?? 0}</span> · building{" "}
              <span className="text-yellow-500">{vercelSummary.states?.building ?? 0}</span> · error{" "}
              <span className="text-red-500">{vercelSummary.states?.error ?? 0}</span> · prod share{" "}
              <span className="text-international-orange-engineering dark:text-international-orange">
                {vercelSummary.productionSharePct == null ? "—" : `${vercelSummary.productionSharePct}%`}
              </span>
            </div>
            {vercelSummary.latest?.url && (
              <div>
                latest:{" "}
                <a
                  href={vercelSummary.latest.url}
                  target="_blank"
                  rel="noreferrer"
                  className="underline hover:opacity-80"
                >
                  {vercelSummary.latest.readyState}
                </a>{" "}
                <span className="opacity-60">
                  ({formatRelativeTime(vercelSummary.latest.createdAt)}
                  {vercelSummary.latest.target ? ` · ${String(vercelSummary.latest.target).toLowerCase()}` : ""})
                </span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Languages */}
      <section className="w-full max-w-xs mb-5">
        <h2 className="text-sm font-semibold uppercase mb-2 text-gray-600 dark:text-gray-50">Languages</h2>
        {langArray.length === 0 ? (
          <p className="text-xs italic text-gray-600 dark:text-gray-50">No language data.</p>
        ) : (
          <>
            {/* Bar container */}
            <div
              className="relative w-full h-4 bg-disabled dark:bg-disabled-dark overflow-hidden mb-2"
              style={PIXEL_CHAMFER_STYLE}
            >
              {(() => {
                let left = 0;
                return langArray.map((lang, idx) => {
                  const el = (
                    <div
                      key={lang.name}
                      className={`absolute top-0 h-full ${pickLangColor(lang.name)}`}
                      style={{ left: `${left}%`, width: `${lang.percent}%` }}
                    />
                  );
                  left += lang.percent;
                  if (idx === langArray.length - 1 && left < 100) {
                    // stretch last to 100 to avoid 1px gaps
                    return (
                      <div key={`${lang.name}-last`} className={`absolute top-0 h-full ${pickLangColor(lang.name)}`} style={{ left: `${100 - lang.percent}%`, width: `${lang.percent + (100 - left)}%` }} />
                    );
                  }
                  return el;
                });
              })()}
            </div>
            {/* Language legend */}
            <p className="text-xs text-gray-600 dark:text-gray-50 flex flex-wrap gap-x-4 gap-y-1">
              {langArray.map((lang) => (
                <span key={lang.name} className="inline-flex items-center">
                  <span className="inline-flex items-center justify-center mr-2 shrink-0">
                    <svg
                      viewBox="0 0 16 16"
                      className={`${pickLangMarkerColor(lang.name)} w-4 h-4`}
                      aria-hidden="true"
                    >
                      <path
                        d="M3 1H13V3H15V13H13V15H3V13H1V3H3V1Z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                  <span className="font-medium px-1">
                    {lang.name}
                  </span>
                  <span className={`${pickLangTextColor(lang.name)} font-medium px-1`}>
                    {lang.percent.toFixed(1)}%
                  </span>
                </span>
              ))}
            </p>
            <p className="text-[10px] mt-1 opacity-60 text-gray-600 dark:text-gray-50">
              distribution uses GitHub linguist byte counts (not file count)
            </p>
          </>
        )}
      </section>

      <section className="w-full max-w-2xl mt-4 mb-10 text-gray-600 dark:text-gray-50">
        <h2 className="text-sm font-semibold uppercase mb-3">Implementation Architecture</h2>

        <details className="group mb-4">
          <summary className="list-none [&::-webkit-details-marker]:hidden cursor-pointer text-xs font-semibold uppercase tracking-wide opacity-90 flex items-center">
            <span className={`${GeistPixelSquare.className} inline-block mr-2 text-[11px] leading-none transition-transform rotate-90 group-open:rotate-180`}>
              ▲
            </span>
            <span>Language Layer (Repository Distribution + Runtime Role)</span>
          </summary>
          <div className="mt-4 space-y-5">
            {langArray.map((lang) => {
              const detail = LANGUAGE_DETAILS[lang.name.toLowerCase()];
              return (
                <article key={`lang-note-${lang.name}`} className="text-xs">
                  <div className="mb-1">
                    <span className="font-semibold">{lang.name}</span>{" "}
                    <span className="opacity-60">({lang.percent.toFixed(1)}% of tracked bytes)</span>
                  </div>
                  <p className="opacity-75 mb-1">Creator: {detail?.creator ?? "Not documented in this section yet."}</p>
                  <p className="opacity-85 mb-1">
                    {detail?.description ??
                      "This language appears in repository byte distribution, but no custom project note has been added yet."}
                  </p>
                  {detail?.implementationNotes && <p className="opacity-75">{detail.implementationNotes}</p>}
                </article>
              );
            })}
          </div>
        </details>

        <details className="group">
          <summary className="list-none [&::-webkit-details-marker]:hidden cursor-pointer text-xs font-semibold uppercase tracking-wide opacity-90 flex items-center">
            <span className={`${GeistPixelSquare.className} inline-block mr-2 text-[11px] leading-none transition-transform rotate-90 group-open:rotate-180`}>
              ▲
            </span>
            <span>Framework + Infrastructure Layer</span>
          </summary>
          <div className="mt-4 space-y-5">
            {TOOL_DETAILS.map((tool) => (
              <article key={`tool-note-${tool.name}`} className="text-xs">
                <div className="mb-1 font-semibold">{tool.name}</div>
                <p className="opacity-75 mb-1">Creator: {tool.creator}</p>
                <p className="opacity-85 mb-1">{tool.description}</p>
                <p className="opacity-75">{tool.implementationNotes}</p>
              </article>
            ))}
          </div>
        </details>
      </section>
      {/* END new code section */}

      {/* Commits List */}
      <div className="mt-5 mb-1 text-[10px] font-mono tracking-tight text-gray-600 dark:text-gray-50 opacity-60">
        [ commits ]
      </div>
      <div className="w-full md:grid md:grid-cols-[minmax(0,1fr)_360px] md:gap-5 items-start">
        <ul className="w-full border border-disabled dark:border-disabled-dark divide-y divide-disabled dark:divide-disabled-dark">
          {commits.map((commit) => {
            const shortSha = commit.sha.substring(0, 7);
            const isActive = hoveredCommitSha === commit.sha;
            return (
              <li
                key={commit.sha}
                onMouseEnter={() => {
                  setHoveredCommitSha(commit.sha);
                  ensureStats(commit.sha);
                }}
                className={`group relative px-4 py-4 transition-colors ${
                  isActive
                    ? "bg-black/[0.03] dark:bg-white/[0.04]"
                    : "hover:bg-black/[0.02] dark:hover:bg-white/[0.03] hover:translate-x-[1px]"
                }`}
              >
                <span
                  className={`absolute left-0 top-0 h-full w-[2px] transition-opacity duration-150 ${
                    isActive
                      ? "bg-international-orange-engineering dark:bg-international-orange opacity-100"
                      : "bg-international-orange-engineering dark:bg-international-orange opacity-0 group-hover:opacity-100"
                  }`}
                />
                <div
                  className={`absolute right-3 top-3 text-[10px] uppercase tracking-wide transition-opacity duration-150 pointer-events-none ${
                    isActive ? "opacity-70" : "opacity-0 group-hover:opacity-70"
                  }`}
                >
                  {isActive ? "selected" : "hover"}
                </div>
                <p className="mb-2 flex items-center space-x-1">
                  {(() => {
                    const status = commitChecks[commit.sha] || "none";
                    if (status === "success") {
                      return (
                        <svg
                          viewBox="0 0 16 16"
                          fill="currentColor"
                          className="text-green-500 w-4 h-4"
                        >
                          <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path>
                        </svg>
                      );
                    } else if (status === "failure" || status === "error") {
                      return (
                        <svg
                          viewBox="0 0 16 16"
                          fill="currentColor"
                          className="text-red-500 w-4 h-4"
                        >
                          <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z"></path>
                        </svg>
                      );
                    }
                    return null;
                  })()}
                  <span className="text-international-orange-engineering dark:text-international-orange text-xs">
                    {shortSha}
                  </span>
                  {commitStats[commit.sha] && (
                    <span className="ml-2 font-mono text-[10px] opacity-70">
                      <span className="text-green-500">+{commitStats[commit.sha].additions}</span>{" "}
                      <span className="text-red-500">-{commitStats[commit.sha].deletions}</span>
                      <span className="opacity-40"> · {commitStats[commit.sha].files} files</span>
                    </span>
                  )}
                </p>

                <p className="text-sm text-gray-600 dark:text-gray-50 mb-2 relative z-10">
                  {commit.commit.message}
                </p>

                <p className="text-xs text-gray-600 dark:text-gray-50">
                  <span className="text-international-orange-engineering dark:text-international-orange">
                    {commit.commit.author.name}
                  </span>{" "}
                  committed on{" "}
                  {new Date(commit.commit.author.date).toLocaleString()}
                </p>

                <a
                  href={commit.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray-600 dark:text-gray-50 underline hover:text-gray-600"
                >
                  View on GitHub
                </a>
              </li>
            );
          })}
        </ul>

        <aside className="hidden md:block sticky top-24">
          <div className="border border-disabled dark:border-disabled-dark bg-bgLight/85 dark:bg-bgDark/85 p-3 min-h-[280px]">
            {(() => {
              const activeCommit =
                commits.find((c) => c.sha === hoveredCommitSha) || commits[0];
              if (!activeCommit) {
                return <div className="text-xs opacity-60">no commits loaded</div>;
              }
              const activeSha = activeCommit.sha;
              const status = commitChecks[activeSha] || "unknown";
              const stats = commitStats[activeSha];
              const preview = stats?.preview;

              return (
                <>
                  <div className="mb-2 text-[10px] uppercase tracking-wide opacity-60">
                    selected commit
                  </div>
                  <div className="text-xs mb-2">
                    <span className="text-international-orange-engineering dark:text-international-orange font-medium">
                      {activeSha.slice(0, 7)}
                    </span>
                    <span className="opacity-60"> · {status}</span>
                  </div>
                  <div className="text-sm mb-2">{activeCommit.commit.message}</div>
                  <div className="text-xs opacity-70 mb-3">
                    {activeCommit.commit.author.name} ·{" "}
                    {new Date(activeCommit.commit.author.date).toLocaleString()}
                  </div>
                  <div className="text-[11px] mb-3 opacity-80">
                    {stats ? (
                      <>
                        <span className="text-green-500">+{stats.additions}</span>{" "}
                        <span className="text-red-500">-{stats.deletions}</span>
                        <span className="opacity-50"> · {stats.files} files touched</span>
                      </>
                    ) : (
                      <span className="opacity-60">loading commit stats…</span>
                    )}
                  </div>
                  {preview ? (
                    <>
                      <div className="mb-2 text-[10px] uppercase tracking-wide opacity-60 truncate">
                        {preview.filename}
                      </div>
                      <div className="text-[11px] font-mono leading-5 whitespace-pre-wrap break-words max-h-44 overflow-hidden">
                        {preview.lines.map((ln, i) => (
                          <div key={i} className={ln.t === "add" ? "text-green-500" : ln.t === "del" ? "text-red-500" : "opacity-60"}>
                            {(ln.t === "add" ? "+" : ln.t === "del" ? "-" : " ")} {ln.c}
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="text-[11px] opacity-60">hover a commit to load diff preview</div>
                  )}
                </>
              );
            })()}
          </div>
        </aside>
      </div>

      {/* Load More Button */}
      {hasMore && !error && (
        <div className="mt-5 flex justify-center">
          <button
            onClick={handleLoadMore}
            className="px-4 py-2 border border-disabled-dark text-sm text-gray-600 dark:text-gray-50 hover:bg-disabled-dark hover:bg-opacity-5 transition-colors"
          >
            Load More
          </button>
        </div>
      )}
    </main>
  );
}