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

export default function GitPage() {
  // Existing commits + pagination states
  const [commits, setCommits] = useState<any[]>([]);
  const [error, setError] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // NEW: states for deployments + languages
  const [deployments, setDeployments] = useState<any[]>([]);
  const [languages, setLanguages] = useState<Record<string, number>>({});

  // 1) Fetch commits in pages
  async function loadCommits(newPage: number) {
    try {
      const url = `https://api.github.com/repos/degstn/degstn.com-v1/commits?per_page=${PER_PAGE}&page=${newPage}`;
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

  // 2) Fetch deployments
  async function loadDeployments() {
    try {
      const res = await fetch("https://api.github.com/repos/degstn/degstn.com-v1/deployments");
      if (!res.ok) {
        // Not all repos have deployments, so handle gracefully
        return [];
      }
      return await res.json();
    } catch {
      return [];
    }
  }

  // 3) Fetch languages
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

  // On mount, fetch:
  // - Deployments
  // - Languages
  // - Commits (page=1)
  useEffect(() => {
    // load first page of commits
    loadCommits(page);

    // load deployments + languages in parallel
    Promise.all([loadDeployments(), loadLanguages()])
      .then(([depData, langData]) => {
        setDeployments(depData);
        setLanguages(langData);
      })
      .catch(() => {
        // do nothing special, maybe there's no deployments or something
      });
  }, []);

  // Whenever "page" changes (beyond the initial), fetch more commits
  useEffect(() => {
    if (page === 1) return; // already fetched on mount
    loadCommits(page);
  }, [page]);

  function handleLoadMore() {
    setPage((prev) => prev + 1);
  }

  // Compute an array of { name, bytes, percent } from the languages object
  const langEntries = Object.entries(languages) as [string, number][];
const totalBytes = langEntries.reduce((sum, [, bytes]) => sum + bytes, 0);

// Sort languages by largest to smallest if you prefer (not required)
const sorted = langEntries.sort((a, b) => b[1] - a[1]);

let sumSoFar = 0;
const langArray = sorted.map(([name, bytes], idx) => {
  if (idx < sorted.length - 1) {
    // normal calculation
    const rawPercent = totalBytes > 0 ? (bytes / totalBytes) * 100 : 0;
    // round to 2 decimals, or keep as is
    const percent = parseFloat(rawPercent.toFixed(2));
    sumSoFar += percent;
    return { name, bytes, percent };
  } else {
    // final language => whatever’s left to reach 100%
    const leftover = 100 - sumSoFar;
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
      <Link
        href="https://github.com/degstn/degstn.com-v1"
        className="text-xs hover:underline text-international-orange-engineering dark:text-international-orange"
      >
        full repo
      </Link>

      {error && (
        <p className="text-red-400 mb-4">Error loading commits: {error}</p>
      )}

      {/* 
        // add new code here 
        BELOW is the new block for Deployments & Languages 
      */}

      {/* Deployments */}
      <section className="w-full max-w-xs mt-4 mb-8">
        <h2 className="text-sm font-semibold uppercase mb-2 text-gray-600 dark:text-gray-50">Deployments</h2>
        {deployments.length === 0 ? (
          <p className="text-xs italic">No recent deployments found.</p>
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
          <p className="text-xs italic">No language data.</p>
        ) : (
          <>
            {/* Bar container */}
            <div className="relative w-full h-4 bg-disabled dark:bg-disabled-dark rounded overflow-hidden mb-2">
              {langArray.reduce((acc: JSX.Element[], lang) => {
                const leftOffset = acc.reduce((sum, el) => sum + (el.props.widthPercent ?? 0), 0);
                const width = lang.percent;
                return [
                  ...acc,
                  <div
                    key={lang.name}
                    className={`absolute top-0 h-full ${pickLangColor(lang.name)}`}
                    style={{
                      left: `${leftOffset}%`,
                      width: `${width}%`,
                    }}
                  />,
                ];
              }, [])}
            </div>
            {/* Language legend */}
            <p className="text-xs text-gray-600 dark:text-gray-50">
              {langArray.map((lang) => (
                <span key={lang.name} className="mr-3">
                  <span className={` font-medium px-1`}>
                    {lang.name} {lang.percent.toFixed(1)}%
                  </span>
                </span>
              ))}
            </p>
          </>
        )}
      </section>
      {/* END new code section */}

      {/* Commits List */}
      <ul className="space-y-6 mt-5">
        {commits.map((commit) => {
          const shortSha = commit.sha.substring(0, 7);
          return (
            <li
              key={commit.sha}
              className="px-2 border-b border-r border-disabled-dark hover:bg-disabled-dark hover:bg-opacity-5 transition-colors"
            >
              <p className="mb-2">
                <span className="text-international-orange-engineering dark:text-international-orange text-xs">
                  {shortSha}
                </span>
              </p>

              <p className="text-sm text-gray-600 dark:text-gray-50 mb-2">
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