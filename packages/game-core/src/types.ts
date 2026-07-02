export type Cup = string[];

export interface LevelDefinition {
  name: string;
  recipe: string;
  description: string;
  cups: Cup[];
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
  hasAddedCup: boolean;
  history: Cup[][];
  message: string;
}
