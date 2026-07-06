import { expect, test } from "@playwright/test";
import { seedOnboardingSeen } from "./storage";

const PROFILE_STORAGE_KEY = "matchamatch.profile.v1";
const DEFAULT_PROFILE = {
  activeSkin: "skin-zen",
  captureCount: 0,
  currentLevelIndex: 0,
  dailyGameCompleted: false,
  dailyScore: 150,
  dailyStreak: 4,
  retryBudgetRemaining: 3,
  unlockedSkins: ["skin-zen"],
  version: 1 as const,
};

async function mockCamera(page: Parameters<typeof test>[0]["page"]) {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: {
        getUserMedia: async () => {
          const stream = new MediaStream();
          const originalGetTracks = stream.getTracks.bind(stream);

          stream.getTracks = () => {
            const tracks = originalGetTracks();
            return tracks.length > 0
              ? tracks
              : [
                  {
                    stop: () => undefined,
                  } as MediaStreamTrack,
                ];
          };

          return stream;
        },
      },
    });

    Object.defineProperty(HTMLMediaElement.prototype, "play", {
      configurable: true,
      value: async () => undefined,
    });

    Object.defineProperty(HTMLVideoElement.prototype, "videoWidth", {
      configurable: true,
      get() {
        return 640;
      },
    });

    Object.defineProperty(HTMLVideoElement.prototype, "videoHeight", {
      configurable: true,
      get() {
        return 480;
      },
    });
  });
}

async function seedProfile(
  page: Parameters<typeof test>[0]["page"],
  overrides: Partial<typeof DEFAULT_PROFILE>,
) {
  await page.addInitScript(
    ({ profile, storageKey }) => {
      window.localStorage.setItem(storageKey, JSON.stringify(profile));
    },
    {
      profile: {
        ...DEFAULT_PROFILE,
        ...overrides,
      },
      storageKey: PROFILE_STORAGE_KEY,
    },
  );
}

test("scanner capture path awards points and unlocks skins", async ({
  page,
}) => {
  await mockCamera(page);
  await seedOnboardingSeen(page);

  await page.goto("/");
  await page.getByRole("button", { name: "Go" }).click();
  const captureButton = page.getByRole("button", { name: "Capture" });
  await expect(captureButton).toBeEnabled();
  await captureButton.click();

  await expect(page.getByText(/Restored \+100 Pts/)).toBeVisible();
});

test("scanner capture resets completed daily game back to level 1", async ({
  page,
}) => {
  await mockCamera(page);
  await seedOnboardingSeen(page);
  await seedProfile(page, {
    currentLevelIndex: 4,
    dailyGameCompleted: true,
    dailyScore: 200,
    retryBudgetRemaining: 0,
  });

  await page.goto("/");
  await expect(page.getByText("Daily game already completed")).toBeVisible();

  await page.getByRole("button", { name: "Scan a Drink" }).click();
  const captureButton = page.getByRole("button", { name: "Capture" });
  await expect(captureButton).toBeEnabled();
  await captureButton.click();

  await expect(page.getByText("Cafe Level 1")).toBeVisible();
  await expect(page.getByText("Warm Up Matcha")).toBeVisible();
  await expect(page.getByTestId("retry-counter")).toHaveText(
    /Retries Left\s*3/,
  );
  await expect(page.getByText("Daily game already completed")).toHaveCount(0);
  await expect(page.getByTestId("daily-score")).toHaveText("300");
});

test("desktop scanner keeps camera flip toggle hidden", async ({ page }) => {
  await mockCamera(page);
  await seedOnboardingSeen(page);

  await page.goto("/");
  await page.getByRole("button", { name: "Go" }).click();

  await expect(page.getByRole("button", { name: /Switch to .* camera/ })).toBeHidden();
});

test.describe("mobile scanner controls", () => {
  test.use({
    viewport: {
      width: 390,
      height: 844,
    },
  });

  test("mobile scanner shows camera flip toggle", async ({ page }) => {
    await mockCamera(page);
    await seedOnboardingSeen(page);

    await page.goto("/");
    await page.getByRole("button", { name: "Go" }).click();

    await expect(
      page.getByRole("button", { name: /Switch to .* camera/ }),
    ).toBeVisible();
  });
});
