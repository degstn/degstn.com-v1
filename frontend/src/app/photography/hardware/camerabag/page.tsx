import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import CameraBagStage from "./CameraBagStage";

export const metadata: Metadata = {
    title: "Hardware Details - Photography - degstn.com",
    description: "Hardware Details for Photography",
    openGraph: {
        title: "Camera Bag - Hardware Details - Photography - degstn.com",
        description: "Shots from around the globe on degstn.com",
        url: "https://degstn.com/photography/hardware",
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

export default function HardwarePage() {
    return (
        <main className="relative w-full h-[100svh]">
            <CameraBagStage />
        </main>
    );
}