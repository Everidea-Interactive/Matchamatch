import { expect, test } from "@playwright/test";
import { ONBOARDING_STORAGE_KEY } from "./storage";

test("first visit opens welcome modal and advances into tutorial", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("dialog", { name: "Welcome to Matchamatch" }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Show me how" }).click();

  await expect(
    page.getByRole("dialog", { name: "How to play Matchamatch" }),
  ).toBeVisible();
  const tutorialDialog = page.getByRole("dialog", {
    name: "How to play Matchamatch",
  });

  await expect(
    tutorialDialog.getByRole("heading", { name: "Sort" }),
  ).toBeVisible();
  await expect(
    tutorialDialog.getByText("Use Undo or Restart if board gets messy."),
  ).toBeVisible();
  await expect(
    tutorialDialog.getByRole("button", { name: "Next" }),
  ).toBeVisible();
  await expect(
    tutorialDialog.getByRole("button", { name: "Back" }),
  ).toBeVisible();
  await expect(tutorialDialog.getByTestId("tutorial-dot-active")).toHaveCount(1);
  await expect(
    tutorialDialog.getByText("Switch", { exact: true }),
  ).toHaveCount(0);

  await tutorialDialog.getByRole("button", { name: /^Next$/ }).click();

  await expect(
    tutorialDialog.getByRole("heading", { name: "Go" }),
  ).toBeVisible();
  await expect(
    tutorialDialog.getByText("Good scan gives +100 points right away."),
  ).toBeVisible();
  await expect(
    tutorialDialog.getByRole("button", { name: "Start playing" }),
  ).toBeVisible();

  await tutorialDialog.getByRole("button", { name: /^Back$/ }).click();

  await expect(
    tutorialDialog.getByRole("heading", { name: "Sort" }),
  ).toBeVisible();
  await tutorialDialog.getByRole("button", { name: /^Back$/ }).click();

  await expect(
    page.getByRole("dialog", { name: "Welcome to Matchamatch" }),
  ).toBeVisible();
});

test("skip stores onboarding as seen and blocks future auto-open", async ({
  page,
}) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Skip for now" }).click();

  await expect(page.getByRole("dialog")).toHaveCount(0);
  const helpButton = page.getByRole("button", { name: "Help & Tutorial" });
  await expect(helpButton).toBeVisible();
  await expect(helpButton).toHaveText("?");

  const storageValue = await page.evaluate((storageKey) => {
    return window.localStorage.getItem(storageKey);
  }, ONBOARDING_STORAGE_KEY);

  expect(storageValue).toBe("seen");

  await page.reload();

  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("help chip reopens tutorial after onboarding dismissed", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Skip for now" }).click();

  await page.getByRole("button", { name: "Help & Tutorial" }).click();

  await expect(
    page.getByRole("dialog", { name: "How to play Matchamatch" }),
  ).toBeVisible();
  await expect(
    page.getByRole("dialog", { name: "How to play Matchamatch" }).getByRole(
      "heading",
      { name: "Sort" },
    ),
  ).toBeVisible();
});
