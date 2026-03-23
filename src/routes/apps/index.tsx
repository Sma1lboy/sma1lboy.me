import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, FlaskConical } from "lucide-react";
import TypewriterPreview from "../../components/apps/typewriter/TypewriterPreview";
import ReceiptPreview from "../../components/apps/receipt/ReceiptPreview";

export const Route = createFileRoute("/apps/")({
  component: AppsIndex,
});

const experiments = [
  {
    to: "/apps/typewriter" as const,
    title: "Motorola Fix Beeper",
    description:
      "A retro typewriter experience. Compose, polish, and print on vintage paper cards.",
    preview: <TypewriterPreview />,
  },
  {
    to: "/apps/receipt" as const,
    title: "3D Receipt",
    description:
      "Interactive receipt with Verlet cloth physics. Grab, drag, and fold thermal paper.",
    preview: <ReceiptPreview />,
  },
];

function AppsIndex() {
  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a]">
      <div className="container mx-auto px-6 py-10 sm:px-8 sm:py-14">
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
            <FlaskConical size={28} className="text-gray-700 dark:text-gray-300" />
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                sma1lboy&apos;s Lab
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Experiments, toys, and interactive demos.
              </p>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {experiments.map((exp) => (
            <Link
              key={exp.to}
              to={exp.to}
              className="group relative block overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-[#222] dark:bg-[#141414] dark:hover:border-[#333]"
            >
              <div className="relative flex h-48 items-center justify-center overflow-hidden border-b border-gray-100 bg-[#111] dark:border-[#222]">
                {exp.preview}
              </div>
              <div className="p-5">
                <h2 className="mb-1.5 text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {exp.title}
                </h2>
                <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                  {exp.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
