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
import { liveVisualizationIds, studioDomainIds, studioModules } from './data/studio';
import { guideDiagramIds } from './data/guide-diagrams';
import { guideFieldIds } from './data/guides';
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

/**
 * Practical guides. One shape throughout: a claim, when the idea applies, when it
 * does not, the move, and a check. Published at /guides/<file>.
 */
const guides = defineCollection({
  loader: folder('guides'),
  schema: entry.extend({
    field: z.enum(guideFieldIds),
    /** Order within the field, then across the index. */
    order: z.number().int(),
    publishedAt: z.coerce.date(),
    /** The situation in which the idea is the right tool. */
    useWhen: z.string(),
    /** The situation in which a simpler object will do, or the idea does not apply. */
    avoidWhen: z.string(),
    /** One thing the reader can check by hand after the guide. */
    check: z.string(),
    /** A live studio instrument drawn on this page. */
    figure: z.enum(liveVisualizationIds).optional(),
    /** A static diagram drawn on this page when no live instrument matches. */
    diagram: z.enum(guideDiagramIds).optional(),
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
    kind: z.enum(['note', 'experiment', 'paper-note', 'patent', 'open-question']),
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
    /** Label for `url`. Live products use the default. */
    linkLabel: z.string().default('Live site'),
    /** Sample pages produced by the project, each with a static preview. */
    samples: z
      .array(
        z.object({
          title: z.string(),
          place: z.string().optional(),
          url: z.url(),
          image: z.string(),
        }),
      )
      .default([]),
    /** A separate set of template sites, each with a loaded snapshot and a price. */
    templates: z
      .array(
        z.object({
          title: z.string(),
          place: z.string().optional(),
          url: z.url(),
          image: z.string(),
          price: z.string().optional(),
          note: z.string().optional(),
        }),
      )
      .default([]),
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

/**
 * Studio lessons. The file name is the module id (`machine-learning/gradient-descent.mdx`
 * is the lesson for `/studio/gradient-descent`). The visualization id is separate so the
 * same figure can serve Learn and Explore. Drafts render in dev and are omitted from
 * production. A private scratch note belongs in a file or folder starting with `_`.
 */
const studio = defineCollection({
  loader: folder('studio'),
  schema: z
    .object({
      title: z.string(),
      description: z.string(),
      /** Explore mode: what the experiment demonstrates, in one paragraph. */
      summary: z.string(),
      domain: z.enum(studioDomainIds),
      difficulty: z.enum(['Foundational', 'Intermediate', 'Advanced']),
      /** Minutes, for a careful reading plus the experiment. */
      estimatedTime: z.number().int().positive(),
      visualization: z.enum(liveVisualizationIds),
      status: z.enum(['published', 'draft']).default('published'),
      /** Catalogue ids. Planned modules are allowed; unknown ids are not. */
      prerequisites: z.array(z.string()).default([]),
      related: z.array(z.string()).default([]),
      next: z.string().optional(),
      /** Suggested runs, named the way the figure names them. */
      experiments: z.array(z.string()).default([]),
      tags: z.array(z.string()).default([]),
    })
    .superRefine((value, context) => {
      const known = new Set<string>(studioModules.map((module) => module.id));
      const relations = [
        ...value.prerequisites.map((id) => ({ field: 'prerequisites' as const, id })),
        ...value.related.map((id) => ({ field: 'related' as const, id })),
        ...(value.next ? [{ field: 'next' as const, id: value.next }] : []),
      ];
      for (const relation of relations) {
        if (!known.has(relation.id)) {
          context.addIssue({
            code: 'custom',
            message: `Unknown studio module “${relation.id}”.`,
            path: [relation.field],
          });
        }
      }
    }),
});

export const collections = { notes, guides, paths, research, projects, videos, studio };
