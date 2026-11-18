import { ReactNode } from "react";
import type { Metadata } from 'next'
import { PERSON_NAME, SITE_NAME } from '@/data/site'

export const metadata: Metadata = {
    title: "cv",
    description: `Curriculum vitae of ${PERSON_NAME}: experience, leadership, education, notable projects, and skills.`,
    openGraph: {
      url: "/cv",
      siteName: SITE_NAME,
      images: [
        {
          url: "/cv-og.jpg", 
          alt: "curriculum vitae",
          width: 1200,
          height: 630,
        },
      ],
      locale: "en_US",
      type: "website",
    },
  };

export default function CVLayout({ children }: { children: ReactNode }) {
  return (
    <section>
      {children}
    </section>
  );
}