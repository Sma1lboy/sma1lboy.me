import thoughtsData from "../data/thoughts.json";

export interface Thought {
  id: string;
  content: string;
  /** ISO date string, e.g. "2026-03-23" */
  date: string;
  /** Optional tags for categorization */
  tags?: string[];
  /** Optional mood/emoji indicator */
  mood?: string;
}

/**
 * Add new thoughts at the TOP of src/data/thoughts.json.
 * They will be displayed newest-first.
 *
 * JSON API: GET /api/thoughts.json
 */
export const thoughts: Thought[] = thoughtsData;
