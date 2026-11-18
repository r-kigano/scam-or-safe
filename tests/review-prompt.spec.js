const { test, expect } = require('@playwright/test');
const { openApp, startGame, playThrough } = require('./helpers');

// Pretend to be the installed app: a fake Capacitor bridge that records rating requests.
async function openAsInstalledApp(page) {
  await page.addInitScript(() => {
    window.__reviewCalls = [];
    window.Capacitor = {
      getPlatform: () => 'ios',
      nativePromise: (plugin, method) => {
        window.__reviewCalls.push(`${plugin}.${method}`);
        return Promise.resolve();
      }
    };
  });
  await openApp(page);
}

const reviewCalls = (page) => page.evaluate(() => window.__reviewCalls);

// Answers `count` questions (wrong where listed), then lets the 5-minute clock run out.
async function finishRun(page, count, wrongAt = []) {
  await startGame(page);
  await playThrough(page, count, { wrongAt });
  await page.clock.runFor(301_000);
  await expect(page.locator('.result-kicker')).toHaveText("Time's up");
}

test('a good run asks for a rating once, shortly after the score appears', async ({ page }) => {
  await openAsInstalledApp(page);
  await finishRun(page, 6, [5]); // 5 of 6 right
  expect(await reviewCalls(page)).toEqual([]);
  await page.clock.runFor(1_600);
  expect(await reviewCalls(page)).toEqual(['InAppReview.requestReview']);
});

test('a weak run does not ask for a rating', async ({ page }) => {
  await openAsInstalledApp(page);
  await finishRun(page, 6, [0, 1, 2]); // 3 of 6 right
  await page.clock.runFor(5_000);
  expect(await reviewCalls(page)).toEqual([]);
});

test('too few answers does not ask for a rating, even if all are right', async ({ page }) => {
  await openAsInstalledApp(page);
  await finishRun(page, 4);
  await page.clock.runFor(5_000);
  expect(await reviewCalls(page)).toEqual([]);
});

test('only asks once per launch, and not again when coming back from Review', async ({ page }) => {
  await openAsInstalledApp(page);
  await finishRun(page, 6);
  await page.clock.runFor(1_600);
  await page.locator('#review-btn').click();
  await page.locator('#review-back-btn').click();
  await page.locator('#again-btn').click();
  await finishRun(page, 6);
  await page.clock.runFor(5_000);
  expect(await reviewCalls(page)).toEqual(['InAppReview.requestReview']);
});

test('in a normal browser (no app bridge) a good run finishes without errors', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await openApp(page);
  await finishRun(page, 6);
  await page.clock.runFor(5_000);
  await expect(page.locator('#again-btn')).toBeVisible();
  expect(errors).toEqual([]);
});
