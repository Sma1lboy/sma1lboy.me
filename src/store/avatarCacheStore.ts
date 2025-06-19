import { create } from "zustand";

interface CircleData {
  x: number;
  y: number;
  radius: number;
  color: string;
  level: number;
  id: string;
}

interface CacheEntry {
  circles: CircleData[];
  timestamp: number;
  imageHash: string;
  stageSize: { width: number; height: number };
}

interface AvatarCacheState {
  cache: Map<string, CacheEntry>;
  isLoading: boolean;

  // Actions
  generateImageHash: (
    imageSrc: string,
    stageSize: { width: number; height: number },
  ) => Promise<string>;
  get: (
    imageSrc: string,
    stageSize: { width: number; height: number },
  ) => Promise<CircleData[] | null>;
  set: (
    imageSrc: string,
    stageSize: { width: number; height: number },
    circles: CircleData[],
  ) => Promise<void>;
  setLoading: (loading: boolean) => void;
  cleanup: () => void;
  clear: () => void;
  getStats: () => { size: number; totalCircles: number };
}

const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours
const MAX_CACHE_SIZE = 50; // Maximum 50 images

// Create a simpler store without persist for now, we'll handle persistence manually
export const useAvatarCacheStore = create<AvatarCacheState>((set, get) => ({
  cache: new Map<string, CacheEntry>(),
  isLoading: false,

  generateImageHash: async (imageSrc: string, stageSize: { width: number; height: number }) => {
    const key = `${imageSrc}_${stageSize.width}x${stageSize.height}`;

    // Simple string hash for consistent key generation
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      const char = key.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    return Math.abs(hash).toString(36);
  },

  get: async (imageSrc: string, stageSize: { width: number; height: number }) => {
    const { cache, generateImageHash } = get();
    const hash = await generateImageHash(imageSrc, stageSize);

    // Try to get from memory cache first
    let entry = cache.get(hash);

    // If not in memory, try to load from localStorage
    if (!entry) {
      try {
        const stored = localStorage.getItem(`avatar-cache-${hash}`);
        if (stored) {
          entry = JSON.parse(stored);
          if (entry) {
            // Add to memory cache
            const newCache = new Map(cache);
            newCache.set(hash, entry);
            set({ cache: newCache });
          }
        }
      } catch (error) {
        console.warn("Failed to load from localStorage:", error);
      }
    }

    if (!entry) {
      return null;
    }

    // Check if cache is expired
    if (Date.now() - entry.timestamp > CACHE_EXPIRY) {
      const newCache = new Map(cache);
      newCache.delete(hash);
      set({ cache: newCache });
      try {
        localStorage.removeItem(`avatar-cache-${hash}`);
      } catch (error) {
        console.warn("Failed to remove from localStorage:", error);
      }
      return null;
    }

    // Check if stage size matches
    if (entry.stageSize.width !== stageSize.width || entry.stageSize.height !== stageSize.height) {
      return null;
    }

    console.log(`🎯 Cache hit: ${hash}`);
    return entry.circles;
  },

  set: async (
    imageSrc: string,
    stageSize: { width: number; height: number },
    circles: CircleData[],
  ) => {
    const { cache, generateImageHash } = get();
    const hash = await generateImageHash(imageSrc, stageSize);

    const newCache = new Map(cache);

    // If cache is full, remove oldest entry
    if (newCache.size >= MAX_CACHE_SIZE) {
      const oldestKey = newCache.keys().next().value;
      if (oldestKey) {
        newCache.delete(oldestKey);
        try {
          localStorage.removeItem(`avatar-cache-${oldestKey}`);
        } catch (error) {
          console.warn("Failed to remove from localStorage:", error);
        }
      }
    }

    const entry: CacheEntry = {
      circles: JSON.parse(JSON.stringify(circles)), // Deep copy to avoid reference issues
      timestamp: Date.now(),
      imageHash: hash,
      stageSize: { ...stageSize },
    };

    newCache.set(hash, entry);
    set({ cache: newCache });

    // Save to localStorage
    try {
      localStorage.setItem(`avatar-cache-${hash}`, JSON.stringify(entry));
    } catch (error) {
      console.warn("Failed to save to localStorage:", error);
    }

    console.log(`💾 Cache saved: ${hash}, circles: ${circles.length}`);
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  cleanup: () => {
    const { cache } = get();
    const now = Date.now();
    const newCache = new Map(cache);
    const expiredKeys: string[] = [];

    for (const [key, entry] of newCache.entries()) {
      if (now - entry.timestamp > CACHE_EXPIRY) {
        expiredKeys.push(key);
      }
    }

    expiredKeys.forEach((key) => {
      newCache.delete(key);
      try {
        localStorage.removeItem(`avatar-cache-${key}`);
      } catch (error) {
        console.warn("Failed to remove from localStorage:", error);
      }
    });

    if (expiredKeys.length > 0) {
      set({ cache: newCache });
      console.log(`🧹 Cleaned up ${expiredKeys.length} expired cache entries`);
    }
  },

  clear: () => {
    const { cache } = get();

    // Clear localStorage entries
    for (const key of cache.keys()) {
      try {
        localStorage.removeItem(`avatar-cache-${key}`);
      } catch (error) {
        console.warn("Failed to remove from localStorage:", error);
      }
    }

    set({ cache: new Map() });
    console.log("🗑️ Cache cleared");
  },

  getStats: () => {
    const { cache } = get();
    let totalCircles = 0;
    for (const entry of cache.values()) {
      totalCircles += entry.circles.length;
    }

    return {
      size: cache.size,
      totalCircles,
    };
  },
}));

// Auto cleanup expired cache entries every hour
setInterval(
  () => {
    useAvatarCacheStore.getState().cleanup();
  },
  60 * 60 * 1000,
);
