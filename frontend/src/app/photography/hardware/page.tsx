import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import HardwareStage from "./HardwareStage";
import { SITE_DOMAIN, SITE_NAME } from "@/data/site";

export const metadata: Metadata = {
    title: "Hardware Details - Photography",
    description: "Hardware Details for Photography",
    openGraph: {
        description: `Shots from around the globe on ${SITE_DOMAIN}`,
        url: "/photography/hardware",
        siteName: SITE_NAME,
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
            <HardwareStage />
        </main>
    );
}