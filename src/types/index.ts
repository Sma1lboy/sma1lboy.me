// Experience types for waterfall layout
export interface Experience {
  id: string;
  title: string;
  company?: string;
  organization?: string;
  period: {
    start: string;
    end?: string; // undefined means current
  };
  description: string;
  type: ExperienceType;
  technologies?: string[];
  achievements?: string[];
  location?: string;
  url?: string;
  image?: string;
  featured?: boolean;
}

export type ExperienceType =
  | "work"
  | "education"
  | "project"
  | "volunteer"
  | "award"
  | "certification"
  | "internship";

export interface ExperienceCategory {
  type: ExperienceType;
  label: string;
  color: string;
  icon?: string;
}

// Animation variants type
export interface AnimationVariants {
  hidden: {
    opacity: number;
    y?: number;
    x?: number;
    scale?: number;
  };
  visible: {
    opacity: number;
    y?: number;
    x?: number;
    scale?: number;
    transition?: {
      duration?: number;
      delay?: number;
      staggerChildren?: number;
    };
  };
}
