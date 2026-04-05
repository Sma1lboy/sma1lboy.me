import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AmbientPreset } from "@/lib/ambient-audio";

interface AmbientPlayerState {
  preset: AmbientPreset;
  volume: number;
  isOpen: boolean;
  wasPlaying: boolean; // tracks if user had audio before page reload
  setPreset: (preset: AmbientPreset) => void;
  setVolume: (volume: number) => void;
  setIsOpen: (open: boolean) => void;
  setWasPlaying: (playing: boolean) => void;
}

export const useAmbientPlayerStore = create<AmbientPlayerState>()(
  persist(
    (set) => ({
      preset: "silence",
      volume: 0.5,
      isOpen: false,
      wasPlaying: false,
      setPreset: (preset: AmbientPreset) => {
        set({ preset, wasPlaying: preset !== "silence" });
      },
      setVolume: (volume: number) => set({ volume }),
      setIsOpen: (isOpen: boolean) => set({ isOpen }),
      setWasPlaying: (playing: boolean) => set({ wasPlaying: playing }),
    }),
    {
      name: "ambient-player",
    },
  ),
);
