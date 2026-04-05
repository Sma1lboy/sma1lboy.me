import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Rss } from "lucide-react";
import { blogPosts } from "../../constants/blog";
import { useSEO } from "@/hooks/useSEO";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function BlogPage() {
  useSEO({
    title: "Blog",
    description: "Thoughts on software engineering, AI, and web development.",
    path: "/blog",
  });

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-black dark:text-gray-100">
      <div className="mx-auto max-w-2xl px-6 py-12 sm:py-20">
        <Breadcrumbs />

        {/* Header */}
        <motion.header
          className="mb-14"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
              Writing
            </h1>
            <a
              href="/rss.xml"
              target="_blank"
              rel="noopener noreferrer"
              title="RSS Feed"
              className="text-gray-400 transition-colors hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            >
              <Rss size={18} />
            </a>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            Long-form thoughts on engineering, systems, and building things.
          </p>
        </motion.header>

        {/* Article list */}
        <div className="space-y-1">
          {blogPosts.map((post, i) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.45,
                delay: 0.15 + i * 0.07,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              <Link
                to="/blog/$slug"
                params={{ slug: post.slug }}
                className="group block rounded-lg px-0 py-5 transition-colors sm:-mx-4 sm:px-4 sm:hover:bg-gray-50 sm:dark:hover:bg-[#0a0a0a]"
              >
                {/* Date + reading time */}
                <div className="mb-2 flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
                  <time>{formatDate(post.date)}</time>
                  <span className="text-gray-300 dark:text-gray-700">/</span>
                  <span>{post.readingTime}</span>
                </div>

                {/* Title */}
                <h2 className="text-base leading-snug font-medium text-gray-900 transition-colors group-hover:text-gray-600 sm:text-lg dark:text-gray-100 dark:group-hover:text-gray-300">
                  {post.title}
                </h2>

                {/* Excerpt */}
                <p className="mt-1.5 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                  {post.excerpt}
                </p>

                {/* Tags */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500 dark:bg-gray-800/60 dark:text-gray-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>

              {/* Divider */}
              {i < blogPosts.length - 1 && (
                <div className="border-b border-gray-100 dark:border-gray-800/50" />
              )}
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}
