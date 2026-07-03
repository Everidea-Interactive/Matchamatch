import type { LevelDefinition, SkinDefinition } from "./types";

export const COLORS = {
  matcha: "#556C38",
  milk: "#D4C898",
  strawberry: "#B6CD85",
  lavender: "#8EA766",
  chocolate: "#6E8750",
} as const;

export const LEVELS: LevelDefinition[] = [
  {
    name: "Warm Up Matcha",
    recipe: "Matcha Silk Latte",
    description: "Simple sorting with 2 primary layers.",
    moveLimit: 5,
    cups: [
      [COLORS.matcha, COLORS.milk, COLORS.matcha],
      [COLORS.milk, COLORS.matcha, COLORS.milk],
      [],
    ],
  },
  {
    name: "Double Whisk",
    recipe: "Strawberry Foam Matcha",
    description: "Add sweet strawberry froth to the mix.",
    moveLimit: 10,
    cups: [
      [COLORS.matcha, COLORS.milk, COLORS.strawberry],
      [COLORS.strawberry, COLORS.matcha, COLORS.milk],
      [COLORS.milk, COLORS.strawberry, COLORS.matcha],
      [],
    ],
  },
  {
    name: "Lavender Swirl",
    recipe: "Earthy Violet Whisk",
    description: "Beautiful lavender aroma layers appear!",
    moveLimit: 12,
    cups: [
      [COLORS.matcha, COLORS.milk, COLORS.lavender],
      [COLORS.lavender, COLORS.strawberry, COLORS.matcha],
      [COLORS.milk, COLORS.lavender, COLORS.strawberry],
      [COLORS.strawberry, COLORS.matcha, COLORS.milk],
      [],
    ],
  },
  {
    name: "Choco-Matcha Blast",
    recipe: "Triple Choco-Matcha Cream",
    description: "Chocolate cream fudge adds deep flavor complexity.",
    moveLimit: 12,
    cups: [
      [COLORS.matcha, COLORS.milk, COLORS.chocolate],
      [COLORS.chocolate, COLORS.strawberry, COLORS.matcha],
      [COLORS.milk, COLORS.chocolate, COLORS.strawberry],
      [COLORS.strawberry, COLORS.matcha, COLORS.milk],
      [COLORS.lavender, COLORS.lavender, COLORS.lavender],
      [],
    ],
  },
  {
    name: "Zen Master Ceremony",
    recipe: "Imperator Whisk Supreme",
    description: "Ultimate blend. 5 rich cafe colors to sort perfectly.",
    moveLimit: 15,
    cups: [
      [COLORS.strawberry, COLORS.lavender, COLORS.chocolate],
      [COLORS.strawberry, COLORS.matcha, COLORS.milk],
      [COLORS.lavender, COLORS.chocolate, COLORS.milk],
      [COLORS.matcha, COLORS.chocolate, COLORS.strawberry],
      [COLORS.lavender, COLORS.milk, COLORS.matcha],
      [],
      [],
    ],
  },
];

export const SKINS: SkinDefinition[] = [
  {
    id: "skin-zen",
    name: "Zen Glass",
    emoji: "🍵",
    hint: "Default modern glass",
  },
  {
    id: "skin-sakura",
    name: "Sakura Chalice",
    emoji: "🌸",
    hint: "Capture 1 daily Matcha cup to unlock",
  },
  {
    id: "skin-bamboo",
    name: "Bamboo Vessel",
    emoji: "🎋",
    hint: "Capture 2 daily Matcha cups to unlock",
  },
  {
    id: "skin-golden",
    name: "Golden Rim",
    emoji: "⭐",
    hint: "Unlock at 300 pts Daily Score",
  },
  {
    id: "skin-emerald",
    name: "Emerald Mug",
    emoji: "🍃",
    hint: "Unlock at 500 pts Daily Score",
  },
];
