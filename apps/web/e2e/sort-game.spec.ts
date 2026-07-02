import { expect, test } from "@playwright/test";

test("player can complete basic sort interactions", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("Warm Up Matcha")).toBeVisible();
  await page.getByTestId("cup-0").click();
  await page.getByTestId("cup-2").click();
  await expect(page.getByText("Satisfying pour! Keep it up.")).toBeVisible();

  await page.getByRole("button", { name: "Undo" }).click();
  await expect(page.getByText("Undo applied! Keep sorting.")).toBeVisible();
});
