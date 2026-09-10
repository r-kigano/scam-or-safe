(() => {
  'use strict';

  const CONFIG = { timerSeconds: 420, hardcoreMode: false, showTips: true };

  const TIME_OPTIONS = [
    { minutes: 5, seconds: 300 },
    { minutes: 9, seconds: 540 },
    { minutes: 13, seconds: 780 },
    { minutes: 17, seconds: 1020 }
  ];

  const FEEDBACK_SECONDS = 15;

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
    { text: "A verified celebrity account replies to your comment and asks you to DM them for a 'surprise,' then requests gift cards.", isScam: true, tip: "Real celebrities with millions of followers don't DM random commenters — this is impersonation." },
    { text: "Your bank sends a one-time code by text and reminds you never to share it, even with the bank itself.", isScam: false, tip: "Legitimate one-time codes are only ever entered by you, never read aloud to anyone." },
    { text: "A text claims you have an unpaid toll and threatens late fees unless you pay right now through a link.", isScam: true, tip: "'Unpaid toll' texts with urgent links are one of the most common smishing scams going around." },
    { text: "The DMV emails that your vehicle registration is expiring soon, linking to the state's real .gov renewal site.", isScam: false, tip: "A renewal notice pointing to your actual state's official .gov domain is normal." },
    { text: "A text says your package couldn't be delivered and asks you to 'update your address' through a shortened link.", isScam: true, tip: "Real carriers don't ask you to fix delivery issues through random shortened links." },
    { text: "A caller ID shows your bank's real name, but the person asks for your full card number and PIN.", isScam: true, tip: "Caller ID can be faked — a real bank never needs your PIN read aloud over the phone." },
    { text: "You verify a charity on an independent site like Charity Navigator before donating after a disaster.", isScam: false, tip: "Checking a charity's rating independently before donating is a smart, safe habit." },
    { text: "A social media post asks people to donate to disaster victims through a personal Venmo or Cash App instead of a charity.", isScam: true, tip: "Real relief efforts run through registered charities, not someone's personal payment app." },
    { text: "A LinkedIn recruiter messages you about a real, well-known company, referencing your actual public work history.", isScam: false, tip: "A recruiter citing your real, verifiable background at a legitimate company is a normal outreach." },
    { text: "A 'job' texts you immediately with no interview and asks you to buy gift cards for 'onboarding supplies.'", isScam: true, tip: "Real employers never hire without an interview or ask new hires to buy gift cards." },
    { text: "You receive a 1099 tax form from a company you actually did freelance work for last year.", isScam: false, tip: "A tax form matching real work you did is expected paperwork, not a scam." },
    { text: "The IRS calls demanding immediate payment by gift card or you'll be arrested today.", isScam: true, tip: "The IRS contacts people by mail first and never demands gift cards or threatens same-day arrest." },
    { text: "A text says your Social Security number has been 'suspended' due to suspicious activity — press 1 to fix it.", isScam: true, tip: "Social Security numbers can't be 'suspended' — this is a scare tactic to get you on the phone." },
    { text: "You get a mailed letter from the Social Security Administration about a benefits update, with your correct name and address.", isScam: false, tip: "A properly addressed mailed notice from a real agency is normal correspondence." },
    { text: "A caller claims to be your grandchild's lawyer, saying bail money must be wired immediately and kept secret from family.", isScam: true, tip: "Any request for secrecy plus urgent wired bail money is a classic grandparent scam." },
    { text: "A pop-up locks your browser screen, claims the FBI found illegal content, and demands a fine to unlock it.", isScam: true, tip: "Law enforcement doesn't lock your browser or collect fines through pop-ups." },
    { text: "Your browser shows a normal software update notification through its own built-in settings menu.", isScam: false, tip: "Updates offered directly inside an app's own settings are the legitimate way updates work." },
    { text: "Someone in a crypto Telegram group promises guaranteed 40% monthly returns if you send them coins to 'manage.'", isScam: true, tip: "Guaranteed high returns are a hallmark of investment scams — no legitimate investment is guaranteed." },
    { text: "You look up a financial advisor on FINRA's BrokerCheck before deciding to invest with them.", isScam: false, tip: "Verifying an advisor's license through a real regulator before investing is a smart safeguard." },
    { text: "A QR code taped to a restaurant table opens that restaurant's normal, familiar menu page.", isScam: false, tip: "A QR code leading to the expected business's real page is the normal, safe use case." },
    { text: "A 'CEO' emails from a slightly misspelled company domain, urgently asking you to buy gift cards for clients.", isScam: true, tip: "Check the sender's exact domain — a single swapped letter is a common impersonation trick." },
    { text: "Your company requires a second approver for large purchases, even ones requested by the CEO.", isScam: false, tip: "Built-in approval steps that apply to everyone, even leadership, are a healthy safeguard." },
    { text: "An email asks you to update wire instructions for a payment, skipping the usual verification phone call.", isScam: true, tip: "Any change to wire instructions should always be confirmed by a phone call to a known number." },
    { text: "A vendor you've worked with for years calls to confirm a routine invoice the same way they always have.", isScam: false, tip: "A familiar process with a long-standing, verified vendor is ordinary business as usual." },
    { text: "A text offers a 'free' cruise if you just pay a small 'processing fee' with your card.", isScam: true, tip: "Nothing that's truly free requires you to pay a fee upfront to claim it." },
    { text: "You book a vacation rental through a well-known platform with built-in payment and message protection.", isScam: false, tip: "Using a platform's built-in protections keeps your payment and communication on the record." },
    { text: "A 'landlord' insists you wire a security deposit before ever seeing the apartment in person or on video.", isScam: true, tip: "Never wire money for a rental you haven't seen in person or verified is real." },
    { text: "You tour an apartment in person and sign a lease directly with a verified property management company.", isScam: false, tip: "An in-person tour and a lease from a verifiable company is how renting is supposed to work." },
    { text: "A pop-up says your antivirus subscription 'expired' and demands payment on an unfamiliar website immediately.", isScam: true, tip: "Renew software directly through the real company's site or app, never a pop-up link." },
    { text: "Your antivirus software renews automatically and emails a receipt matching your usual billing amount.", isScam: false, tip: "An expected renewal receipt matching your normal billing is routine, not suspicious." },
    { text: "A text says a streaming service payment failed and asks you to 're-enter' your card through a link.", isScam: true, tip: "Update payment info by opening the real app yourself, never through a text link." },
    { text: "You update an expired card by logging into your streaming service's app directly.", isScam: false, tip: "Managing billing by logging into the app yourself is always the safer path." },
    { text: "A caller claims to be from Amazon's fraud department and asks you to buy gift cards to 'secure' your account.", isScam: true, tip: "Amazon will never ask you to buy gift cards to protect your account." },
    { text: "Amazon's app shows an order confirmation that matches a purchase you actually remember making.", isScam: false, tip: "A confirmation matching a real purchase you made is expected, not alarming." },
    { text: "A voicemail uses an AI-cloned voice of your boss, urgently asking you to wire money for a 'confidential deal.'", isScam: true, tip: "AI voice cloning can imitate anyone — verify unusual money requests through a separate known channel." },
    { text: "You confirm an unusual request from your boss by calling them directly on a number you already know is theirs.", isScam: false, tip: "Verifying urgent requests through an independent, known contact method is exactly the right move." },
    { text: "On a video call, a 'relative' asks for money urgently, but their face looks slightly off and the audio doesn't quite match their lips.", isScam: true, tip: "Glitchy lip-sync or an 'off' face on a video call can be a sign of deepfake video." },
    { text: "A text claims your child was in an accident and demands money be wired now, telling you not to call them.", isScam: true, tip: "Scammers create panic and isolation on purpose — always try to reach the person directly first." },
    { text: "You confirm your child is safe by calling them directly before reacting to an alarming text.", isScam: false, tip: "A quick direct call to verify is the single best defense against panic-based scams." },
    { text: "A login page's web address is spelled slightly differently than the real company, like 'paypa1.com.'", isScam: true, tip: "Always double-check a URL letter by letter before entering a password." },
    { text: "The address bar shows a padlock and the correct, exactly spelled company name before you log in.", isScam: false, tip: "A padlock plus a correctly spelled domain name are good signs, though not a total guarantee." },
    { text: "You use a password manager to generate and store a unique password for a new account.", isScam: false, tip: "Unique, generated passwords mean one leaked site can't unlock all your other accounts." },
    { text: "A text asks you to reply with the one-time verification code you just received.", isScam: true, tip: "A one-time code is meant only for you to enter — anyone asking you to share it is trying to break in." },
    { text: "Your email provider blocks a suspicious login attempt and asks you to confirm whether it was really you.", isScam: false, tip: "A provider proactively checking a suspicious login is a safety feature working as intended." },
    { text: "A pop-up says you've won a free iPhone — just enter your card number to cover 'shipping.'", isScam: true, tip: "A 'free' prize that needs your card number isn't actually free." },
    { text: "You check your account activity directly through your bank's own app, not a link from a text.", isScam: false, tip: "Going straight to the official app instead of clicking a link is always the safer habit." },
    { text: "Someone claiming to be Apple Support says your iCloud was hacked and asks for your Apple ID password.", isScam: true, tip: "Apple never asks for your password over chat, email, or phone." },
    { text: "Apple's real support process never asks you to say or type your full password to a support agent.", isScam: false, tip: "Legitimate support can help you without ever needing your actual password." },
    { text: "A fake invoice email for software you never bought includes a phone number to call to 'cancel' the charge.", isScam: true, tip: "Fake invoices bait you into calling a scam number — verify any charge through your real account instead." },
    { text: "You spot a suspicious charge and call the number on the back of your own card, not one from an email.", isScam: false, tip: "Always use the number on your card or statement, never one provided in a suspicious message." },
    { text: "A text claims your PayPal account is limited and asks you to click a link to restore it.", isScam: true, tip: "Log into PayPal directly through the app to check any account status, not through a text link." },
    { text: "PayPal's official app shows the exact same account alert when you open it directly.", isScam: false, tip: "Confirming an alert inside the real app itself, on your own, is the safe way to check." },
    { text: "A stranger online sends an 'accidental' overpayment and asks you to refund the difference right away.", isScam: true, tip: "Fake-overpayment scams rely on you refunding real money before their fake payment bounces." },
    { text: "You wait for a payment to fully clear before refunding any part of it back to a buyer.", isScam: false, tip: "Waiting for a payment to truly clear protects you from overpayment scams." },
    { text: "A marketplace buyer offers to pay by personal check for more than your asking price.", isScam: true, tip: "An offer to overpay by check is a classic setup for a bounced-check scam." },
    { text: "A marketplace buyer pays the exact listed price through the platform's built-in secure checkout.", isScam: false, tip: "Sticking to a platform's built-in payment system keeps the transaction protected." },
    { text: "Someone asks you to send a small crypto payment first to 'verify you're not a bot.'", isScam: true, tip: "No real verification process ever requires you to send money first." },
    { text: "A dating app match asks to text you directly instead of using the app's built-in messenger.", isScam: false, tip: "Moving to texting is common on dating apps — the real warning sign is a request for money, not the platform switch." },
    { text: "A dating match asks you to buy them crypto to 'prove your love.'", isScam: true, tip: "Any romantic partner asking for money or crypto, especially early on, is a major red flag." },
    { text: "A match on a dating app suggests meeting for the first time in a public place.", isScam: false, tip: "Suggesting a public first meeting is a normal, sensible dating safety practice." },
    { text: "An online 'boyfriend' is always too busy to video call and suddenly needs money for an emergency.", isScam: true, tip: "Someone who avoids ever video calling before asking for money is a textbook romance scam." },
    { text: "You do a reverse image search on a dating profile's photos before trusting the person behind them.", isScam: false, tip: "Reverse image searches can quickly reveal a photo stolen from someone else's real profile." },
    { text: "A text says you're pre-approved for a loan, but you must pay an upfront 'insurance fee' to receive it.", isScam: true, tip: "Legitimate loans never require you to pay a fee before the money is disbursed." },
    { text: "Your bank's own app shows you're pre-approved for a credit card, with no upfront fee required.", isScam: false, tip: "A pre-approval offer inside your own bank's app, with no fee, is a normal marketing offer." },
    { text: "A robocall says your car warranty is about to expire — press 1 to renew right now.", isScam: true, tip: "Unsolicited 'car warranty expiring' robocalls are one of the most common scam robocalls out there." },
    { text: "Your dealership mails an actual extended warranty offer that matches your car's make, model, and VIN.", isScam: false, tip: "An offer matching your specific vehicle's real details from your own dealer is legitimate." },
    { text: "A robocall claims to be Amazon about a suspicious $800 charge — press 1 to dispute it.", isScam: true, tip: "Check your real order history in the app instead of trusting an unexpected robocall." },
    { text: "You check your Amazon orders directly in the app and see no unusual charge at all.", isScam: false, tip: "Confirming directly in your own account is the reliable way to rule out a scam claim." },
    { text: "A text says you owe a fine for a parking ticket and must pay immediately through a link.", isScam: true, tip: "Real parking fines don't arrive as urgent 'pay now or else' text links." },
    { text: "A parking ticket arrives by mail with a real citation number you can look up on the city's own site.", isScam: false, tip: "A verifiable citation number on an official city site is how real tickets work." },
    { text: "Someone in a game group chat shares a link to a 'free V-Bucks generator' website.", isScam: true, tip: "There's no such thing as a free generator for in-game currency — these sites exist to steal accounts." },
    { text: "A game's official patch notes are posted directly on the developer's own verified website.", isScam: false, tip: "Official updates from the developer's real site are the legitimate source of game news." },
    { text: "A bot in a streamer's chat offers to 'match' any donation you send to a separate link first.", isScam: true, tip: "Donation-matching bots in chat are almost always scams designed to steal your payment info." },
    { text: "A verified streamer thanks you for a donation you made directly through the platform's real tipping tool.", isScam: false, tip: "A donation made through the platform's own built-in system is the safe way to support creators." },
    { text: "A popular app's store listing has thousands of reviews and shows the real developer's verified name.", isScam: false, tip: "A long history of reviews and a verified developer are good signs of a legitimate app." },
    { text: "A near-identical copycat app has almost no reviews and asks for way more permissions than it needs.", isScam: true, tip: "Copycat apps with excessive permission requests are a common way to sneak malware onto your phone." },
    { text: "A browser extension promises to 'block all ads' but asks for permission to read everything you type.", isScam: true, tip: "An extension asking for far more access than its stated job needs is a red flag." },
    { text: "You install a browser extension only from the official web store, with permissions that match its purpose.", isScam: false, tip: "Sticking to official stores and reasonable permissions is the safer way to add extensions." },
    { text: "You bring your own charging cable and a wall adapter instead of using an unknown public USB port.", isScam: false, tip: "Using your own cable and adapter avoids the data risk of unknown public charging ports." },
    { text: "You plug your phone directly into an unfamiliar public USB charging station with no cable of your own.", isScam: true, tip: "'Juice jacking' can let a compromised public USB port access data from your phone." },
    { text: "A coffee shop's Wi-Fi network name looks nearly identical to a second, fake hotspot nearby.", isScam: true, tip: "Fake look-alike hotspots are set up to intercept your traffic — always confirm the real network name." },
    { text: "You confirm the exact Wi-Fi network name with staff before connecting your device.", isScam: false, tip: "A quick check with staff is an easy way to avoid connecting to a fake hotspot." },
    { text: "You turn on a VPN before checking sensitive accounts over public Wi-Fi.", isScam: false, tip: "A VPN adds a layer of protection when you're on a network you don't fully trust." },
    { text: "A 'free VPN' app requests access to all of your traffic and has no visible privacy policy.", isScam: true, tip: "A VPN with no privacy policy can see and potentially sell everything you do online." },
    { text: "A text says your package needs a customs fee paid by gift card before it can be released.", isScam: true, tip: "Real customs fees are never paid with gift cards." },
    { text: "A real customs fee, if actually owed, is paid directly through the shipping carrier's official website.", isScam: false, tip: "Paying directly on a carrier's real site is the legitimate way to settle an actual fee." },
    { text: "Someone calls claiming to be a process server, saying you'll be arrested unless you pay a fine right now.", isScam: true, tip: "Real legal notices don't arrive as a surprise phone threat demanding instant payment." },
    { text: "A real legal summons arrives by mail or in person, never as a sudden phone call demanding money.", isScam: false, tip: "Legitimate legal processes follow formal, verifiable steps, not urgent phone threats." },
    { text: "A 'recruiter' asks for your Social Security number before any interview or job offer.", isScam: true, tip: "No legitimate employer needs your SSN before you're actually hired." },
    { text: "A real employer asks for your Social Security number only after a formal offer, for tax paperwork.", isScam: false, tip: "SSNs are normally collected for tax forms only after you're actually hired." },
    { text: "A text offers a 'government grant' you never applied for, as long as you pay a small fee to claim it.", isScam: true, tip: "Real government grants never require an upfront fee to receive them." },
    { text: "A real government grant you actually applied for has no upfront fee to receive the funds.", isScam: false, tip: "Legitimate grant programs never ask you to pay money to get money." },
    { text: "An email says you've inherited money from a distant overseas relative you've never heard of.", isScam: true, tip: "Surprise inheritance emails from strangers are one of the oldest scams in the book." },
    { text: "A real inheritance notice comes from a licensed attorney whose credentials you can independently verify.", isScam: false, tip: "You can verify a real attorney's license through your state's bar association website." },
    { text: "A caller claims to be from your utility company, threatening shutoff in one hour unless you pay by gift card.", isScam: true, tip: "Utility companies don't demand instant gift-card payment to avoid a same-hour shutoff." },
    { text: "Your utility company mails a normal bill with a due date and standard payment options.", isScam: false, tip: "A routine bill with normal payment options is exactly how utility billing should look." },
    { text: "A text says your subscription auto-renewed for $99 and gives a number to call to dispute it.", isScam: true, tip: "Check your actual subscription status in the app instead of calling a number from a text." },
    { text: "You check your subscription status directly inside the app's own account settings.", isScam: false, tip: "Verifying billing inside the real app yourself avoids falling for a fake dispute number." },
    { text: "A fake 'Microsoft' pop-up locks your screen and provides a phone number for 'support.'", isScam: true, tip: "Microsoft doesn't lock your screen with a pop-up demanding you call a number." },
    { text: "Windows Update runs quietly in the background the way it normally does.", isScam: false, tip: "Routine background updates without dramatic warnings are the normal, safe behavior." },
    { text: "Someone messages offering to double any cryptocurrency you send to their wallet address.", isScam: true, tip: "No legitimate service or person can 'double' crypto you send them — this is always a scam." },
    { text: "You research a crypto exchange's licensing and reputation before creating an account.", isScam: false, tip: "Checking licensing and reviews before using a new exchange is a smart safeguard." },
    { text: "An anonymous NFT project's team promises the price will 'definitely 10x soon.'", isScam: true, tip: "Anonymous teams making guaranteed price promises are a major red flag in crypto and NFTs." },
    { text: "A 'wrong number' text starts a friendly chat that slowly turns into a crypto investment pitch.", isScam: true, tip: "This slow-build 'pig butchering' scam often starts with an innocent-looking wrong-number text." },
    { text: "You block and report a stranger who quickly steers small talk toward investment advice.", isScam: false, tip: "Cutting off unsolicited investment pitches from strangers early is a smart move." },
    { text: "A 'landlord' only accepts payment by wire transfer or gift card and never provides a lease.", isScam: true, tip: "No lease, plus payment only by wire or gift card, is a major rental scam warning sign." },
    { text: "A real lease includes your name, the property address, and a signature from a verifiable landlord.", isScam: false, tip: "A proper signed lease with verifiable details is how legitimate renting works." },
    { text: "An email says your cloud storage is full and to click a link immediately to 'upgrade.'", isScam: true, tip: "Manage storage plans by logging into the real service yourself, not through an email link." },
    { text: "You manage your cloud storage plan by logging directly into the service yourself.", isScam: false, tip: "Handling account changes directly in the real app or site is always the safer approach." },
    { text: "A text claims to be a school closing or weather alert, sent from an unknown short number with a link.", isScam: true, tip: "Verify any alarming school alert against your school's own official channels first." },
    { text: "Your school's official app sends a weather alert that matches what's being reported on local news.", isScam: false, tip: "An alert that matches independently reported news through an official app is legitimate." },
    { text: "A caller claims your Medicare card needs a new chip and asks for your Medicare number to send one.", isScam: true, tip: "Medicare cards don't have chips, and Medicare won't call asking for your number." },
    { text: "Medicare will never call you asking you to pay for a new or replacement card.", isScam: false, tip: "Knowing Medicare never charges for a replacement card helps you spot this scam instantly." },
    { text: "A voice that sounds exactly like your parent urgently asks for money, then hangs up quickly.", isScam: true, tip: "A rushed call that avoids questions is a common sign of an AI voice-cloning scam." },
    { text: "You call your parent back on their known number before sending any money.", isScam: false, tip: "A quick callback to a number you already know defeats most voice-cloning scams." },
    { text: "A quiz app on social media asks for your mother's maiden name and first pet 'just for fun.'", isScam: true, tip: "Fun quizzes that ask common security-question answers are often harvesting data for account takeovers." },
    { text: "You skip quizzes that ask for the kind of answers used in account security questions.", isScam: false, tip: "Declining to share common security-question answers publicly is a smart habit." },
    { text: "A message says you're the 'lucky winner' of a lottery you never entered.", isScam: true, tip: "You can't win a lottery you never entered — this is always a scam." },
    { text: "You know that real lotteries never require a fee to release your winnings.", isScam: false, tip: "Recognizing that real prizes never need an upfront fee protects you from this scam." },
    { text: "A text offers a part-time 'reshipping' job: receive packages at home and forward them for pay.", isScam: true, tip: "Reshipping jobs are commonly used to launder stolen goods — real employers don't work this way." },
    { text: "A real part-time job posting lists a legitimate, independently verifiable local business.", isScam: false, tip: "A verifiable real business behind a job posting is a good sign it's legitimate." },
    { text: "Someone asks you to cash a check for them and wire back a portion, keeping the rest as payment.", isScam: true, tip: "Fake-check scams rely on you wiring real money before the fake check bounces days later." },
    { text: "Your bank explains that funds from a deposited check can take several days to fully clear.", isScam: false, tip: "Knowing checks can bounce days later helps you avoid fake-check scams." },
    { text: "A pop-up ad says your phone has 3 viruses and to tap 'clean now' immediately.", isScam: true, tip: "Browser pop-ups can't actually scan your phone — this is a scare tactic to get a click." },
    { text: "Your phone's real settings app shows no infected-file warning at all.", isScam: false, tip: "Checking your actual device settings is the reliable way to rule out a fake warning." },
    { text: "A caller pretends to be your cable company offering a 'loyalty discount' if you pay a deposit by phone right now.", isScam: true, tip: "Real loyalty discounts show up as a credit on your bill, not an urgent phone-only deposit." },
    { text: "Your cable company's real discounts show up as a credit directly on your actual bill.", isScam: false, tip: "A discount reflected on your real bill, without a phone-only rush, is the legitimate version." },
    { text: "A text says you've been randomly selected for a free product test, just cover 'shipping' with your card.", isScam: true, tip: "A 'free' test product that needs your card number is a data-harvesting scam." },
    { text: "A real product-testing program runs through an established company's own site with no card required upfront.", isScam: false, tip: "No legitimate free-sample program needs your card details just to sign up." },
    { text: "Someone in a Discord server DMs offering to boost your game rank for a small upfront fee.", isScam: true, tip: "Boosting scams often just take the payment and disappear, or steal the account instead." },
    { text: "A friend you've played with for years vouches for a trusted, well-known trading site.", isScam: false, tip: "A recommendation from someone you actually know and trust carries real weight." },
    { text: "A text claims your electric car's charging subscription failed and asks you to update payment via a link.", isScam: true, tip: "Update EV charging payment info directly in the network's own app, not through a text link." },
    { text: "You update payment info directly through your EV charging network's own app.", isScam: false, tip: "Handling billing changes inside the real app yourself is always the safer route." },
    { text: "A caller says they're from your child's school, asking for payment info over the phone for a 'field trip.'", isScam: true, tip: "Schools rarely collect payment info by surprise phone call — check with the school directly." },
    { text: "Your child's school uses a secure, known online portal to collect field trip payments.", isScam: false, tip: "A familiar, secure school portal is the legitimate way payments are usually handled." },
    { text: "An ad for a 'miracle' supplement promises impossible results and auto-bills you after a 'free trial.'", isScam: true, tip: "Free-trial supplement ads that auto-bill you later are a well-known subscription trap." },
    { text: "You research a supplement and its seller's reviews before ever entering payment information.", isScam: false, tip: "Researching a product and seller first helps you avoid hidden auto-billing traps." },
    { text: "A message claims to be tech support you never contacted, saying they've remotely detected a problem on your device.", isScam: true, tip: "Real tech support never reaches out first about a problem you never reported." },
    { text: "You only get tech support help after reaching out to a company yourself through its real site.", isScam: false, tip: "Initiating support contact yourself, through official channels, is always the safer direction." },
    { text: "An online 'friend' only ever wants to talk about a hot new investment opportunity.", isScam: true, tip: "A relationship that only exists to pitch investments isn't really a friendship." },
    { text: "A real friend checks in on how you're doing without ever asking for money or investments.", isScam: false, tip: "Genuine friendships don't come with a constant investment pitch attached." },
    { text: "A caller says your SSN was used in a crime elsewhere and you must move your money to a 'safe' account.", isScam: true, tip: "No real government agency ever asks you to move your money to an account they control." },
    { text: "You know that no legitimate agency will ever ask you to transfer money to a 'safe' account.", isScam: false, tip: "Recognizing this exact scam pattern is one of the best defenses against it." },
    { text: "A text says a family member is in jail and needs bail money sent through an app right now.", isScam: true, tip: "Always confirm any jail or bail claim independently before sending money." },
    { text: "You confirm a jail or bail claim by calling the actual courthouse or jail directly.", isScam: false, tip: "Verifying through the real courthouse or jail is the reliable way to check this kind of claim." },
    { text: "An online seller has thousands of verified reviews and ships through the platform's tracked shipping.", isScam: false, tip: "A long track record of verified reviews and tracked shipping are strong trust signals." },
    { text: "An online seller only accepts payment by wire transfer and has zero reviews.", isScam: true, tip: "No reviews plus wire-transfer-only payment is a strong sign of a fake seller." },
    { text: "A caller offers to lower your credit card interest rate for an upfront fee paid over the phone.", isScam: true, tip: "Real rate negotiations happen through your card issuer directly, never for an upfront phone fee." },
    { text: "You call your credit card company directly using the number on the back of your card to ask about rates.", isScam: false, tip: "Using the number on your own card is always safer than trusting an inbound caller." },
    { text: "A text says you qualify for student loan forgiveness, just provide your FSA ID and password to apply.", isScam: true, tip: "Real loan forgiveness programs never ask you to hand over your FSA ID password." },
    { text: "You know that real student loan forgiveness never requires giving away your FSA ID password.", isScam: false, tip: "Your FSA ID password should never be shared with anyone, including anyone claiming to help you apply." },
    { text: "A 'modeling contest' online asks you to pay an entry fee to be considered.", isScam: true, tip: "Legitimate modeling opportunities don't charge hopefuls a fee just to enter." },
    { text: "A real school talent show or contest has no cash entry fee to take part.", isScam: false, tip: "No-cost participation is standard for real school and community contests." },
    { text: "Someone claiming to be a soldier stationed overseas quickly moves the relationship toward romance and then asks for money to 'come home.'", isScam: true, tip: "Military romance scams follow this exact script — fast romance, then a money request." },
    { text: "A new online contact always has an excuse to avoid a video call before eventually asking for money.", isScam: true, tip: "A consistent refusal to video call, followed by a money request, is a major romance-scam pattern." },
    { text: "A well-known nonprofit's real donation page uses their official, correctly spelled web address.", isScam: false, tip: "Donating directly through a nonprofit's own correctly spelled site is the safe way to give." }
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
    timerSeconds: CONFIG.timerSeconds,
    timeLeft: CONFIG.timerSeconds,
    feedback: null,
    locked: false,
    results: []
  };

  let timerId = null;
  let feedbackTimerId = null;

  function start(seconds) {
    clearInterval(timerId);
    clearTimeout(feedbackTimerId);
    Object.assign(state, {
      screen: 'playing', qIndex: 0, score: 0,
      timerSeconds: seconds, timeLeft: seconds, feedback: null, locked: false, results: []
    });
    timerId = setInterval(() => {
      if (state.locked) return;
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
    state.results.push({ guessScam, correct });
    render();
    clearTimeout(feedbackTimerId);
    feedbackTimerId = setTimeout(continueNext, FEEDBACK_SECONDS * 1000);
  }

  function continueNext() {
    if (!state.locked) return;
    clearTimeout(feedbackTimerId);
    if (state.feedback === 'wrong' && CONFIG.hardcoreMode) {
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
      case 'happy':
        return '<svg width="46" height="46" viewBox="0 0 24 24" fill="none" class="pop-icon"><circle cx="12" cy="12" r="9" stroke="var(--color-bg)" stroke-width="1.8"></circle><circle cx="8.5" cy="10" r="1.1" fill="var(--color-bg)"></circle><circle cx="15.5" cy="10" r="1.1" fill="var(--color-bg)"></circle><path d="M8 14.5c1 1.5 2.5 2.3 4 2.3s3-.8 4-2.3" stroke="var(--color-bg)" stroke-width="1.6" stroke-linecap="round"></path></svg>';
      case 'sad':
        return '<svg width="46" height="46" viewBox="0 0 24 24" fill="none" class="pop-icon"><circle cx="12" cy="12" r="9" stroke="var(--color-bg)" stroke-width="1.8"></circle><circle cx="8.5" cy="10" r="1.1" fill="var(--color-bg)"></circle><circle cx="15.5" cy="10" r="1.1" fill="var(--color-bg)"></circle><path d="M8 16.3c1-1.5 2.5-2.3 4-2.3s3 .8 4 2.3" stroke="var(--color-bg)" stroke-width="1.6" stroke-linecap="round"></path></svg>';
      default:
        return '';
    }
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function renderIntro() {
    return `
      <div class="screen intro">
        <div class="intro-body">
          <div class="eyebrow">Cybersecurity training game</div>
          <h1>Scam or Safe?</h1>
          <p class="lede">${QUESTIONS.length} real-life moments. Read each one and decide fast — is it safe, or a scam?</p>
          <hr class="hr">
          <div class="rules">
            <div class="rule">${svgIcon('shield')}<div class="rule-text"><strong>Get it right</strong> — a happy-face celebration, then move on when you're ready.</div></div>
            <div class="rule">${svgIcon('bars')}<div class="rule-text"><strong>Get it wrong</strong> — a sad face and a quick tip on what to watch for.</div></div>
            <div class="rule">${svgIcon('clock')}<div class="rule-text"><strong>Pick your time limit</strong> below to start.</div></div>
          </div>
          <div class="difficulty-section">
            <div class="difficulty-label">Choose your time limit</div>
            <div class="difficulty-options">
              ${TIME_OPTIONS.map(t => `
                <button class="btn btn-secondary btn-block difficulty-btn" data-seconds="${t.seconds}">
                  <span class="difficulty-name">${t.minutes} minutes</span>
                </button>`).join('')}
            </div>
          </div>
        </div>
      </div>`;
  }

  function renderPlaying() {
    const q = QUESTIONS[state.qIndex];
    const mm = Math.floor(state.timeLeft / 60);
    const ss = String(state.timeLeft % 60).padStart(2, '0');
    const timeColor = state.timeLeft <= 30 ? 'var(--color-accent)' : 'var(--color-text)';

    const cells = QUESTIONS.map((_, i) => {
      let cls = 'progress-cell';
      if (i < state.results.length) cls += state.results[i].correct ? ' correct' : ' wrong';
      return `<div class="${cls}"></div>`;
    }).join('');

    let overlay = '';
    if (state.feedback === 'wrong') {
      overlay = `
        <div class="overlay overlay-wrong">
          <div class="overlay-content">
            ${svgIcon('sad')}
            <div class="overlay-title">NOT QUITE</div>
            ${CONFIG.showTips ? `<div class="overlay-tip">${escapeHtml(q.tip)}</div>` : ''}
            <button class="btn btn-block overlay-continue-btn" id="continue-btn">Continue ${svgIcon('arrow')}</button>
            <div class="overlay-auto-hint">Continues automatically in ${FEEDBACK_SECONDS}s</div>
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
            ${svgIcon('happy')}
            <div class="overlay-title">CORRECT</div>
            ${CONFIG.showTips ? `<div class="overlay-tip">${escapeHtml(q.tip)}</div>` : ''}
            <button class="btn btn-block overlay-continue-btn" id="continue-btn">Continue ${svgIcon('arrow')}</button>
            <div class="overlay-auto-hint">Continues automatically in ${FEEDBACK_SECONDS}s</div>
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
            Safe ${svgIcon('arrow')}
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
        <button class="btn btn-secondary btn-block" style="justify-content:center;margin-top:10px" id="review-btn">Review answers</button>
      </div>`;
  }

  function renderReview() {
    const rows = QUESTIONS.map((q, i) => {
      const r = state.results[i];
      if (!r) {
        return `
          <div class="review-item review-unreached">
            <div class="review-q">${i + 1}. ${escapeHtml(q.text)}</div>
            <div class="review-meta">Not reached — ran out of time</div>
          </div>`;
      }
      const userLabel = r.guessScam ? "It's a scam" : 'Safe';
      const correctLabel = q.isScam ? "It's a scam" : 'Safe';
      return `
        <div class="review-item ${r.correct ? 'review-correct' : 'review-wrong'}">
          <div class="review-q">${i + 1}. ${escapeHtml(q.text)}</div>
          <div class="review-meta">
            <span class="review-badge">${r.correct ? 'Correct' : 'Missed'}</span>
            You answered <strong>${userLabel}</strong> — correct answer was <strong>${correctLabel}</strong>
          </div>
          <div class="review-tip">${escapeHtml(q.tip)}</div>
        </div>`;
    }).join('');

    return `
      <div class="screen review">
        <div class="review-header">
          <div class="review-title">Review</div>
          <button class="btn btn-secondary" id="review-back-btn">Back</button>
        </div>
        <div class="review-list">${rows}</div>
      </div>`;
  }

  function render() {
    let html;
    if (state.screen === 'intro') html = renderIntro();
    else if (state.screen === 'playing') html = renderPlaying();
    else if (state.screen === 'review') html = renderReview();
    else html = renderResult();

    app.innerHTML = html;

    document.querySelectorAll('.difficulty-btn').forEach((btn) => {
      btn.addEventListener('click', () => start(parseInt(btn.dataset.seconds, 10)));
    });

    const safeBtn = document.getElementById('answer-safe');
    if (safeBtn) safeBtn.addEventListener('click', () => answer(false));

    const scamBtn = document.getElementById('answer-scam');
    if (scamBtn) scamBtn.addEventListener('click', () => answer(true));

    const continueBtn = document.getElementById('continue-btn');
    if (continueBtn) continueBtn.addEventListener('click', continueNext);

    const againBtn = document.getElementById('again-btn');
    if (againBtn) againBtn.addEventListener('click', () => { state.screen = 'intro'; render(); });

    const reviewBtn = document.getElementById('review-btn');
    if (reviewBtn) reviewBtn.addEventListener('click', () => { state.screen = 'review'; render(); });

    const reviewBackBtn = document.getElementById('review-back-btn');
    if (reviewBackBtn) reviewBackBtn.addEventListener('click', () => { state.screen = 'result'; render(); });
  }

  render();
})();
