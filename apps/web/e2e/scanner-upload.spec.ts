import { expect, test } from "@playwright/test";

test("scanner upload path awards points and unlocks skins", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Go" }).click();

  await page.setInputFiles('input[type="file"]', [
    {
      name: "matcha.png",
      mimeType: "image/png",
      buffer: Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFElEQVR42mNk+M/wn4EIwDiqAABVxgQBr4bN5wAAAABJRU5ErkJggg==",
        "base64",
      ),
    },
  ]);

  await expect(page.getByText(/Restored \+100 Pts/)).toBeVisible();
});
