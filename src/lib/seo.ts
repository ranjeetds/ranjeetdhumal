/**
 * JSON-LD builders (schema.org). `BaseHead.astro` always emits the WebSite + Person graph;
 * pages add their own nodes through the layout's `structuredData` prop.
 */

import { site } from '@/config/site';

type JsonLd = Record<string, unknown>;

const personId = `${site.url}/#person`;
const websiteId = `${site.url}/#website`;

export const absoluteUrl = (path: string) => new URL(path, site.url).href;

export function personSchema(): JsonLd {
  return {
    '@type': 'Person',
    '@id': personId,
    name: site.name,
    url: site.url,
    jobTitle: site.role,
    worksFor: { '@type': 'Organization', name: site.employer },
    email: site.email,
    address: { '@type': 'PostalAddress', addressLocality: site.location, addressCountry: 'IN' },
    ...(site.socials.length > 0 && { sameAs: site.socials.map((social) => social.href) }),
  };
}

export function websiteSchema(): JsonLd {
  return {
    '@type': 'WebSite',
    '@id': websiteId,
    name: site.name,
    description: site.description,
    url: site.url,
    inLanguage: site.locale,
    publisher: { '@id': personId },
  };
}

export interface Crumb {
  name: string;
  path: string;
}

export function breadcrumbSchema(crumbs: Crumb[]): JsonLd {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Home', path: '/' }, ...crumbs].map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

export function articleSchema(article: {
  title: string;
  description: string;
  path: string;
  publishedAt: Date;
  updatedAt?: Date;
}): JsonLd {
  return {
    '@type': 'TechArticle',
    headline: article.title,
    description: article.description,
    url: absoluteUrl(article.path),
    datePublished: article.publishedAt.toISOString(),
    dateModified: (article.updatedAt ?? article.publishedAt).toISOString(),
    inLanguage: site.locale,
    author: { '@id': personId },
    publisher: { '@id': personId },
    isPartOf: { '@id': websiteId },
  };
}

/** Serialises nodes as one `@graph`, escaped so it is safe inside a <script> element. */
export function serializeGraph(nodes: JsonLd[]): string {
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes }).replace(
    /</g,
    '\\u003c',
  );
}
