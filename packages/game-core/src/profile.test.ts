import { describe, expect, it } from "vitest";
import {
  DEFAULT_PROFILE,
  DEFAULT_RETRY_BUDGET,
  applyCaptureReward,
  applyFailurePenalty,
  completeDailyGame,
  loadProfile,
  resetAfterDailyGameScan,
  resetProfileProgressAfterRetryExhaustion,
  restoreRetryBudget,
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
    expect(profile.dailyGameCompleted).toBe(false);
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

  it("spends retry budget down to zero on exhaustion", () => {
    const nextProfile = applyFailurePenalty({
      ...DEFAULT_PROFILE,
      currentLevelIndex: 4,
      retryBudgetRemaining: 2,
    });
    const exhaustedProfile = applyFailurePenalty({
      ...DEFAULT_PROFILE,
      currentLevelIndex: 4,
      retryBudgetRemaining: 1,
    });

    expect(nextProfile.currentLevelIndex).toBe(4);
    expect(nextProfile.retryBudgetRemaining).toBe(1);
    expect(exhaustedProfile.currentLevelIndex).toBe(4);
    expect(exhaustedProfile.retryBudgetRemaining).toBe(0);
  });

  it("marks daily game complete after final clear", () => {
    const completedProfile = completeDailyGame({
      ...DEFAULT_PROFILE,
      currentLevelIndex: 4,
      retryBudgetRemaining: 1,
    });

    expect(completedProfile.dailyGameCompleted).toBe(true);
    expect(completedProfile.dailyScore).toBe(DEFAULT_PROFILE.dailyScore + 50);
    expect(completedProfile.currentLevelIndex).toBe(4);
    expect(completedProfile.retryBudgetRemaining).toBe(1);
  });

  it("resets progress after retry exhaustion", () => {
    const resetProfile = resetProfileProgressAfterRetryExhaustion({
      ...DEFAULT_PROFILE,
      currentLevelIndex: 4,
      retryBudgetRemaining: 0,
    });

    expect(resetProfile.currentLevelIndex).toBe(0);
    expect(resetProfile.retryBudgetRemaining).toBe(DEFAULT_RETRY_BUDGET);
  });

  it("restores single retry without exceeding budget", () => {
    const rescuedProfile = restoreRetryBudget({
      ...DEFAULT_PROFILE,
      retryBudgetRemaining: 0,
    });
    const cappedProfile = restoreRetryBudget(DEFAULT_PROFILE);

    expect(rescuedProfile.retryBudgetRemaining).toBe(1);
    expect(cappedProfile.retryBudgetRemaining).toBe(DEFAULT_RETRY_BUDGET);
  });

  it("resets completed daily game after scanner capture", () => {
    const resetProfile = resetAfterDailyGameScan({
      ...DEFAULT_PROFILE,
      dailyGameCompleted: true,
      currentLevelIndex: 4,
      retryBudgetRemaining: 0,
      dailyScore: 350,
      unlockedSkins: ["skin-zen", "skin-sakura"],
    });

    expect(resetProfile.dailyGameCompleted).toBe(false);
    expect(resetProfile.currentLevelIndex).toBe(0);
    expect(resetProfile.retryBudgetRemaining).toBe(DEFAULT_RETRY_BUDGET);
    expect(resetProfile.dailyScore).toBe(350);
    expect(resetProfile.unlockedSkins).toEqual(["skin-zen", "skin-sakura"]);
  });
});
