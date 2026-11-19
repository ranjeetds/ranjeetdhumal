/**
 * Content collections. Each collection is a folder of Markdown/MDX under `src/content/`.
 *
 * The schemas are written with an Obsidian workflow in mind:
 *   - plain `.md` and `.mdx` are both accepted;
 *   - frontmatter uses ordinary YAML (dates like `2026-11-18`, `tags` and `aliases` lists);
 *   - files and folders starting with `_` are ignored, so templates and scratch notes can
 *     live inside the vault without being published.
 */

import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { topicIds } from './data/topics';

const pattern = ['**/*.{md,mdx}', '!**/_*', '!**/_*/**'];
const folder = (name: string) => glob({ base: `./src/content/${name}`, pattern });

/** Fields every entry shares. */
const entry = z.object({
  title: z.string(),
  description: z.string(),
  tags: z.array(z.string()).default([]),
  /** Drafts render in `astro dev` but are excluded from production builds. */
  draft: z.boolean().default(false),
});

/** Knowledge Hub — short, visual notes. Published at /knowledge/<file-path>. */
const notes = defineCollection({
  loader: folder('notes'),
  schema: entry.extend({
    topic: z.enum(topicIds).optional(),
    /** How settled the note is: a first sketch, a developing note, or a stable reference. */
    maturity: z.enum(['seedling', 'budding', 'evergreen']).default('seedling'),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    /** Obsidian aliases; reserved for wikilink resolution. */
    aliases: z.array(z.string()).default([]),
    /** What the reader should already be able to do. Optional. */
    prerequisites: z.array(z.string()).default([]),
    /** What the reader can do after the lesson. Optional. */
    objectives: z.array(z.string()).default([]),
    /** Links that are not the lesson itself. */
    furtherReading: z
      .array(z.object({ title: z.string(), href: z.string() }))
      .default([]),
  }),
});

/** Learning Paths — ordered sequences of notes. */
const paths = defineCollection({
  loader: folder('paths'),
  schema: entry.extend({
    level: z.enum(['foundational', 'intermediate', 'advanced']),
    topics: z.array(z.enum(topicIds)).default([]),
    /** Notes in the order they should be read, once they exist. */
    notes: z.array(reference('notes')).default([]),
    /** The path a newcomer should follow. Branch paths stay available beside it. */
    primary: z.boolean().default(false),
    /** The journey, in a few paragraphs' worth of prose. Shown above the modules. */
    overview: z.string(),
    /**
     * Ordered modules. Each one says what becomes clear, which ideas it turns on,
     * why those ideas are the ones that matter, and how the next module uses them.
     */
    modules: z
      .array(
        z.object({
          title: z.string(),
          outcome: z.string(),
          concepts: z.array(z.string()).min(2),
          why: z.string(),
          next: z.string(),
          /** Knowledge Hub article for this chapter, as a site path. */
          article: z.string().optional(),
          /** Visualization id, linked from the visual lab. */
          figure: z.string().optional(),
          /** A small experiment the reader can do with the figure or by hand. */
          experiment: z.string().optional(),
          /** A lecture that belongs with this chapter, as a site path or URL. */
          reading: z.string().optional(),
        }),
      )
      .min(3),
    /** What a learner can do after the last module. */
    outcome: z.string(),
    order: z.number().default(0),
  }),
});

/** Research — paper notes, experiments and open questions. */
const research = defineCollection({
  loader: folder('research'),
  schema: entry.extend({
    kind: z.enum(['note', 'experiment', 'paper-note', 'open-question']),
    /** `planned` entries are the queue. They are not findings. */
    stage: z.enum(['planned', 'posted']).default('posted'),
    publishedAt: z.coerce.date(),
    authors: z.array(z.string()).default([]),
    /** Link to the paper or primary source being discussed. */
    source: z.url().optional(),
  }),
});

/** Projects — things that were built. */
const projects = defineCollection({
  loader: folder('projects'),
  schema: entry.extend({
    status: z.enum(['active', 'shipped', 'archived']),
    year: z.number().int(),
    stack: z.array(z.string()).default([]),
    /** The constraint the project exists to deal with. */
    problem: z.string(),
    /** How the system is put together, at the level of design rather than a file list. */
    approach: z.string(),
    /** What building it makes visible. Not a success metric. */
    outcome: z.string(),
    repository: z.url().optional(),
    url: z.url().optional(),
  }),
});

/** Videos — explainers and walkthroughs hosted elsewhere. */
const videos = defineCollection({
  loader: folder('videos'),
  schema: entry.extend({
    publishedAt: z.coerce.date().optional(),
    /** Set once the video exists. Absent means the entry is planned, not a link. */
    url: z.url().optional(),
    /** Series title used to group the library. */
    series: z.string(),
    /** Human-readable running time, e.g. "12 min". An estimate until the video is cut. */
    duration: z.string().optional(),
    /** The written note this video accompanies, if any. */
    note: reference('notes').optional(),
    /** What to watch for. Curated lectures need this; planned films may omit it. */
    why: z.string().optional(),
    /** Chapter of the primary path this video belongs with. */
    chapter: z.string().optional(),
    /** `curated` is someone else's lecture. `original` is a film this notebook will make. */
    origin: z.enum(['curated', 'original']).default('original'),
  }),
});

export const collections = { notes, paths, research, projects, videos };
