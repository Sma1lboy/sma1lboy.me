import { motion } from "framer-motion";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { blogPosts, getBlogPost } from "../../constants/blog";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function BlogPostPage() {
  const { slug } = useParams({ from: "/blog/$slug" });
  const post = getBlogPost(slug);

  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
        <div className="text-center">
          <p className="mb-4 text-gray-500 dark:text-gray-400">Post not found.</p>
          <Link
            to="/blog"
            className="text-sm text-gray-400 transition-colors hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300"
          >
            Back to Writing
          </Link>
        </div>
      </div>
    );
  }

  const currentIndex = blogPosts.findIndex((p) => p.slug === slug);
  const prevPost = currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null;

  // Split content into paragraphs
  const paragraphs = post.content.split("\n\n").filter(Boolean);

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-black dark:text-gray-100">
      <div className="mx-auto max-w-2xl px-6 py-12 sm:py-20">
        {/* Back */}
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            to="/blog"
            className="mb-10 inline-flex items-center gap-1.5 text-sm text-gray-400 transition-colors hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300"
          >
            <ArrowLeft size={14} />
            Writing
          </Link>
        </motion.div>

        {/* Article header */}
        <motion.header
          className="mb-10"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Meta */}
          <div className="mb-4 flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
            <time>{formatDate(post.date)}</time>
            <span className="text-gray-300 dark:text-gray-700">/</span>
            <span>{post.readingTime}</span>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold leading-tight tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
            {post.title}
          </h1>

          {/* Tags */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500 dark:bg-gray-800/60 dark:text-gray-400"
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.header>

        {/* Article body */}
        <motion.div
          className="space-y-5"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.15,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {paragraphs.map((paragraph, i) => (
            <p
              key={i}
              className="text-[15px] leading-[1.8] text-gray-700 dark:text-gray-300"
            >
              {paragraph}
            </p>
          ))}
        </motion.div>

        {/* Prev / Next navigation */}
        <motion.nav
          className="mt-16 border-t border-gray-100 pt-8 dark:border-gray-800/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <div className="flex justify-between gap-4">
            {prevPost ? (
              <Link
                to="/blog/$slug"
                params={{ slug: prevPost.slug }}
                className="group flex min-w-0 flex-1 flex-col items-start gap-1"
              >
                <span className="flex items-center gap-1 text-xs text-gray-400 transition-colors group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300">
                  <ArrowLeft size={12} />
                  Previous
                </span>
                <span className="truncate text-sm font-medium text-gray-700 transition-colors group-hover:text-gray-900 dark:text-gray-300 dark:group-hover:text-gray-100">
                  {prevPost.title}
                </span>
              </Link>
            ) : (
              <div />
            )}

            {nextPost ? (
              <Link
                to="/blog/$slug"
                params={{ slug: nextPost.slug }}
                className="group flex min-w-0 flex-1 flex-col items-end gap-1"
              >
                <span className="flex items-center gap-1 text-xs text-gray-400 transition-colors group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300">
                  Next
                  <ArrowRight size={12} />
                </span>
                <span className="truncate text-sm font-medium text-gray-700 transition-colors group-hover:text-gray-900 dark:text-gray-300 dark:group-hover:text-gray-100">
                  {nextPost.title}
                </span>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </motion.nav>
      </div>
    </div>
  );
}
