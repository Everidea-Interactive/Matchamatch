import { expect, test, type Page } from "@playwright/test";
import { ONBOARDING_STORAGE_KEY } from "./storage";

const AUDIO_STORAGE_KEY = "matchamatch.audio.v1";

type AudioTestState = {
  createAudioCalls: number;
  playCalls: number;
  pauseCalls: number;
  lastSrc: string | null;
  visibilityState: "visible" | "hidden";
};

declare global {
  interface Window {
    __mmAudioTest?: AudioTestState;
  }
}

test.beforeEach(async ({ page }) => {
  await page.goto("/account");
  await page.evaluate((storageKey) => {
    window.localStorage.clear();
    window.localStorage.setItem(storageKey, "seen");
  }, ONBOARDING_STORAGE_KEY);
});

async function installAudioMock(page: Page) {
  await page.addInitScript(() => {
    window.__mmAudioTest = {
      createAudioCalls: 0,
      playCalls: 0,
      pauseCalls: 0,
      lastSrc: null,
      visibilityState: "visible",
    };

    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      get() {
        return window.__mmAudioTest?.visibilityState ?? "visible";
      },
    });

    Object.defineProperty(document, "hidden", {
      configurable: true,
      get() {
        return (window.__mmAudioTest?.visibilityState ?? "visible") === "hidden";
      },
    });

    class MockAudio {
      currentTime = 0;
      loop = false;
      muted = false;
      playsInline = false;
      preload = "";
      src = "";

      constructor(src = "") {
        window.__mmAudioTest!.createAudioCalls += 1;
        this.src = src;
        window.__mmAudioTest!.lastSrc = src;
      }

      async play() {
        window.__mmAudioTest!.playCalls += 1;
        window.__mmAudioTest!.lastSrc = this.src;
      }

      pause() {
        window.__mmAudioTest!.pauseCalls += 1;
      }

      removeAttribute(name: string) {
        if (name === "src") {
          this.src = "";
        }
      }

      load() {
        return undefined;
      }
    }

    Object.defineProperty(window, "Audio", {
      configurable: true,
      writable: true,
      value: MockAudio,
    });
  });
}

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

async function readAudioPref(page: Page) {
  return page.evaluate((storageKey) => {
    return window.localStorage.getItem(storageKey);
  }, AUDIO_STORAGE_KEY);
}

test("account music toggle defaults on", async ({ page }) => {
  await page.goto("/account");

  await expect(page.getByRole("switch", { name: "Background Music" })).toHaveAttribute(
    "aria-checked",
    "true",
  );
});

test("music toggle off persists across route change and reload", async ({
  page,
}) => {
  await page.goto("/account");

  const musicToggle = page.getByRole("switch", { name: "Background Music" });
  await musicToggle.click();
  await expect(musicToggle).toHaveAttribute("aria-checked", "false");
  await expect(await readAudioPref(page)).toContain('"musicEnabled":false');

  await page.getByRole("link", { name: "Back to home" }).click();
  await page.getByRole("link", { name: "Open account" }).click();
  await expect(page.getByRole("switch", { name: "Background Music" })).toHaveAttribute(
    "aria-checked",
    "false",
  );

  await page.reload();
  await expect(page.getByRole("switch", { name: "Background Music" })).toHaveAttribute(
    "aria-checked",
    "false",
  );
});

test("music toggle on persists after being re-enabled", async ({ page }) => {
  await page.addInitScript((storageKey) => {
    window.localStorage.setItem(
      storageKey,
      JSON.stringify({ musicEnabled: false }),
    );
  }, AUDIO_STORAGE_KEY);

  await page.goto("/account");

  const musicToggle = page.getByRole("switch", { name: "Background Music" });
  await expect(musicToggle).toHaveAttribute("aria-checked", "false");
  await musicToggle.click();
  await expect(musicToggle).toHaveAttribute("aria-checked", "true");
  await expect(await readAudioPref(page)).toContain('"musicEnabled":true');

  await page.getByRole("link", { name: "Back to home" }).click();
  await page.getByRole("link", { name: "Open account" }).click();
  await expect(page.getByRole("switch", { name: "Background Music" })).toHaveAttribute(
    "aria-checked",
    "true",
  );

  await page.reload();
  await expect(page.getByRole("switch", { name: "Background Music" })).toHaveAttribute(
    "aria-checked",
    "true",
  );
});

test("first user gesture primes and resumes background music without page errors", async ({
  page,
}) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => {
    pageErrors.push(error.message);
  });

  await installAudioMock(page);
  await mockCamera(page);
  await page.goto("/");
  await expect(page.getByText("Warm Up Matcha")).toBeVisible();
  await page.mouse.click(20, 20);

  await expect.poll(async () => {
    return page.evaluate(() => window.__mmAudioTest?.playCalls ?? 0);
  }).toBeGreaterThan(0);

  await expect
    .poll(async () => {
      return page.evaluate(() => window.__mmAudioTest);
    })
    .toMatchObject({
      createAudioCalls: 1,
      lastSrc: "/audio/bgm.mpeg",
    });

  expect(pageErrors).toEqual([]);
});

test("hidden tab suspends and visible tab resumes when music enabled", async ({
  page,
}) => {
  await installAudioMock(page);
  await mockCamera(page);
  await page.goto("/");
  await expect(page.getByText("Warm Up Matcha")).toBeVisible();
  await page.mouse.click(20, 20);

  await page.evaluate(() => {
    if (!window.__mmAudioTest) {
      return;
    }

    window.__mmAudioTest.visibilityState = "hidden";
    document.dispatchEvent(new Event("visibilitychange"));
    window.__mmAudioTest.visibilityState = "visible";
    document.dispatchEvent(new Event("visibilitychange"));
  });

  await expect
    .poll(async () => {
      return page.evaluate(() => window.__mmAudioTest);
    })
    .toMatchObject({
      playCalls: 2,
      pauseCalls: 1,
    });
});

test("unsupported audio keeps account page stable and setting persists", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "Audio", {
      configurable: true,
      writable: true,
      value: undefined,
    });
  });

  await page.goto("/account");

  const musicToggle = page.getByRole("switch", { name: "Background Music" });
  await expect(musicToggle).toHaveAttribute("aria-checked", "true");
  await musicToggle.click();
  await expect(musicToggle).toHaveAttribute("aria-checked", "false");

  await page.reload();
  await expect(page.getByRole("switch", { name: "Background Music" })).toHaveAttribute(
    "aria-checked",
    "false",
  );
});
