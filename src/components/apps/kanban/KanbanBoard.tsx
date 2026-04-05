import { useState, useCallback, useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Plus, X, GripVertical } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSEO } from "@/hooks/useSEO";

// --- Types ---

interface Card {
  id: string;
  text: string;
  color: string;
}

interface Column {
  id: string;
  title: string;
  cards: Card[];
}

type BoardState = Column[];

// --- Helpers ---

const STORAGE_KEY = "kanban-board-state";

const PASTEL_COLORS = [
  "#fef3c7", // amber-100
  "#fce7f3", // pink-100
  "#dbeafe", // blue-100
  "#d1fae5", // emerald-100
  "#ede9fe", // violet-100
  "#fef9c3", // yellow-100
  "#ffe4e6", // rose-100
  "#e0f2fe", // sky-100
  "#f3e8ff", // purple-100
  "#ccfbf1", // teal-100
  "#fce4ec", // soft rose
  "#e8f5e9", // soft green
  "#fff3e0", // soft orange
  "#e3f2fd", // soft blue
  "#f3e5f5", // soft purple
];

function randomPastel(): string {
  return PASTEL_COLORS[Math.floor(Math.random() * PASTEL_COLORS.length)];
}

function genId(): string {
  return Math.random().toString(36).slice(2, 10);
}

const DEFAULT_BOARD: BoardState = [
  {
    id: "todo",
    title: "To Do",
    cards: [
      { id: genId(), text: "Fix that one CSS bug", color: randomPastel() },
      {
        id: genId(),
        text: "Write tests (for real this time)",
        color: randomPastel(),
      },
      { id: genId(), text: "Update README", color: randomPastel() },
    ],
  },
  {
    id: "in-progress",
    title: "In Progress",
    cards: [
      {
        id: genId(),
        text: "Refactoring the refactor",
        color: randomPastel(),
      },
      { id: genId(), text: "Debugging the debugger", color: randomPastel() },
    ],
  },
  {
    id: "done",
    title: "Done",
    cards: [
      { id: genId(), text: "Set up the project", color: randomPastel() },
      {
        id: genId(),
        text: "Added a Kanban board to track tasks",
        color: randomPastel(),
      },
    ],
  },
];

function loadBoard(): BoardState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as BoardState;
      if (
        Array.isArray(parsed) &&
        parsed.length === 3 &&
        parsed.every((c) => Array.isArray(c.cards))
      ) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  return DEFAULT_BOARD;
}

function saveBoard(board: BoardState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(board));
}

// --- Dragging state ---

interface DragInfo {
  cardId: string;
  fromColId: string;
}

// --- Components ---

function CardItem({
  card,
  onDelete,
  onEdit,
  onDragStart,
  onDragEnd,
}: {
  card: Card;
  onDelete: () => void;
  onEdit: (text: string) => void;
  onDragStart: () => void;
  onDragEnd: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(card.text);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const commitEdit = useCallback(() => {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== card.text) {
      onEdit(trimmed);
    } else {
      setDraft(card.text);
    }
    setEditing(false);
  }, [draft, card.text, onEdit]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  return (
    <motion.div
      layout
      layoutId={card.id}
      drag
      dragSnapToOrigin
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      whileDrag={{ scale: 1.05, zIndex: 50, boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
      className="group relative cursor-grab rounded-lg p-3 shadow-md active:cursor-grabbing"
      style={{ backgroundColor: card.color }}
    >
      <div className="flex items-start gap-1.5">
        <GripVertical
          size={14}
          className="mt-0.5 shrink-0 text-gray-400/60"
        />
        <div className="min-w-0 flex-1">
          {editing ? (
            <textarea
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commitEdit}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  commitEdit();
                }
                if (e.key === "Escape") {
                  setDraft(card.text);
                  setEditing(false);
                }
              }}
              rows={2}
              className="w-full resize-none rounded bg-white/60 px-1.5 py-1 text-sm text-gray-800 outline-none focus:ring-1 focus:ring-gray-400/40"
            />
          ) : (
            <p
              onDoubleClick={() => setEditing(true)}
              className="cursor-text text-sm leading-snug text-gray-800 select-none"
            >
              {card.text}
            </p>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="shrink-0 rounded p-0.5 text-gray-400/50 opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100"
        >
          <X size={14} />
        </button>
      </div>
    </motion.div>
  );
}

function ColumnComponent({
  column,
  onAddCard,
  onDeleteCard,
  onEditCard,
  onCardDragStart,
  onCardDragEnd,
  dragOverThis,
  onPointerEnter,
}: {
  column: Column;
  onAddCard: (colId: string, text: string) => void;
  onDeleteCard: (colId: string, cardId: string) => void;
  onEditCard: (colId: string, cardId: string, text: string) => void;
  onCardDragStart: (cardId: string, colId: string) => void;
  onCardDragEnd: (cardId: string) => void;
  dragOverThis: boolean;
  onPointerEnter: () => void;
}) {
  const [adding, setAdding] = useState(false);
  const [newText, setNewText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (adding && inputRef.current) inputRef.current.focus();
  }, [adding]);

  const handleAdd = useCallback(() => {
    const trimmed = newText.trim();
    if (trimmed) {
      onAddCard(column.id, trimmed);
      setNewText("");
    }
    setAdding(false);
  }, [newText, column.id, onAddCard]);

  const cardCount = column.cards.length;

  return (
    <div
      onPointerEnter={onPointerEnter}
      className={`flex w-full flex-col rounded-xl border transition-colors duration-200 sm:w-80 ${
        dragOverThis
          ? "border-blue-400/50 bg-blue-500/5 dark:border-blue-500/40 dark:bg-blue-500/5"
          : "border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950/50"
      }`}
    >
      {/* Column header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {column.title}
          </h2>
          <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
            {cardCount}
          </span>
        </div>
        <button
          onClick={() => setAdding(true)}
          className="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Cards */}
      <div className="flex min-h-[120px] flex-col gap-2 p-3">
        <AnimatePresence mode="popLayout">
          {column.cards.map((card) => (
            <CardItem
              key={card.id}
              card={card}
              onDelete={() => onDeleteCard(column.id, card.id)}
              onEdit={(text) => onEditCard(column.id, card.id, text)}
              onDragStart={() => onCardDragStart(card.id, column.id)}
              onDragEnd={() => onCardDragEnd(card.id)}
            />
          ))}
        </AnimatePresence>

        {/* Add card input */}
        {adding && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-2"
          >
            <input
              ref={inputRef}
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAdd();
                if (e.key === "Escape") {
                  setNewText("");
                  setAdding(false);
                }
              }}
              placeholder="What needs to be done?"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-gray-600"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAdd}
                className="rounded-lg bg-gray-800 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-gray-700 dark:bg-gray-200 dark:text-gray-900 dark:hover:bg-gray-300"
              >
                Add Card
              </button>
              <button
                onClick={() => {
                  setNewText("");
                  setAdding(false);
                }}
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// --- Main ---

export default function KanbanBoard() {
  useSEO({
    title: "Kanban Board",
    description:
      "Drag-and-drop Kanban board with sticky note cards. Organize tasks across To Do, In Progress, and Done columns.",
    path: "/apps/kanban",
  });

  const [board, setBoard] = useState<BoardState>(loadBoard);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragInfoRef = useRef<DragInfo | null>(null);
  const [dragOverColId, setDragOverColId] = useState<string | null>(null);

  // Debounced save
  const persistBoard = useCallback((next: BoardState) => {
    setBoard(next);
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => saveBoard(next), 300);
  }, []);

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  const handleAddCard = useCallback(
    (colId: string, text: string) => {
      persistBoard(
        board.map((col) =>
          col.id === colId
            ? {
                ...col,
                cards: [
                  ...col.cards,
                  { id: genId(), text, color: randomPastel() },
                ],
              }
            : col,
        ),
      );
    },
    [board, persistBoard],
  );

  const handleDeleteCard = useCallback(
    (colId: string, cardId: string) => {
      persistBoard(
        board.map((col) =>
          col.id === colId
            ? { ...col, cards: col.cards.filter((c) => c.id !== cardId) }
            : col,
        ),
      );
    },
    [board, persistBoard],
  );

  const handleEditCard = useCallback(
    (colId: string, cardId: string, text: string) => {
      persistBoard(
        board.map((col) =>
          col.id === colId
            ? {
                ...col,
                cards: col.cards.map((c) =>
                  c.id === cardId ? { ...c, text } : c,
                ),
              }
            : col,
        ),
      );
    },
    [board, persistBoard],
  );

  const handleCardDragStart = useCallback(
    (cardId: string, fromColId: string) => {
      dragInfoRef.current = { cardId, fromColId };
    },
    [],
  );

  const handleCardDragEnd = useCallback(
    (cardId: string) => {
      const info = dragInfoRef.current;
      if (!info || !dragOverColId || info.fromColId === dragOverColId) {
        dragInfoRef.current = null;
        setDragOverColId(null);
        return;
      }

      // Move card from source column to target column
      const sourceCol = board.find((c) => c.id === info.fromColId);
      const card = sourceCol?.cards.find((c) => c.id === cardId);
      if (!card) {
        dragInfoRef.current = null;
        setDragOverColId(null);
        return;
      }

      const next = board.map((col) => {
        if (col.id === info.fromColId) {
          return { ...col, cards: col.cards.filter((c) => c.id !== cardId) };
        }
        if (col.id === dragOverColId) {
          return { ...col, cards: [...col.cards, card] };
        }
        return col;
      });

      persistBoard(next);
      dragInfoRef.current = null;
      setDragOverColId(null);
    },
    [board, dragOverColId, persistBoard],
  );

  const handleResetBoard = useCallback(() => {
    persistBoard(DEFAULT_BOARD);
  }, [persistBoard]);

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto px-4 py-8 sm:px-6 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/apps"
            className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <ArrowLeft size={14} />
            Back
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-3xl">
                Kanban Board
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Drag cards between columns to organize your tasks
              </p>
            </div>
            <button
              onClick={handleResetBoard}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-700 dark:border-gray-800 dark:text-gray-400 dark:hover:border-gray-700 dark:hover:text-gray-300"
            >
              Reset Board
            </button>
          </div>
        </div>

        {/* Board */}
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-6 sm:overflow-x-auto sm:pb-4">
          {board.map((col) => (
            <ColumnComponent
              key={col.id}
              column={col}
              onAddCard={handleAddCard}
              onDeleteCard={handleDeleteCard}
              onEditCard={handleEditCard}
              onCardDragStart={handleCardDragStart}
              onCardDragEnd={handleCardDragEnd}
              dragOverThis={dragOverColId === col.id && dragInfoRef.current?.fromColId !== col.id}
              onPointerEnter={() => {
                if (dragInfoRef.current) {
                  setDragOverColId(col.id);
                }
              }}
            />
          ))}
        </div>

        {/* Hint */}
        <p className="mt-6 text-center text-xs text-gray-400 dark:text-gray-600">
          Drag cards between columns &middot; Double-click to edit &middot; Auto-saved to localStorage
        </p>
      </div>
    </div>
  );
}
