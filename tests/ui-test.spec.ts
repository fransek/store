import { test, expect, Page } from "@playwright/test";

test("Counter", async ({ page }) => {
  const count = page.getByLabel("count", { exact: true });

  await page.goto("/counter");
  await page.getByRole("button", { name: "+" }).click();
  await expect(count).toHaveText("1");
  await page.getByRole("link", { name: "Demo" }).click();
  await page.getByRole("link", { name: "Counter", exact: true }).click();
  await expect(count).toHaveText("1");
  await page.getByRole("button", { name: "-" }).click();
  await expect(count).toHaveText("0");
});

test("Counter with context", async ({ page }) => {
  const count = page.getByLabel("count", { exact: true });

  await page.goto("/context");
  await page.getByRole("button", { name: "+" }).click();
  await expect(count).toHaveText("1");
  await page.getByRole("button", { name: "Reset" }).click();
  await expect(count).toHaveText("0");
});

test("Todo app", async ({ page }) => {
  const todo = page.getByTestId("todo-0");

  await page.goto("/todo");
  await page.getByLabel("Add a new todo").fill("Buy milk");
  await page.getByRole("button", { name: "Add" }).click();
  await expect(todo).toHaveText("Buy milk");
  await todo.click();
  await expect(todo).toHaveCSS("text-decoration", /line-through/);
});

test("Async", async ({ page }) => {
  const loadingText = page.getByText("Fetching posts...");
  const firstPostTitle = page.getByTestId("post-0-title");
  await mockPosts(page, [{ userId: 1, id: 1, title: "Post 1", body: "Body" }]);

  await page.goto("/async");
  await expect(loadingText).toBeVisible();
  await expect(firstPostTitle).toHaveText("Post 1");

  await mockPosts(page, [{ userId: 2, id: 2, title: "Post 2", body: "Body" }]);
  await page.getByRole("button", { name: "Refresh" }).click();
  await expect(loadingText).toBeVisible();
  await expect(firstPostTitle).toHaveText("Post 2");

  await page.getByRole("link", { name: "Demo" }).click();
  await page.getByRole("link", { name: "Async" }).click();
  await expect(loadingText).not.toBeVisible();
});

const mockPosts = async (
  page: Page,
  json: {
    userId: number;
    id: number;
    title: string;
    body: string;
  }[],
) => {
  await page.route(
    "https://jsonplaceholder.typicode.com/posts",
    async (route) => {
      await route.fulfill({ json });
    },
  );
};
