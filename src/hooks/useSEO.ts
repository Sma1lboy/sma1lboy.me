import { useEffect } from "react";

const BASE_URL = "https://sma1lboy.me";
const DEFAULT_TITLE = "Jackson Chen - Full Stack Developer";
const DEFAULT_DESCRIPTION =
  "Full Stack Developer & CS graduate. Building AI tooling, open-source projects, and interactive web experiences.";
const DEFAULT_OG_IMAGE = `${BASE_URL}/og/default.svg`;

interface UseSEOParams {
  title?: string;
  description?: string;
  path?: string;
  ogImage?: string;
}

function setMetaTag(
  attr: "name" | "property",
  key: string,
  content: string,
): void {
  let el = document.querySelector<HTMLMetaElement>(
    `meta[${attr}="${key}"]`,
  );
  if (el) {
    el.setAttribute("content", content);
  } else {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    el.setAttribute("content", content);
    document.head.appendChild(el);
  }
}

function setCanonical(href: string): void {
  let el = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (el) {
    el.setAttribute("href", href);
  } else {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    el.setAttribute("href", href);
    document.head.appendChild(el);
  }
}

export function useSEO({ title, description, path, ogImage }: UseSEOParams) {
  useEffect(() => {
    const fullTitle = title
      ? title === DEFAULT_TITLE
        ? DEFAULT_TITLE
        : `${title} | Jackson Chen`
      : DEFAULT_TITLE;
    const desc = description || DEFAULT_DESCRIPTION;
    const url = path ? `${BASE_URL}${path}` : `${BASE_URL}/`;
    const image = ogImage || DEFAULT_OG_IMAGE;

    // Store previous values for cleanup
    const prevTitle = document.title;
    const prevDesc =
      document.querySelector<HTMLMetaElement>('meta[name="description"]')
        ?.content || "";
    const prevOgTitle =
      document.querySelector<HTMLMetaElement>('meta[property="og:title"]')
        ?.content || "";
    const prevOgDesc =
      document.querySelector<HTMLMetaElement>(
        'meta[property="og:description"]',
      )?.content || "";
    const prevOgUrl =
      document.querySelector<HTMLMetaElement>('meta[property="og:url"]')
        ?.content || "";
    const prevOgImage =
      document.querySelector<HTMLMetaElement>('meta[property="og:image"]')
        ?.content || "";
    const prevTwitterTitle =
      document.querySelector<HTMLMetaElement>('meta[name="twitter:title"]')
        ?.content || "";
    const prevTwitterDesc =
      document.querySelector<HTMLMetaElement>(
        'meta[name="twitter:description"]',
      )?.content || "";
    const prevCanonical =
      document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href ||
      "";

    // Set new values
    document.title = fullTitle;
    setMetaTag("name", "description", desc);
    setMetaTag("property", "og:title", fullTitle);
    setMetaTag("property", "og:description", desc);
    setMetaTag("property", "og:url", url);
    setMetaTag("property", "og:image", image);
    setMetaTag("name", "twitter:title", fullTitle);
    setMetaTag("name", "twitter:description", desc);
    setCanonical(url);

    return () => {
      document.title = prevTitle;
      setMetaTag("name", "description", prevDesc);
      setMetaTag("property", "og:title", prevOgTitle);
      setMetaTag("property", "og:description", prevOgDesc);
      setMetaTag("property", "og:url", prevOgUrl);
      setMetaTag("property", "og:image", prevOgImage);
      setMetaTag("name", "twitter:title", prevTwitterTitle);
      setMetaTag("name", "twitter:description", prevTwitterDesc);
      setCanonical(prevCanonical);
    };
  }, [title, description, path, ogImage]);
}
