"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const PER_PAGE = 10;

export default function GitPage() {
  const [commits, setCommits] = useState<any[]>([]);
  const [error, setError] = useState<string>("");
  const [page, setPage] = useState<number>(1);    
  const [hasMore, setHasMore] = useState<boolean>(true); 

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

  useEffect(() => {
    loadCommits(page);
  }, [page]);

  function handleLoadMore() {
    setPage((prev) => prev + 1);
  }

  return (
    <main className="min-h-screen flex-grid items-center justify-center bg-bgLight dark:bg-bgDark p-6 md:px-56 px-6 pt-24">
      <h1 className="text-normal text-gray-600 dark:text-gray-50">git</h1>
      <Link
        href="/"
        className="text-xs hover:underline text-international-orange-engineering dark:text-international-orange"
      >
        full repo
      </Link>

      {error && (
        <p className="text-red-400 mb-4">Error loading commits: {error}</p>
      )}

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