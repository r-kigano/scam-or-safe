(() => {
  'use strict';

  const CONFIG = { timerSeconds: 420, hardcoreMode: false, showTips: true };

  const QUESTIONS = [
    { text: "A text says you've won a $500 gift card — just click the link to claim it.", isScam: true, tip: "Prize texts from strangers are almost always scams." },
    { text: "Your bank's official app asks you to confirm a purchase you actually made.", isScam: false, tip: "Confirming a real transaction in your own banking app is normal." },
    { text: "Someone calls claiming to be tech support and asks to install remote-access software you didn't request.", isScam: true, tip: "Unsolicited remote-access requests are a classic takeover scam." },
    { text: "You turn on two-factor authentication for your email account.", isScam: false, tip: "Two-factor authentication makes accounts much harder to break into." },
    { text: "An email says your package is delayed and demands a small fee to release it.", isScam: true, tip: "Surprise 'release fees' for packages are a common phishing trick." },
    { text: "You notice a small padlock icon next to a shopping site's address before entering your card number.", isScam: false, tip: "A padlock means the connection is encrypted — a good sign, not a guarantee." },
    { text: "Your 'grandchild' calls in distress, asking you to buy gift cards to help them right now.", isScam: true, tip: "Urgent gift-card requests are one of the most common scams targeting families." },
    { text: "You use a different, strong password for every account.", isScam: false, tip: "Unique passwords stop one leak from unlocking everything else." },
    { text: "A caller says they're from the fraud department and asks you to read them your one-time passcode.", isScam: true, tip: "Real banks never ask you to read back a one-time code." },
    { text: "A pop-up shouts that your computer is infected and gives a number to call immediately.", isScam: true, tip: "Scare-tactic virus pop-ups exist to get you to call a fake support line." },
    { text: "Your phone's own settings app shows a normal software update is available.", isScam: false, tip: "Updates from your device's real settings app are safe and important." },
    { text: "An online seller insists you can only pay them using gift cards.", isScam: true, tip: "Legitimate sellers never require payment only in gift cards." },
    { text: "An email from a coworker's real address feels off and urgently asks for a wire transfer.", isScam: true, tip: "A hacked account can send urgent messages — verify by another channel." },
    { text: "You lock your phone with a passcode or fingerprint.", isScam: false, tip: "A locked phone protects everything if it's lost or stolen." },
    { text: "A message says your account will be closed in 24 hours unless you 'verify' by clicking now.", isScam: true, tip: "Manufactured urgency is a pressure tactic, not a real deadline." },
    { text: "You check that a checkout page's address starts with https before entering payment details.", isScam: false, tip: "https means the connection is encrypted — a helpful, if imperfect, check." },
    { text: "A new online match asks for your Social Security number to 'verify you're real.'", isScam: true, tip: "No legitimate verification needs your Social Security number." },
    { text: "You back up your photos and files regularly.", isScam: false, tip: "Backups mean a scam or crash can't cost you your memories." },
    { text: "A brand-new profile with no mutual friends messages you about a hot investment opportunity.", isScam: true, tip: "New profiles pushing investments are a well-known scam pattern." },
    { text: "You get a receipt email for a purchase you actually remember making.", isScam: false, tip: "A receipt matching a purchase you made is expected, not suspicious." },
    { text: "A caller says they're from Medicare and needs your Medicare number to send a 'new' card.", isScam: true, tip: "Medicare never cold-calls for your number — hang up and call them back directly." },
    { text: "You get a login alert from your email provider for a sign-in from a country you've never visited.", isScam: false, tip: "The alert itself is a safety feature — but change your password immediately if the sign-in wasn't you." },
    { text: "A QR code taped over a parking meter's real one leads to a payment site when scanned.", isScam: true, tip: "'QR-jacking' swaps a real code for a fake one — check the URL before paying." },
    { text: "A recruiter offers you a job after one text exchange and asks you to buy your own laptop via a link they send.", isScam: true, tip: "Real employers never make new hires front equipment costs through a personal link." },
    { text: "Your company's IT department emails a scheduled maintenance notice from the same internal address they always use.", isScam: false, tip: "A routine notice from a verified, familiar internal sender is normal — no links or urgency needed to trust it." },
    { text: "A Discord DM says you've won free Nitro — just log in through this link to claim it.", isScam: true, tip: "Fake Nitro gift links steal your Discord login, they don't give you free perks." },
    { text: "Your parent's phone shows a normal app-update notification from the official App Store.", isScam: false, tip: "Updates through the official app store are legitimate and routine." },
    { text: "A Roblox trader offers rare items for nothing in return, then asks you to 'confirm' on an outside website.", isScam: true, tip: "Off-platform 'confirmation' sites exist to steal your account, not give you free items." },
    { text: "A classmate shares a study guide link in the group chat, hosted right on your school's real portal.", isScam: false, tip: "A link to your school's own verified portal, shared by someone you know, is normal." },
    { text: "An Instagram 'modeling scout' account with barely any followers DMs you asking for your address and photos right away.", isScam: true, tip: "Real agencies don't recruit through cold DMs asking for personal info upfront." },
    { text: "A new game lets you log in with your existing Google account instead of creating a new password.", isScam: false, tip: "Using a trusted 'Sign in with Google' option is safer than creating a new password on every site." },
    { text: "Someone in a game lobby claims to be 'friends with the developer' and offers to double your in-game currency if you send yours first.", isScam: true, tip: "No one can legitimately double in-game currency — it's a bait-and-switch every time." },
    { text: "A text claims to be from your school's attendance office, asking you to click a link to 'confirm an absence.'", isScam: true, tip: "Schools verify absences through parents or official portals, not surprise text links." },
    { text: "Your streaming account texts you a code when you log in from a new device.", isScam: false, tip: "That's normal two-factor verification working as intended." },
    { text: "A friend messages from their real account asking you to buy them a gift card because their card isn't working right now.", isScam: true, tip: "Hacked accounts often beg for gift cards — call or video the person to confirm it's really them." },
    { text: "An ad promises instant followers if you just enter your Instagram username and password on their site.", isScam: true, tip: "No legitimate service ever needs your real password to boost followers — that's straight-up account theft." },
    { text: "A YouTuber you already follow announces a giveaway on their verified channel, no entry fee required.", isScam: false, tip: "Real giveaways from a channel you already trust don't ask you to pay to enter." },
    { text: "A pop-up in a mobile game says you're the '1000th visitor' and offers a free skin if you enter your Apple ID password.", isScam: true, tip: "'Congratulations' pop-ups asking for account passwords are a classic phishing trap." },
    { text: "A part-time job posting asks you to deposit a check they send you, then wire back the 'extra' amount.", isScam: true, tip: "Fake-check-then-wire-back scams are one of the most common job scams targeting teens." },
    { text: "Your school issues a Chromebook with the district's monitoring software already installed.", isScam: false, tip: "School-managed devices having district software is expected, not a hack." },
    { text: "Someone on a friend-finder app says they love you after one day of chatting, then asks for money for an emergency.", isScam: true, tip: "Fast declarations of love followed by money requests are the hallmark of a romance scam." },
    { text: "A login code arrives by text right after you tried signing into your own account.", isScam: false, tip: "A code appearing right after you request one is expected — just never share it with anyone else." },
    { text: "Someone claiming to be from your bank's teen debit card program calls and asks you to read back the code they just texted you.", isScam: true, tip: "No real bank employee ever needs the one-time code you were just sent." },
    { text: "A scholarship email addresses you by name, references the actual school you applied to, and links to that school's official .edu portal.", isScam: false, tip: "An email that matches your real application and points to an official school domain is legitimate." },
    { text: "A verified celebrity account replies to your comment and asks you to DM them for a 'surprise,' then requests gift cards.", isScam: true, tip: "Real celebrities with millions of followers don't DM random commenters — this is impersonation." }
  ];

  const CONFETTI = [
    { top: '14%', left: '18%', size: 14, dark: false, dur: 1.1, delay: .05 },
    { top: '10%', left: '38%', size: 10, dark: true, dur: 1.3, delay: .2 },
    { top: '16%', left: '58%', size: 12, dark: false, dur: 1.0, delay: .1 },
    { top: '8%', left: '76%', size: 9, dark: true, dur: 1.4, delay: .3 },
    { top: '18%', left: '88%', size: 13, dark: false, dur: 1.15, delay: .15 },
    { top: '6%', left: '8%', size: 11, dark: true, dur: 1.25, delay: .25 }
  ];

  const app = document.getElementById('app');

  const state = {
    screen: 'intro',
    qIndex: 0,
    score: 0,
    timeLeft: CONFIG.timerSeconds,
    feedback: null,
    locked: false,
    results: []
  };

  let timerId = null;

  function start() {
    clearInterval(timerId);
    Object.assign(state, {
      screen: 'playing', qIndex: 0, score: 0,
      timeLeft: CONFIG.timerSeconds, feedback: null, locked: false, results: []
    });
    timerId = setInterval(() => {
      if (state.timeLeft <= 1) {
        clearInterval(timerId);
        state.timeLeft = 0;
        state.screen = 'result';
      } else {
        state.timeLeft -= 1;
      }
      render();
    }, 1000);
    render();
  }

  function answer(guessScam) {
    if (state.locked || state.screen !== 'playing') return;
    const q = QUESTIONS[state.qIndex];
    const correct = q.isScam === guessScam;
    state.locked = true;
    state.feedback = correct ? 'correct' : 'wrong';
    if (correct) state.score += 1;
    state.results.push(correct);
    render();

    setTimeout(() => {
      if (!correct && CONFIG.hardcoreMode) {
        clearInterval(timerId);
        state.screen = 'result';
        render();
        return;
      }
      const nextIndex = state.qIndex + 1;
      if (nextIndex >= QUESTIONS.length) {
        clearInterval(timerId);
        state.screen = 'result';
      } else {
        state.qIndex = nextIndex;
        state.feedback = null;
        state.locked = false;
      }
      render();
    }, 1600);
  }

  function svgIcon(name) {
    switch (name) {
      case 'shield':
        return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" style="flex:none;margin-top:2px"><path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6l8-4z" stroke="var(--color-accent)" stroke-width="1.8" stroke-linejoin="round"></path></svg>';
      case 'bars':
        return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" style="flex:none;margin-top:2px"><rect x="4" y="10" width="16" height="11" stroke="var(--color-accent)" stroke-width="1.8"></rect><path d="M8 10V7a4 4 0 018 0v3" stroke="var(--color-accent)" stroke-width="1.8"></path></svg>';
      case 'clock':
        return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" style="flex:none;margin-top:2px"><circle cx="12" cy="12" r="9" stroke="var(--color-accent)" stroke-width="1.8"></circle><path d="M12 7v5l4 2" stroke="var(--color-accent)" stroke-width="1.8" stroke-linecap="round"></path></svg>';
      case 'arrow':
        return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
      case 'lock':
        return '<svg width="46" height="46" viewBox="0 0 24 24" fill="none" class="spin-icon"><circle cx="12" cy="12" r="9" stroke="var(--color-bg)" stroke-width="1.6"></circle><path d="M3 12h18M12 3v18M5.5 5.5l13 13M18.5 5.5l-13 13" stroke="var(--color-bg)" stroke-width="1.2"></path></svg>';
      default:
        return '';
    }
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function renderIntro() {
    const minutes = Math.round(CONFIG.timerSeconds / 60);
    return `
      <div class="screen intro">
        <div class="intro-body">
          <div class="eyebrow">Cybersecurity training game</div>
          <h1>Scam or Safe?</h1>
          <p class="lede">${QUESTIONS.length} real-life moments. Read each one and decide fast — is it safe, or a scam?</p>
          <hr class="hr">
          <div class="rules">
            <div class="rule">${svgIcon('shield')}<div class="rule-text"><strong>Get it right</strong> — the disco lights come on.</div></div>
            <div class="rule">${svgIcon('bars')}<div class="rule-text"><strong>Get it wrong</strong> — you're doing time behind bars.</div></div>
            <div class="rule">${svgIcon('clock')}<div class="rule-text"><strong>${minutes} minutes on the clock</strong> for all ${QUESTIONS.length} scenarios.</div></div>
          </div>
        </div>
        <button class="btn btn-primary btn-block" style="min-height:54px;font-size:15px;margin-top:20px" id="start-btn">Start the run →</button>
      </div>`;
  }

  function renderPlaying() {
    const q = QUESTIONS[state.qIndex];
    const mm = Math.floor(state.timeLeft / 60);
    const ss = String(state.timeLeft % 60).padStart(2, '0');
    const timeColor = state.timeLeft <= 30 ? 'var(--color-accent)' : 'var(--color-text)';

    const cells = QUESTIONS.map((_, i) => {
      let cls = 'progress-cell';
      if (i < state.results.length) cls += state.results[i] ? ' correct' : ' wrong';
      return `<div class="${cls}"></div>`;
    }).join('');

    let overlay = '';
    if (state.feedback === 'wrong') {
      const bars = Array.from({ length: 7 }).map((_, i) =>
        `<div class="jail-bar" style="animation-delay:${(i * 0.04).toFixed(2)}s"></div>`
      ).join('');
      overlay = `
        <div class="overlay overlay-wrong">
          <div class="jail-bars">${bars}</div>
          <div class="overlay-content">
            <div class="overlay-title">BUSTED</div>
            <div class="overlay-divider"></div>
            ${CONFIG.showTips ? `<div class="overlay-tip">${escapeHtml(q.tip)}</div>` : ''}
          </div>
        </div>`;
    } else if (state.feedback === 'correct') {
      const confetti = CONFETTI.map(c =>
        `<div class="confetti" style="top:${c.top};left:${c.left};width:${c.size}px;height:${c.size}px;background:${c.dark ? 'var(--color-neutral-900)' : 'var(--color-bg)'};animation-duration:${c.dur}s;animation-delay:${c.delay}s"></div>`
      ).join('');
      overlay = `
        <div class="overlay overlay-correct">
          ${confetti}
          <div class="overlay-content">
            ${svgIcon('lock')}
            <div class="overlay-title">CORRECT</div>
            ${CONFIG.showTips ? `<div class="overlay-tip">${escapeHtml(q.tip)}</div>` : ''}
          </div>
        </div>`;
    }

    return `
      <div class="screen playing">
        <div class="play-header">
          <div class="q-count">Q${state.qIndex + 1} / ${QUESTIONS.length}</div>
          <div class="timer" style="color:${timeColor}">${mm}:${ss}</div>
        </div>
        <div class="progress" style="grid-template-columns:repeat(${QUESTIONS.length},1fr)">${cells}</div>

        <div class="card elev-sm scenario-card">
          <div class="card-kicker">Scenario</div>
          <p class="scenario-text">${escapeHtml(q.text)}</p>
        </div>

        <div class="answers">
          <button class="btn btn-secondary btn-block" id="answer-safe" ${state.locked ? 'disabled' : ''}>
            Looks safe ${svgIcon('arrow')}
          </button>
          <button class="btn btn-secondary btn-block" id="answer-scam" ${state.locked ? 'disabled' : ''}>
            It's a scam ${svgIcon('arrow')}
          </button>
        </div>

        ${overlay}
      </div>`;
  }

  function renderResult() {
    const finalScore = state.score;
    let tierLabel = 'Watch out';
    let resultCopy = "Scammers count on quick, distracted taps. Slow down next time and you'll spot them.";
    const total = QUESTIONS.length;
    if (finalScore >= Math.round(total * 0.9)) { tierLabel = 'Cyber sentinel'; resultCopy = 'Sharp eyes. You caught almost every trick in the book.'; }
    else if (finalScore >= Math.round(total * 0.7)) { tierLabel = 'Sharp eye'; resultCopy = 'Solid instincts — a few tricks still slipped past.'; }
    else if (finalScore >= Math.round(total * 0.4)) { tierLabel = 'Getting there'; resultCopy = 'Good start. Review the tips and run it again.'; }

    const resultKicker = state.timeLeft === 0 && state.qIndex < total - 1 ? "Time's up" : 'Run complete';

    return `
      <div class="screen result">
        <div class="result-kicker">${resultKicker}</div>
        <div class="result-score">${finalScore}<span class="of">/${total}</span></div>
        <div class="tag tag-accent result-tier">${tierLabel}</div>
        <p class="result-copy">${resultCopy}</p>
        <hr class="hr" style="margin:10px 0">
        <button class="btn btn-primary btn-block" style="min-height:54px;font-size:15px;justify-content:center" id="again-btn">Play again</button>
      </div>`;
  }

  function render() {
    let html;
    if (state.screen === 'intro') html = renderIntro();
    else if (state.screen === 'playing') html = renderPlaying();
    else html = renderResult();

    app.innerHTML = html;

    const startBtn = document.getElementById('start-btn');
    if (startBtn) startBtn.addEventListener('click', start);

    const safeBtn = document.getElementById('answer-safe');
    if (safeBtn) safeBtn.addEventListener('click', () => answer(false));

    const scamBtn = document.getElementById('answer-scam');
    if (scamBtn) scamBtn.addEventListener('click', () => answer(true));

    const againBtn = document.getElementById('again-btn');
    if (againBtn) againBtn.addEventListener('click', start);
  }

  render();
})();
