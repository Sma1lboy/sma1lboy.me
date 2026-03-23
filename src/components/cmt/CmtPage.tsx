import { Link } from "@tanstack/react-router";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { thoughts } from "../../constants/thoughts";
import ThoughtCard from "./ThoughtCard";

export default function CmtPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a]">
      <div className="mx-auto max-w-2xl px-6 py-10 sm:py-14">
        {/* Header */}
        <div className="mb-10">
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <ArrowLeft size={14} />
            Back
          </Link>
          <div className="flex items-center gap-3">
            <MessageCircle size={28} className="text-gray-700 dark:text-gray-300" />
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                cmt
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Thoughts, notes, and quick ideas.
              </p>
            </div>
          </div>
        </div>

        {/* Thoughts feed */}
        <div className="flex flex-col items-center">
          {thoughts.map((thought, i) => (
            <ThoughtCard key={thought.id} thought={thought} index={i} />
          ))}

          {/* End marker */}
          <div className="mt-2 flex flex-col items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-gray-300 dark:bg-[#333]" />
            <span className="text-xs text-gray-400 dark:text-gray-500">
              That&apos;s all for now.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
