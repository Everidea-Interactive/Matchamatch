import { describe, expect, it } from "vitest";
import {
  DEFAULT_PROFILE,
  applyCaptureReward,
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
});
