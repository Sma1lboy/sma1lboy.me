import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const BASE_URL = "https://sma1lboy.me";
const today = new Date().toISOString().split("T")[0];

// Static routes: [path, changefreq, priority]
const staticRoutes = [
  ["/", "weekly", "1.0"],
  ["/blog", "weekly", "0.8"],
  ["/projects", "monthly", "0.8"],
  ["/resume", "monthly", "0.8"],
  ["/timeline", "monthly", "0.8"],
  ["/github", "weekly", "0.8"],
  ["/contact", "yearly", "0.8"],
  ["/uses", "monthly", "0.8"],
  ["/reading", "monthly", "0.8"],
  ["/snippets", "monthly", "0.8"],
  ["/stats", "weekly", "0.8"],
  ["/changelog", "weekly", "0.8"],
  ["/profile", "monthly", "0.8"],
  ["/apps/terminal", "monthly", "0.5"],
  ["/apps/receipt", "monthly", "0.5"],
  ["/apps/typewriter", "monthly", "0.5"],
];

// Read blog posts for dynamic routes
const posts = JSON.parse(
  readFileSync(join(root, "src/data/blog-posts.json"), "utf-8"),
);

const staticEntries = staticRoutes
  .map(
    ([path, changefreq, priority]) => `  <url>
    <loc>${BASE_URL}${path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`,
  )
  .join("\n");

const blogEntries = posts
  .map(
    (post) => `  <url>
    <loc>${BASE_URL}/blog/${post.slug}</loc>
    <lastmod>${post.date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`,
  )
  .join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticEntries}
${blogEntries}
</urlset>
`;

writeFileSync(join(root, "public/sitemap.xml"), sitemap);
console.log(
  "Generated public/sitemap.xml with",
  staticRoutes.length + posts.length,
  "URLs",
);
