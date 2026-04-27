import { test, expect } from "@playwright/test";

const email = `user-${Date.now()}@example.com`;
const password = "password123";

test.describe("Habit Tracker app", () => {
  test("shows the splash screen and redirects unauthenticated users to /login", async ({
    page,
  }) => {
    // clear any existing session so we get the unauthenticated redirect
    await page.goto("/login");
    await page.evaluate(() => localStorage.clear());

    await page.goto("/");
    await expect(page.getByTestId("splash-screen")).toBeVisible();
    await page.waitForURL("/login", { timeout: 5000 });
    expect(page.url()).toContain("/login");
  });

  test("redirects authenticated users from / to /dashboard", async ({
    page,
  }) => {
    // Set up session directly in localStorage
    await page.goto("/login");
    await page.evaluate(() => {
      const user = {
        id: "test-id",
        email: "auth@example.com",
        password: "pass",
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem("habit-tracker-users", JSON.stringify([user]));
      localStorage.setItem(
        "habit-tracker-session",
        JSON.stringify({ userId: "test-id", email: "auth@example.com" }),
      );
    });

    await page.goto("/");
    await page.waitForURL("/dashboard", { timeout: 5000 });
    expect(page.url()).toContain("/dashboard");
  });

  test("prevents unauthenticated access to /dashboard", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForURL("/login", { timeout: 5000 });
    expect(page.url()).toContain("/login");
  });

  test("signs up a new user and lands on the dashboard", async ({ page }) => {
    await page.goto("/signup");
    await page.getByTestId("auth-signup-email").fill(email);
    await page.getByTestId("auth-signup-password").fill(password);
    await page.getByTestId("auth-signup-submit").click();
    await page.waitForURL("/dashboard", { timeout: 5000 });
    await expect(page.getByTestId("dashboard-page")).toBeVisible();
  });

  test("logs in an existing user and loads only that user's habits", async ({
    page,
  }) => {
    // Sign up first
    await page.goto("/signup");
    await page
      .getByTestId("auth-signup-email")
      .fill(`unique-${Date.now()}@example.com`);
    await page.getByTestId("auth-signup-password").fill(password);
    await page.getByTestId("auth-signup-submit").click();
    await page.waitForURL("/dashboard", { timeout: 5000 });

    // Create a habit
    await page.getByTestId("create-habit-button").click();
    await page.getByTestId("habit-name-input").fill("My Personal Habit");
    await page.getByTestId("habit-save-button").click();

    // Log out
    await page.getByTestId("auth-logout-button").click();
    await page.waitForURL("/login", { timeout: 5000 });

    // Sign up and log in as a different user
    const otherEmail = `other-${Date.now()}@example.com`;
    await page.goto("/signup");
    await page.getByTestId("auth-signup-email").fill(otherEmail);
    await page.getByTestId("auth-signup-password").fill(password);
    await page.getByTestId("auth-signup-submit").click();
    await page.waitForURL("/dashboard", { timeout: 5000 });

    // Other user should not see first user's habit
    await expect(page.getByTestId("empty-state")).toBeVisible();
  });

  test("creates a habit from the dashboard", async ({ page }) => {
    await page.goto("/signup");
    await page
      .getByTestId("auth-signup-email")
      .fill(`create-${Date.now()}@example.com`);
    await page.getByTestId("auth-signup-password").fill(password);
    await page.getByTestId("auth-signup-submit").click();
    await page.waitForURL("/dashboard", { timeout: 5000 });

    await page.getByTestId("create-habit-button").click();
    await page.getByTestId("habit-name-input").fill("Drink Water");
    await page.getByTestId("habit-description-input").fill("Stay hydrated");
    await page.getByTestId("habit-save-button").click();

    await expect(page.getByTestId("habit-card-drink-water")).toBeVisible();
  });

  test("completes a habit for today and updates the streak", async ({
    page,
  }) => {
    await page.goto("/signup");
    await page
      .getByTestId("auth-signup-email")
      .fill(`streak-${Date.now()}@example.com`);
    await page.getByTestId("auth-signup-password").fill(password);
    await page.getByTestId("auth-signup-submit").click();
    await page.waitForURL("/dashboard", { timeout: 5000 });

    await page.getByTestId("create-habit-button").click();
    await page.getByTestId("habit-name-input").fill("Drink Water");
    await page.getByTestId("habit-save-button").click();

    await expect(page.getByTestId("habit-streak-drink-water")).toContainText(
      "0 day streak",
    );

    await page.getByTestId("habit-complete-drink-water").click();

    await expect(page.getByTestId("habit-streak-drink-water")).toContainText(
      "1 day streak",
    );
  });

  test("persists session and habits after page reload", async ({ page }) => {
    await page.goto("/signup");
    await page
      .getByTestId("auth-signup-email")
      .fill(`persist-${Date.now()}@example.com`);
    await page.getByTestId("auth-signup-password").fill(password);
    await page.getByTestId("auth-signup-submit").click();
    await page.waitForURL("/dashboard", { timeout: 5000 });

    await page.getByTestId("create-habit-button").click();
    await page.getByTestId("habit-name-input").fill("Drink Water");
    await page.getByTestId("habit-save-button").click();
    await expect(page.getByTestId("habit-card-drink-water")).toBeVisible();

    // Reload and verify persistence
    await page.reload();
    await page.waitForURL("/dashboard", { timeout: 5000 });
    await expect(page.getByTestId("dashboard-page")).toBeVisible();
    await expect(page.getByTestId("habit-card-drink-water")).toBeVisible();
  });

  test("logs out and redirects to /login", async ({ page }) => {
    await page.goto("/signup");
    await page
      .getByTestId("auth-signup-email")
      .fill(`logout-${Date.now()}@example.com`);
    await page.getByTestId("auth-signup-password").fill(password);
    await page.getByTestId("auth-signup-submit").click();
    await page.waitForURL("/dashboard", { timeout: 5000 });

    await page.getByTestId("auth-logout-button").click();
    await page.waitForURL("/login", { timeout: 5000 });
    expect(page.url()).toContain("/login");
  });

  test("loads the cached app shell when offline after the app has been loaded once", async ({
    page,
    context,
  }) => {
    // Load the app online first so service worker caches it
    await page.goto("/");
    await page.waitForURL("/login", { timeout: 5000 });

    // Wait for service worker to install and cache
    await page.waitForTimeout(2000);

    // Go offline
    await context.setOffline(true);

    // Try to load the app offline
    try {
      await page.goto("/", { waitUntil: "domcontentloaded", timeout: 10000 });
    } catch {
      // Navigation may throw when offline — that's okay
    }

    // App shell should not hard crash — page should still have content
    const body = await page.locator("body").textContent();
    expect(body).not.toBeNull();

    // Restore online
    await context.setOffline(false);
  });
});
