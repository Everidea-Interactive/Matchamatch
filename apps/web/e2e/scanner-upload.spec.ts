import { expect, test } from "@playwright/test";
import { seedOnboardingSeen } from "./storage";

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
