import { describe, expect, it } from "vitest";
import {
  DEFAULT_PROFILE,
  DEFAULT_RETRY_BUDGET,
  applyCaptureReward,
  applyFailurePenalty,
  loadProfile,
  saveProfile,
} from "./profile";

describe("profile", () => {
  it("loads defaults when storage is empty", () => {
    const storage = new Map<string, string>();
    const profile = loadProfile({
      getItem: (key) => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, value),
    });

    expect(profile).toEqual(DEFAULT_PROFILE);
  });

  it("backfills retry budget for legacy profile payloads", () => {
    const storage = new Map<string, string>();
    storage.set(
      "matchamatch.profile.v1",
      JSON.stringify({
        currentLevelIndex: 3,
        dailyScore: 250,
        dailyStreak: 4,
        captureCount: 1,
        unlockedSkins: ["skin-zen"],
        activeSkin: "skin-zen",
      }),
    );

    const profile = loadProfile({
      getItem: (key) => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, value),
    });

    expect(profile.retryBudgetRemaining).toBe(DEFAULT_RETRY_BUDGET);
  });

  it("saves updated profile state", () => {
    const storage = new Map<string, string>();
    saveProfile(
      {
        getItem: (key) => storage.get(key) ?? null,
        setItem: (key, value) => storage.set(key, value),
      },
      applyCaptureReward(DEFAULT_PROFILE, true),
    );

    expect(storage.get("matchamatch.profile.v1")).toContain('"dailyScore":250');
  });

  it("spends retry budget and resets progress on exhaustion", () => {
    const nextProfile = applyFailurePenalty({
      ...DEFAULT_PROFILE,
      currentLevelIndex: 4,
      retryBudgetRemaining: 2,
    });
    const resetProfile = applyFailurePenalty({
      ...DEFAULT_PROFILE,
      currentLevelIndex: 4,
      retryBudgetRemaining: 1,
    });

    expect(nextProfile.currentLevelIndex).toBe(4);
    expect(nextProfile.retryBudgetRemaining).toBe(1);
    expect(resetProfile.currentLevelIndex).toBe(0);
    expect(resetProfile.retryBudgetRemaining).toBe(DEFAULT_RETRY_BUDGET);
  });
});
