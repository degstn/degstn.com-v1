import { NextResponse } from "next/server";
import areas from "@/app/photography/areas.json";
import regionNames from "@/app/photography/region-names.json";

type AreaConfig = {
  id?: string;
  folder: string;
  name: string;
  lat?: number;
  lng?: number;
};

type PhotoItem = {
  area: string;
  region: string;
  src: string;
  alt: string;
};

type ResponseBody = {
  areas: Array<{ id?: string; name: string; lat?: number; lng?: number }>;
  photos: PhotoItem[];
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

export async function GET() {
  const bucket = process.env.S3_BUCKET as string;
  const region = process.env.AWS_REGION as string;
  const cdn = process.env.CDN_DOMAIN || "cdn.degstn.com";

  if (!bucket || !region) {
    return NextResponse.json(
      { error: "S3_BUCKET and AWS_REGION env vars are required" },
      { status: 500 }
    );
  }

  try {
    const { S3Client, ListObjectsV2Command } = await import("@aws-sdk/client-s3");
    const s3 = new S3Client({ region });
    const prefix = "images/";
    const all: PhotoItem[] = [];

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
        const parts = key.split("/");
        if (parts.length < 3) continue; // require images/<area>/<file> or images/<area>/<region>/<file>
        const areaFolder = parts[1];
        const regionFolder = parts.length >= 4 ? parts[2] : "all";
        const filename = parts[parts.length - 1];
        if (!areaFolder) continue;

        const areaConfig = (areas as AreaConfig[]).find(
          (area) => area.folder.toLowerCase() === areaFolder.toLowerCase()
        );
        const areaName = areaConfig?.name || titleCase(areaFolder);
        const regionMap = (regionNames as Record<string, Record<string, string>>)[
          areaFolder.toLowerCase()
        ];
        const region =
          (regionMap && regionMap[regionFolder.toLowerCase()]) ||
          (regionFolder === "all" ? "All" : titleCase(regionFolder));

        all.push({
          area: areaName,
          region,
          src: `https://${cdn}/${key}`,
          alt: filename,
        });
      }
      token = out.IsTruncated ? out.NextContinuationToken : undefined;
    } while (token);

    all.sort((a, b) => a.src.localeCompare(b.src));

    const areaSet = new Map<string, { id?: string; name: string; lat?: number; lng?: number }>();
    (areas as AreaConfig[]).forEach((area) => {
      areaSet.set(area.name, {
        id: area.id,
        name: area.name,
        lat: area.lat,
        lng: area.lng,
      });
    });
    all.forEach((photo) => {
      if (!areaSet.has(photo.area)) {
        areaSet.set(photo.area, { name: photo.area });
      }
    });

    const response: ResponseBody = {
      areas: Array.from(areaSet.values()),
      photos: all,
    };

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": `s-maxage=${CACHE_SECONDS}, stale-while-revalidate=${CACHE_SECONDS}`,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to list S3 objects" },
      { status: 500 }
    );
  }
}
