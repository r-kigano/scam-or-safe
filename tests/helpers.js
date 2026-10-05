const fs = require('fs');
const path = require('path');

const WWW = path.join(__dirname, '..', 'www');
const APP_URL = '/';

// Pull the QUESTIONS array out of app.js so tests always match the real content.
function loadQuestions() {
  const src = fs.readFileSync(path.join(WWW, 'app.js'), 'utf8');
  const match = src.match(/const QUESTIONS = (\[[\s\S]*?\n  \]);/);
  if (!match) throw new Error('Could not find QUESTIONS array in www/app.js');
  return new Function(`return ${match[1]};`)();
}

const QUESTIONS = loadQuestions();

// Opens the app with a fake clock so timers only move when a test says so.
async function openApp(page) {
  const t0 = new Date('2026-01-01T00:00:00Z');
  await page.clock.install({ time: t0 });
  await page.goto(APP_URL);
  // Skip pop-in/confetti animations so clicks don't wait on them (slow in WebKit on Windows).
  await page.addStyleTag({ content: '*, *::before, *::after { animation: none !important; transition: none !important; }' });
  // An installed clock still ticks in real time; pause it so nothing moves until runFor().
  await page.clock.pauseAt(new Date(t0.getTime() + 60_000));
}

async function startGame(page, minutes = 5) {
  await page.getByRole('button', { name: `${minutes} minutes` }).click();
  await page.locator('.screen.playing').waitFor();
}

async function answer(page, isScam) {
  await page.locator(isScam ? '#answer-scam' : '#answer-safe').click();
}

// Answers questions 0..count-1 (correctly, unless wrongAt includes the index) and continues past each.
// Clicks run inside the page: simulated taps cost ~0.5s each in WebKit on Windows, too slow for 200 questions.
async function playThrough(page, count, { wrongAt = [] } = {}) {
  const answers = QUESTIONS.slice(0, count).map((q, i) => (wrongAt.includes(i) ? !q.isScam : q.isScam));
  await page.evaluate((answers) => {
    for (const isScam of answers) {
      document.getElementById(isScam ? 'answer-scam' : 'answer-safe').click();
      document.getElementById('continue-btn').click();
    }
  }, answers);
}

async function currentQuestionIndex(page) {
  const text = await page.locator('.q-count').innerText();
  return parseInt(text.match(/Q(\d+)/)[1], 10) - 1;
}

module.exports = { APP_URL, QUESTIONS, openApp, startGame, answer, playThrough, currentQuestionIndex };
