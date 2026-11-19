/**
 * Site-wide metadata and navigation. Everything that names the site, describes a
 * section or links between sections is defined here and nowhere else.
 */

export interface SocialLink {
  label: string;
  href: string;
}

export const site = {
  name: 'Ranjeet Dhumal',
  title: 'Ranjeet Dhumal — AI research notebook',
  tagline: 'Seeing how machines learn.',
  description:
    'A public notebook for learning how intelligent systems work: lessons, figures, paths, videos, code, and research, from a sample and its mean to agents.',
  /**
   * POST target for the contact form. Empty uses a mailto action and the visitor's
   * mail client. Set a Formspree or Worker URL here when one exists. Nothing is connected.
   */
  contactFormAction: '',
  url: 'https://ranjeetdhumal.com',
  locale: 'en',
  ogImage: '/og.png',
  /** Browser UI colour per scheme; keep in sync with `--canvas` in global.css. */
  themeColor: { dark: '#0a0d13', light: '#fbfaf7' },
  /** Current role. LinkedIn and GitHub still list it; the résumé (Nov 2025) agrees. */
  role: 'Senior Data Scientist',
  employer: 'Wolters Kluwer',
  location: 'Pune',
  /**
   * Public profiles. They appear in the footer and as `sameAs` in structured data.
   */
  socials: [
    { label: 'GitHub', href: 'https://github.com/ranjeetds' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ranjeetrdhumal/' },
  ] as SocialLink[],
  /** Public contact address, as printed on the résumé. Shown on the About page. */
  email: 'ranjeetrdhumal@gmail.com',
} as const;

export interface SiteSection {
  id: string;
  href: string;
  /** Short name used in navigation. */
  label: string;
  /** Full name used as the page heading. */
  title: string;
  /** One or two sentences; doubles as the page lede and meta description. */
  description: string;
  /**
   * `primary` is the learning navigation. `secondary` is the author.
   * `reference` stays on the site and out of the header, so older hubs keep their URLs.
   */
  group: 'primary' | 'secondary' | 'reference';
}

export const sections = [
  {
    id: 'studio',
    href: '/studio',
    label: 'Studio',
    title: 'Learning Studio',
    description:
      'Open an experiment and change it. The explanation is on the same page as the figure.',
    group: 'primary',
  },
  {
    id: 'explore',
    href: '/explore',
    label: 'Explore',
    title: 'Explore',
    description:
      'Twelve domains, from Python and mathematics to agents and current research. A domain explains what it is for. A lesson exists only when it is linked.',
    group: 'primary',
  },
  {
    id: 'learning-paths',
    href: '/learning-paths',
    label: 'Paths',
    title: 'Learning Paths',
    description:
      'Several journeys. From Data to Intelligence is the one to follow first. The others are branches, opened only where the essays exist.',
    group: 'primary',
  },
  {
    id: 'research',
    href: '/research',
    label: 'Research',
    title: 'Research',
    description:
      'Paper notes, experiments, and open questions. Posted work links to its source; planned entries are the queue, not findings.',
    group: 'primary',
  },
  {
    id: 'projects',
    href: '/projects',
    label: 'Projects',
    title: 'Code & Projects',
    description:
      'Public repositories, each with the problem, the approach in the code, and what that code demonstrates. Employer work is on the résumé.',
    group: 'primary',
  },
  {
    id: 'knowledge',
    href: '/knowledge',
    label: 'Knowledge',
    title: 'Knowledge Hub',
    description:
      'Eight fields, written as essays. Each one explains why it matters, then the ideas it is responsible for. Notes are linked from the field they belong to.',
    group: 'reference',
  },
  {
    id: 'videos',
    href: '/videos',
    label: 'Videos',
    title: 'Videos',
    description:
      'Lectures placed on the path, with a note on what to watch for, and films this notebook has not made yet.',
    group: 'reference',
  },
  {
    id: 'contact',
    href: '/contact',
    label: 'Contact',
    title: 'Contact',
    description: 'Email, LinkedIn, and GitHub.',
    group: 'secondary',
  },
  {
    id: 'about',
    href: '/about',
    label: 'About',
    title: 'About',
    description:
      'Why the notebook exists, how a page is supposed to teach, and the person who maintains it.',
    group: 'secondary',
  },
  {
    id: 'resume',
    href: '/resume',
    label: 'Résumé',
    title: 'Résumé',
    description: 'Experience, education and selected work.',
    group: 'secondary',
  },
] as const satisfies readonly SiteSection[];

export type SectionId = (typeof sections)[number]['id'];

export const primaryNav = sections.filter((section) => section.group === 'primary');
export const secondaryNav = sections.filter((section) => section.group === 'secondary');
export const referenceNav = sections.filter((section) => section.group === 'reference');

export function getSection(id: SectionId) {
  const section = sections.find((candidate) => candidate.id === id);
  if (!section) throw new Error(`Unknown site section: ${id}`);
  return section;
}

/** Two-digit ordinal used as a visual index ("01", "02", …). */
export function sectionIndex(id: SectionId): string {
  return String(sections.findIndex((section) => section.id === id) + 1).padStart(2, '0');
}

/**
 * The public path for a page, identical in dev, build and preview. During a build Astro
 * reports the output file (`/about.html`, and `/index.html` for the homepage), so this
 * strips `.html`, a directory's `index.html`, and trailing slashes.
 */
export function normalizePath(pathname: string): string {
  const path = pathname.replace(/(\/index)?\.html$/, '').replace(/\/+$/, '');
  return path === '' ? '/' : path;
}

export function isActivePath(pathname: string, href: string): boolean {
  const current = normalizePath(pathname);
  return current === href || current.startsWith(`${href}/`);
}
