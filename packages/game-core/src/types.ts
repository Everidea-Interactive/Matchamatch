export type Cup = string[];
export type SortStatus = "active" | "won" | "failed";

export interface LevelDefinition {
  name: string;
  recipe: string;
  description: string;
  cups: Cup[];
  moveLimit: number;
}

export type SkinId =
  | "skin-zen"
  | "skin-sakura"
  | "skin-bamboo"
  | "skin-golden"
  | "skin-emerald";

export interface SkinDefinition {
  id: SkinId;
  name: string;
  emoji: string;
  hint: string;
}

export interface SortState {
  cups: Cup[];
  selectedCupIndex: number | null;
  history: Cup[][];
  message: string;
  moveLimit: number;
  movesUsed: number;
  restartRemaining: number;
  status: SortStatus;
  undoRemaining: number;
}
