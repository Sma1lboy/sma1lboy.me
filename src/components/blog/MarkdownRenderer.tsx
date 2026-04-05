import { useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Highlight, themes } from "prism-react-renderer";
import { Copy } from "lucide-react";
import { useToastStore } from "@/store/toastStore";

function CopyButton({ code }: { code: string }) {
  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(code);
    useToastStore.getState().addToast("Copied to clipboard!");
  }, [code]);

  return (
    <button
      onClick={handleCopy}
      className="absolute top-3 right-3 flex items-center gap-1.5 rounded-md bg-white/10 px-2 py-1 text-xs text-gray-400 backdrop-blur-sm transition-colors hover:bg-white/20 hover:text-gray-200"
    >
      <Copy size={12} />
      Copy
    </button>
  );
}

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => (
          <h1 className="mt-8 mb-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="mt-7 mb-3 text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="mt-6 mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
            {children}
          </h3>
        ),
        h4: ({ children }) => (
          <h4 className="mt-5 mb-2 text-base font-semibold text-gray-900 dark:text-gray-100">
            {children}
          </h4>
        ),
        h5: ({ children }) => (
          <h5 className="mt-4 mb-1 text-sm font-semibold text-gray-900 dark:text-gray-100">
            {children}
          </h5>
        ),
        h6: ({ children }) => (
          <h6 className="mt-4 mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
            {children}
          </h6>
        ),
        p: ({ children }) => (
          <p className="mb-5 text-[15px] leading-[1.8] text-gray-700 dark:text-gray-300">
            {children}
          </p>
        ),
        strong: ({ children }) => (
          <strong className="font-semibold text-gray-900 dark:text-gray-100">{children}</strong>
        ),
        em: ({ children }) => <em className="italic">{children}</em>,
        a: ({ href, children }) => (
          <a
            href={href}
            target={href?.startsWith("http") ? "_blank" : undefined}
            rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
            className="text-gray-900 underline decoration-gray-300 underline-offset-2 transition-colors hover:decoration-gray-500 dark:text-gray-100 dark:decoration-gray-600 dark:hover:decoration-gray-400"
          >
            {children}
          </a>
        ),
        blockquote: ({ children }) => (
          <blockquote className="my-5 border-l-2 border-gray-200 pl-4 italic text-gray-500 dark:border-gray-700 dark:text-gray-400">
            {children}
          </blockquote>
        ),
        ul: ({ children }) => (
          <ul className="my-4 ml-5 list-disc space-y-1.5 text-[15px] leading-[1.8] text-gray-700 dark:text-gray-300">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="my-4 ml-5 list-decimal space-y-1.5 text-[15px] leading-[1.8] text-gray-700 dark:text-gray-300">
            {children}
          </ol>
        ),
        li: ({ children }) => <li className="pl-1">{children}</li>,
        hr: () => <hr className="my-8 border-gray-100 dark:border-gray-800/50" />,
        img: ({ src, alt }) => (
          <figure className="my-6">
            <img
              src={src}
              alt={alt ?? ""}
              className="w-full rounded-lg"
              loading="lazy"
            />
            {alt && (
              <figcaption className="mt-2 text-center text-xs text-gray-400 dark:text-gray-500">
                {alt}
              </figcaption>
            )}
          </figure>
        ),
        table: ({ children }) => (
          <div className="my-5 overflow-x-auto">
            <table className="w-full text-sm text-gray-700 dark:text-gray-300">{children}</table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="border-b border-gray-200 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:border-gray-700 dark:text-gray-400">
            {children}
          </thead>
        ),
        th: ({ children }) => <th className="px-3 py-2">{children}</th>,
        td: ({ children }) => (
          <td className="border-b border-gray-100 px-3 py-2 dark:border-gray-800">{children}</td>
        ),
        del: ({ children }) => <del className="text-gray-400 dark:text-gray-500">{children}</del>,
        code: ({ className, children }) => {
          const match = /language-(\w+)/.exec(className || "");
          const codeString = String(children).replace(/\n$/, "");

          if (!match) {
            return (
              <code className="rounded bg-gray-100 px-1.5 py-0.5 text-[13px] font-mono text-gray-800 dark:bg-gray-800/60 dark:text-gray-200">
                {children}
              </code>
            );
          }

          return (
            <div className="relative my-5 overflow-hidden rounded-lg">
              <CopyButton code={codeString} />
              <Highlight theme={themes.nightOwl} code={codeString} language={match[1]}>
                {({ className: hlClass, style, tokens, getLineProps, getTokenProps }) => (
                  <pre
                    className={`${hlClass} overflow-x-auto px-5 py-4 text-[13px] leading-relaxed`}
                    style={{ ...style, margin: 0, background: "#011627" }}
                  >
                    {tokens.map((line, i) => {
                      const lineProps = getLineProps({ line });
                      return (
                        <div key={i} {...lineProps}>
                          {line.map((token, key) => {
                            const tokenProps = getTokenProps({ token });
                            return <span key={key} {...tokenProps} />;
                          })}
                        </div>
                      );
                    })}
                  </pre>
                )}
              </Highlight>
            </div>
          );
        },
        pre: ({ children }) => <>{children}</>,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
