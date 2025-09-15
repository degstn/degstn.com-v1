"use client";

import React from "react";
import Link from "next/link";
import ScaledStage from "../../ScaledStage";

const STAGE_WIDTH = 1240;
const STAGE_HEIGHT = 760;

export default function CameraBagStage() {
    return (
        <ScaledStage stageWidth={STAGE_WIDTH} stageHeight={STAGE_HEIGHT} backgroundUrl="/hardwaretest2.png">
            <div className="relative w-[100px] h-[100px]">
                <div className="absolute top-0 left-0 text-gray-50 p-4">
                    <div className="text-xs mb-1">
                        <Link href="/photography/hardware" className="hover:underline ">
                            back
                        </Link>
                    </div>
                    <div className="text-xs mb-0">/photography/hardware/camerabag</div>
                    <div className="text-xs mb-0">camera bag</div>
                </div>
                <div className="absolute top-[530px] left-[580px] text-2xl text-gray-50 group">
                    <p>▄</p>
                    <Link href="https://www.peakdesign.com/products/travel-tripod?Type=Aluminum" className="absolute bottom-full left-1/2 transform -translate-x-1/2 whitespace-nowrap hidden group-hover:block hover:underline bg-gray-800 text-gray-50 text-sm rounded pb-5">
                        Peak Design Tripod <span className="">↗</span>
                    </Link>
                    <p className="absolute bottom-full left-1/2 transform -translate-x-1/2 whitespace-nowrap hidden group-hover:block bg-gray-800 text-gray-50 opacity-50 text-sm rounded">$380</p>
                </div>
                <div className="absolute top-[420px] left-[780px] text-2xl text-gray-50 group">
                    <p>▄</p>
                    <Link href="https://www.hasselblad.com/x-system/x2d-100c-earth-explorer-limited-edition/" className="absolute bottom-full left-1/2 transform -translate-x-1/2 whitespace-nowrap hidden group-hover:block hover:underline bg-gray-800 text-gray-50 text-sm rounded pb-5">
                        Hasselblad X2D 100C Earth Explorer Edition <span className="">↗</span>
                    </Link>
                    <p className="absolute bottom-full left-1/2 transform -translate-x-1/2 whitespace-nowrap hidden group-hover:block bg-gray-800 text-gray-50 opacity-50 text-sm rounded">$14000</p>
                </div>
                <div className="absolute top-[450px] left-[960px] text-2xl text-gray-50 group">
                    <p>▄</p>
                    <Link href="https://www.bhphotovideo.com/c/product/1346734-REG/canon_eos_6d_mark_ii.html?ap=y&smpn=&srsltid=AfmBOoqUsJLjbstQMFPPm-PvU411ssfp68gmwbp8X2chxRv0PCY2U4AJLSM" className="absolute bottom-full left-1/2 transform -translate-x-1/2 whitespace-nowrap hidden group-hover:block hover:underline bg-gray-800 text-gray-50 text-sm rounded pb-5">
                        Canon EOS 6D Mkii <span className="">↗</span>
                    </Link>
                    <p className="absolute bottom-full left-1/2 transform -translate-x-1/2 whitespace-nowrap hidden group-hover:block bg-gray-800 text-gray-50 opacity-50 text-sm rounded">$1200</p>
                </div>
                <div className="absolute top-[522px] left-[920px] text-2xl text-gray-50 group">
                    <p>▄</p>
                    <Link href="https://www.sigmaphoto.com/24-70mm-f2-8-dg-os-hsm-a" className="absolute bottom-full left-1/2 transform -translate-x-1/2 whitespace-nowrap hidden group-hover:block hover:underline bg-gray-800 text-gray-50 text-sm rounded pb-5">
                        24-70mm ƒ2.8 DG OS HSM <span className="">↗</span>
                    </Link>
                    <p className="absolute bottom-full left-1/2 transform -translate-x-1/2 whitespace-nowrap hidden group-hover:block bg-gray-800 text-gray-50 opacity-50 text-sm rounded">$1300</p>
                </div>
                <div className="absolute top-[600px] left-[880px] text-2xl text-gray-50 group">
                    <p>▄</p>
                    <Link href="https://www.polarpro.com/products/helix-mckinnon?view=sl-E44E742A" className="absolute bottom-full left-1/2 transform -translate-x-1/2 whitespace-nowrap hidden group-hover:block hover:underline bg-gray-800 text-gray-50 text-sm rounded pb-5">
                        PMVND Helix Maglock ND Filter <span className="">↗</span>
                    </Link>
                    <p className="absolute bottom-full left-1/2 transform -translate-x-1/2 whitespace-nowrap hidden group-hover:block bg-gray-800 text-gray-50 opacity-50 text-sm rounded">$330</p>
                </div>
                <div className="absolute top-[250px] left-[460px] text-2xl text-gray-50 group">
                    <p>▄</p>
                    <Link href="https://www.sigmaphoto.com/150-600mm-f5-6-3-dg-os-hsm-c" className="absolute bottom-full left-1/2 transform -translate-x-1/2 whitespace-nowrap hidden group-hover:block hover:underline bg-gray-800 text-gray-50 text-sm rounded pb-5">
                        150-600MM ƒ5-6.3 DG OS HSM <span className="">↗</span>
                    </Link>
                    <p className="absolute bottom-full left-1/2 transform -translate-x-1/2 whitespace-nowrap hidden group-hover:block bg-gray-800 text-gray-50 opacity-50 text-sm rounded">$1100</p>
                </div>
                <div className="absolute top-[330px] left-[510px] text-2xl text-gray-50 group">
                    <p>▄</p>
                    <Link href="https://www.polarpro.com/products/chroma-vndpl-filter?variant=44141023592633&view=sl-E44E742A" className="absolute bottom-full left-1/2 transform -translate-x-1/2 whitespace-nowrap hidden group-hover:block hover:underline bg-gray-800 text-gray-50 text-sm rounded pb-5">
                        Chroma VND/PL Gold Mist 6-9 stop <span className="">↗</span>
                    </Link>
                    <p className="absolute bottom-full left-1/2 transform -translate-x-1/2 whitespace-nowrap hidden group-hover:block bg-gray-800 text-gray-50 opacity-50 text-sm rounded">$250</p>
                </div>
            </div>
        </ScaledStage>
    );
}
