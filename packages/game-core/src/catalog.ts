import type { LevelDefinition, SkinDefinition } from "./types";

export const COLORS = {
  matcha: "#76895C",
  milk: "#F8F9F3",
  strawberry: "#E8A2A5",
  lavender: "#C3B1E1",
  chocolate: "#8B5A2B",
} as const;

export const LEVELS: LevelDefinition[] = [
  {
    name: "Warm Up Matcha",
    recipe: "Matcha Silk Latte",
    description: "Simple sorting with 2 primary layers.",
    cups: [
      [COLORS.matcha, COLORS.milk, COLORS.matcha],
      [COLORS.milk, COLORS.strawberry, COLORS.milk],
      [],
    ],
  },
  {
    name: "Double Whisk",
    recipe: "Strawberry Foam Matcha",
    description: "Add sweet strawberry froth to the mix.",
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
    cups: [
      [COLORS.matcha, COLORS.milk, COLORS.chocolate],
      [COLORS.chocolate, COLORS.strawberry, COLORS.matcha],
      [COLORS.milk, COLORS.chocolate, COLORS.strawberry],
      [COLORS.strawberry, COLORS.matcha, COLORS.milk],
      [COLORS.lavender, COLORS.milk, COLORS.lavender],
      [COLORS.chocolate, COLORS.lavender, COLORS.matcha],
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
