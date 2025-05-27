/* --------------------------------------------------------------------------
   src/app/project/[slug]/page.tsx
   Dynamic project-detail page – Server Component (Next 15)
--------------------------------------------------------------------------- */

import { projects } from '@/data/projects';
import { notFound } from 'next/navigation';
import Image from 'next/image';

/** Route-param shape */
type Params = { slug: string };

export default async function ProjectDetail(
  { params }: { params: Promise<Params> }    // ←  🔑 Next 15 expects a Promise here
) {
  const { slug } = await params;

  const project = projects.find((p) => p.slug === slug);
  if (!project) return notFound();

  return (
    <main className="mx-auto max-w-3xl p-4 flex flex-col md:flex-row gap-6">
      {/* preview image */}
      <div className="flex-1">
        <Image
          src={project.image}
          alt={`${project.name} preview`}
          width={1280}
          height={720}
          className="rounded shadow object-cover aspect-video"
          priority
        />
      </div>

      {/* details */}
      <div className="flex-1 flex flex-col">
        <h1 className="text-2xl font-bold mb-2">{project.name}</h1>

        {/* tags */}
        <div className="mb-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="inline-block bg-gray-200 text-xs px-2 py-1 rounded mr-2 mb-1"
            >
              {tag}
            </span>
          ))}
        </div>

        <p className="mb-4">{project.description}</p>

        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-international-orange-engineering text-white px-4 py-2 rounded hover:bg-orange-700 transition w-fit"
        >
          Visit Site
        </a>
      </div>
    </main>
  );
}