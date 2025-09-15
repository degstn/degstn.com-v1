"use client";

import React from "react";

type ScaledStageProps = {
    stageWidth: number;
    stageHeight: number;
    backgroundUrl: string;
    children: React.ReactNode;
    mobileBreakpointPx?: number;
};

export default function ScaledStage({ stageWidth, stageHeight, backgroundUrl, children, mobileBreakpointPx = 768 }: ScaledStageProps) {
    const [scale, setScale] = React.useState<number>(1);
    const [isMobile, setIsMobile] = React.useState<boolean>(false);
    const [showHint, setShowHint] = React.useState<boolean>(false);

    React.useEffect(() => {
        const updateScale = () => {
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            const mobile = vw < mobileBreakpointPx;
            setIsMobile(mobile);

            if (mobile) {
                setScale(1);
            } else {
                const scaleW = vw / stageWidth;
                const scaleH = vh / stageHeight;
                const nextScale = Math.max(1, Math.min(scaleW, scaleH));
                setScale(nextScale);
            }
        };
        updateScale();
        window.addEventListener("resize", updateScale);
        return () => window.removeEventListener("resize", updateScale);
    }, [mobileBreakpointPx, stageWidth, stageHeight]);

    React.useEffect(() => {
        if (isMobile) {
            setShowHint(true);
            const t = window.setTimeout(() => setShowHint(false), 3500);
            return () => window.clearTimeout(t);
        } else {
            setShowHint(false);
        }
    }, [isMobile]);

    const handleScroll: React.UIEventHandler<HTMLDivElement> = (e) => {
        if (!showHint) return;
        const el = e.currentTarget;
        if (el.scrollLeft > 8) setShowHint(false);
    };

    const scaledWidth = stageWidth * scale;
    const scaledHeight = stageHeight * scale;

    return (
        <div
            onScroll={handleScroll}
            className="relative w-full h-[100svh] overflow-x-auto overflow-y-hidden md:overflow-hidden md:flex md:items-center md:justify-center"
        >
            <div className="relative" style={{ width: scaledWidth, height: scaledHeight }}>
                <div
                    className="relative bg-cover bg-no-repeat bg-center"
                    style={{
                        width: stageWidth,
                        height: stageHeight,
                        backgroundImage: `url(${backgroundUrl})`,
                        transform: `scale(${scale})`,
                        transformOrigin: "top left",
                    }}
                >
                    {children}
                </div>
            </div>

            {showHint && (
                <div className="md:hidden pointer-events-none fixed bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-gray-100 text-sm px-3 py-1.5 rounded-full whitespace-nowrap">
                    <span className="mr-1">Scroll</span>
                    <span className="mx-1">←</span>
                    <span className="mx-1">→</span>
                    <span className="ml-1">to explore</span>
                </div>
            )}
        </div>
    );
}
