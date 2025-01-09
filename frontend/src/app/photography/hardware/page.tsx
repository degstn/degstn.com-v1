import React from "react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Hardware Details - Photography - degstn.com",
    description: "Hardware Details for Photography",
    openGraph: {
        title: "Hardware Details - Photography - degstn.com",
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
        <main className="relative overflow-auto w-full">
      {/* TODO: FIX THIS, HARDCODING IS TEMPORARY AND THIS IS A PROBLEM... */}
      <div
        className="
          relative
          w-[1240px]   
          h-[760px]
          bg-[url('/hardwaretest1.png')]
          bg-cover
          bg-no-repeat
          bg-center
        "
      >
          <div className="relative w-[100px] h-[100px]">
            <div
                className="absolute top-0 left-0 text-gray-50 p-4"
            >
                <div className="text-xs mb-1">
                <Link href="/photography" className="hover:underline ">
                                back
                            </Link>
                </div>
                <div className="text-xs mb-0">/photography/hardware</div>
                <div className="text-xs mb-0">
                    office view 1
                    
                </div>
                

            </div>
        <div className="absolute top-[480px] left-[280px] text-2xl text-gray-50 group">
            <p>▄</p>
        <Link href="https://www.apple.com/airpods-max" className="absolute bottom-full left-1/2 transform -translate-x-1/2 whitespace-nowrap hidden group-hover:block hover:underline bg-gray-800 text-gray-50 text-sm rounded pb-5">
            AirPods Max <span className="">↗</span>
        </Link>
        <p className="absolute bottom-full left-1/2 transform -translate-x-1/2 whitespace-nowrap hidden group-hover:block bg-gray-800 text-gray-50 opacity-50 text-sm rounded">$549</p>
        </div>
        <div className="absolute top-[260px] left-[520px] text-2xl text-gray-50 group">
            <p>▄</p>
        <Link href="https://www.lego.com/en-us/product/porsche-911-10295" className="absolute bottom-full left-1/2 transform -translate-x-1/2 whitespace-nowrap hidden group-hover:block hover:underline bg-gray-800 text-gray-50 text-sm rounded pb-5">
            LEGO Porsche 930 911 <span className="">↗</span>
        </Link>
        <p className="absolute bottom-full left-1/2 transform -translate-x-1/2 whitespace-nowrap hidden group-hover:block bg-gray-800 text-gray-50 opacity-50 text-sm rounded">$170</p>
        </div>
        <div className="absolute top-[650px] left-[170px] text-2xl text-gray-50 group">
            <p>▄</p>
        <Link href="https://www.apple.com/apple-vision-pro" className="absolute bottom-full left-1/2 transform -translate-x-1/2 whitespace-nowrap hidden group-hover:block hover:underline bg-gray-800 text-gray-50 text-sm rounded pb-5">
            Apple Vision Pro <span className="">↗</span>
        </Link>
        <p className="absolute bottom-full left-1/2 transform -translate-x-1/2 whitespace-nowrap hidden group-hover:block bg-gray-800 text-gray-50 opacity-50 text-sm rounded">~$6000</p>
        </div>
        <div className="absolute top-[690px] left-[270px] text-2xl text-gray-50 group">
            <p>▄</p>
        <Link href="https://snap.com" className="absolute bottom-full left-1/2 transform -translate-x-1/2 whitespace-nowrap hidden group-hover:block hover:underline bg-gray-800 text-gray-50 text-sm rounded pb-5">
            Snapchat Spectacles <span className="">↗</span>
        </Link>
        <p className="absolute bottom-full left-1/2 transform -translate-x-1/2 whitespace-nowrap hidden group-hover:block bg-gray-800 text-gray-50 opacity-50 text-sm rounded">not sold to consumers</p>
        </div>
        <div className="absolute top-[440px] left-[650px] text-2xl text-gray-50 group">
            <p>▄</p>
        <Link href="https://www.apple.com/macbook-pro" className="absolute bottom-full left-1/2 transform -translate-x-1/2 whitespace-nowrap hidden group-hover:block hover:underline bg-gray-800 text-gray-50 text-sm rounded pb-5">
            MacBook Pro 14" <span className="">↗</span>
        </Link>
        <p className="absolute bottom-full left-1/2 transform -translate-x-1/2 whitespace-nowrap hidden group-hover:block bg-gray-800 text-gray-50 opacity-50 text-sm rounded">$5499</p>
        </div>
        <div className="absolute top-[412px] left-[760px] text-2xl text-gray-50 group">
            <p>▄</p>
        <Link href="https://www.apple.com/ipad-pro" className="absolute bottom-full left-1/2 transform -translate-x-1/2 whitespace-nowrap hidden group-hover:block hover:underline bg-gray-800 text-gray-50 text-sm rounded pb-5">
            iPad Pro 13" <span className="">↗</span>
        </Link>
        <p className="absolute bottom-full left-1/2 transform -translate-x-1/2 whitespace-nowrap hidden group-hover:block bg-gray-800 text-gray-50 opacity-50 text-sm rounded">$2200</p>
        </div>
        <div className="absolute top-[615px] left-[100px] text-2xl text-gray-50 group">
            <p>▄</p>
        <Link href="https://www.hasselblad.com/x-system/x2d-100c-earth-explorer-limited-edition/" className="absolute bottom-full left-1/2 transform -translate-x-1/2 whitespace-nowrap hidden group-hover:block hover:underline bg-gray-800 text-gray-50 text-sm rounded pb-5">
            Hasselblad X2D 100c <span className="">↗</span>
        </Link>
        <p className="absolute bottom-full left-1/2 transform -translate-x-1/2 whitespace-nowrap hidden group-hover:block bg-gray-800 text-gray-50 opacity-50 text-sm rounded">$14000</p>
        </div>
        <div className="absolute top-[440px] left-[890px] text-2xl text-gray-50 group">
            <p>▄</p>
        <Link href="https://www.apple.com/mac-studio" className="absolute bottom-full left-1/2 transform -translate-x-1/2 whitespace-nowrap hidden group-hover:block hover:underline bg-gray-800 text-gray-50 text-sm rounded pb-5">
            Mac Studio <span className="">↗</span>
        </Link>
        <p className="absolute bottom-full left-1/2 transform -translate-x-1/2 whitespace-nowrap hidden group-hover:block bg-gray-800 text-gray-50 opacity-50 text-sm rounded">~$5000</p>
        </div>
        <div className="absolute top-[330px] left-[920px] text-2xl text-gray-50 group">
            <p>▄</p>
        <Link href="https://www.apple.com/studio-display" className="absolute bottom-full left-1/2 transform -translate-x-1/2 whitespace-nowrap hidden group-hover:block hover:underline bg-gray-800 text-gray-50 text-sm rounded pb-5">
        Studio Display <span className="">↗</span>
        </Link>
        <p className="absolute bottom-full left-1/2 transform -translate-x-1/2 whitespace-nowrap hidden group-hover:block bg-gray-800 text-gray-50 opacity-50 text-sm rounded">$2000</p>
        </div>
        </div>
        </div>
        </main>
    );
}