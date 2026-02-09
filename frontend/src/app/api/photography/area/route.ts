import { NextRequest, NextResponse } from "next/server";
import areas from "@/app/photography/areas.json";
import regionNames from "@/app/photography/region-names.json";

type AreaConfig = {
  id?: string;
  folder?: string;
  name: string;
  lat?: number;
  lng?: number;
};

type PhotoItem = {
  area: string;
  region: string;
  src: string;
  alt: string;
  thumbSrc?: string;
};

const CACHE_SECONDS = 120;

function titleCase(value: string) {
  return value
    .replace(/[_-]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export async function GET(req: NextRequest) {
  const bucket = process.env.S3_BUCKET as string;
  const region = process.env.AWS_REGION as string;
  const cdn = process.env.CDN_DOMAIN || "cdn.degstn.com";

  if (!bucket || !region) {
    return NextResponse.json(
      { error: "S3_BUCKET and AWS_REGION env vars are required" },
      { status: 500 }
    );
  }

  const name = req.nextUrl.searchParams.get("name")?.trim();
  if (!name) {
    return NextResponse.json({ error: "Missing area name" }, { status: 400 });
  }

  const areaConfig = (areas as AreaConfig[]).find(
    (area) => area.name.toLowerCase() === name.toLowerCase()
  );
  const folder = areaConfig?.folder || name.toLowerCase().replace(/\s+/g, "");
  const areaLabel = areaConfig?.name || titleCase(name);
  const regionMap = (regionNames as Record<string, Record<string, string>>)[
    folder.toLowerCase()
  ];

  try {
    const { S3Client, ListObjectsV2Command } = await import("@aws-sdk/client-s3");
    const s3 = new S3Client({ region });
    const prefix = `images/${folder}/`;
    const all: Array<PhotoItem & { key: string }> = [];
    const regionFolders = new Set<string>();
    const thumbsByKey = new Map<string, string>();

    const isThumbKey = (key: string) => key.includes("/thumbs/");
    const toFullKey = (key: string) => key.replace("/thumbs/", "/");

    try {
      const prefixResult = await s3.send(
        new ListObjectsV2Command({
          Bucket: bucket,
          Prefix: prefix,
          Delimiter: "/",
        })
      );
      const prefixes = prefixResult.CommonPrefixes || [];
      prefixes.forEach((p) => {
        const raw = p.Prefix || "";
        const parts = raw.split("/").filter(Boolean);
        const regionFolder = parts.length >= 3 ? parts[2] : "";
        if (!regionFolder || regionFolder.toLowerCase() === "thumbs") return;
        const regionName =
          (regionMap && regionMap[regionFolder.toLowerCase()]) ||
          (regionFolder === "all" ? "All" : titleCase(regionFolder));
        regionFolders.add(regionName);
      });
    } catch {
      // fall back to regions derived from objects
    }

    let token: string | undefined;
    do {
      const out = await s3.send(
        new ListObjectsV2Command({
          Bucket: bucket,
          Prefix: prefix,
          ContinuationToken: token,
        })
      );
      const contents = out.Contents || [];
      for (const obj of contents) {
        const key = obj.Key || "";
        if (!key || key.endsWith("/") || !/\.(?:jpe?g|png|webp|gif)$/i.test(key)) continue;
        if (isThumbKey(key)) {
          thumbsByKey.set(toFullKey(key), `https://${cdn}/${key}`);
          continue;
        }
        const parts = key.split("/");
        if (parts.length < 3) continue;
        const regionFolder = parts.length >= 4 ? parts[2] : "all";
        const regionName =
          (regionMap && regionMap[regionFolder.toLowerCase()]) ||
          (regionFolder === "all" ? "All" : titleCase(regionFolder));
        const filename = parts[parts.length - 1];
        regionFolders.add(regionName);
        all.push({
          key,
          area: areaLabel,
          region: regionName,
          src: `https://${cdn}/${key}`,
          alt: filename,
        });
      }
      token = out.IsTruncated ? out.NextContinuationToken : undefined;
    } while (token);

    const merged = all.map(({ key, ...photo }) => ({
      ...photo,
      thumbSrc: thumbsByKey.get(key),
    }));

    merged.sort((a, b) => a.src.localeCompare(b.src));

    const regions = Array.from(regionFolders).sort((a, b) => a.localeCompare(b));

    return NextResponse.json(
      { area: areaLabel, photos: merged, regions },
      {
        headers: {
          "Cache-Control": `s-maxage=${CACHE_SECONDS}, stale-while-revalidate=${CACHE_SECONDS}`,
        },
      }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to list S3 objects" },
      { status: 500 }
    );
  }
}
