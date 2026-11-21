import type { APIRoute } from 'astro';
import { site } from '@/config/site';
import { getPublishedGuides, getPublishedNotes, guideHref, noteHref } from '@/lib/content';

const escapeXml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Published lessons only. Planned videos and queued research are not feed items. */
export const GET: APIRoute = async () => {
  const [notes, guides] = await Promise.all([getPublishedNotes(), getPublishedGuides()]);
  const entries = [
    ...notes.map((note) => ({
      title: note.data.title,
      href: noteHref(note),
      publishedAt: note.data.publishedAt,
      description: note.data.description,
    })),
    ...guides.map((guide) => ({
      title: guide.data.title,
      href: guideHref(guide),
      publishedAt: guide.data.publishedAt,
      description: guide.data.description,
    })),
  ].sort((a, b) => b.publishedAt.valueOf() - a.publishedAt.valueOf());
  const items = entries
    .map((entry) => {
      const link = new URL(entry.href, site.url).href;
      return `<item>
        <title>${escapeXml(entry.title)}</title>
        <link>${link}</link>
        <guid>${link}</guid>
        <pubDate>${entry.publishedAt.toUTCString()}</pubDate>
        <description>${escapeXml(entry.description)}</description>
      </item>`;
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(site.title)}</title>
    <link>${site.url}</link>
    <description>${escapeXml(site.description)}</description>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
