import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Bold,
  Italic,
  Heading1,
  Link as LinkIcon,
  Code,
  List,
  ListOrdered,
  Download,
  FileText,
} from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import MarkdownRenderer from "@/components/blog/MarkdownRenderer";

const STORAGE_KEY = "markdown-editor-content";

const DEFAULT_CONTENT = `# Welcome to Markdown Editor

Write your **markdown** here and see the *live preview* on the right.

## Features

- **Live preview** with syntax highlighting
- **Toolbar** for common formatting
- **Auto-save** to localStorage
- **Export** as HTML
- Word and character count

## Code Example

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

> "The best way to predict the future is to invent it." — Alan Kay

| Feature | Status |
|---------|--------|
| Preview | ✅ |
| Toolbar | ✅ |
| Export  | ✅ |
`;

interface ToolbarAction {
  icon: React.ReactNode;
  label: string;
  prefix: string;
  suffix: string;
  block?: boolean;
}

export default function MarkdownEditor() {
  useSEO({
    title: "Markdown Editor",
    description:
      "Write markdown with live preview, toolbar shortcuts, auto-save, and HTML export.",
    path: "/apps/markdown",
  });

  const [content, setContent] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || DEFAULT_CONTENT;
    } catch {
      return DEFAULT_CONTENT;
    }
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // Debounced save to localStorage
  useEffect(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, content);
      } catch {
        // localStorage full or unavailable
      }
    }, 300);
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [content]);

  // Word and character counts
  const { words, chars } = useMemo(() => {
    const trimmed = content.trim();
    return {
      words: trimmed ? trimmed.split(/\s+/).length : 0,
      chars: content.length,
    };
  }, [content]);

  // Insert markdown at cursor position
  const insertMarkdown = useCallback(
    (prefix: string, suffix: string, block?: boolean) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selected = content.substring(start, end);

      let insertion: string;
      let cursorPos: number;

      if (block) {
        // For block-level items (headings, lists), insert at line start
        const lineStart = content.lastIndexOf("\n", start - 1) + 1;
        const before = content.substring(0, lineStart);
        const lineEnd = content.indexOf("\n", end);
        const actualEnd = lineEnd === -1 ? content.length : lineEnd;
        const line = content.substring(lineStart, actualEnd);

        insertion = before + prefix + line + suffix + content.substring(actualEnd);
        cursorPos = lineStart + prefix.length + line.length + suffix.length;
      } else if (selected) {
        insertion =
          content.substring(0, start) +
          prefix +
          selected +
          suffix +
          content.substring(end);
        cursorPos = start + prefix.length + selected.length + suffix.length;
      } else {
        const placeholder = "text";
        insertion =
          content.substring(0, start) +
          prefix +
          placeholder +
          suffix +
          content.substring(end);
        cursorPos = start + prefix.length;
        // Select the placeholder
        setTimeout(() => {
          textarea.setSelectionRange(
            start + prefix.length,
            start + prefix.length + placeholder.length,
          );
          textarea.focus();
        }, 0);
        setContent(insertion);
        return;
      }

      setContent(insertion);
      setTimeout(() => {
        textarea.setSelectionRange(cursorPos, cursorPos);
        textarea.focus();
      }, 0);
    },
    [content],
  );

  const toolbarActions: ToolbarAction[] = [
    { icon: <Bold size={16} />, label: "Bold", prefix: "**", suffix: "**" },
    { icon: <Italic size={16} />, label: "Italic", prefix: "*", suffix: "*" },
    {
      icon: <Heading1 size={16} />,
      label: "Heading",
      prefix: "# ",
      suffix: "",
      block: true,
    },
    {
      icon: <LinkIcon size={16} />,
      label: "Link",
      prefix: "[",
      suffix: "](url)",
    },
    {
      icon: <Code size={16} />,
      label: "Code",
      prefix: "```\n",
      suffix: "\n```",
    },
    {
      icon: <List size={16} />,
      label: "Unordered List",
      prefix: "- ",
      suffix: "",
      block: true,
    },
    {
      icon: <ListOrdered size={16} />,
      label: "Ordered List",
      prefix: "1. ",
      suffix: "",
      block: true,
    },
  ];

  // Export as HTML
  const exportHTML = useCallback(() => {
    const previewEl = previewRef.current;
    if (!previewEl) return;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Markdown Export</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 800px; margin: 2rem auto; padding: 0 1rem; line-height: 1.8; color: #333; }
    h1, h2, h3, h4, h5, h6 { color: #111; margin-top: 1.5em; }
    code { background: #f4f4f4; padding: 0.2em 0.4em; border-radius: 3px; font-size: 0.9em; }
    pre { background: #011627; color: #d6deeb; padding: 1rem; border-radius: 8px; overflow-x: auto; }
    pre code { background: none; color: inherit; padding: 0; }
    blockquote { border-left: 3px solid #ddd; padding-left: 1rem; color: #666; margin: 1rem 0; }
    table { border-collapse: collapse; width: 100%; margin: 1rem 0; }
    th, td { border: 1px solid #ddd; padding: 0.5rem; text-align: left; }
    th { background: #f8f8f8; }
    img { max-width: 100%; border-radius: 8px; }
    a { color: #0066cc; }
  </style>
</head>
<body>
${previewEl.innerHTML}
</body>
</html>`;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "markdown-export.html";
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Header */}
        <div className="mb-6">
          <Breadcrumbs />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText
                size={28}
                className="text-gray-700 dark:text-gray-300"
              />
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                  Markdown Editor
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Write, preview, and export markdown
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={exportHTML}
              className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <Download size={14} />
              Export HTML
            </motion.button>
          </div>
        </div>

        {/* Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 flex flex-wrap gap-1 rounded-lg border border-gray-200 bg-gray-50 p-2 dark:border-gray-800 dark:bg-gray-900"
        >
          {toolbarActions.map((action) => (
            <button
              key={action.label}
              onClick={() =>
                insertMarkdown(action.prefix, action.suffix, action.block)
              }
              title={action.label}
              className="rounded-md p-2 text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
            >
              {action.icon}
            </button>
          ))}
        </motion.div>

        {/* Editor + Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col gap-4 lg:flex-row"
        >
          {/* Editor pane */}
          <div className="flex-1">
            <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
              <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 dark:border-gray-800 dark:bg-gray-900">
                <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Editor
                </span>
              </div>
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                spellCheck={false}
                className="h-[calc(100vh-360px)] min-h-[400px] w-full resize-none bg-white px-4 py-3 font-mono text-sm leading-relaxed text-gray-800 outline-none dark:bg-gray-950 dark:text-gray-200"
                placeholder="Start writing markdown..."
              />
            </div>
          </div>

          {/* Preview pane */}
          <div className="flex-1">
            <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
              <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 dark:border-gray-800 dark:bg-gray-900">
                <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Preview
                </span>
              </div>
              <div
                ref={previewRef}
                className="h-[calc(100vh-360px)] min-h-[400px] overflow-y-auto bg-white px-6 py-4 dark:bg-gray-950"
              >
                <MarkdownRenderer content={content} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Status bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-3 flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-xs text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400"
        >
          <div className="flex gap-4">
            <span>
              {words} {words === 1 ? "word" : "words"}
            </span>
            <span>
              {chars} {chars === 1 ? "character" : "characters"}
            </span>
          </div>
          <span className="text-gray-400 dark:text-gray-500">Auto-saved</span>
        </motion.div>
      </div>
    </div>
  );
}
