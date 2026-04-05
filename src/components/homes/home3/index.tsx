import { Sidebar } from "./Sidebar";
import { ThoughtsFeed } from "./ThoughtsFeed";
import { ImageGallery } from "./ImageGallery";

export function Home3() {
  return (
    <div
      className="flex h-screen w-screen flex-col font-mono md:flex-row"
      style={{ backgroundColor: "#0a0a0a", color: "#b0b0b0" }}
    >
      {/* Left sidebar */}
      <div className="w-full shrink-0 md:w-[250px]">
        <Sidebar />
      </div>

      {/* Vertical separator — desktop only */}
      <div className="hidden md:block" style={{ width: "1px", backgroundColor: "#1a1a1a" }} />

      {/* Middle — thoughts feed */}
      <div className="min-h-0 max-h-[60vh] flex-1 overflow-y-auto md:max-h-full">
        <ThoughtsFeed />
      </div>

      {/* Vertical separator — desktop only */}
      <div className="hidden md:block" style={{ width: "1px", backgroundColor: "#1a1a1a" }} />

      {/* Right — image gallery */}
      <div className="w-full shrink-0 md:w-[350px]">
        <ImageGallery />
      </div>
    </div>
  );
}
