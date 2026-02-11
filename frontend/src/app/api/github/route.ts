import { NextResponse } from "next/server";

const OWNER = "degstn";
const REPO = "degstn.com-v1";

type GithubHeaders = HeadersInit;

function getGithubHeaders(): GithubHeaders {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || "";
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": `${OWNER}-${REPO}-app`,
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

async function safeJson<T>(res: Response, fallback: T): Promise<T> {
  try {
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

function pickVercelState(readyState?: string): "ready" | "error" | "building" | "canceled" | "unknown" {
  if (!readyState) return "unknown";
  if (readyState === "READY") return "ready";
  if (readyState === "ERROR") return "error";
  if (readyState === "CANCELED") return "canceled";
  if (readyState === "BUILDING" || readyState === "QUEUED" || readyState === "INITIALIZING") {
    return "building";
  }
  return "unknown";
}

function asEpochMs(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
    const ts = new Date(value).getTime();
    if (Number.isFinite(ts)) return ts;
  }
  return null;
}

function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return Math.round((sorted[mid - 1] + sorted[mid]) / 2);
  }
  return sorted[mid];
}

export async function GET() {
  const headers = getGithubHeaders();
  const base = `https://api.github.com/repos/${OWNER}/${REPO}`;

  try {
    const [repoRes, langsRes, depsRes, runsRes, relRes, contribRes] = await Promise.all([
      fetch(base, { headers }),
      fetch(`${base}/languages`, { headers }),
      fetch(`${base}/deployments?per_page=10`, { headers }),
      fetch(`${base}/actions/runs?per_page=10`, { headers }),
      fetch(`${base}/releases?per_page=1`, { headers }),
      fetch(`${base}/contributors?per_page=10&anon=false`, { headers }),
    ]);

    const repo = await safeJson(repoRes, {} as any);
    const languages = await safeJson<Record<string, number>>(langsRes, {});
    const deployments = await safeJson<any[]>(depsRes, []);
    const workflowRunsData = await safeJson<any>(runsRes, {});
    const releases = await safeJson<any[]>(relRes, []);
    const contributors = await safeJson<any[]>(contribRes, []);

    // Search endpoints for open PRs and issues to get accurate counts
    const [openPrsRes, openIssuesRes] = await Promise.all([
      fetch(
        `https://api.github.com/search/issues?q=repo:${OWNER}/${REPO}+is:pr+is:open`,
        { headers }
      ),
      fetch(
        `https://api.github.com/search/issues?q=repo:${OWNER}/${REPO}+is:issue+is:open`,
        { headers }
      ),
    ]);
    const openPrs = await safeJson<{ total_count: number }>(openPrsRes, { total_count: 0 });
    const openIssues = await safeJson<{ total_count: number }>(openIssuesRes, { total_count: 0 });

    const defaultBranch: string | undefined = (repo as any)?.default_branch;
    const lastCommitReq = defaultBranch
      ? fetch(`${base}/commits?sha=${defaultBranch}&per_page=1`, { headers })
      : null;
    const lastCommit = lastCommitReq
      ? await safeJson<any[]>(await lastCommitReq, [])
      : [];

    const latestRun = workflowRunsData?.workflow_runs?.[0] ?? null;
    const latestRelease = releases?.[0] ?? null;

    // Pull per-deployment statuses to avoid "always green dot" on UI.
    const enrichedDeployments = await Promise.all(
      deployments.slice(0, 10).map(async (dep) => {
        const statusesUrl = dep?.statuses_url as string | undefined;
        const statuses = statusesUrl
          ? await safeJson<any[]>(await fetch(statusesUrl, { headers }), [])
          : [];
        const latestStatus = statuses?.[0];
        return {
          id: dep?.id,
          environment: dep?.environment,
          created_at: dep?.created_at,
          sha: dep?.sha,
          ref: dep?.ref,
          status: latestStatus?.state ?? dep?.status ?? "unknown",
          target_url: latestStatus?.target_url ?? null,
        };
      })
    );

    // Optional Vercel stats if env vars are present.
    const vercelToken = process.env.VERCEL_TOKEN;
    const vercelProjectId = process.env.VERCEL_PROJECT_ID;
    const vercelTeamId = process.env.VERCEL_TEAM_ID;
    let vercel: any = null;
    if (vercelToken && vercelProjectId) {
      const teamQuery = vercelTeamId ? `&teamId=${encodeURIComponent(vercelTeamId)}` : "";
      const vercelRes = await fetch(
        `https://api.vercel.com/v6/deployments?projectId=${encodeURIComponent(vercelProjectId)}&limit=20${teamQuery}`,
        { headers: { Authorization: `Bearer ${vercelToken}` } }
      );
      const vercelData = await safeJson<any>(vercelRes, { deployments: [] });
      const deps = Array.isArray(vercelData?.deployments) ? vercelData.deployments : [];
      const now = Date.now();
      const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
      const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

      const stateCounts = deps.reduce(
        (acc: Record<string, number>, dep: any) => {
          const key = pickVercelState(dep?.readyState);
          acc[key] = (acc[key] ?? 0) + 1;
          return acc;
        },
        { ready: 0, error: 0, building: 0, canceled: 0, unknown: 0 }
      );

      const withCreatedAt = deps
        .map((dep: any) => ({ dep, createdAt: asEpochMs(dep?.createdAt) }))
        .filter((entry: { dep: any; createdAt: number | null }) => typeof entry.createdAt === "number");

      const inWindow = (fromEpoch: number) => withCreatedAt.filter((entry: { createdAt: number | null }) => {
        const createdAt = entry.createdAt as number;
        return createdAt >= fromEpoch;
      });
      const rateFor = (entries: Array<{ dep: any }>) => {
        if (entries.length === 0) return null;
        const ready = entries.filter((entry) => pickVercelState(entry.dep?.readyState) === "ready").length;
        return Number(((ready / entries.length) * 100).toFixed(1));
      };

      const lastFailureEntry = withCreatedAt.find(
        (entry: { dep: any }) => pickVercelState(entry.dep?.readyState) === "error"
      );

      const durationCandidates = deps
        .map((dep: any) => {
          const createdAt = asEpochMs(dep?.createdAt);
          const readyAt = asEpochMs(dep?.ready);
          if (typeof createdAt !== "number" || typeof readyAt !== "number") return null;
          const duration = readyAt - createdAt;
          return duration > 0 ? duration : null;
        })
        .filter((v: number | null): v is number => typeof v === "number");

      const prodDeps = deps.filter((dep: any) => {
        const target = String(dep?.target ?? "").toLowerCase();
        return target === "production" || target === "prod";
      });

      const latest = deps[0];
      vercel = {
        count: deps.length,
        states: stateCounts,
        successRate7d: rateFor(inWindow(sevenDaysAgo)),
        successRate30d: rateFor(inWindow(thirtyDaysAgo)),
        lastFailureAt: lastFailureEntry?.dep?.createdAt ?? null,
        medianDurationMs: median(durationCandidates),
        productionSharePct:
          deps.length > 0 ? Number(((prodDeps.length / deps.length) * 100).toFixed(1)) : null,
        latest: latest
          ? {
              uid: latest.uid,
              name: latest.name,
              url: latest.url ? `https://${latest.url}` : null,
              readyState: latest.readyState,
              createdAt: latest.createdAt,
              target: latest.target ?? null,
            }
          : null,
      };
    }

    const overview = {
      name: (repo as any)?.name,
      full_name: (repo as any)?.full_name,
      description: (repo as any)?.description,
      html_url: (repo as any)?.html_url,
      homepage: (repo as any)?.homepage,
      visibility: (repo as any)?.visibility,
      default_branch: defaultBranch,
      size_kb: (repo as any)?.size,
      license: (repo as any)?.license?.spdx_id ?? (repo as any)?.license?.name ?? null,
      topics: (repo as any)?.topics ?? [],
      watchers_count: (repo as any)?.subscribers_count ?? 0,
      stars_count: (repo as any)?.stargazers_count ?? 0,
      forks_count: (repo as any)?.forks_count ?? 0,
      open_issues_count: (repo as any)?.open_issues_count ?? 0,
      open_prs_count: openPrs.total_count,
      open_issues_via_search: openIssues.total_count,
      created_at: (repo as any)?.created_at,
      updated_at: (repo as any)?.updated_at,
      pushed_at: (repo as any)?.pushed_at,
      latest_workflow_run: latestRun
        ? {
            name: latestRun.name,
            event: latestRun.event,
            status: latestRun.status,
            conclusion: latestRun.conclusion,
            html_url: latestRun.html_url,
            created_at: latestRun.created_at,
            run_number: latestRun.run_number,
          }
        : null,
      latest_release: latestRelease
        ? {
            name: latestRelease.name ?? latestRelease.tag_name,
            tag_name: latestRelease.tag_name,
            draft: latestRelease.draft,
            prerelease: latestRelease.prerelease,
            published_at: latestRelease.published_at,
            html_url: latestRelease.html_url,
          }
        : null,
      last_commit: lastCommit?.[0]
        ? {
            sha: lastCommit[0].sha,
            html_url: lastCommit[0].html_url,
            message: lastCommit[0].commit?.message,
            author: lastCommit[0].commit?.author?.name,
            date: lastCommit[0].commit?.author?.date,
          }
        : null,
      contributors: contributors?.slice(0, 8).map((c) => ({
        login: c.login,
        avatar_url: c.avatar_url,
        html_url: c.html_url,
        contributions: c.contributions,
      })),
    };

    const result = {
      overview,
      languages,
      deployments: enrichedDeployments,
      workflow_runs: workflowRunsData?.workflow_runs ?? [],
      vercel,
    };

    const res = NextResponse.json(result);
    res.headers.set("Cache-Control", "s-maxage=300, stale-while-revalidate=300");
    return res;
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Failed to load GitHub data" },
      { status: 500 }
    );
  }
}


