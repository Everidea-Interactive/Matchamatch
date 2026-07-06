import type { Page } from "@playwright/test";

export const ONBOARDING_STORAGE_KEY = "matchamatch.onboarding.v1";

export async function seedOnboardingSeen(page: Page) {
  await page.addInitScript((storageKey) => {
    window.localStorage.setItem(storageKey, "seen");
  }, ONBOARDING_STORAGE_KEY);
}
