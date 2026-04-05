import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const blogPosts = JSON.parse(
  fs.readFileSync(path.join(ROOT, "src/data/blog-posts.json"), "utf-8"),
);

const OG_DIR = path.join(ROOT, "public/og");
fs.mkdirSync(OG_DIR, { recursive: true });

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function truncateTitle(title, maxLen = 55) {
  if (title.length <= maxLen) return escapeXml(title);
  return escapeXml(title.slice(0, maxLen - 1).trimEnd()) + "…";
}

function escapeXml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function wrapTitle(title, maxCharsPerLine = 28) {
  const escaped = truncateTitle(title, 55);
  const words = escaped.split(" ");
  const lines = [];
  let current = "";

  for (const word of words) {
    if (current && (current + " " + word).length > maxCharsPerLine) {
      lines.push(current);
      current = word;
    } else {
      current = current ? current + " " + word : word;
    }
  }
  if (current) lines.push(current);

  return lines.slice(0, 3);
}

function generatePostSVG(post) {
  const titleLines = wrapTitle(post.title);
  const date = formatDate(post.date);
  const tags = post.tags.slice(0, 3).map(escapeXml);

  const titleY = 220;
  const lineHeight = 56;

  const titleTspans = titleLines
    .map(
      (line, i) =>
        `<tspan x="80" dy="${i === 0 ? 0 : lineHeight}">${line}</tspan>`,
    )
    .join("");

  const tagsMarkup = tags
    .map((tag, i) => {
      const x = 80 + i * 120;
      return `<text x="${x}" y="${titleY + titleLines.length * lineHeight + 40}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif" font-size="16" fill="#94a3b8" letter-spacing="0.5">#${tag}</text>`;
    })
    .join("\n    ");

  return `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0f0a1e;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#1a1035;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0c1929;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#6366f1;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)" />

  <!-- Subtle grid pattern -->
  <g opacity="0.03">
    <line x1="0" y1="0" x2="0" y2="630" stroke="white" stroke-width="1" />
    <line x1="120" y1="0" x2="120" y2="630" stroke="white" stroke-width="1" />
    <line x1="240" y1="0" x2="240" y2="630" stroke="white" stroke-width="1" />
    <line x1="360" y1="0" x2="360" y2="630" stroke="white" stroke-width="1" />
    <line x1="480" y1="0" x2="480" y2="630" stroke="white" stroke-width="1" />
    <line x1="600" y1="0" x2="600" y2="630" stroke="white" stroke-width="1" />
    <line x1="720" y1="0" x2="720" y2="630" stroke="white" stroke-width="1" />
    <line x1="840" y1="0" x2="840" y2="630" stroke="white" stroke-width="1" />
    <line x1="960" y1="0" x2="960" y2="630" stroke="white" stroke-width="1" />
    <line x1="1080" y1="0" x2="1080" y2="630" stroke="white" stroke-width="1" />
    <line x1="1200" y1="0" x2="1200" y2="630" stroke="white" stroke-width="1" />
  </g>

  <!-- Accent bar at top -->
  <rect x="0" y="0" width="1200" height="4" fill="url(#accent)" />

  <!-- Author + date -->
  <text x="80" y="120" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif" font-size="18" fill="#94a3b8" letter-spacing="1">Jackson Chen · ${escapeXml(date)}</text>

  <!-- Divider line -->
  <rect x="80" y="145" width="60" height="2" fill="#6366f1" rx="1" />

  <!-- Title -->
  <text y="${titleY}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif" font-size="48" font-weight="700" fill="#f1f5f9" letter-spacing="-0.5">
    ${titleTspans}
  </text>

  <!-- Tags -->
  ${tagsMarkup}

  <!-- Site URL -->
  <text x="1120" y="590" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif" font-size="14" fill="#475569" text-anchor="end" letter-spacing="0.5">sma1lboy.me</text>

  <!-- Corner accent -->
  <circle cx="1160" cy="585" r="4" fill="#6366f1" opacity="0.6" />
</svg>`;
}

function generateDefaultSVG() {
  return `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0f0a1e;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#1a1035;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0c1929;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#6366f1;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)" />

  <!-- Subtle grid pattern -->
  <g opacity="0.03">
    <line x1="0" y1="0" x2="0" y2="630" stroke="white" stroke-width="1" />
    <line x1="120" y1="0" x2="120" y2="630" stroke="white" stroke-width="1" />
    <line x1="240" y1="0" x2="240" y2="630" stroke="white" stroke-width="1" />
    <line x1="360" y1="0" x2="360" y2="630" stroke="white" stroke-width="1" />
    <line x1="480" y1="0" x2="480" y2="630" stroke="white" stroke-width="1" />
    <line x1="600" y1="0" x2="600" y2="630" stroke="white" stroke-width="1" />
    <line x1="720" y1="0" x2="720" y2="630" stroke="white" stroke-width="1" />
    <line x1="840" y1="0" x2="840" y2="630" stroke="white" stroke-width="1" />
    <line x1="960" y1="0" x2="960" y2="630" stroke="white" stroke-width="1" />
    <line x1="1080" y1="0" x2="1080" y2="630" stroke="white" stroke-width="1" />
    <line x1="1200" y1="0" x2="1200" y2="630" stroke="white" stroke-width="1" />
  </g>

  <!-- Accent bar at top -->
  <rect x="0" y="0" width="1200" height="4" fill="url(#accent)" />

  <!-- Name -->
  <text x="600" y="260" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif" font-size="64" font-weight="700" fill="#f1f5f9" text-anchor="middle" letter-spacing="-1">Jackson Chen</text>

  <!-- Divider -->
  <rect x="560" y="290" width="80" height="2" fill="#6366f1" rx="1" />

  <!-- Subtitle -->
  <text x="600" y="340" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif" font-size="24" fill="#94a3b8" text-anchor="middle" letter-spacing="2">Full Stack Developer</text>

  <!-- Site URL -->
  <text x="600" y="590" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif" font-size="16" fill="#475569" text-anchor="middle" letter-spacing="0.5">sma1lboy.me</text>

  <!-- Corner accents -->
  <circle cx="40" cy="40" r="4" fill="#6366f1" opacity="0.4" />
  <circle cx="1160" cy="40" r="4" fill="#8b5cf6" opacity="0.4" />
  <circle cx="40" cy="590" r="4" fill="#8b5cf6" opacity="0.4" />
  <circle cx="1160" cy="590" r="4" fill="#6366f1" opacity="0.4" />
</svg>`;
}

// Generate default homepage OG
fs.writeFileSync(path.join(OG_DIR, "default.svg"), generateDefaultSVG());
console.log("  ✓ public/og/default.svg");

// Generate per-post OG images
for (const post of blogPosts) {
  const svg = generatePostSVG(post);
  fs.writeFileSync(path.join(OG_DIR, `${post.slug}.svg`), svg);
  console.log(`  ✓ public/og/${post.slug}.svg`);
}

console.log(`\nGenerated ${blogPosts.length + 1} OG images.`);
