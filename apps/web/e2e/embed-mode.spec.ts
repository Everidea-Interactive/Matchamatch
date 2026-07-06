import { expect, test } from "@playwright/test";

test("embed route sends ready and progress messages to host", async ({
  page,
}) => {
  await page.goto("/embed-host.html");
  const frame = page.frameLocator("iframe");

  await expect(
    frame.getByRole("dialog", { name: "Welcome to Matcha Match" }),
  ).toBeVisible();
  await expect(frame.getByText("Warm Up Matcha")).toBeVisible();
  await expect(page.getByTestId("host-log")).toContainText("matchamatch:ready");
});
