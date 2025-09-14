"use client";

import { useEffect } from "react";

export default function DarkBg() {
  useEffect(() => {
    const html = document.documentElement as HTMLElement;
    const body = document.body as HTMLBodyElement;
    const prevHtmlBg = html.style.backgroundColor;
    const prevBodyBg = body.style.backgroundColor;
    const prevScheme = (html.style as any).colorScheme || "";

    html.style.backgroundColor = "#1a1a1a";
    (html.style as any).colorScheme = "dark";
    body.style.backgroundColor = "#1a1a1a";

    return () => {
      html.style.backgroundColor = prevHtmlBg;
      (html.style as any).colorScheme = prevScheme;
      body.style.backgroundColor = prevBodyBg;
    };
  }, []);

  return null;
}


