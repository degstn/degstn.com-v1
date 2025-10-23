"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";

// We'll fetch 10 commits at a time
const PER_PAGE = 10;

// Helper for picking color classes based on language name
// Replace the old pickLangColor function with this:
function pickLangColor(langName: string) {
    switch (langName.toLowerCase()) {
      case "typescript":
        // e.g. TypeScript => international-orange
        return "bg-international-orange";
      case "css":
        // e.g. CSS => international-orange-engineering
        return "bg-international-orange-engineering";
      case "javascript":
        // e.g. JavaScript => green
        return "bg-green-500";
      default:
        // fallback color for any other language
        return "bg-gray-600";
    }
  }

  /** Text color for each language label in the legend. */
function pickLangTextColor(lang: string) {
    switch (lang.toLowerCase()) {
      case "typescript":
        return "text-international-orange";
      case "css":
        return "text-international-orange-engineering";
      case "javascript":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  }

export default function GitPage() {
  const [commits, setCommits] = useState<any[]>([]);
  const [commitChecks, setCommitChecks] = useState<Record<string, string>>({});
  const [error, setError] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const [deployments, setDeployments] = useState<any[]>([]);
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
                <span className="text-green-500">●</span>
                <span className="text-gray-600 dark:text-gray-50">
                  {dep.environment}{" "}
                  <span className="text-gray-600 dark:text-gray-50 opacity-25">
                    ({dep.created_at.slice(0, 10)})
                  </span>
                </span>
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

      {/* Languages */}
      <section className="w-full max-w-xs mb-5">
        <h2 className="text-sm font-semibold uppercase mb-2 text-gray-600 dark:text-gray-50">Languages</h2>
        {langArray.length === 0 ? (
          <p className="text-xs italic text-gray-600 dark:text-gray-50">No language data.</p>
        ) : (
          <>
            {/* Bar container */}
            <div className="relative w-full h-4 bg-disabled dark:bg-disabled-dark rounded overflow-hidden mb-2">
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
            <p className="text-xs text-gray-600 dark:text-gray-50">
              {langArray.map((lang) => (
                <span key={lang.name} className="mr-3">
                  <span className={` font-medium px-1`}>
                    {lang.name} 
                  </span>
                  <span className={`${pickLangTextColor(lang.name)} font-medium px-1`}>
                     {lang.percent.toFixed(1)}%
                  </span>
                </span>
              ))}
            </p>
          </>
        )}
      </section>
      {/* END new code section */}

      {/* Commits List */}
      <div className="mt-5 mb-1 text-[10px] font-mono tracking-tight text-gray-600 dark:text-gray-50 opacity-60">
        [ commits ]
      </div>
      <ul className="w-full border-y border-dashed border-disabled-dark divide-y divide-disabled-dark">
        {commits.map((commit) => {
          const shortSha = commit.sha.substring(0, 7);
          return (
            <li
              key={commit.sha}
              onMouseEnter={() => ensureStats(commit.sha)}
              className="relative group px-3 py-3 hover:bg-disabled-dark hover:bg-opacity-5 transition-colors border-l border-dashed border-disabled-dark overflow-hidden"
            >
              <p className="mb-2 flex items-center space-x-1">
  {(() => {
    const status = commitChecks[commit.sha] || "none";
    if (status === "success") {
      // green check
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
      // red x
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
    // else no icon for "pending"/"none"
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

              {commitStats[commit.sha]?.preview && (
                <div className="pointer-events-none hidden group-hover:block absolute right-0 top-6 md:top-8 bottom-0 w-[56%] max-w-[520px] min-w-[240px] transform-gpu rotate-[-6deg] z-0">
                  <div className="absolute inset-0 p-3 [mask-image:linear-gradient(to_left,rgba(0,0,0,1)_50%,rgba(0,0,0,0)_100%)] backdrop-blur-[2px]">
                    <div className="text-sm md:text-base font-mono leading-tight whitespace-pre break-words">
                      {commitStats[commit.sha]?.preview?.lines.map((ln, i) => (
                        <div key={i} className={ln.t === 'add' ? 'text-green-500' : ln.t === 'del' ? 'text-red-500' : 'opacity-60'}>
                          {(ln.t === 'add' ? '+' : ln.t === 'del' ? '-' : ' ')} {ln.c}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>

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