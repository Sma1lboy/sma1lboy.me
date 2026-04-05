import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Music, Volume2 } from "lucide-react";
import { useTranslation } from "@/i18n";
import {
  type AmbientPreset,
  playPreset,
  setVolume,
  stopAll,
} from "@/lib/ambient-audio";
import { useAmbientPlayerStore } from "@/store/ambientPlayerStore";

const PRESETS: AmbientPreset[] = ["lofi", "rain", "coffee", "silence"];

function EqualizerBars({ active }: { active: boolean }) {
  return (
    <div className="flex items-end gap-[2px] h-4">
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="w-[3px] rounded-full bg-current"
          animate={
            active
              ? {
                  height: ["4px", `${10 + Math.random() * 6}px`, "4px"],
                }
              : { height: "4px" }
          }
          transition={
            active
              ? {
                  duration: 0.6 + i * 0.15,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.1,
                }
              : { duration: 0.3 }
          }
        />
      ))}
    </div>
  );
}

export function AmbientPlayer() {
  const { t } = useTranslation();
  const {
    preset,
    volume,
    isOpen,
    wasPlaying,
    setPreset,
    setVolume: storeSetVolume,
    setIsOpen,
  } = useAmbientPlayerStore();

  const [isAudioActive, setIsAudioActive] = useState(false);
  const [showResume, setShowResume] = useState(false);
  const hasInitialized = useRef(false);

  // On mount, check if user had audio playing last session
  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      if (wasPlaying && preset !== "silence") {
        setShowResume(true);
      }
    }
  }, [wasPlaying, preset]);

  // Sync volume changes to Web Audio
  useEffect(() => {
    if (isAudioActive) {
      setVolume(volume);
    }
  }, [volume, isAudioActive]);

  const handlePresetChange = useCallback(
    async (newPreset: AmbientPreset) => {
      setPreset(newPreset);
      setShowResume(false);

      if (newPreset === "silence") {
        stopAll();
        setIsAudioActive(false);
      } else {
        await playPreset(newPreset);
        setVolume(volume);
        setIsAudioActive(true);
      }
    },
    [setPreset, volume],
  );

  const handleResume = useCallback(async () => {
    setShowResume(false);
    if (preset !== "silence") {
      await playPreset(preset);
      setVolume(volume);
      setIsAudioActive(true);
    }
  }, [preset, volume]);

  const handleVolumeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = parseFloat(e.target.value);
      storeSetVolume(v);
    },
    [storeSetVolume],
  );

  const toggleOpen = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen, setIsOpen]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAll();
    };
  }, []);

  const isPlaying = isAudioActive && preset !== "silence";

  return (
    <div className="fixed left-6 bottom-6 z-50 flex flex-col items-start gap-2">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-2 rounded-2xl border border-gray-200 bg-white/80 p-3 shadow-lg backdrop-blur-md dark:border-[#2a2a2a] dark:bg-[#0a0a0a]/80"
          >
            {/* Equalizer */}
            <div className="mb-3 flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <EqualizerBars active={isPlaying} />
              <span className="text-xs font-medium">
                {isPlaying
                  ? t(`ambientPlayer.presets.${preset}`)
                  : t("ambientPlayer.idle")}
              </span>
            </div>

            {/* Preset buttons */}
            <div className="mb-3 grid grid-cols-2 gap-1.5">
              {PRESETS.map((p) => (
                <button
                  key={p}
                  onClick={() => handlePresetChange(p)}
                  className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                    preset === p && isAudioActive
                      ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                      : preset === p && !isAudioActive && p !== "silence"
                        ? "bg-gray-200 text-gray-700 dark:bg-[#2a2a2a] dark:text-gray-300"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-[#1a1a1a] dark:text-gray-400 dark:hover:bg-[#2a2a2a]"
                  }`}
                >
                  {p === "silence"
                    ? isPlaying
                      ? t("ambientPlayer.stop")
                      : t("ambientPlayer.presets.silence")
                    : t(`ambientPlayer.presets.${p}`)}
                </button>
              ))}
            </div>

            {/* Volume slider */}
            <div className="flex items-center gap-2">
              <Volume2 size={14} className="text-gray-500 dark:text-gray-500" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="h-1 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-gray-700 dark:bg-[#2a2a2a] dark:accent-gray-300"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Minimized button */}
      <motion.button
        onClick={showResume ? handleResume : toggleOpen}
        className="relative flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white/80 text-gray-600 shadow-lg backdrop-blur-sm transition-colors hover:bg-gray-100 dark:border-[#2a2a2a] dark:bg-[#0a0a0a]/80 dark:text-gray-400 dark:hover:bg-[#1a1a1a]"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={t("ambientPlayer.title")}
      >
        {isPlaying ? (
          <EqualizerBars active={true} />
        ) : (
          <Music size={18} />
        )}

        {/* Resume indicator */}
        {showResume && (
          <motion.span
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green-500"
          />
        )}
      </motion.button>

      {/* Resume tooltip */}
      <AnimatePresence>
        {showResume && !isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -5 }}
            className="absolute bottom-0 left-12 whitespace-nowrap rounded-lg border border-gray-200 bg-white/90 px-2.5 py-1 text-xs text-gray-600 shadow-md backdrop-blur-sm dark:border-[#2a2a2a] dark:bg-[#0a0a0a]/90 dark:text-gray-400"
          >
            {t("ambientPlayer.clickToResume")}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
