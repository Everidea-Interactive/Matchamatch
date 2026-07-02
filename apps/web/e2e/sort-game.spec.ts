import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.clear();
  });
});

test("player can complete basic sort interactions", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("Warm Up Matcha")).toBeVisible();
  await page.getByTestId("cup-0").click();
  await page.getByTestId("cup-2").click();
  await expect(page.getByText("Satisfying pour! Keep it up.")).toBeVisible();

  await page.getByRole("button", { name: "Undo" }).click();
  await expect(page.getByText("Undo applied! Keep sorting.")).toBeVisible();
});

test("winning level 1 loads fresh level 2 board", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("Cafe Level 1")).toBeVisible();
  await page.getByRole("button", { name: "Power Up" }).click();
  await page.getByTestId("cup-0").click();
  await page.getByTestId("cup-2").click();
  await page.getByTestId("cup-1").click();
  await page.getByTestId("cup-3").click();
  await page.getByTestId("cup-0").click();
  await page.getByTestId("cup-3").click();
  await page.getByTestId("cup-2").click();
  await page.getByTestId("cup-0").click();
  await page.getByTestId("cup-1").click();
  await page.getByTestId("cup-2").click();
  await page.getByTestId("cup-1").click();
  await page.getByTestId("cup-3").click();

  await expect(page.getByText("Cafe Level 2")).toBeVisible();
  await expect(page.getByText("Double Whisk")).toBeVisible();
  await expect(
    page.getByText("Tap a cup to select, then tap another to pour."),
  ).toBeVisible();
  await expect(page.getByTestId("cup-1")).not.toContainText("Empty");
  await expect(page.getByTestId("cup-3")).toContainText("Empty");
});
