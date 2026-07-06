import { LEVELS } from "./catalog";
import type { SkinId } from "./types";

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export interface LocalProfile {
  version: 1;
  retryBudgetRemaining: number;
  currentLevelIndex: number;
  dailyGameCompleted: boolean;
  dailyScore: number;
  dailyStreak: number;
  captureCount: number;
  unlockedSkins: SkinId[];
  activeSkin: SkinId;
}

export const PROFILE_STORAGE_KEY = "matchamatch.profile.v1";
export const DEFAULT_RETRY_BUDGET = 3;

export const DEFAULT_PROFILE: LocalProfile = {
  version: 1,
  retryBudgetRemaining: DEFAULT_RETRY_BUDGET,
  currentLevelIndex: 0,
  dailyGameCompleted: false,
  dailyScore: 150,
  dailyStreak: 4,
  captureCount: 0,
  unlockedSkins: ["skin-zen"],
  activeSkin: "skin-zen",
};

function cloneProfile(profile: LocalProfile): LocalProfile {
  return {
    ...profile,
    unlockedSkins: [...profile.unlockedSkins],
  };
}

function normalizeUnlockedSkins(unlockedSkins?: SkinId[]): SkinId[] {
  if (!unlockedSkins?.length) {
    return [...DEFAULT_PROFILE.unlockedSkins];
  }

  return [...new Set(unlockedSkins)];
}

function clampLevelIndex(levelIndex: number): number {
  return Math.min(Math.max(levelIndex, 0), LEVELS.length - 1);
}

export function loadProfile(storage: StorageLike): LocalProfile {
  const raw = storage.getItem(PROFILE_STORAGE_KEY);

  if (!raw) {
    return cloneProfile(DEFAULT_PROFILE);
  }

  try {
    const parsed = JSON.parse(raw) as Partial<LocalProfile>;

    return {
      ...DEFAULT_PROFILE,
      ...parsed,
      currentLevelIndex: clampLevelIndex(
        parsed.currentLevelIndex ?? DEFAULT_PROFILE.currentLevelIndex,
      ),
      dailyGameCompleted:
        parsed.dailyGameCompleted ?? DEFAULT_PROFILE.dailyGameCompleted,
      retryBudgetRemaining:
        parsed.retryBudgetRemaining ?? DEFAULT_PROFILE.retryBudgetRemaining,
      unlockedSkins: normalizeUnlockedSkins(parsed.unlockedSkins),
      activeSkin: parsed.activeSkin ?? DEFAULT_PROFILE.activeSkin,
      version: 1,
    };
  } catch {
    return cloneProfile(DEFAULT_PROFILE);
  }
}

export function saveProfile(storage: StorageLike, profile: LocalProfile): void {
  storage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
}

export function applyLevelReward(profile: LocalProfile): LocalProfile {
  return {
    ...profile,
    dailyScore: profile.dailyScore + 50,
    currentLevelIndex: clampLevelIndex(profile.currentLevelIndex + 1),
  };
}

export function completeDailyGame(profile: LocalProfile): LocalProfile {
  return {
    ...profile,
    dailyGameCompleted: true,
    dailyScore: profile.dailyScore + 50,
    currentLevelIndex: LEVELS.length - 1,
  };
}

export function applyFailurePenalty(profile: LocalProfile): LocalProfile {
  return {
    ...profile,
    retryBudgetRemaining: Math.max(profile.retryBudgetRemaining - 1, 0),
  };
}

export function resetProfileProgressAfterRetryExhaustion(
  profile: LocalProfile,
): LocalProfile {
  return {
    ...profile,
    currentLevelIndex: 0,
    retryBudgetRemaining: DEFAULT_RETRY_BUDGET,
  };
}

export function restoreRetryBudget(
  profile: LocalProfile,
  retryCount = 1,
): LocalProfile {
  return {
    ...profile,
    retryBudgetRemaining: Math.min(
      profile.retryBudgetRemaining + retryCount,
      DEFAULT_RETRY_BUDGET,
    ),
  };
}

export function resetAfterDailyGameScan(profile: LocalProfile): LocalProfile {
  return {
    ...profile,
    currentLevelIndex: 0,
    dailyGameCompleted: false,
    retryBudgetRemaining: DEFAULT_RETRY_BUDGET,
  };
}

export function applyCaptureReward(
  profile: LocalProfile,
  isMatcha: boolean,
): LocalProfile {
  const captureCount = profile.captureCount + 1;
  const unlockedSkins = new Set<SkinId>(profile.unlockedSkins);

  if (captureCount >= 1) {
    unlockedSkins.add("skin-sakura");
  }

  if (captureCount >= 2) {
    unlockedSkins.add("skin-bamboo");
  }

  const dailyScore = profile.dailyScore + 100;

  if (dailyScore >= 300) {
    unlockedSkins.add("skin-golden");
  }

  if (dailyScore >= 500) {
    unlockedSkins.add("skin-emerald");
  }

  return {
    ...profile,
    captureCount,
    dailyScore,
    unlockedSkins: [...unlockedSkins],
    dailyStreak: isMatcha ? profile.dailyStreak + 1 : profile.dailyStreak,
  };
}
