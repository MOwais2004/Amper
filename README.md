# Amper — SaaS fintech website

Live: https://mowais2004.github.io/Amper/


https://github.com/user-attachments/assets/9015d98e-56e0-44fd-9622-9b9a113e38ac


**Amper** is a fictional global business account: multi-currency accounts, cards, batch payouts, treasury yield and a payments API.
Tagline: **"Money, fully charged ⚡"**. The name comes from *ampere*: money that's "charged" moves instantly. The bolt from the Velto reference is the one brand symbol. It appears in the logo, the loader, the hero headline, the notification icons, the word band and the favicon.

The site is one static page made of `index.html`, `style.css` and `script.js`. There is no build step and no framework. The whole folder is about 1.1 MB, of which images are 0.77 MB.

---

## 1. Running it

```bash
node .claude/serve.mjs amper 5211
```

Run this from the `10k websites demo` folder, or use the `amper` entry in `.claude/launch.json`. Opening `index.html` straight from disk also works, because GSAP, ScrollTrigger and Lenis are vendored. Only the Google Font needs the internet.

```
amper/
├── index.html      markup + inline SVG sprite (logo mark, bolts, 1.6px-stroke icons)
├── style.css       tokens → type → letter roll → buttons → card system → loader → nav → sections 01–15 → footer → responsive
├── script.js       Lenis + GSAP ScrollTrigger, one commented block per section (same numbering as the HTML)
├── README.md
└── assets/
    ├── favicon.svg ink rounded square + volt bolt
    ├── js/         gsap 3.12.5 · ScrollTrigger 3.12.5 · lenis 1.1.13
    └── img/        16 WebP photos + av/ (5 avatars, 240px)
```

---

## 2. References → where they live

| Reference | What was taken | Where |
|---|---|---|
| **Velto poster** (hand + phone, "Power your life with one wallet ⚡") | Tight dark-green headline top-left, backlit hand + phone in the centre, two small grey notes left/right. App UI: greeting, green balance, lime card with a dark card behind it, Quick send, transaction cards, dark-green bottom bar with a lime home circle | 01 Hero |
| **ctrl.xyz** | Logo · grey pill nav · black pill CTA. Pastel cards with a white chip label and *outlined* mini-illustrations. Fading list of assets. Outlined FAQ. Giant footer wordmark ("Level up.") | Nav, card system, 06 currency card, 12 Security, 14 FAQ, footer |
| **Wise** (site + promo + "$3.2BN" ad) | Lime as a surface colour. Bright lifestyle photography with a product pill on top. The fee comparison widget. Giant number overlapping a rounded photo | 04 Products, 07 Compare, 09 Stat |
| **Pinterest Predicts collage** | Scattered rounded photo cards of different sizes, coloured circles peeking from behind them, colour-matched stat tags ("chartreuse green +175%") | 03 Why |
| **Stripe** | Dark code window with language tabs plus metric cards | 10 Developers |
| **Paynext** | Eyebrow pill above every heading. Monthly/Yearly pricing toggle, middle plan inverted | Section heads, 13 Pricing |
| **"150+ countries" ring** | Dashed ring orbited by glossy flag spheres around a glowing counter pill | 06 Global |
| **Zypay** | "You have an incoming transaction" notification card | 06 Global |
| **"Start a pool"** | Ring over a motion-blurred crowd, lime arc, avatar pills with +$ amounts | 08 Team |
| **"Request To Follow" / Superhuman billboard** | Big statement words with small photos set inline | 05 Band |
| **Uber "Captain speaking >"** | Small labels sitting on photos → the chip on every card | Card system |
| **Fortune 3×3 tile grid** | Photo tiles mixed with coloured text cards | 11 Stories |
| **"Weekly Wallpapers" poster** | Huge wordmark above a backlit hand + phone on grey, meta text in the corners | 15 CTA |
| **bluf** | App-store badges on the poster | 15 CTA |

---

## 3. Design system

### 3.1 One card language (built from the security cards)
Every section uses the same kit:

1. **Card**: radius `--r: 28px` (collage cards 22px, tiles inherit 28px). The surface is white, volt, forest, sky, blush, lemon or a full-bleed photo.
2. **Chip label** `.chip`: 28px tall, white at 72% with an 8px backdrop blur, 13px/500 text. It sits top-left on photo cards (absolute, 18px inset) and in the flow on solid cards. Variants: `.chip-dark` (white 14% on dark), paper-coloured on white cards, volt on the forest plan card.
3. **Outlined details**: 1.5px ink borders on the small UI inside cards (security rows, chat bubbles, star rows, quote author pills, FAQ items, outline button).
4. **One floating pill** `.pill-note`: white at 94% with a blur, 9px padding, a 38px round icon (volt or ink), a bold line and a 12.5px grey line, with a soft two-layer shadow. It's used on the hero phone, every product photo and the code window.
5. **One section head** `.sec-head`: a grid with an eyebrow pill across the top, then the h2 on the left and the sub-copy (or the pricing toggle) on the right, aligned to the bottom. The FAQ uses a sticky single-column version.
6. **One card hover**: `translateY(-6px) rotate(-.6deg)` over 0.9s expo-out (product cards, tiles, security cards, plans, stat cards). Collage cards tilt 2° and zoom their photo.
7. **One icon style**: 1.6px rounded stroke, drawn once in the SVG sprite.

### 3.2 Colour (`:root`)
| Token | Value | Use |
|---|---|---|
| `--paper` | `#f4f4f1` | Page. The hero photo's white was baked to exactly this colour |
| `--white` | `#ffffff` | Cards, pills, calculator |
| `--ink` | `#0d1f12` | Text, dark buttons, ink pills (green-tinted near-black) |
| `--forest` | `#16451f` | Brand green: hero headline, big numbers, Growth plan, Halftone quote, nav progress line |
| `--deep` | `#0a1a0e` | Global section, code window |
| `--volt` | `#c4f43e` | Brand lime: app card, Compare + Stat surfaces, button hover, ticks, dots, highlights |
| `--grey` / `--grey-2` | `#6b716c` / `#a3a8a2` | Secondary text / loader "Charging", band row 2 |
| `--line` / `--line-d` | ink 12% / white 14% | Hairlines on light / dark |
| `--pos` / `--neg` | `#1f9d4a` / `#e0453a` | Money in / out |
| `--sky` `--blush` `--lemon` | `#a9cdf7` `#ffcfe0` `#fbe96a` | Card surfaces only |
| Collage extras | `#cfe4fb` sky-light, `#ff5a36` coral, `#3d2433` plum | Collage dots and tags only |

Rhythm: paper → dark Global (rounded top) → volt Compare (rounded bottom) → paper → volt Stat card → paper → poster.

### 3.3 Typography
- **Inter Tight** (400–800) is the only family.
- Display `clamp(52px,7.6vw,116px)` / 600 / −0.058em / 0.9 · h2 `clamp(38px,5vw,76px)` / 600 / −0.05em / 0.95 · h3 `clamp(28px,3vw,44px)` · sub 16–18px grey, max 40ch · labels 13px · pills 14px.
- Big numbers: `$412M` 800 / −0.07em, plan prices 600 / −0.06em, both with `tabular-nums` so the counters don't jitter.
- Code: system monospace (`ui-monospace`, SF Mono, Cascadia, Consolas).

### 3.4 Imagery
Clean, bright studio photography on saturated seamless backdrops (Unsplash, free licence). There are no dark or moody shots.

| File | Shows | Used in |
|---|---|---|
| `hero.webp` | Hand holding a phone on white. Curves pushed the white to pure white, then ffmpeg multiplied it with `#f4f4f1`, plus a CSS edge mask | Hero |
| `cta.webp` | Backlit silhouette of a hand + phone | CTA poster |
| `pink-card` | Woman with a card + phone, blue backdrop | Products 01 |
| `tap2` | Green card held out at a bakery | Products 02, collage |
| `yellow-point` | Woman pointing at a phone, orange backdrop | Products 03, collage |
| `yellow` | Yellow jacket, celebrating, white | Products 04, band |
| `lilac-man` · `green-red` · `orange-suit` · `pink-blue` · `blue-walk` · `orange-hijab` | Studio portraits on colour | Collage + Stories (each quote card's author photo is the person in the next tile) |
| `blue-card` · `purple-card` | Cards held on beige / purple | Collage, band |
| `pool-blur` | Orange-lit motion-blur crowd | Team |
| `gradient-selfie` | Selfie against a colourful wall | Stat |
| `av/1,3,6,11,12` | Avatars | Hero UI, team pills |

Encoding: WebP q76 at 1400px max (hero 2000px, CTA 1800px), compression level 6. Everything below the hero uses `loading="lazy"`, and the hero is preloaded.

---

## 4. Sections in detail

### Loader
A full-screen paper sheet. Top-left: the logo, whose bolt fills with lime from the bottom (an SVG clip rect). Centre: **"Charging [accounts → cards → payouts → treasury → your money.]"**, with "Charging" in grey and the last word rolling up (expo.inOut) in step with the count. Bottom: a hairline progress bar and a big 0–100% counter. The count takes 2.4s and waits for `load` and `document.fonts.ready`. The text then lifts away and the sheet wipes up with `clip-path: inset(0 0 100% 0)`.

### Nav
Fixed, starting transparent. After 40px it becomes a blurred paper bar with a hairline and less padding. The centre has a grey pill of links:
- A **white highlight slides** to the hovered link, then settles back on the section you're reading.
- **Scroll-spy** grows a volt dot in front of the active link. The dot is offset by a negative margin, so the link width never changes.
- Labels use the **letter roll**.
- A 2px forest **progress line** along the bottom of the nav tracks page scroll.

Below 1100px it collapses to a round ink burger that opens a full-screen menu with a clip-path wipe.

### 01 Hero
- The headline enters **letter by letter** (each character rises 115% and un-rotates 8°). The ⚡ spins in with `back.out`.
- **The phone screen is live HTML mapped onto the photo.** The screen rectangle was measured from the photo's pixels: centre (1016, 953) on a 2000px image, 705×1535, rotated 0.72°. Inside `.screen`, `font-size: 2.5641cqw` makes **1em = 10pt of a 390pt iPhone**, so the UI scales exactly with the photo at any size. The notch, status bar and bottom bar are drawn in CSS.
- The balance counts up. The card slides in, then Quick send and the transactions stagger in.
- **Scrolling the page scrolls the app**: `.ui-scroll` moves up 26% to reveal an Accounts list (USD, EUR, GBP, JPY with CSS flags).
- Three notification pills pop in one after another and then float (y only).
- Two grey side notes (Velto). The headline drifts up on scroll.

### 02 Logos
A label on the left and a **hairline grid of 6 cells**. Every 1.6s one random cell flips: the old logo rolls up and a new one rolls in, from a pool of 12 fictional logos. Each logo is a geometric SVG mark plus a wordmark, all one size and one grey that turns ink on hover. It pauses while the tab is hidden.

### 03 Why — collage
- The headline sits in the centre ("One account to get paid, spend smarter and pay anyone.") and **lights up word by word** as you scroll, with a sub-line under it.
- **Nine rounded photo cards** of different sizes are scattered around it. Two are cropped by the screen edge, like the reference.
- **Peeking circles** (sky, volt, coral, blush) sit behind cards at their top-right, top-left or bottom-left.
- **Colour-matched tags**, each with a count-up number:
  - **cross-border sales +175%** (volt)
  - **supplier payouts +220%** (plum)
  - **FX fees −64%** (sky)
  - **month-end close 9 days faster** (ink)
- Motion:
  - Cards scale in from 0.4 with alternating rotation, staggered. Dots pop. Tags pop and count.
  - **Layered parallax**: each card has its own `data-speed` (−0.6…0.75), giving ±160px of travel, or ±50px on phones.
  - **Mouse depth**: the inner layer leans away from the cursor in proportion to its speed.
- Layout: `.c1`–`.c9` in `style.css`. Desktop positions are % of the section with widths in vw. Mobile uses vw with 3 cards hidden.

### 04 Products
A bento of 7/5 then 5/7 columns. Each card has a numbered chip (01 Accounts, 02 Cards, 03 Payouts, 04 Treasury), one pill-note and a title + line over a soft bottom gradient. Motion: a clip-path reveal, the photo settling from 1.12 scale with parallax, the chip and pill popping and the copy rising. On hover the card lifts, the photo zooms and the pill lifts 8px.

### 05 Band
Two huge rows: "Get paid · Spend · Send · Save" (ink) and "40 currencies · 160+ countries · 11-second transfers" (grey), with inline photo pills and bolts. **Scroll moves the rows in opposite directions** (xPercent 0 ↔ −28) and the bolts rotate a full turn.

### 06 Global (dark, rounded top)
- Standard section head on dark.
- **Currency card** ("Live rates · USD" chip): 12 currencies with CSS flags and rates. The list **steps up one row every 1.4s** and fades at its top and bottom edges.
- **Orbit**: a dashed ring draws in. 12 glossy CSS flag spheres (a highlight and shadow gradient on top) rotate around it in 60s, counter-rotating so they stay upright. The glowing "160+ →" pill has a volt arrow that turns 45° on hover, with "countries" under it.
- **Notification card** (Zypay): it cycles through four messages every 4.2s, leaving and arriving with a pop.

### 07 Compare (volt, rounded bottom)
A **working calculator** in a card with a "Calculator" chip. You set the amount and the from/to currencies; the flag dots update.
- Four providers: Amper, plus three generic categories (High-street bank, Card network, Legacy wire).
- Each recipient amount is calculated from a % fee, a fixed fee and a hidden FX markup.
- Numbers tween to new values and the bars scale between the best and worst offers. The Amper row is volt and shows "Save up to X".
- The amount input formats as you type.

### 08 Team
"Spend as a team" over the orange motion-blur crowd. The volt arc on the ring **fills with scroll**, three avatar pills (+$1,200 Design, +$800 Ops, +$450 Travel) pop in, and the photo zooms out. Next to it: an h3 and three checklist rows with volt ticks.

### 09 Stat (volt card)
A chip, the kicker line, then **$412M** counting up and overlapping the top of a rounded photo (Wise). The photo reveals with a clip-path and has parallax. Under it: "Could we save you money too?" plus a button and a footnote.

### 10 Developers
- Two **stat cards**: white "99.999%" uptime and volt "84ms" speed, both counting up.
- The **code card** has Node / Python / cURL tabs. A sliding highlight moves under the active tab and "Read the docs" sits in the tab bar.
- Code lines fade in one by one with syntax colours: keyword pink, string volt, number amber, function blue, comment 35% white. A volt block cursor blinks after the last line.
- A "200 OK · 84ms" pill is attached to the card's corner.

### 11 Stories
**Full width, aligned with the heading, 4 columns × 2 rows.**
- 5 photo tiles with name chips.
- 3 quote cards (volt, forest, sky) with a company chip, an Inter Tight quote, and an outlined author pill using the person's photo.
- Tiles are **dealt in**: they rise with an alternating ±3° rotation, staggered by column, and photos settle from 1.2 scale.

### 12 Security
Three pastel cards:
- **Protected** (sky): three outlined shield rows.
- **Watchful** (blush): a fraud-alert chat with an ink reply bubble.
- **Loved** (lemon): three outlined star rows with coloured dots.

On scroll the cards rise with a slight rotation, the rows check in, **the chat bubbles pop from their tail corners like messages arriving**, and **the stars fill one by one**.

### 13 Pricing
Three plan cards: Starter (white), Growth (forest, with a volt "Most popular" chip and a volt button) and Scale (white). The toggle has a sliding ink knob. Switching **rolls the prices** up and out, then in from below ($49 ↔ $39, $199 ↔ $159).

### 14 FAQ
A sticky left column (eyebrow, "FAQ", sub, "Talk to a human" link) beside 6 outlined accordions. They're native `<details>` with GSAP height animation. When open, the card turns white and the circle-plus rotates into a volt minus. Hovering also fills the icon volt.

### 15 CTA poster
The Weekly Wallpapers layout: a "Get the app" chip, a giant white **Amper** wordmark whose letters rise in, and the backlit silhouette photo zooming out as the poster enters. The bottom corners hold the copy, App Store / Google Play badges (they turn volt on hover) and "Vol 1.0 / iOS & Android".

### Footer
- A newsletter form (shows "You're on the list ⚡" on submit) and three link columns with the letter roll.
- The giant **"Fully charged."** wordmark with a lime full stop. Letters rise in on scroll, and **letters near the cursor lift** in a proximity wave.
- Legal row below.

---

## 5. Motion language

| Pattern | Spec | Used on |
|---|---|---|
| Smooth scroll | Lenis `lerp 0.1`, drives ScrollTrigger; anchors offset −80px | Whole page |
| Letter roll | Each label gets two stacked copies of its letters; hover moves both up 100%, staggered 14ms per letter, 0.6s expo-out | Buttons, nav, text links, footer links, docs link |
| Button colour | 0.5s cross-fade: ink → volt, volt → white, outline → ink fill; press scales to 0.97 | `.btn` |
| Link underline | The line retracts to the right, then redraws from the left (keyframes) | `.link` |
| Type reveal | `.words` headings rise word by word from a mask (115%, 4°, 1.2s, 0.035s stagger); `.chars` (hero) letter by letter | Every h2/h3, hero |
| Pop | `scale .5–.7 → 1`, `back.out(1.8)` | Chips, eyebrows, pills, tags, dots, flags |
| Counters | power3.out, tabular numbers | Balance, $412M, 99.999%, 84ms, collage tags, compare |
| Scroll-linked | progress line, phone content, collage parallax, statement light-up, band, team ring, photo parallax, CTA zoom | — |
| Ambient | logo flips 1.6s, currency steps 1.4s, notifications 4.2s, orbit 60s, hero pill float | — |

Rules:
- One easing family: `expo.out` (CSS `cubic-bezier(.16,1,.3,1)`).
- The intro tween and scroll tween of an element never animate the same property. Scroll moves the outer element and entrance or mouse moves the inner one (collage, hero pills).
- **No clipped text.** Every reveal mask has padding on all sides (`.ln`, `.fm`, `.rl`, loader roll, prices), and once a reveal finishes the mask is switched off (`.done → overflow: visible`). Descenders and tightly tracked edges are never cut.

---

## 6. Editing guide

| To change | Edit |
|---|---|
| Brand colours | `--volt`, `--forest` etc. in `:root`; update `assets/favicon.svg` by hand |
| Loader words | the `<b>` items in `.ld-words` (any count) |
| Hero app content | `.screen .ui` in index.html; sizes in em (1em = 10pt); content inside `.ui-scroll` scrolls with the page |
| Logos | `pool` (mark + name) and `M` (SVG marks) in script.js §02 |
| Collage | cards `.c1–.c9` (HTML: photo, `data-speed`, dot class `d-tr/d-tl/d-bl` + colour, tag `t-volt/t-plum/t-sky/t-ink` + `data-to/pre/suf`); positions in style.css §03 |
| Product pills | inline `--x` / `--y` on each `.pc-pill` |
| Band words | the two `.band-row` elements (keep both wider than the screen) |
| Currencies / flags | `cur` and `flags` arrays in script.js §06; flags are CSS classes `.f-xx` |
| Comparison maths | `rate` (USD base) and `providers` (`pct`, `fixed` in USD, `markup`) in script.js §07 |
| Code samples | the `code` object in script.js §10 (helpers S/K/N/C/F = string/keyword/number/comment/function) |
| Prices | `data-m` / `data-y` on `.plan-price span` |
| Notifications | the `msgs` array in script.js §06 |

Naming note: section classes are deliberately unique (`.cl` = collage card, `.code-ln` = code line, `.filled` = star). A shared class name such as `.cl` once broke the code window, so keep new names section-specific.

---

## 7. Responsive

- **≤1100px:**
  - The pill nav becomes a burger and the hero side notes hide.
  - Global, Developers, Team and FAQ stack, and the FAQ head stops being sticky.
  - The logo grid becomes 3×2, Stories become 2 columns, and the dev stat cards sit side by side.
- **≤900px:**
  - The hero photo grows to 150vw centred so the phone stays readable.
  - Section heads stack and the bento becomes one column.
  - The collage switches to its mobile layout (cards above and below the headline, 3 hidden, gentler parallax).
  - Plans and security cards go to one column.
- **≤600px:** pills, tags and chips shrink, product pills move to the top-left, the poster meta stacks and the calculator hides fee subtitles.

Tested at 1440×900 and 390×844 with no horizontal overflow, no console errors and no broken images.

## 8. Credits
Photography: Unsplash contributors (Unsplash licence). Font: Inter Tight (Google Fonts, OFL). Libraries: GSAP + ScrollTrigger (GreenSock standard licence), Lenis (MIT). Amper, its customers, logos and every figure on the page are fictional.
