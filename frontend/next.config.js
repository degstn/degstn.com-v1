const { execSync } = require('child_process');

// Branch label for the homepage footer: Vercel sets VERCEL_GIT_COMMIT_REF on
// deploys (e.g. "main", "beta"); locally we ask git directly.
function resolveGitBranch() {
  if (process.env.VERCEL_GIT_COMMIT_REF) return process.env.VERCEL_GIT_COMMIT_REF;
  try {
    return execSync('git rev-parse --abbrev-ref HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
  } catch {
    return 'local';
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_GIT_BRANCH: resolveGitBranch(),
    // "production" | "preview" on Vercel; empty locally (rendered as "development").
    NEXT_PUBLIC_VERCEL_ENV: process.env.VERCEL_ENV || '',
  },
  eslint: {
    // Allow production builds to complete even with ESLint errors
    // (merged from the previously unused next.config.ts).
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [];
  },
};

// Set the dev server port
if (process.env.NODE_ENV === 'development') {
  nextConfig.devServer = {
    port: 3001
  };
}

module.exports = nextConfig;
