const { test, expect } = require('@playwright/test');
const { QUESTIONS, openApp, startGame, answer, playThrough, currentQuestionIndex } = require('./helpers');

test.beforeEach(async ({ page }) => {
  await openApp(page);
});

test('intro shows title, question count and four time limits', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Scam or Safe?' })).toBeVisible();
  await expect(page.locator('.lede')).toContainText(`${QUESTIONS.length} real-life moments`);
  for (const m of [5, 9, 13, 17]) {
    await expect(page.getByRole('button', { name: `${m} minutes` })).toBeVisible();
  }
});

for (const [minutes, label] of [[5, '5:00'], [9, '9:00'], [13, '13:00'], [17, '17:00']]) {
  test(`starting with ${minutes} minutes shows Q1 and a ${label} timer`, async ({ page }) => {
    await startGame(page, minutes);
    await expect(page.locator('.q-count')).toHaveText(`Q1 / ${QUESTIONS.length}`);
    await expect(page.locator('.timer')).toHaveText(label);
    await expect(page.locator('.scenario-text')).toHaveText(QUESTIONS[0].text);
  });
}

test('correct answer shows CORRECT, the tip, and locks the answer buttons', async ({ page }) => {
  await startGame(page);
  await answer(page, QUESTIONS[0].isScam);
  await expect(page.locator('.overlay-correct .overlay-title')).toHaveText('CORRECT');
  await expect(page.locator('.overlay-tip')).toHaveText(QUESTIONS[0].tip);
  await expect(page.locator('#answer-safe')).toBeDisabled();
  await expect(page.locator('#answer-scam')).toBeDisabled();
});

test('wrong answer shows NOT QUITE and the tip', async ({ page }) => {
  await startGame(page);
  await answer(page, !QUESTIONS[0].isScam);
  await expect(page.locator('.overlay-wrong .overlay-title')).toHaveText('NOT QUITE');
  await expect(page.locator('.overlay-tip')).toHaveText(QUESTIONS[0].tip);
});

test('Continue button moves to the next question and fills the progress bar', async ({ page }) => {
  await startGame(page);
  await answer(page, QUESTIONS[0].isScam);
  await page.locator('#continue-btn').click();
  await expect(page.locator('.q-count')).toHaveText(`Q2 / ${QUESTIONS.length}`);
  await expect(page.locator('.scenario-text')).toHaveText(QUESTIONS[1].text);
  await expect(page.locator('.progress-cell.correct')).toHaveCount(1);
  await expect(page.locator('.overlay')).toHaveCount(0);
});

test('feedback auto-continues after 15 seconds', async ({ page }) => {
  await startGame(page);
  await answer(page, QUESTIONS[0].isScam);
  await page.clock.runFor(14_000);
  await expect(page.locator('.q-count')).toHaveText(`Q1 / ${QUESTIONS.length}`);
  await page.clock.runFor(1_500);
  await expect(page.locator('.q-count')).toHaveText(`Q2 / ${QUESTIONS.length}`);
});

test('timer counts down while playing and pauses during feedback', async ({ page }) => {
  await startGame(page);
  await page.clock.runFor(10_000);
  await expect(page.locator('.timer')).toHaveText('4:50');
  await answer(page, QUESTIONS[0].isScam);
  await page.clock.runFor(10_000);
  await expect(page.locator('.timer')).toHaveText('4:50');
});

test('timer turns accent colour in the last 30 seconds', async ({ page }) => {
  await startGame(page);
  const normal = await page.locator('.timer').evaluate(el => getComputedStyle(el).color);
  await page.clock.runFor(271_000);
  await expect(page.locator('.timer')).toHaveText('0:29');
  const warning = await page.locator('.timer').evaluate(el => getComputedStyle(el).color);
  expect(warning).not.toBe(normal);
});

test("running out of time shows Time's up and the score so far", async ({ page }) => {
  await startGame(page);
  await answer(page, QUESTIONS[0].isScam);
  await page.locator('#continue-btn').click();
  await page.clock.runFor(301_000);
  await expect(page.locator('.result-kicker')).toHaveText("Time's up");
  await expect(page.locator('.result-score')).toHaveText(`1/${QUESTIONS.length}`);
  await expect(page.locator('.result-tier')).toHaveText('Watch out');
});

test("running out of time on the last question still says Time's up", async ({ page }) => {
  await startGame(page);
  await playThrough(page, QUESTIONS.length - 1);
  expect(await currentQuestionIndex(page)).toBe(QUESTIONS.length - 1);
  await page.clock.runFor(301_000);
  await expect(page.locator('.result-kicker')).toHaveText("Time's up");
  await expect(page.locator('.result-score')).toHaveText(`${QUESTIONS.length - 1}/${QUESTIONS.length}`);
});

test('confetti shows normally but is hidden when the phone has Reduce Motion on', async ({ page }) => {
  await startGame(page);
  await answer(page, QUESTIONS[0].isScam);
  await expect(page.locator('.confetti').first()).toBeVisible();

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.confetti').first()).toBeHidden();
  await expect(page.locator('.overlay-title')).toHaveText('CORRECT');
});

test('review lists correct, missed and unreached questions', async ({ page }) => {
  await startGame(page);
  await answer(page, QUESTIONS[0].isScam);      // correct
  await page.locator('#continue-btn').click();
  await answer(page, !QUESTIONS[1].isScam);     // wrong
  await page.locator('#continue-btn').click();
  await page.clock.runFor(301_000);             // time runs out

  await page.locator('#review-btn').click();
  await expect(page.locator('.review-item')).toHaveCount(QUESTIONS.length);
  await expect(page.locator('.review-correct')).toHaveCount(1);
  await expect(page.locator('.review-wrong')).toHaveCount(1);
  await expect(page.locator('.review-unreached')).toHaveCount(QUESTIONS.length - 2);
  await expect(page.locator('.review-unreached').first()).toContainText('Not reached');

  await page.locator('#review-back-btn').click();
  await expect(page.locator('.result-score')).toBeVisible();
});

test('Play again returns to the intro and a fresh game starts at Q1 with score 0', async ({ page }) => {
  await startGame(page);
  await answer(page, QUESTIONS[0].isScam);
  await page.locator('#continue-btn').click();
  await page.clock.runFor(301_000);
  await page.locator('#again-btn').click();
  await expect(page.getByRole('heading', { name: 'Scam or Safe?' })).toBeVisible();

  await startGame(page);
  await expect(page.locator('.q-count')).toHaveText(`Q1 / ${QUESTIONS.length}`);
  await expect(page.locator('.timer')).toHaveText('5:00');
  await expect(page.locator('.progress-cell.correct, .progress-cell.wrong')).toHaveCount(0);
});

test('double-tapping an answer only counts once', async ({ page }) => {
  await startGame(page);
  const btn = page.locator(QUESTIONS[0].isScam ? '#answer-scam' : '#answer-safe');
  await btn.click();
  await btn.click({ force: true });
  await page.locator('#continue-btn').click();
  await expect(page.locator('.progress-cell.correct')).toHaveCount(1);
  await expect(page.locator('.q-count')).toHaveText(`Q2 / ${QUESTIONS.length}`);
});

test('a perfect run through all questions scores full marks', async ({ page }) => {
  await startGame(page, 17);
  await playThrough(page, QUESTIONS.length - 1);
  expect(await currentQuestionIndex(page)).toBe(QUESTIONS.length - 1);
  await answer(page, QUESTIONS[QUESTIONS.length - 1].isScam);
  await page.locator('#continue-btn').click();
  await expect(page.locator('.result-kicker')).toHaveText('Run complete');
  await expect(page.locator('.result-score')).toHaveText(`${QUESTIONS.length}/${QUESTIONS.length}`);
  await expect(page.locator('.result-tier')).toHaveText('Cyber sentinel');
});

test.describe('Android Back button (MainActivity calls window.scamOrSafeBack)', () => {
  // Returns what the game tells Android: true = handled (app stays open), false = close the app.
  const pressBack = (page) => page.evaluate(() => window.scamOrSafeBack());

  test('on the start screen, Back lets Android close the app', async ({ page }) => {
    expect(await pressBack(page)).toBe(false);
  });

  test('mid-game, Back asks first; Cancel keeps playing (and asks again next time)', async ({ page }) => {
    await startGame(page);
    await answer(page, QUESTIONS[0].isScam);
    await page.locator('#continue-btn').click();
    const dialogs = [];
    page.on('dialog', (d) => { dialogs.push(d.message()); d.dismiss(); });
    expect(await pressBack(page)).toBe(true);
    expect(dialogs[0]).toContain('Leave this game?');
    await expect(page.locator('.q-count')).toHaveText(`Q2 / ${QUESTIONS.length}`);
    expect(await pressBack(page)).toBe(true);
    expect(dialogs).toHaveLength(2);
    await expect(page.locator('.q-count')).toHaveText(`Q2 / ${QUESTIONS.length}`);
  });

  test('Back on the CORRECT / NOT QUITE screen also asks first', async ({ page }) => {
    await startGame(page);
    await answer(page, QUESTIONS[0].isScam);
    const dialogs = [];
    page.once('dialog', (d) => { dialogs.push(d.message()); d.dismiss(); });
    expect(await pressBack(page)).toBe(true);
    expect(dialogs).toHaveLength(1);
    await expect(page.locator('.overlay-title')).toHaveText('CORRECT');
  });

  test('mid-game, Back then OK returns to the start screen and stops the timer', async ({ page }) => {
    await startGame(page);
    page.once('dialog', (d) => d.accept());
    expect(await pressBack(page)).toBe(true);
    await expect(page.getByRole('heading', { name: 'Scam or Safe?' })).toBeVisible();
    await page.clock.runFor(10_000);
    await expect(page.getByRole('heading', { name: 'Scam or Safe?' })).toBeVisible();
    expect(await pressBack(page)).toBe(false);
  });

  test('Back from Review goes to results, then to the start screen, then closes', async ({ page }) => {
    await startGame(page);
    await page.clock.runFor(301_000);
    await page.locator('#review-btn').click();
    expect(await pressBack(page)).toBe(true);
    await expect(page.locator('.result-score')).toBeVisible();
    expect(await pressBack(page)).toBe(true);
    await expect(page.getByRole('heading', { name: 'Scam or Safe?' })).toBeVisible();
    expect(await pressBack(page)).toBe(false);
  });
});
