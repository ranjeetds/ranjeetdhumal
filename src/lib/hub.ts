/**
 * Knowledge Hub model. Built from the notes, guides, studio lessons and paths.
 * The only additions are the field mappings in guides.ts and studio domains,
 * the path chosen per field, and the mathematics entry links (proposed).
 */
import { readFileSync } from 'node:fs';
import { guideFieldToTopic } from '@/data/guides';
import { studioDomains, studioModules } from '@/data/studio';
import { topics, type TopicId } from '@/data/topics';
import {
  getPublishedGuides,
  getPublishedNotes,
  getPublishedPaths,
  getPublishedStudioLessons,
  guideHref,
  noteHref,
  type Guide,
  type Note,
  type Path,
  type StudioLesson,
} from '@/lib/content';

export type HubKind = 'note' | 'guide' | 'figure';
export type HubLevel = 'Foundational' | 'Intermediate' | 'Advanced';

export interface HubItem {
  key: string;
  id: string;
  kind: HubKind;
  field: TopicId;
  title: string;
  description: string;
  href: string;
  minutes: number;
  level: HubLevel | null;
  maturity?: 'seedling' | 'budding' | 'evergreen';
  publishedAt: string | null;
  tags: string[];
  equation: string | null;
  figureId: string | null;
  prerequisites: string[];
  objectives: string[];
  useWhen?: string;
  avoidWhen?: string;
  check?: string;
  next: string | null;
}

export interface HubEntry {
  title: string;
  paragraphs: readonly string[];
  links: HubItem[];
}

export interface HubStep {
  n: number;
  title: string;
  outcome: string;
  concepts: readonly string[];
  why: string;
  experiment: string | null;
  article: HubItem | null;
  figure: HubItem | null;
}

export interface HubPath {
  id: string;
  title: string;
  description: string;
  level: string;
  primary: boolean;
  outcome: string;
  href: string;
  steps: HubStep[];
}

export interface HubField {
  id: TopicId;
  n: number;
  title: string;
  description: string;
  introduction: readonly string[];
  entries: HubEntry[];
  items: HubItem[];
  path: HubPath | null;
  /** Path-order rank for each item key. Items outside the path sort after these. */
  order: Map<string, number>;
  tags: string[];
  minutes: number;
  hasLevels: boolean;
}

export interface HubSearchHit {
  key: string;
  kind: HubKind | 'entry' | 'step' | 'field';
  title: string;
  sub: string;
  field: TopicId;
  fieldTitle: string;
  href: string;
  text: string;
}

export interface HubModel {
  fields: HubField[];
  items: HubItem[];
  metaNote: HubItem | null;
  primaryPath: HubPath | null;
  counts: { notes: number; guides: number; figures: number; paths: number };
  search: HubSearchHit[];
}

/** Which path a field opens with. Python and research have none. */
const FIELD_PATH: Partial<Record<TopicId, string>> = {
  'artificial-intelligence': 'from-data-to-intelligence',
  'machine-learning': 'foundations-of-machine-learning',
  'deep-learning': 'neural-networks-to-transformers',
  'generative-ai': 'building-with-modern-llms',
  'agentic-ai': 'agentic-ai-systems',
  mathematics: 'mathematics-for-ai',
};

/**
 * PROPOSED entry → resource keys, mathematics only. Confirm before treating
 * these as part of the essays themselves.
 */
const ENTRY_LINKS: Record<string, readonly string[]> = {
  'A sample and its mean': ['note:a-sample-and-its-mean', 'figure:sample-mean', 'guide:a-sample-is-not-the-population'],
  'Linear maps': ['figure:linear-map', 'guide:a-matrix-is-a-map', 'figure:dot-product'],
  Gradients: ['guide:a-derivative-is-a-local-slope', 'figure:gradient-descent'],
  'Probability as an update': ['guide:calibration', 'figure:entropy'],
  Optimization: ['note:training-dynamics', 'figure:gradient-descent'],
};

const KIND_RANK: Record<HubKind, number> = { note: 0, figure: 1, guide: 2 };

function rawBody(entry: { body?: unknown; filePath?: unknown }): string {
  if (typeof entry.body === 'string' && entry.body.length > 0) return entry.body;
  if (typeof entry.filePath === 'string') {
    const file = readFileSync(entry.filePath, 'utf8');
    const fence = file.indexOf('\n---', 3);
    return fence === -1 ? file : file.slice(fence + 4);
  }
  return '';
}

function minutesFromBody(body: string): number {
  const text = body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#>*_[\]()`]/g, ' ');
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function firstViz(body: string): string | null {
  return body.match(/<Viz\s+id="([^"]+)"/)?.[1] ?? null;
}

function firstDisplayEquation(body: string): string | null {
  for (const match of body.matchAll(/<Equation\b([^>]*?)\/>/g)) {
    const attrs = match[1] ?? '';
    if (/display=\{false\}/.test(attrs)) continue;
    const tex = attrs.match(/\btex="([^"]*)"/)?.[1];
    if (!tex) continue;
    return tex.replace(/[.,]\s*$/, '');
  }
  return null;
}

function isoDay(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function hrefToKey(href: string | undefined): string | null {
  if (!href) return null;
  const match = href.match(/^\/(knowledge|guides)\/([^#?]+)/);
  if (!match) return null;
  const kind = match[1] === 'knowledge' ? 'note' : 'guide';
  const id = match[2];
  if (!id) return null;
  return `${kind}:${id}`;
}

export async function getHub(): Promise<HubModel> {
  const [notes, guides, lessons, paths] = await Promise.all([
    getPublishedNotes(),
    getPublishedGuides(),
    getPublishedStudioLessons(),
    getPublishedPaths(),
  ]);

  const noteItems = notes.map((note) => noteItem(note));
  const guideItems = guides.map((guide) => guideItem(guide));
  const figureItems = lessons.map((lesson) => figureItem(lesson));
  const byKey = new Map<string, HubItem>(
    [...noteItems, ...guideItems, ...figureItems].map((item) => [item.key, item]),
  );

  const extras = new Map<TopicId, HubItem[]>();
  for (const domain of studioDomains) {
    for (const id of domain.sequence) {
      const item = byKey.get(`figure:${id}`);
      if (!item || item.field === domain.topic) continue;
      const list = extras.get(domain.topic) ?? [];
      if (!list.some((candidate) => candidate.key === item.key)) list.push(item);
      extras.set(domain.topic, list);
    }
  }

  const hubPaths = paths.map((path) => toPath(path, byKey));
  const pathById = new Map(hubPaths.map((path) => [path.id, path]));
  const primaryPath = hubPaths.find((path) => path.primary) ?? null;

  const fields: HubField[] = topics.map((topic, index) => {
    const own = [...noteItems, ...guideItems, ...figureItems].filter(
      (item) => item.field === topic.id && item.id !== 'how-to-read-this-notebook',
    );
    const extra = extras.get(topic.id) ?? [];
    const items = [...own];
    for (const item of extra) {
      if (!items.some((candidate) => candidate.key === item.key)) items.push(item);
    }
    const pathId = FIELD_PATH[topic.id];
    const path = pathId ? (pathById.get(pathId) ?? null) : null;
    const order = new Map<string, number>();
    let rank = 0;
    for (const step of path?.steps ?? []) {
      for (const key of [step.article?.key, step.figure?.key]) {
        if (key && !order.has(key)) order.set(key, rank++);
      }
    }
    for (const item of items) {
      if (!order.has(item.key)) order.set(item.key, 100 + KIND_RANK[item.kind]);
    }
    const tagCounts = new Map<string, number>();
    for (const item of items) {
      for (const tag of item.tags) tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    }
    const tags = [...tagCounts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 10)
      .map(([tag]) => tag);
    return {
      id: topic.id,
      n: index + 1,
      title: topic.title,
      description: topic.description,
      introduction: topic.introduction,
      entries: topic.entries.map((entry) => ({
        title: entry.title,
        paragraphs: entry.paragraphs,
        links:
          topic.id === 'mathematics'
            ? (ENTRY_LINKS[entry.title] ?? []).flatMap((key) => {
                const item = byKey.get(key);
                return item ? [item] : [];
              })
            : [],
      })),
      items,
      path,
      order,
      tags,
      minutes: items.reduce((sum, item) => sum + item.minutes, 0),
      hasLevels: items.some((item) => item.level),
    };
  });

  const metaNote = noteItems.find((item) => item.id === 'how-to-read-this-notebook') ?? null;
  const fieldTitle = new Map(fields.map((field) => [field.id, field.title]));
  const search: HubSearchHit[] = [
    ...fields.map((field) => ({
      key: `field:${field.id}`,
      kind: 'field' as const,
      title: field.title,
      sub: field.description,
      field: field.id,
      fieldTitle: field.title,
      href: `/knowledge#${field.id}`,
      text: `${field.title} ${field.description}`,
    })),
    ...[...noteItems, ...guideItems, ...figureItems].flatMap((item) => {
      const title = fieldTitle.get(item.field);
      if (!title) return [];
      return [
        {
          key: item.key,
          kind: item.kind,
          title: item.title,
          sub: item.description,
          field: item.field,
          fieldTitle: title,
          href: item.href,
          text: `${item.title} ${item.description} ${item.tags.join(' ')}`,
        },
      ];
    }),
    ...fields.flatMap((field) =>
      field.entries.map((entry) => ({
        key: `entry:${field.id}:${entry.title}`,
        kind: 'entry' as const,
        title: entry.title,
        sub: entry.paragraphs[0] ?? '',
        field: field.id,
        fieldTitle: field.title,
        href: `/knowledge#${field.id}`,
        text: `${entry.title} ${entry.paragraphs.join(' ')}`,
      })),
    ),
    ...fields.flatMap((field) =>
      (field.path?.steps ?? []).map((step) => ({
        key: `step:${field.path?.id ?? field.id}:${step.n}`,
        kind: 'step' as const,
        title: step.title,
        sub: `${field.path?.title ?? field.title} · step ${step.n}`,
        field: field.id,
        fieldTitle: field.title,
        href: step.article?.href ?? step.figure?.href ?? `/knowledge#${field.id}`,
        text: `${step.title} ${step.concepts.join(' ')} ${step.outcome}`,
      })),
    ),
  ];

  return {
    fields,
    items: [...noteItems, ...guideItems, ...figureItems],
    metaNote,
    primaryPath,
    counts: {
      notes: noteItems.length,
      guides: guideItems.length,
      figures: figureItems.length,
      paths: hubPaths.length,
    },
    search,
  };
}

function noteItem(note: Note): HubItem {
  const body = rawBody(note);
  return {
    key: `note:${note.id}`,
    id: note.id,
    kind: 'note',
    field: note.data.topic ?? 'artificial-intelligence',
    title: note.data.title,
    description: note.data.description,
    href: noteHref(note),
    minutes: minutesFromBody(body),
    level: null,
    maturity: note.data.maturity,
    publishedAt: isoDay(note.data.publishedAt),
    tags: note.data.tags,
    equation: null,
    figureId: firstViz(body),
    prerequisites: note.data.prerequisites,
    objectives: note.data.objectives,
    next: null,
  };
}

function guideItem(guide: Guide): HubItem {
  const body = rawBody(guide);
  return {
    key: `guide:${guide.id}`,
    id: guide.id,
    kind: 'guide',
    field: guideFieldToTopic[guide.data.field],
    title: guide.data.title,
    description: guide.data.description,
    href: guideHref(guide),
    minutes: minutesFromBody(body),
    level: null,
    publishedAt: isoDay(guide.data.publishedAt),
    tags: guide.data.tags,
    equation: null,
    figureId: guide.data.figure ?? firstViz(body),
    prerequisites: [],
    objectives: [],
    useWhen: guide.data.useWhen,
    avoidWhen: guide.data.avoidWhen,
    check: guide.data.check,
    next: null,
  };
}

function figureItem(lesson: StudioLesson): HubItem {
  const domain = studioDomains.find((candidate) => candidate.id === lesson.data.domain);
  const body = rawBody(lesson);
  return {
    key: `figure:${lesson.data.visualization}`,
    id: lesson.data.visualization,
    kind: 'figure',
    field: domain?.topic ?? 'machine-learning',
    title: lesson.data.title,
    description: lesson.data.description,
    href: `/studio/${lesson.data.visualization}`,
    minutes: lesson.data.estimatedTime,
    level: lesson.data.difficulty,
    publishedAt: null,
    tags: lesson.data.tags,
    equation: firstDisplayEquation(body),
    figureId: lesson.data.visualization,
    prerequisites: lesson.data.prerequisites,
    objectives: [],
    next: lesson.data.next ?? null,
  };
}

function toPath(path: Path, byKey: Map<string, HubItem>): HubPath {
  return {
    id: path.id,
    title: path.data.title,
    description: path.data.description,
    level: path.data.level,
    primary: path.data.primary,
    outcome: path.data.outcome,
    href: `/learning-paths#${path.id}`,
    steps: path.data.modules.map((module, index) => ({
      n: index + 1,
      title: module.title,
      outcome: module.outcome,
      concepts: module.concepts,
      why: module.why,
      experiment: module.experiment ?? null,
      article: lookup(byKey, hrefToKey(module.article)),
      figure: module.figure ? lookup(byKey, `figure:${module.figure}`) : null,
    })),
  };
}

function lookup(byKey: Map<string, HubItem>, key: string | null): HubItem | null {
  if (!key) return null;
  return byKey.get(key) ?? null;
}

export function moduleTitle(id: string): string {
  return studioModules.find((module) => module.id === id)?.title ?? id;
}

export const HUB_KIND_LABEL: Record<HubKind, string> = {
  note: 'Note',
  guide: 'Guide',
  figure: 'Live figure',
};
