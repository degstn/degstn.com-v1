"use client";

import { useEffect } from "react";

export default function DarkBg() {
  useEffect(() => {
    const html = document.documentElement as HTMLElement;
    const body = document.body as HTMLBodyElement;
    const prevHtmlBg = html.style.backgroundColor;
    const prevBodyBg = body.style.backgroundColor;
    const prevScheme = (html.style as any).colorScheme || "";
    const prevBodyPaddingBottom = body.style.paddingBottom;
    const prevBodyMinHeight = body.style.minHeight;

    html.style.backgroundColor = "#111111";
    (html.style as any).colorScheme = "dark";
    body.style.backgroundColor = "#111111";
    body.style.paddingBottom = "0px";
    body.style.minHeight = "100dvh";

    return () => {
      html.style.backgroundColor = prevHtmlBg;
      (html.style as any).colorScheme = prevScheme;
      body.style.backgroundColor = prevBodyBg;
      body.style.paddingBottom = prevBodyPaddingBottom;
      body.style.minHeight = prevBodyMinHeight;
    };
  }, []);

  return null;
}


