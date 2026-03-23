import React, { useState, useRef } from "react";
import PaperCard from "./PaperCard";

interface CardData {
  id: number;
  text: string;
  isPolished: boolean;
  x: number;
  y: number;
  rotation: number;
}

const MOCK_1920S_DICTIONARY: Record<string, string> = {
  cool: "the bee's knees",
  great: "the cat's pajamas",
  money: "clams",
  police: "fuzz",
  car: "jalopy",
  friend: "chum",
  party: "shindig",
  hello: "howdy",
  yes: "abso-lutely",
  no: "nix",
  crazy: "dippy",
  drunk: "spifflicated",
  tired: "bushed",
  happy: "on cloud nine",
  sad: "blue",
  good: "swell",
  bad: "lousy",
};

export default function Typewriter() {
  const [inputText, setInputText] = useState("");
  const [cards, setCards] = useState<CardData[]>([]);
  const [isPolished, setIsPolished] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sound effect (simple oscillator beep)
  const playTypeSound = () => {
    try {
      const AudioContext =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
      if (!AudioContext) return;

      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "square";
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // Ignore audio errors
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.metaKey) {
      e.preventDefault();
      handlePrint();
    } else {
      playTypeSound();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    if (isPolished) setIsPolished(false);
  };

  const handlePolish = () => {
    if (!inputText) return;

    setIsPolished(true);

    let polishedText = inputText.toLowerCase();
    Object.entries(MOCK_1920S_DICTIONARY).forEach(([key, value]) => {
      const regex = new RegExp(`\\b${key}\\b`, "gi");
      polishedText = polishedText.replace(regex, value);
    });

    polishedText = polishedText.replace(/(^\w|\.\s+\w)/gm, (letter) => letter.toUpperCase());
    setInputText(polishedText);
  };

  const handlePrint = () => {
    if (!inputText.trim()) return;

    const newCard: CardData = {
      id: Date.now(),
      text: inputText,
      isPolished,
      x: Math.random() * 100 - 50,
      y: Math.random() * 100 - 50,
      rotation: Math.random() * 6 - 3,
    };

    setCards([...cards, newCard]);
    setInputText("");
    setIsPolished(false);

    // Focus back on textarea
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#2c2c2c] font-sans text-[#e0e0e0] selection:bg-[#d4b483] selection:text-[#2c2c2c]">
      {/* Background Texture */}
      <div className="pointer-events-none absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] opacity-5"></div>

      {/* Workspace Area (for dropped cards) */}
      <div className="absolute inset-0 z-0">
        {cards.map((card) => (
          <div
            key={card.id}
            className="absolute top-1/2 left-1/2"
            style={{
              transform: `translate(-50%, -50%) translate(${card.x}px, ${card.y}px)`,
            }}
          >
            <PaperCard text={card.text} isPolished={card.isPolished} rotation={card.rotation} />
          </div>
        ))}
      </div>

      {/* Typewriter Interface */}
      <div className="pointer-events-none relative z-10 flex min-h-screen flex-col items-center justify-center">
        {/* The Machine */}
        <div className="pointer-events-auto relative flex w-full max-w-3xl flex-col items-center">
          {/* Paper / Input Area */}
          <div className="relative z-10 h-[300px] w-[210mm] origin-bottom bg-[#fdfbf7] shadow-lg transition-transform duration-100">
            {/* Paper Texture */}
            <div className="pointer-events-none absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-10"></div>

            {/* The Actual Input */}
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              className={`h-full w-full resize-none border-none bg-transparent p-12 font-mono text-xl leading-loose text-[#222] outline-none ${isPolished ? "font-serif text-[#1a1a1a]" : ""}`}
              placeholder="Start typing..."
              spellCheck={false}
              autoFocus
            />
          </div>

          {/* Typewriter Body Visuals */}
          <div className="relative z-20 mt-[-10px] w-full rounded-t-3xl border-t-8 border-[#333] bg-[#1a1a1a] p-8 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <div className="text-sm font-bold tracking-widest text-[#d4b483] uppercase">
                Motorola Fix Beeper
              </div>
              <div className="flex gap-4">
                <button
                  onClick={handlePolish}
                  className={`rounded-full px-4 py-2 text-xs font-bold tracking-wider uppercase transition-all ${isPolished ? "bg-[#d4b483] text-[#1a1a1a]" : "bg-[#333] text-[#888] hover:bg-[#444]"}`}
                >
                  {isPolished ? "AI Polished" : "Polish Text"}
                </button>
                <button
                  onClick={handlePrint}
                  className="rounded-full bg-[#d4b483] px-4 py-2 text-xs font-bold tracking-wider text-[#1a1a1a] uppercase shadow-[0_0_15px_rgba(212,180,131,0.3)] transition-all hover:bg-[#e5c594]"
                >
                  Print Card
                </button>
              </div>
            </div>

            {/* Decorative Keyboard Hint */}
            <div className="mt-4 text-center text-xs tracking-widest text-[#555] uppercase">
              Type your message • CMD+ENTER to Print
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
