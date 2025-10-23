import { NextResponse } from "next/server";

const OWNER = "degstn";
const REPO = "degstn.com-v1";

const CACHE_TTL_MS = 120 * 1000; // 2m
const cache = new Map<string, { expires: number; data: any }>();

function getGithubHeaders(): HeadersInit {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || "";
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": `${OWNER}-${REPO}-app`,
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

export async function GET(
  _req: Request,
  { params }: any
) {
  const sha = params.sha;
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/commits/${encodeURIComponent(sha)}`;
  try {
    const key = url;
    const now = Date.now();
    const cached = cache.get(key);
    if (cached && cached.expires > now) {
      const out = NextResponse.json(cached.data, { status: 200 });
      out.headers.set("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
      return out;
    }
    const res = await fetch(url, { headers: getGithubHeaders() });
    const data = await res.json();
    if (res.ok) {
      cache.set(key, { expires: now + CACHE_TTL_MS, data });
    }
    const out = NextResponse.json(data, { status: res.status });
    out.headers.set("Cache-Control", "s-maxage=120, stale-while-revalidate=300");
    return out;
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed" }, { status: 500 });
  }
}


