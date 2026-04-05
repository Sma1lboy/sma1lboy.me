export type SnippetCategory = "typescript" | "react" | "python" | "shell" | "ai-ml";

export type SnippetLanguage = "typescript" | "tsx" | "python" | "bash" | "json";

export interface Snippet {
  id: string;
  title: string;
  description: string;
  language: SnippetLanguage;
  category: SnippetCategory;
  code: string;
  tags: string[];
}

export const categoryLabels: Record<SnippetCategory, string> = {
  typescript: "TypeScript",
  react: "React",
  python: "Python",
  shell: "Shell",
  "ai-ml": "AI/ML",
};

export const categoryColors: Record<SnippetCategory, string> = {
  typescript: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  react: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
  python: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  shell: "bg-green-500/10 text-green-600 dark:text-green-400",
  "ai-ml": "bg-violet-500/10 text-violet-600 dark:text-violet-400",
};

export const languageLabels: Record<SnippetLanguage, string> = {
  typescript: "TypeScript",
  tsx: "TSX",
  python: "Python",
  bash: "Bash",
  json: "JSON",
};

export const snippets: Snippet[] = [
  // TypeScript
  {
    id: "ts-exhaustive-switch",
    title: "Exhaustive Switch Pattern",
    description:
      "Ensure all cases in a union type are handled at compile time using the never type.",
    language: "typescript",
    category: "typescript",
    code: `type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; side: number }
  | { kind: "triangle"; base: number; height: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.side ** 2;
    case "triangle":
      return (shape.base * shape.height) / 2;
    default: {
      const _exhaustive: never = shape;
      return _exhaustive;
    }
  }
}`,
    tags: ["pattern-matching", "union-types", "type-safety"],
  },
  {
    id: "ts-branded-types",
    title: "Branded Types for Type-Safe IDs",
    description:
      "Prevent accidentally mixing up string IDs from different entities using branded types.",
    language: "typescript",
    category: "typescript",
    code: `type Brand<T, B extends string> = T & { __brand: B };

type UserId = Brand<string, "UserId">;
type PostId = Brand<string, "PostId">;

function createUserId(id: string): UserId {
  return id as UserId;
}

function createPostId(id: string): PostId {
  return id as PostId;
}

function getUser(id: UserId) { /* ... */ }
function getPost(id: PostId) { /* ... */ }

const userId = createUserId("user_123");
const postId = createPostId("post_456");

getUser(userId); // OK
// getUser(postId); // Compile error!`,
    tags: ["type-safety", "branding", "nominal-types"],
  },
  {
    id: "ts-result-type",
    title: "Result Type (Railway-Oriented)",
    description:
      "A Result type for explicit error handling without exceptions, inspired by Rust.",
    language: "typescript",
    category: "typescript",
    code: `type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

function ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

function err<E>(error: E): Result<never, E> {
  return { ok: false, error };
}

function parseJSON<T>(raw: string): Result<T, string> {
  try {
    return ok(JSON.parse(raw));
  } catch {
    return err("Invalid JSON");
  }
}

// Usage
const result = parseJSON<{ name: string }>('{"name":"Jackson"}');
if (result.ok) {
  console.log(result.value.name); // fully typed
} else {
  console.error(result.error);
}`,
    tags: ["error-handling", "result-type", "functional"],
  },
  {
    id: "ts-typesafe-event-emitter",
    title: "Type-Safe Event Emitter",
    description:
      "A strongly-typed event emitter where event names and payload types are enforced.",
    language: "typescript",
    category: "typescript",
    code: `type EventMap = {
  "user:login": { userId: string; timestamp: number };
  "user:logout": { userId: string };
  "error": { message: string; code: number };
};

class TypedEmitter<T extends Record<string, unknown>> {
  private listeners = new Map<keyof T, Set<(data: never) => void>>();

  on<K extends keyof T>(event: K, fn: (data: T[K]) => void) {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event)!.add(fn as (data: never) => void);
    return () => this.listeners.get(event)?.delete(fn as (data: never) => void);
  }

  emit<K extends keyof T>(event: K, data: T[K]) {
    this.listeners.get(event)?.forEach((fn) => fn(data as never));
  }
}

const bus = new TypedEmitter<EventMap>();
bus.on("user:login", ({ userId, timestamp }) => {
  console.log(\`\${userId} logged in at \${timestamp}\`);
});`,
    tags: ["events", "generics", "pubsub"],
  },

  // React
  {
    id: "react-use-debounce",
    title: "useDebounce Hook",
    description:
      "A reusable debounce hook for search inputs and other delayed-response patterns.",
    language: "tsx",
    category: "react",
    code: `import { useEffect, useState } from "react";

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

// Usage
function SearchInput() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery) {
      // fetch results...
    }
  }, [debouncedQuery]);

  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
}`,
    tags: ["hooks", "debounce", "performance"],
  },
  {
    id: "react-optimistic-update",
    title: "Optimistic UI Update Pattern",
    description:
      "Update the UI immediately while the server request is in-flight, with rollback on failure.",
    language: "tsx",
    category: "react",
    code: `import { useState, useCallback } from "react";

interface Todo {
  id: string;
  text: string;
  done: boolean;
}

function useTodos(initial: Todo[]) {
  const [todos, setTodos] = useState(initial);

  const toggleTodo = useCallback(async (id: string) => {
    // Snapshot for rollback
    setTodos((prev) => {
      const snapshot = prev;
      const optimistic = prev.map((t) =>
        t.id === id ? { ...t, done: !t.done } : t
      );

      // Fire async update, rollback on error
      fetch(\`/api/todos/\${id}/toggle\`, { method: "PATCH" }).catch(() => {
        setTodos(snapshot);
      });

      return optimistic;
    });
  }, []);

  return { todos, toggleTodo };
}`,
    tags: ["optimistic-ui", "state", "ux-pattern"],
  },
  {
    id: "react-compound-component",
    title: "Compound Component Pattern",
    description:
      "Build flexible, composable components using React context and dot notation.",
    language: "tsx",
    category: "react",
    code: `import { createContext, useContext, useState, type ReactNode } from "react";

interface AccordionCtx {
  openId: string | null;
  toggle: (id: string) => void;
}

const Ctx = createContext<AccordionCtx | null>(null);
const useAccordion = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("Must be inside <Accordion>");
  return ctx;
};

function Accordion({ children }: { children: ReactNode }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id));
  return <Ctx value={{ openId, toggle }}>{children}</Ctx>;
}

function Item({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  const { openId, toggle } = useAccordion();
  return (
    <div>
      <button onClick={() => toggle(id)}>{title}</button>
      {openId === id && <div>{children}</div>}
    </div>
  );
}

Accordion.Item = Item;
export { Accordion };`,
    tags: ["compound-components", "context", "composition"],
  },

  // Python
  {
    id: "py-decorator-retry",
    title: "Retry Decorator with Exponential Backoff",
    description:
      "A decorator that retries a function on exception with configurable backoff and max attempts.",
    language: "python",
    category: "python",
    code: `import time
import functools
from typing import TypeVar, Callable, Type

F = TypeVar("F", bound=Callable)

def retry(
    max_attempts: int = 3,
    backoff: float = 1.0,
    exceptions: tuple[Type[Exception], ...] = (Exception,),
) -> Callable[[F], F]:
    def decorator(fn: F) -> F:
        @functools.wraps(fn)
        def wrapper(*args, **kwargs):
            for attempt in range(1, max_attempts + 1):
                try:
                    return fn(*args, **kwargs)
                except exceptions as e:
                    if attempt == max_attempts:
                        raise
                    wait = backoff * (2 ** (attempt - 1))
                    print(f"Attempt {attempt} failed: {e}. Retrying in {wait}s...")
                    time.sleep(wait)
        return wrapper  # type: ignore
    return decorator

@retry(max_attempts=3, backoff=0.5, exceptions=(ConnectionError,))
def fetch_data(url: str) -> dict:
    # ... your fetch logic
    pass`,
    tags: ["decorator", "retry", "backoff", "error-handling"],
  },
  {
    id: "py-dataclass-validation",
    title: "Dataclass with __post_init__ Validation",
    description:
      "Use Python dataclasses with runtime validation in __post_init__ for clean data models.",
    language: "python",
    category: "python",
    code: `from dataclasses import dataclass, field
from datetime import datetime

@dataclass
class Config:
    name: str
    max_retries: int = 3
    timeout: float = 30.0
    tags: list[str] = field(default_factory=list)
    created_at: datetime = field(default_factory=datetime.now)

    def __post_init__(self):
        if not self.name.strip():
            raise ValueError("name cannot be empty")
        if self.max_retries < 0:
            raise ValueError("max_retries must be non-negative")
        if self.timeout <= 0:
            raise ValueError("timeout must be positive")
        self.name = self.name.strip()

# Usage
config = Config(name="my-service", tags=["prod", "api"])
# Config(name="", max_retries=3) -> ValueError: name cannot be empty`,
    tags: ["dataclass", "validation", "data-model"],
  },
  {
    id: "py-context-manager",
    title: "Custom Context Manager for Timing",
    description:
      "A context manager that measures execution time of a code block with optional logging.",
    language: "python",
    category: "python",
    code: `import time
from contextlib import contextmanager
from typing import Generator

@contextmanager
def timer(label: str = "Block") -> Generator[None, None, None]:
    start = time.perf_counter()
    try:
        yield
    finally:
        elapsed = time.perf_counter() - start
        print(f"{label}: {elapsed:.3f}s")

# Usage
with timer("Data processing"):
    data = [x ** 2 for x in range(1_000_000)]

# Nested timers
with timer("Full pipeline"):
    with timer("  Step 1: load"):
        items = list(range(500_000))
    with timer("  Step 2: transform"):
        result = [x * 2 for x in items]`,
    tags: ["context-manager", "performance", "timing"],
  },

  // Shell
  {
    id: "sh-git-cleanup",
    title: "Git Branch Cleanup",
    description:
      "Delete local branches that have been merged into main, keeping main and current branch.",
    language: "bash",
    category: "shell",
    code: `#!/usr/bin/env bash
# Delete merged local branches (keeps main and current)

current=$(git branch --show-current)

git branch --merged main \\
  | grep -v "^\\*" \\
  | grep -v "main" \\
  | while read -r branch; do
      echo "Deleting: $branch"
      git branch -d "$branch"
    done

echo "Done. Current branch: $current"`,
    tags: ["git", "cleanup", "branches"],
  },
  {
    id: "sh-port-finder",
    title: "Find & Kill Process on Port",
    description:
      "Quickly find what process is using a port and optionally kill it.",
    language: "bash",
    category: "shell",
    code: `#!/usr/bin/env bash
# Usage: ./port.sh <port> [--kill]

PORT=\${1:?Usage: port.sh <port> [--kill]}
KILL=\${2:-}

PID=$(lsof -ti :"$PORT" 2>/dev/null)

if [ -z "$PID" ]; then
  echo "No process on port $PORT"
  exit 0
fi

echo "Port $PORT used by PID $PID:"
ps -p "$PID" -o pid,user,command | tail -1

if [ "$KILL" = "--kill" ]; then
  kill -9 "$PID" && echo "Killed PID $PID"
fi`,
    tags: ["ports", "processes", "debugging"],
  },
  {
    id: "sh-docker-prune",
    title: "Docker Full Cleanup Script",
    description:
      "Reclaim disk space by pruning unused Docker images, containers, volumes, and networks.",
    language: "bash",
    category: "shell",
    code: `#!/usr/bin/env bash
set -euo pipefail

echo "=== Docker Cleanup ==="
echo ""

echo "Stopped containers:"
docker container prune -f

echo ""
echo "Dangling images:"
docker image prune -f

echo ""
echo "Unused volumes:"
docker volume prune -f

echo ""
echo "Unused networks:"
docker network prune -f

echo ""
echo "Space reclaimed. Current usage:"
docker system df`,
    tags: ["docker", "cleanup", "devops"],
  },

  // AI/ML
  {
    id: "ai-structured-output",
    title: "Structured JSON Output from LLMs",
    description:
      "Force reliable JSON output from Claude/GPT using TypeScript + Zod validation.",
    language: "typescript",
    category: "ai-ml",
    code: `import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";

const SentimentSchema = z.object({
  sentiment: z.enum(["positive", "negative", "neutral"]),
  confidence: z.number().min(0).max(1),
  keywords: z.array(z.string()),
});

type Sentiment = z.infer<typeof SentimentSchema>;

async function analyzeSentiment(text: string): Promise<Sentiment> {
  const client = new Anthropic();

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 256,
    messages: [
      {
        role: "user",
        content: \`Analyze the sentiment. Respond with ONLY valid JSON:
{"sentiment": "positive"|"negative"|"neutral", "confidence": 0-1, "keywords": [...]}

Text: "\${text}"\`,
      },
    ],
  });

  const content = response.content[0];
  if (content.type !== "text") throw new Error("Unexpected response");
  return SentimentSchema.parse(JSON.parse(content.text));
}`,
    tags: ["llm", "structured-output", "zod", "claude"],
  },
  {
    id: "ai-embedding-search",
    title: "Simple Embedding-Based Search",
    description:
      "Build a lightweight semantic search over documents using embeddings and cosine similarity.",
    language: "python",
    category: "ai-ml",
    code: `import numpy as np
from openai import OpenAI

client = OpenAI()

def get_embedding(text: str) -> list[float]:
    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=text,
    )
    return response.data[0].embedding

def cosine_similarity(a: list[float], b: list[float]) -> float:
    a_np, b_np = np.array(a), np.array(b)
    return float(np.dot(a_np, b_np) / (np.linalg.norm(a_np) * np.linalg.norm(b_np)))

# Index documents
docs = [
    "Python is great for data science",
    "React hooks simplify state management",
    "Docker containers improve deployment",
]
doc_embeddings = [get_embedding(doc) for doc in docs]

# Search
query = "machine learning tools"
query_emb = get_embedding(query)

results = sorted(
    zip(docs, [cosine_similarity(query_emb, de) for de in doc_embeddings]),
    key=lambda x: x[1],
    reverse=True,
)

for doc, score in results:
    print(f"{score:.3f} | {doc}")`,
    tags: ["embeddings", "search", "cosine-similarity", "openai"],
  },
  {
    id: "ai-tool-use",
    title: "Claude Tool Use / Function Calling",
    description:
      "Define and use tools with Claude's API for structured agent interactions.",
    language: "typescript",
    category: "ai-ml",
    code: `import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const tools: Anthropic.Tool[] = [
  {
    name: "get_weather",
    description: "Get current weather for a location",
    input_schema: {
      type: "object" as const,
      properties: {
        location: { type: "string", description: "City name" },
        unit: { type: "string", enum: ["celsius", "fahrenheit"] },
      },
      required: ["location"],
    },
  },
];

async function chat(userMessage: string) {
  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    tools,
    messages: [{ role: "user", content: userMessage }],
  });

  for (const block of response.content) {
    if (block.type === "tool_use") {
      console.log(\`Tool: \${block.name}\`, block.input);
      // Execute tool, then send result back in next turn
    } else if (block.type === "text") {
      console.log(block.text);
    }
  }
}

chat("What's the weather in Tokyo?");`,
    tags: ["claude", "tool-use", "function-calling", "agent"],
  },
];
