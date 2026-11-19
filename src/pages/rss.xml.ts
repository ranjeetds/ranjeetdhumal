import type { APIRoute } from 'astro';
import { site } from '@/config/site';
import { getPublishedNotes, noteHref } from '@/lib/content';

const escapeXml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Published lessons only. Planned videos and queued research are not feed items. */
export const GET: APIRoute = async () => {
  const notes = await getPublishedNotes();
  const items = notes
    .map((note) => {
      const link = new URL(noteHref(note), site.url).href;
      return `<item>
        <title>${escapeXml(note.data.title)}</title>
        <link>${link}</link>
        <guid>${link}</guid>
        <pubDate>${note.data.publishedAt.toUTCString()}</pubDate>
        <description>${escapeXml(note.data.description)}</description>
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
