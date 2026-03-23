import React from "react";
import PaperCard from "./PaperCard";

export default function TypewriterPreview() {
  return (
    <div className="flex h-full w-full items-center justify-center p-4">
      <div className="h-40 w-32 rotate-[-5deg] transform">
        <PaperCard text="" isPolished={false} preview={true} />
      </div>
    </div>
  );
}
