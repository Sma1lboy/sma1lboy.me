import { createFileRoute, Link } from "@tanstack/react-router";
import TypewriterPreview from "../../components/apps/typewriter/TypewriterPreview";
import ReceiptPreview from "../../components/apps/receipt/ReceiptPreview";

export const Route = createFileRoute("/apps/")({
  component: AppsIndex,
});

function AppsIndex() {
  return (
    <div className="container mx-auto min-h-screen p-8">
      <h1 className="mb-8 text-4xl font-bold">Playground</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link
          to="/apps/typewriter"
          className="group relative block overflow-hidden rounded-xl border bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
        >
          {/* Preview Area */}
          <div className="relative flex h-48 items-center justify-center overflow-hidden border-b bg-[#1a1a1a]">
            <TypewriterPreview />
          </div>

          <div className="p-6">
            <h2 className="mb-2 text-2xl font-semibold">Motorola Fix Beeper</h2>
            <p className="text-gray-600">
              A retro typewriter experience. Compose, polish, and print.
            </p>
          </div>
        </Link>

        <Link
          to="/apps/receipt"
          className="group relative block overflow-hidden rounded-xl border bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
        >
          {/* Preview Area */}
          <div className="relative flex h-48 items-center justify-center overflow-hidden border-b bg-[#1a1a1a]">
            <ReceiptPreview />
          </div>

          <div className="p-6">
            <h2 className="mb-2 text-2xl font-semibold">3D Receipt</h2>
            <p className="text-gray-600">
              Interactive receipt with Verlet physics. Grab, drag, and fold.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
