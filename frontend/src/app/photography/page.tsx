import React from "react";
import DotMatrixGlobe from "./DotMatrixGlobe"; // The client component
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Photography - degstn.com",
  description: "Shots from around the globe on degstn.com",
  openGraph: {
    title: "Photography - degstn.com",
    description: "Shots from around the globe on degstn.com",
    url: "https://degstn.com/photography",
    siteName: "degstn.com",
    images: [
      {
        url: "/photography-og.jpg", 
        alt: "A globe representing worldwide photography",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function PhotographyPage() {
  return (
    <main className="bg-bgDark" style={{ width: "100%", height: "80vh" }}>
      <DotMatrixGlobe />      
    </main>
  );
}