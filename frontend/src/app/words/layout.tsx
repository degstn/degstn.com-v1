import type { ReactNode } from 'react'
import type { Metadata } from 'next'

// The page itself is a client component, which can't export metadata.
export const metadata: Metadata = {
  title: "words",
  description: "Long-form writing, starting with the story of how this portfolio came to be.",
};

export default function WordsLayout({ children }: { children: ReactNode }) {
  return children;
}
