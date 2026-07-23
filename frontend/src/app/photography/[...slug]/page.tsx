import { Metadata } from "next";
import { notFound } from "next/navigation";
import DotMatrixGlobe from "../DotMatrixGlobe";
import areas from "../areas.json";

type AreaConfig = {
  id?: string;
  folder?: string;
  name: string;
  lat?: number;
  lng?: number;
};

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function findAreaById(areaId: string): AreaConfig | undefined {
  const normalized = safeDecode(areaId).toLowerCase();
  return (areas as AreaConfig[]).find(
    (area) => (area.id || "").toLowerCase() === normalized
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const area = slug?.length ? findAreaById(slug[0]) : undefined;
  if (!area) return {};
  const title = `${area.name} - Photography - degstn.com`;
  const description = `Shots from ${area.name} on degstn.com`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://degstn.com/photography/${area.id}`,
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
}

// Matches /photography/{areaId} and /photography/{areaId}/{photoSlug}.
// Static routes like /photography/hardware take precedence over this one.
export default async function PhotographyAreaPage({ params }: PageProps) {
  const { slug } = await params;
  if (!slug || slug.length === 0 || slug.length > 2 || !findAreaById(slug[0])) {
    notFound();
  }
  return (
    <main style={{ width: "100%", height: "80vh" }}>
      <DotMatrixGlobe />
    </main>
  );
}
