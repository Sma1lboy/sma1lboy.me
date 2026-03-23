import { createFileRoute, Link } from '@tanstack/react-router'
import TypewriterPreview from '../../components/apps/typewriter/TypewriterPreview'
import ReceiptPreview from '../../components/apps/receipt/ReceiptPreview'

export const Route = createFileRoute('/apps/')({
  component: AppsIndex,
})

function AppsIndex() {
  return (
    <div className="container mx-auto p-8 min-h-screen">
      <h1 className="text-4xl font-bold mb-8">Playground</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/apps/typewriter"
          className="block group relative overflow-hidden rounded-xl border bg-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
        >
          {/* Preview Area */}
          <div className="h-48 bg-[#1a1a1a] flex items-center justify-center overflow-hidden border-b relative">
             <TypewriterPreview />
          </div>
          
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-2">Motorola Fix Beeper</h2>
            <p className="text-gray-600">
              A retro typewriter experience. Compose, polish, and print.
            </p>
          </div>
        </Link>

        <Link
          to="/apps/receipt"
          className="block group relative overflow-hidden rounded-xl border bg-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
        >
          {/* Preview Area */}
          <div className="h-48 bg-[#1a1a1a] flex items-center justify-center overflow-hidden border-b relative">
             <ReceiptPreview />
          </div>

          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-2">3D Receipt</h2>
            <p className="text-gray-600">
              Interactive receipt with Verlet physics. Grab, drag, and fold.
            </p>
          </div>
        </Link>
      </div>
    </div>
  )
}
