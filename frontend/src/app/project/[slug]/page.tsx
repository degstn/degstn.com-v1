import { projects } from '@/data/projects';
import { notFound } from 'next/navigation';

export default async function ProjectDetail({ params }: { params: { slug: string } }) {
  const project = projects.find(p => p.slug === params.slug);
  if (!project) return notFound();

  return (
    <main className="max-w-3xl mx-auto p-4 flex flex-col md:flex-row gap-6">
      <div className="flex-1">
        <img
          src={project.image}
          alt={`${project.name} preview`}
          className="rounded shadow w-full object-cover aspect-video"
        />
      </div>
      <div className="flex-1 flex flex-col">
        <h1 className="text-2xl font-bold mb-2">{project.name}</h1>
        <div className="mb-2">
          {project.tags.map(tag => (
            <span key={tag} className="inline-block bg-gray-200 text-xs px-2 py-1 rounded mr-2 mb-1">{tag}</span>
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