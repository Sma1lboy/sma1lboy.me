import { Sidebar } from "./Sidebar";
import { ThoughtsFeed } from "./ThoughtsFeed";
import { ImageGallery } from "./ImageGallery";

export function Home3() {
  return (
    <div
      className="flex min-h-screen w-screen flex-col bg-white font-mono text-gray-600 transition-colors duration-300 md:h-screen md:min-h-0 md:flex-row dark:bg-[#0a0a0a] dark:text-[#b0b0b0]"
    >
      {/* Left sidebar */}
      <div className="w-full md:w-[250px] md:shrink-0">
        <Sidebar />
      </div>

      {/* Vertical separator — desktop only */}
      <div className="hidden w-px bg-gray-200 transition-colors duration-300 md:block dark:bg-[#1a1a1a]" />

      {/* Middle — thoughts feed */}
      <div className="md:min-h-0 md:flex-1 md:overflow-y-auto">
        <ThoughtsFeed />
      </div>

      {/* Vertical separator — desktop only */}
      <div className="hidden w-px bg-gray-200 transition-colors duration-300 md:block dark:bg-[#1a1a1a]" />

      {/* Right — image gallery */}
      <div className="w-full md:min-h-0 md:w-[420px] md:shrink-0 md:overflow-y-auto">
        <ImageGallery />
      </div>
    </div>
  );
}
