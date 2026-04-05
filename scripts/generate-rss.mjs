import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const posts = JSON.parse(
  readFileSync(join(root, "src/data/blog-posts.json"), "utf-8"),
);

// Sort newest first
posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

function escapeXml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toRfc822(dateStr) {
  return new Date(dateStr + "T12:00:00Z").toUTCString();
}

const items = posts
  .map((post) => {
    const link = `https://sma1lboy.me/blog/${post.slug}`;
    return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${link}</link>
      <description>${escapeXml(post.excerpt)}</description>
      <pubDate>${toRfc822(post.date)}</pubDate>
      <guid isPermaLink="true">${link}</guid>
    </item>`;
  })
  .join("\n");

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Jackson Chen's Blog</title>
    <description>Thoughts on software engineering, AI, and building things</description>
    <link>https://sma1lboy.me/blog</link>
    <language>en-us</language>
    <atom:link href="https://sma1lboy.me/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;

writeFileSync(join(root, "public/rss.xml"), rss);
console.log("Generated public/rss.xml with", posts.length, "items");
