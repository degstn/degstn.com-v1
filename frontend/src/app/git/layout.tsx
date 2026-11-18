import type { ReactNode } from 'react'
import type { Metadata } from 'next'

// The page itself is a client component, which can't export metadata.
export const metadata: Metadata = {
  title: "git",
  description: "Changelog for this site: commits, deployments, languages, and implementation architecture.",
};

export default function GitLayout({ children }: { children: ReactNode }) {
  return children;
}
