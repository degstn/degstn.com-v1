import { ReactNode } from "react";
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: "cv - degstn.com",
    description: "curriculum vitae",
    openGraph: {
      title: "cv - degstn.com",
      description: "curriculum vitae",
      url: "https://degstn.com/cv",
      siteName: "degstn.com",
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