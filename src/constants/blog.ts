import blogData from "../data/blog-posts.json";

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  tags: string[];
  readingTime: string;
}

/**
 * Blog posts sorted newest-first.
 * JSON API: GET /api/blog-posts.json
 */
export const blogPosts: BlogPost[] = (blogData as BlogPost[]).sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
);

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
