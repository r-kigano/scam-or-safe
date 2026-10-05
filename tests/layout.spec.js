// Phone-screen layout checks: nothing spills sideways, key buttons are reachable.
const { test, expect } = require('@playwright/test');
const { QUESTIONS, openApp, startGame, answer, playThrough } = require('./helpers');

async function expectNoHorizontalScroll(page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow, 'page is wider than the screen').toBeLessThanOrEqual(1);
}

async function expectInViewport(page, selector) {
  const box = await page.locator(selector).boundingBox();
  const vp = page.viewportSize();
  expect(box, `${selector} not rendered`).not.toBeNull();
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(vp.width + 1);
  expect(box.y + box.height, `${selector} is below the fold`).toBeLessThanOrEqual(vp.height + 1);
}

test.beforeEach(async ({ page }) => {
  await openApp(page);
});

test('intro fits the screen width', async ({ page }) => {
  await expectNoHorizontalScroll(page);
  await page.screenshot({ path: test.info().outputPath('intro.png'), fullPage: true });
});

test('answer buttons are visible without scrolling, even on the longest question', async ({ page }) => {
  const longest = QUESTIONS.reduce((a, q, i) => (q.text.length > QUESTIONS[a].text.length ? i : a), 0);
  await startGame(page, 17);
  await playThrough(page, longest);
  await expect(page.locator('.scenario-text')).toHaveText(QUESTIONS[longest].text);
  await expectNoHorizontalScroll(page);
  await expectInViewport(page, '#answer-safe');
  await expectInViewport(page, '#answer-scam');
  await page.screenshot({ path: test.info().outputPath('longest-question.png') });
});

test('feedback overlay Continue button is reachable, even with the longest tip', async ({ page }) => {
  const longest = QUESTIONS.reduce((a, q, i) => (q.tip.length > QUESTIONS[a].tip.length ? i : a), 0);
  await startGame(page, 17);
  await playThrough(page, longest);
  await answer(page, !QUESTIONS[longest].isScam);
  await expectInViewport(page, '#continue-btn');
  await page.screenshot({ path: test.info().outputPath('longest-tip.png') });
});

test('result and review screens fit the screen width', async ({ page }) => {
  await startGame(page);
  await page.clock.runFor(301_000);
  await expectNoHorizontalScroll(page);
  await expectInViewport(page, '#again-btn');
  await page.locator('#review-btn').click();
  await expectNoHorizontalScroll(page);
});
