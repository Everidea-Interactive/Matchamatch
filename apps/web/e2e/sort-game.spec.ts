import { expect, test, type Page } from "@playwright/test";
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

const LEVEL_ONE_WINNING_MOVES: Array<[number, number]> = [
  [0, 2],
  [1, 0],
  [1, 2],
  [0, 1],
  [0, 2],
];

const LEVEL_ONE_FAILURE_MOVES: Array<[number, number]> = [
  [0, 2],
  [1, 0],
  [2, 1],
  [0, 2],
  [1, 0],
];

const LEVEL_FOUR_FAILURE_MOVES: Array<[number, number]> = [
  [4, 5],
  [5, 4],
  [4, 5],
  [5, 4],
  [4, 5],
  [5, 4],
  [4, 5],
  [5, 4],
  [4, 5],
  [5, 4],
  [4, 5],
  [5, 4],
];

const LEVEL_FIVE_WINNING_MOVES: Array<[number, number]> = [
  [0, 5],
  [1, 6],
  [2, 6],
  [2, 5],
  [0, 2],
  [3, 0],
  [3, 5],
  [1, 3],
  [0, 1],
  [4, 3],
  [4, 6],
  [2, 4],
];

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.clear();
  });
  await seedOnboardingSeen(page);
});

async function mockCamera(page: Page) {
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

async function playMoves(page: Page, moves: Array<[number, number]>) {
  for (const [sourceIndex, destinationIndex] of moves) {
    await page.getByTestId(`cup-${sourceIndex}`).click();
    await page.getByTestId(`cup-${destinationIndex}`).click();
  }
}

async function seedProfile(
  page: Page,
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

test("sort HUD tracks moves, undo, restart, and retries", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByTestId("moves-counter")).toHaveText(/Moves\s*0 \/ 5/);
  await expect(page.getByTestId("undo-counter")).toHaveText(/Undo Left\s*5/);
  await expect(page.getByTestId("restart-counter")).toHaveText(
    /Restart Left\s*1/,
  );
  await expect(page.getByTestId("retry-counter")).toHaveText(
    /Retries Left\s*3/,
  );

  await page.getByTestId("cup-0").click();
  await page.getByTestId("cup-2").click();
  await expect(page.getByText("Satisfying pour! Keep it up.")).toBeVisible();
  await expect(page.getByTestId("moves-counter")).toHaveText(/Moves\s*1 \/ 5/);
  await expect(page.getByTestId("undo-counter")).toHaveText(/Undo Left\s*5/);

  await page.getByRole("button", { name: "Undo" }).click();
  await expect(page.getByText("Undo applied! Keep sorting.")).toBeVisible();
  await expect(page.getByTestId("moves-counter")).toHaveText(/Moves\s*0 \/ 5/);
  await expect(page.getByTestId("undo-counter")).toHaveText(/Undo Left\s*4/);

  await page.getByTestId("cup-0").click();
  await page.getByTestId("cup-2").click();
  await expect(page.getByRole("button", { name: "Restart" })).toBeEnabled();
  await page.getByRole("button", { name: "Restart" }).click();

  await expect(page.getByTestId("moves-counter")).toHaveText(/Moves\s*0 \/ 5/);
  await expect(page.getByTestId("undo-counter")).toHaveText(/Undo Left\s*5/);
  await expect(page.getByTestId("restart-counter")).toHaveText(
    /Restart Left\s*0/,
  );
  await expect(page.getByRole("button", { name: "Restart" })).toBeDisabled();
  await expect(page.getByRole("button", { name: "Undo" })).toBeDisabled();
  await expect(page.getByTestId("cup-2")).toContainText("Empty");
  await expect(page.getByTestId("cup-3")).toHaveCount(0);
  await expect(
    page.getByText("Tap a cup to select, then tap another to pour."),
  ).toBeVisible();
});

test("tab switch clears pending sort selection state", async ({ page }) => {
  await page.goto("/");

  await page.getByTestId("cup-0").click();
  await expect(page.getByTestId("cup-0")).toHaveAttribute(
    "aria-pressed",
    "true",
  );

  await page.getByRole("button", { name: "Go" }).click();
  await page.getByRole("button", { name: "Sort" }).click();

  await expect(page.getByTestId("cup-0")).toHaveAttribute(
    "aria-pressed",
    "false",
  );
  await expect(
    page.getByText("Tap a cup to select, then tap another to pour."),
  ).toBeVisible();
});

test("tab switch keeps shell height stable", async ({ page }) => {
  await mockCamera(page);
  await page.goto("/");
  await page.waitForTimeout(500);

  const shell = page.locator(".mm-shell-in");
  const sortHeight = await shell.evaluate((element) => {
    return element.getBoundingClientRect().height;
  });

  await page.getByRole("button", { name: "Go" }).click();
  await expect(page.getByRole("button", { name: "Capture" })).toBeEnabled();

  const goHeight = await shell.evaluate((element) => {
    return element.getBoundingClientRect().height;
  });

  expect(Math.abs(goHeight - sortHeight)).toBeLessThan(1);
});

test("winning level 1 loads fresh level 2 board without spawned cup", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page.getByText("Cafe Level 1")).toBeVisible();
  await expect(page.getByRole("button", { name: "Power Up" })).toHaveCount(0);

  await playMoves(page, LEVEL_ONE_WINNING_MOVES);

  await expect(page.getByText("Cafe Level 2")).toBeVisible();
  await expect(page.getByText("Double Whisk")).toBeVisible();
  await expect(page.getByTestId("moves-counter")).toHaveText(
    /Moves\s*0 \/ 10/,
  );
  await expect(page.getByTestId("cup-3")).toContainText("Empty");
  await expect(page.getByTestId("cup-4")).toHaveCount(0);
});

test("clearing level 5 locks Sort with completed daily game state", async ({
  page,
}) => {
  await seedProfile(page, {
    currentLevelIndex: 4,
  });
  await page.goto("/");

  await playMoves(page, LEVEL_FIVE_WINNING_MOVES);

  await expect(page.getByText("Daily game already completed")).toBeVisible();
  await expect(
    page.getByText("Scan a drink in Go to start another game."),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Scan a Drink" })).toBeVisible();
  await expect(page.getByTestId("cup-0")).toHaveCount(0);
});

test("completed daily game persists across reload", async ({ page }) => {
  await seedProfile(page, {
    currentLevelIndex: 4,
    dailyGameCompleted: true,
    dailyScore: 200,
  });
  await page.goto("/");

  await expect(page.getByText("Daily game already completed")).toBeVisible();
  await expect(
    page.getByText("Scan a drink in Go to start another game."),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Scan a Drink" })).toBeVisible();
  await expect(page.getByTestId("cup-0")).toHaveCount(0);
});

test("failed level locks board and Try Again resets same level with spent retry", async ({
  page,
}) => {
  await page.goto("/");

  await playMoves(page, LEVEL_ONE_FAILURE_MOVES);

  const failureDialog = page.getByRole("dialog", {
    name: "Move limit reached",
  });

  await expect(failureDialog).toBeVisible();
  await expect(failureDialog).toContainText("2 retries left.");
  await expect(page.getByTestId("moves-counter")).toHaveText(/Moves\s*5 \/ 5/);
  await expect(page.getByTestId("retry-counter")).toHaveText(
    /Retries Left\s*2/,
  );
  await expect(page.getByTestId("cup-0")).toBeDisabled();
  await expect(
    page.getByRole("button", { name: "Undo", includeHidden: true }),
  ).toBeDisabled();
  await expect(
    page.getByRole("button", { name: "Restart", includeHidden: true }),
  ).toBeDisabled();
  await expect(page.getByRole("button", { name: "Retry" })).toBeEnabled();

  await page.getByRole("button", { name: "Retry" }).click();

  await expect(page.getByText("Cafe Level 1")).toBeVisible();
  await expect(page.getByTestId("moves-counter")).toHaveText(/Moves\s*0 \/ 5/);
  await expect(page.getByTestId("undo-counter")).toHaveText(/Undo Left\s*5/);
  await expect(page.getByTestId("restart-counter")).toHaveText(
    /Restart Left\s*1/,
  );
  await expect(page.getByTestId("retry-counter")).toHaveText(
    /Retries Left\s*2/,
  );
  await expect(page.getByTestId("cup-0")).toBeEnabled();
  await expect(page.getByTestId("cup-2")).toContainText("Empty");
  await expect(page.getByTestId("cup-3")).toHaveCount(0);
  await expect(
    page.getByText("Tap a cup to select, then tap another to pour."),
  ).toBeVisible();
});

test("exhausted retries offer capture rescue and level 1 fallback", async ({
  page,
}) => {
  await seedProfile(page, {
    currentLevelIndex: 3,
    retryBudgetRemaining: 1,
  });
  await page.goto("/");

  await expect(page.getByText("Cafe Level 4")).toBeVisible();
  await expect(page.getByTestId("retry-counter")).toHaveText(
    /Retries Left\s*1/,
  );

  await playMoves(page, LEVEL_FOUR_FAILURE_MOVES);

  const failureDialog = page.getByRole("dialog", {
    name: "Move limit reached",
  });

  await expect(failureDialog).toBeVisible();
  await expect(failureDialog).toContainText(
    "No retries left. Capture Matcha in Go for +1 retry, or go back to Cafe Level 1.",
  );
  await expect(page.getByTestId("moves-counter")).toHaveText(
    /Moves\s*12 \/ 12/,
  );
  await expect(page.getByTestId("retry-counter")).toHaveText(
    /Retries Left\s*0/,
  );
  await expect(
    page.getByRole("button", { name: "Capture Matcha for +1 Retry" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Back to Level 1" }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Back to Level 1" }).click();

  await expect(page.getByText("Cafe Level 1")).toBeVisible();
  await expect(page.getByText("Warm Up Matcha")).toBeVisible();
  await expect(page.getByTestId("moves-counter")).toHaveText(/Moves\s*0 \/ 5/);
  await expect(page.getByTestId("retry-counter")).toHaveText(
    /Retries Left\s*3/,
  );
  await expect(page.getByTestId("cup-2")).toContainText("Empty");
  await expect(page.getByTestId("cup-3")).toHaveCount(0);
});

test("exhausted retries can be restored by Matcha capture", async ({
  page,
}) => {
  await mockCamera(page);
  await seedProfile(page, {
    currentLevelIndex: 3,
    retryBudgetRemaining: 1,
  });
  await page.goto("/");

  await playMoves(page, LEVEL_FOUR_FAILURE_MOVES);
  await page
    .getByRole("button", { name: "Capture Matcha for +1 Retry" })
    .click();

  const captureButton = page.getByRole("button", { name: "Capture" });
  await expect(captureButton).toBeEnabled();
  await captureButton.click();

  await expect(page.getByText("Cafe Level 4")).toBeVisible();
  await expect(page.getByTestId("moves-counter")).toHaveText(/Moves\s*0 \/ 12/);
  await expect(page.getByTestId("retry-counter")).toHaveText(
    /Retries Left\s*1/,
  );
  await expect(
    page.getByRole("dialog", { name: "Move limit reached" }),
  ).toHaveCount(0);
});

test.describe("mobile sort layout", () => {
  test.use({
    viewport: {
      width: 390,
      height: 844,
    },
  });

  test("level 5 sort board fits without vertical page scroll", async ({
    page,
  }) => {
    await seedProfile(page, {
      currentLevelIndex: 4,
    });
    await page.goto("/");

    await expect(page.getByText("Cafe Level 5")).toBeVisible();
    await expect(page.getByTestId("cup-6")).toBeVisible();

    const pageMetrics = await page.evaluate(() => {
      return {
        innerHeight: window.innerHeight,
        scrollHeight: document.documentElement.scrollHeight,
      };
    });

    expect(pageMetrics.scrollHeight).toBeLessThanOrEqual(
      pageMetrics.innerHeight + 4,
    );
  });
});
