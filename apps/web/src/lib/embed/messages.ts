export type HostToGameMessage =
  | { type: "matchamatch:set-safe-area"; top: number; bottom: number }
  | { type: "matchamatch:pause" }
  | { type: "matchamatch:resume" };

export type GameToHostMessage =
  | { type: "matchamatch:ready"; mode: "embed" }
  | { type: "matchamatch:tab-change"; tab: "sort" | "go" }
  | { type: "matchamatch:progress"; levelIndex: number; dailyScore: number }
  | { type: "matchamatch:close-request" };
