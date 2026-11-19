import { type CollectionEntry, getCollection } from 'astro:content';
import { liveVisualizationIds } from '@/data/studio';

export type Note = CollectionEntry<'notes'>;

/** Notes that should be visible: everything in dev, non-drafts in production. Newest first. */
export async function getPublishedNotes(): Promise<Note[]> {
  const notes = await getCollection('notes', ({ data }) => import.meta.env.DEV || !data.draft);
  return notes.sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf());
}

export function noteHref(note: Note): string {
  return `/knowledge/${note.id}`;
}

export type Path = CollectionEntry<'paths'>;
export type ResearchEntry = CollectionEntry<'research'>;
export type Video = CollectionEntry<'videos'>;

const isPublic = ({ data }: { data: { draft: boolean } }) => import.meta.env.DEV || !data.draft;

/** Paths in teaching order. */
export async function getPublishedPaths(): Promise<Path[]> {
  const paths = await getCollection('paths', isPublic);
  return paths.sort((a, b) => a.data.order - b.data.order);
}

/** Research log, newest first. Planned entries are included; they are marked in the data. */
export async function getPublishedResearch(): Promise<ResearchEntry[]> {
  const entries = await getCollection('research', isPublic);
  return entries.sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf());
}

/** Planned and published videos, grouped later by series. */
export async function getPublishedVideos(): Promise<Video[]> {
  const videos = await getCollection('videos', isPublic);
  return videos.sort((a, b) => a.data.series.localeCompare(b.data.series) || a.data.title.localeCompare(b.data.title));
}

export type StudioLesson = CollectionEntry<'studio'>;

/**
 * Published studio lessons. Drafts stay available in dev.
 * The file's basename must be the visualization id, which is the module URL.
 */
export async function getPublishedStudioLessons(): Promise<StudioLesson[]> {
  const lessons = await getCollection(
    'studio',
    ({ data }) => import.meta.env.DEV || data.status === 'published',
  );
  const live = new Set<string>(liveVisualizationIds);
  for (const lesson of lessons) {
    const slash = lesson.id.lastIndexOf('/');
    const basename = slash === -1 ? lesson.id : lesson.id.slice(slash + 1);
    if (basename !== lesson.data.visualization) {
      throw new Error(
        `Studio lesson “${lesson.id}” must be named after its visualization “${lesson.data.visualization}”.`,
      );
    }
    if (!live.has(lesson.data.visualization)) {
      throw new Error(`Studio lesson “${lesson.id}” points at a figure that is not live.`);
    }
  }
  return lessons.sort((a, b) => a.data.title.localeCompare(b.data.title));
}

export function getStudioLessonByVisualization(
  lessons: readonly StudioLesson[],
  visualization: string,
): StudioLesson | undefined {
  return lessons.find((lesson) => lesson.data.visualization === visualization);
}

export type Project = CollectionEntry<'projects'>;

/** Projects that should be visible: everything in dev, non-drafts in production. Newest year first. */
export async function getPublishedProjects(): Promise<Project[]> {
  const projects = await getCollection(
    'projects',
    ({ data }) => import.meta.env.DEV || !data.draft,
  );
  return projects.sort((a, b) => b.data.year - a.data.year || a.data.title.localeCompare(b.data.title));
}

const dateFormat = new Intl.DateTimeFormat('en', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
});

/** "Nov 18, 2026". Frontmatter dates are date-only, so they are formatted in UTC. */
export function formatDate(date: Date): string {
  return dateFormat.format(date);
}
