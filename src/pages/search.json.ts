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
import { getHub } from '@/lib/hub';

export interface SearchRecord {
  title: string;
  href: string;
  description: string;
  kind: 'lesson' | 'guide' | 'domain' | 'path' | 'figure' | 'video' | 'project' | 'research' | 'path-step' | 'field-map';
  /** False when the entry is a plan, not a recording or a result. */
  available: boolean;
  field?: string;
  minutes?: number;
  level?: string;
}

/** Static index. The search page filters it in the browser, so a query needs no server. */
export const GET: APIRoute = async () => {
  const [notes, guides, paths, projects, research, videos, hub] = await Promise.all([
    getPublishedNotes(),
    getPublishedGuides(),
    getPublishedPaths(),
    getPublishedProjects(),
    getPublishedResearch(),
    getPublishedVideos(),
    getHub(),
  ]);
  const byHref = new Map(hub.items.map((item) => [item.href, item]));

  const records: SearchRecord[] = [
    ...domains.map((domain) => ({
      title: domain.title,
      href: `/explore/${domain.id}`,
      description: domain.description,
      kind: 'domain' as const,
      available: true,
    })),
    ...guides.map((guide) => {
      const href = guideHref(guide);
      const item = byHref.get(href);
      return {
        title: guide.data.title,
        href,
        description: guide.data.description,
        kind: 'guide' as const,
        available: true,
        ...(item ? { field: item.field, minutes: item.minutes } : {}),
      };
    }),
    ...notes.map((note) => {
      const href = noteHref(note);
      const item = byHref.get(href);
      return {
        title: note.data.title,
        href,
        description: note.data.description,
        kind: 'lesson' as const,
        available: true,
        ...(item ? { field: item.field, minutes: item.minutes } : {}),
      };
    }),
    ...paths.map((path) => ({
      title: path.data.title,
      href: `/learning-paths#${path.id}`,
      description: path.data.description,
      kind: 'path' as const,
      available: true,
    })),
    ...visualizations.map((figure) => {
      const href = `/studio/${figure.id}`;
      const item = byHref.get(href);
      return {
        title: figure.title,
        href,
        description: figure.summary,
        kind: 'figure' as const,
        available: figure.status === 'live',
        ...(item ? { field: item.field, minutes: item.minutes, ...(item.level ? { level: item.level } : {}) } : {}),
      };
    }),
    ...hub.search.flatMap((hit) => {
      if (hit.kind !== 'step' && hit.kind !== 'entry') return [];
      return [
        {
          title: hit.title,
          href: hit.href,
          description: hit.sub,
          kind: hit.kind === 'step' ? ('path-step' as const) : ('field-map' as const),
          available: true,
          field: hit.field,
        },
      ];
    }),
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
