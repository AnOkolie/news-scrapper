import { chromium } from "playwright";
import { expect } from "playwright/test";
import { textAnalysis } from "./analysis/text_analysis.js";

async function sortHackerNewsArticles() {
  const startTime = performance.now();
  // launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // go to Hacker News
  await page.goto("https://news.ycombinator.com/newest");
  await expect(page).toHaveURL("https://news.ycombinator.com/newest");

  let size = 0;
  const MAX_SIZE = 100;
  //store dates
  let dates = [];
  let articles = [];

  while (size < 100) {
    await expect(page.locator(".athing").first()).toBeVisible();
    await page.waitForSelector(".athing.submission", { timeout: 5000 });
    let stories = await page.locator(".athing.submission");

    let count = await stories.count();
    const firstBefore = await stories.first().textContent();

    //iterate through the articles on the current page and extract information
    for (let i = 0; i < count && size + i < MAX_SIZE; i++) {
      const story = stories.nth(i);
      //retreieve the url for that news feed
      let url = await story
        .locator(".titleline > a")
        .first()
        .getAttribute("href");
      //retrireve the browser title
      let title =
        (await story.locator(".titleline > a").first().textContent()) ||
        "NO_TITLE";
      //returns the timestamp for that entry
      const age = await story.locator("+ tr span.age").getAttribute("title");

      if (!title || !url || !age) {
        await page.screenshot({ path: `error-${Date.now()}.png` });
        throw new Error("Missing article data detected");
      }
      expect(url).not.toBeNull();
      expect(age).not.toBeNull();
      expect(title).not.toBeNull();

      articles.push({ title, url, age });
      //Store timestamps as dates, to make comparison easier
      //split on the space character to preserve the validity of the timestamp
      const date = new Date(age.split(" ")[0]);
      dates.push(date);
      //verifies that the articles are sorted
      if (dates.length > 1) {
        expect(dates[dates.length - 1].getTime()).toBeLessThanOrEqual(
          dates[dates.length - 2].getTime(),
        );
      }
    }
    size += count;
    await page.locator("a.morelink").click();
    const newFirst = await page
      .locator(".athing.submission")
      .first()
      .textContent();
    expect(newFirst).not.toBe(firstBefore);
  }
  //verify that 100 articles were viewed before we close
  expect(articles.length).toBeGreaterThanOrEqual(100);
  // close browser
  await browser.close();
  await textAnalysis(articles);

  const endTime = performance.now();
  console.log(`Elapsed time: ${endTime - startTime}ms`);
}

(async () => {
  await sortHackerNewsArticles();
})();
