import type { APIRoute } from 'astro';
import { domains } from '@/data/domains';
import { visualizations } from '@/components/visualizations/registry';
import {
  getPublishedGuides,
  getPublishedNotes,
  getPublishedPaths,
  getPublishedProjects,
  getPublishedResearch,
  getPublishedVideos,
  guideHref,
  noteHref,
} from '@/lib/content';

export interface SearchRecord {
  title: string;
  href: string;
  description: string;
  kind: 'lesson' | 'guide' | 'domain' | 'path' | 'figure' | 'video' | 'project' | 'research';
  /** False when the entry is a plan, not a recording or a result. */
  available: boolean;
}

/** Static index. The search page filters it in the browser, so a query needs no server. */
export const GET: APIRoute = async () => {
  const [notes, guides, paths, projects, research, videos] = await Promise.all([
    getPublishedNotes(),
    getPublishedGuides(),
    getPublishedPaths(),
    getPublishedProjects(),
    getPublishedResearch(),
    getPublishedVideos(),
  ]);

  const records: SearchRecord[] = [
    ...domains.map((domain) => ({
      title: domain.title,
      href: `/explore/${domain.id}`,
      description: domain.description,
      kind: 'domain' as const,
      available: true,
    })),
    ...guides.map((guide) => ({
      title: guide.data.title,
      href: guideHref(guide),
      description: guide.data.description,
      kind: 'guide' as const,
      available: true,
    })),
    ...notes.map((note) => ({
      title: note.data.title,
      href: noteHref(note),
      description: note.data.description,
      kind: 'lesson' as const,
      available: true,
    })),
    ...paths.map((path) => ({
      title: path.data.title,
      href: `/learning-paths#${path.id}`,
      description: path.data.description,
      kind: 'path' as const,
      available: true,
    })),
    ...visualizations.map((figure) => ({
      title: figure.title,
      href: `/studio/${figure.id}`,
      description: figure.summary,
      kind: 'figure' as const,
      available: figure.status === 'live',
    })),
    ...videos.map((video) => ({
      title: video.data.title,
      href: `/videos#${video.id}`,
      description: video.data.description,
      kind: 'video' as const,
      available: Boolean(video.data.url),
    })),
    ...projects.map((project) => ({
      title: project.data.title,
      href: `/projects#${project.id}`,
      description: project.data.description,
      kind: 'project' as const,
      available: true,
    })),
    ...research.map((entry) => ({
      title: entry.data.title,
      href: `/research#${entry.id}`,
      description: entry.data.description,
      kind: 'research' as const,
      available: entry.data.stage === 'posted',
    })),
  ];

  return new Response(JSON.stringify(records), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
