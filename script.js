/* AMPER — interactions & motion
   Motion language: expo.out everywhere · masked rises for type · back.out pop for pills · letter roll on every clickable label */
gsap.registerPlugin(ScrollTrigger);
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const EASE = "expo.out";
const html = document.documentElement;
html.classList.add("is-loading");

/* ---------- smooth scroll ---------- */
const lenis = new Lenis({ lerp: 0.1 });
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add(t => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);
lenis.stop();
$$('a[href^="#"]').forEach(a => a.addEventListener("click", e => {
  const id = a.getAttribute("href");
  if (id.length < 2) return;
  const el = $(id); if (!el) return;
  e.preventDefault();
  html.classList.remove("menu-open");
  lenis.scrollTo(el, { offset: id === "#top" ? 0 : -80, duration: 1.4 });
}));

/* =========================================================
   Text builders
   ========================================================= */
// letter roll: label → two stacked copies of its letters; hover lifts both by 100%
const rollHTML = t => [...t].map((c, i) => `<i style="--i:${i}">${c}</i>`).join("");
$$(".btn > span, .roll > span, .nav-pill a > span").forEach(s => {
  const t = s.textContent;
  s.parentElement.setAttribute("aria-label", t);
  s.innerHTML = `<span class="rl"><span class="rl1">${rollHTML(t)}</span><span class="rl2" aria-hidden="true">${rollHTML(t)}</span></span>`;
});

// headings: lines (<br>) → masked lines → words (.words) or characters (.chars)
function splitText(el, unit) {
  el.innerHTML = el.innerHTML.split(/<br\s*\/?>/i).map(l => `<span class="ln">${l.trim()}</span>`).join("");
  $$(".ln", el).forEach(line => {
    [...line.childNodes].forEach(n => {
      if (n.nodeType !== 3) { const w = document.createElement("span"); w.className = unit === "chars" ? "ch" : "wd"; n.replaceWith(w); w.append(n); return; }
      const frag = document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach(tok => {
        if (!tok) return;
        if (/^\s+$/.test(tok)) { frag.append(" "); return; }
        if (unit === "chars") {
          const word = document.createElement("span"); word.style.whiteSpace = "nowrap"; word.style.display = "inline-block";
          [...tok].forEach(c => { const s = document.createElement("span"); s.className = "ch"; s.textContent = c; word.append(s); });
          frag.append(word);
        } else { const s = document.createElement("span"); s.className = "wd"; s.textContent = tok; frag.append(s); }
      });
      n.replaceWith(frag);
    });
  });
}
$$(".chars").forEach(el => splitText(el, "chars"));
$$(".words").forEach(el => splitText(el, "words"));

/* ---------- counters ---------- */
const fmt = (v, d) => v.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
function countUp(el, dur = 2) {
  const to = +el.dataset.to, d = +el.dataset.dec || 0, o = { v: 0 };
  return gsap.to(o, { v: to, duration: dur, ease: "power3.out", onUpdate: () => el.textContent = fmt(o.v, d) });
}

/* =========================================================
   Nav — progress line, sliding highlight, scroll-spy dot
   ========================================================= */
const nav = $(".nav");
ScrollTrigger.create({ start: 40, end: "max", onToggle: s => nav.classList.toggle("scrolled", s.isActive) });
gsap.to(".nav-progress", { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } });
$(".burger").addEventListener("click", () => html.classList.toggle("menu-open"));

(() => {
  const pill = $(".nav-pill"), hl = $(".nav-hl"), links = $$("a", pill);
  let active = null, hovering = false;
  const moveTo = (a, instant) => a
    ? gsap.to(hl, { x: a.offsetLeft, width: a.offsetWidth, opacity: 1, duration: instant ? 0 : 0.7, ease: EASE })
    : gsap.to(hl, { opacity: 0, duration: 0.3 });
  links.forEach(a => a.addEventListener("mouseenter", () => { hovering = true; moveTo(a, hl.style.opacity === "0" || !hl.style.opacity); }));
  pill.addEventListener("mouseleave", () => { hovering = false; moveTo(active); });
  links.forEach(a => {
    const sec = $("#" + a.dataset.sec);
    ScrollTrigger.create({
      trigger: sec, start: "top 45%", end: "bottom 45%",
      onToggle: s => {
        a.classList.toggle("active", s.isActive);
        if (s.isActive) active = a; else if (active === a) active = null;
        if (!hovering) moveTo(active);
      }
    });
  });
})();

/* =========================================================
   Loader — "Charging [word]" roll + counter + bar, then wipe
   ========================================================= */
const hero = gsap.timeline({ paused: true });
gsap.set(".hero .pill-note", { scale: 0.6, opacity: 0 });
gsap.set(".hero-media", { y: 140, opacity: 0 });
gsap.set(".hero-ctas, .hero-note, .nav", { opacity: 0, y: 20 });
hero
  .from(".hero h1 .ch", { yPercent: 115, rotate: 8, duration: 1.3, ease: EASE, stagger: 0.025, onComplete: () => $$(".hero h1 .ln").forEach(l => l.classList.add("done")) }, 0)
  .from(".hero h1 .h-bolt", { scale: 0, rotate: -40, duration: 1, ease: "back.out(2)" }, 0.5)
  .to(".nav", { opacity: 1, y: 0, duration: 1, ease: EASE }, 0.2)
  .to(".hero-media", { y: 0, opacity: 1, duration: 1.7, ease: EASE }, 0.1)
  .add(() => countUp($(".ui-bal .count"), 2.2), 0.5)
  .to(".hero-ctas, .hero-note", { opacity: 1, y: 0, duration: 1.1, ease: EASE, stagger: 0.08 }, 0.55)
  .from(".ui-card", { yPercent: 30, opacity: 0, duration: 1.2, ease: EASE }, 0.6)
  .from(".ui-people span, .ui-tx>div", { y: 14, opacity: 0, duration: 0.8, ease: EASE, stagger: 0.05 }, 0.9)
  .to(".hero .pill-note", { scale: 1, opacity: 1, duration: 0.9, ease: "back.out(1.8)", stagger: 0.35 }, 1.1);
$$(".hero .pill-note").forEach((p, i) =>
  gsap.to(p, { y: i % 2 ? 10 : -10, duration: 2.6 + i * 0.4, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 1.6 + i * 0.3 }));

(() => {
  const words = $$(".ld-words b"), n = words.length;
  const fill = $(".loader-fill"), num = $(".loader-num"), bar = $(".ld-bar i");
  const ready = new Promise(r => (document.readyState === "complete" ? r() : addEventListener("load", r)));
  const fonts = document.fonts ? document.fonts.ready : Promise.resolve();
  const p = { v: 0 };
  const tl = gsap.timeline();
  tl.from(".ld-line > *", { yPercent: 100, opacity: 0, duration: 0.9, ease: EASE, stagger: 0.08 })
    .to(p, {
      v: 100, duration: 2.4, ease: "power2.inOut",
      onUpdate: () => { num.textContent = Math.round(p.v); bar.style.width = p.v + "%"; fill.setAttribute("y", 40 - p.v * 0.4); }
    }, 0.2);
  // roll the words in step with the count
  for (let i = 1; i < n; i++) tl.to(".ld-words", { yPercent: -(100 / n) * i, duration: 0.55, ease: "expo.inOut" }, 0.2 + i * 0.5);
  tl.add(() => Promise.all([ready, fonts]).then(() => {
    html.classList.remove("is-loading");
    gsap.timeline()
      .to(".ld-line, .ld-bottom, .ld-top", { yPercent: -60, opacity: 0, duration: 0.6, ease: "power3.in", stagger: 0.05 })
      .to(".loader", { clipPath: "inset(0 0 100% 0)", duration: 1.1, ease: "expo.inOut" }, 0.35)
      .add(() => { hero.play(); lenis.start(); ScrollTrigger.refresh(); }, 0.75)
      .set(".loader", { display: "none" });
  }));
})();

/* hero scroll: headline drifts, the phone screen scrolls its own content */
gsap.to(".hero-head", { y: -80, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
gsap.to(".ui-scroll", { yPercent: -26, ease: "none", scrollTrigger: { trigger: ".hero", start: "8% top", end: "75% top", scrub: 0.6 } });

/* =========================================================
   Shared reveals
   ========================================================= */
$$(".words").forEach(el => gsap.from($$(".wd", el), {
  yPercent: 115, rotate: 4, duration: 1.2, ease: EASE, stagger: 0.035, onComplete: () => $$(".ln", el).forEach(l => l.classList.add("done")),
  scrollTrigger: { trigger: el, start: "top 88%" }
}));
$$(".eyebrow").forEach(el => {
  if (el.closest(".hero, .why")) return;
  gsap.from(el, { scale: 0.7, opacity: 0, duration: 0.9, ease: "back.out(1.8)", transformOrigin: "0% 50%", scrollTrigger: { trigger: el, start: "top 92%" } });
});
$$(".sec-head .sub, .sec-head .toggle, .sec-head .link").forEach(el => gsap.from(el, {
  y: 24, opacity: 0, duration: 1.1, ease: EASE, delay: 0.15, scrollTrigger: { trigger: el, start: "top 92%" }
}));

/* =========================================================
   02 Logos — one cell flips to a new logo every 1.6s
   ========================================================= */
(() => {
  const M = {
    circle: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="currentColor"/></svg>',
    half: '<svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 0 1 18 0z" fill="currentColor"/><path d="M3 14h18" stroke="currentColor" stroke-width="2"/></svg>',
    tri: '<svg viewBox="0 0 24 24"><path d="M12 3 22 20H2z" fill="currentColor"/></svg>',
    diamond: '<svg viewBox="0 0 24 24"><rect x="5" y="5" width="14" height="14" rx="3" transform="rotate(45 12 12)" fill="currentColor"/></svg>',
    dots: '<svg viewBox="0 0 24 24"><circle cx="7" cy="12" r="5" fill="currentColor"/><circle cx="17" cy="12" r="5" fill="none" stroke="currentColor" stroke-width="2.4"/></svg>',
    ring: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="3.2"/></svg>',
    plus: '<svg viewBox="0 0 24 24"><path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z" fill="currentColor"/></svg>',
    wave: '<svg viewBox="0 0 24 24"><path d="M2 9c3-3 6-3 10 0s7 3 10 0M2 16c3-3 6-3 10 0s7 3 10 0" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',
    arch: '<svg viewBox="0 0 24 24"><path d="M4 21V12a8 8 0 0 1 16 0v9h-5v-9a3 3 0 0 0-6 0v9z" fill="currentColor"/></svg>',
    sq: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="8" height="8" rx="2" fill="currentColor"/><rect x="13" y="13" width="8" height="8" rx="2" fill="currentColor"/><rect x="13" y="3" width="8" height="8" rx="4" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
    star: '<svg viewBox="0 0 24 24"><path d="M12 2l2.6 7.4L22 12l-7.4 2.6L12 22l-2.6-7.4L2 12l7.4-2.6z" fill="currentColor"/></svg>',
    slash: '<svg viewBox="0 0 24 24"><path d="M15 3h6L9 21H3z" fill="currentColor"/></svg>'
  };
  const pool = [["circle", "nordlys"], ["tri", "Fieldwork"], ["half", "halftone"], ["dots", "Oat & Co."], ["diamond", "Parcel"], ["wave", "kinfolk"],
    ["ring", "Lumen"], ["plus", "Okafor"], ["arch", "Monolith"], ["sq", "brightside"], ["star", "Verde"], ["slash", "Tidal"]];
  const cells = $$(".lcell"), shown = [];
  const make = i => { const d = document.createElement("div"); d.className = "lg"; d.innerHTML = M[pool[i][0]] + `<span>${pool[i][1]}</span>`; return d; };
  cells.forEach((c, i) => { c.append(make(i)); shown[i] = i; });
  gsap.from(".lg", { yPercent: 100, opacity: 0, duration: 1, ease: EASE, stagger: 0.07, scrollTrigger: { trigger: ".logos", start: "top 90%" } });
  let last = -1;
  setInterval(() => {
    if (document.hidden) return;
    let ci; do ci = Math.floor(Math.random() * cells.length); while (ci === last); last = ci;
    let next; do next = Math.floor(Math.random() * pool.length); while (shown.includes(next));
    const cell = cells[ci], old = $(".lg", cell), el = make(next); shown[ci] = next;
    cell.append(el);
    gsap.fromTo(el, { yPercent: 100 }, { yPercent: 0, duration: 0.9, ease: "expo.inOut" });
    gsap.to(old, { yPercent: -100, duration: 0.9, ease: "expo.inOut", onComplete: () => old.remove() });
  }, 1600);
})();

/* =========================================================
   03 Why — collage: cards deal in, dots pop, tags count up;
   each card drifts at its own scroll speed and leans away from the mouse
   ========================================================= */
(() => {
  const sec = $(".why"), cards = $$(".cl", sec);
  const st = { trigger: sec, start: "top 70%" };
  cards.forEach((c, i) => {
    const sp = +c.dataset.speed;
    // scroll parallax lives on the outer card…
    const amp = innerWidth < 900 ? 50 : 160;
    gsap.fromTo(c, { y: sp * amp }, { y: -sp * amp, ease: "none", scrollTrigger: { trigger: sec, start: "top bottom", end: "bottom top", scrub: 0.8 } });
    // …the entrance on the image, so the two never fight over a property
    gsap.from($(".cl-img", c), { scale: 0.4, opacity: 0, rotate: (i % 2 ? 1 : -1) * (6 + i), duration: 1.4, ease: EASE, delay: i * 0.07, scrollTrigger: st });
  });
  gsap.from($$(".cl-dot", sec), { scale: 0, duration: 1.1, ease: "back.out(2.2)", delay: 0.5, stagger: 0.08, scrollTrigger: st });
  gsap.from($$(".cl-tag", sec), { scale: 0.5, opacity: 0, duration: 0.9, ease: "back.out(1.8)", delay: 0.8, stagger: 0.15, scrollTrigger: st });
  gsap.from($$(".why-copy > *", sec), { y: 30, opacity: 0, duration: 1.2, ease: EASE, stagger: 0.1, scrollTrigger: st });
  ScrollTrigger.create({ ...st, once: true, onEnter: () => $$(".tn", sec).forEach(t => {
    const o = { v: 0 }, to = +t.dataset.to;
    gsap.to(o, { v: to, duration: 1.8, delay: 1, ease: "power3.out", onUpdate: () => t.textContent = t.dataset.pre + Math.round(o.v) + t.dataset.suf });
  }) });
  // mouse depth on the inner layer (x/y only)
  const movers = cards.map(c => {
    const d = (Math.abs(+c.dataset.speed) + 0.3) * 34;
    const el = $(".cl-in", c);
    return { d, x: gsap.quickTo(el, "x", { duration: 1, ease: "power3.out" }), y: gsap.quickTo(el, "y", { duration: 1, ease: "power3.out" }) };
  });
  if (matchMedia("(hover:hover)").matches) {
    sec.addEventListener("mousemove", e => {
      const r = sec.getBoundingClientRect(), mx = (e.clientX - r.left) / r.width - 0.5, my = (e.clientY - r.top) / r.height - 0.5;
      movers.forEach(m => { m.x(-mx * m.d); m.y(-my * m.d); });
    });
    sec.addEventListener("mouseleave", () => movers.forEach(m => { m.x(0); m.y(0); }));
  }
})();

/* the headline lights up word by word with scroll */
(() => {
  const h = $(".lit");
  [...h.childNodes].forEach(n => {
    if (n.nodeType !== 3) return;
    const frag = document.createDocumentFragment();
    n.textContent.split(/(\s+)/).forEach(t => {
      if (!t) return;
      if (/^\s+$/.test(t)) frag.append(t);
      else { const s = document.createElement("span"); s.className = "w"; s.textContent = t; frag.append(s); }
    });
    n.replaceWith(frag);
  });
  const items = $$(".w", h);
  ScrollTrigger.create({
    trigger: h, start: "top 80%", end: "bottom 45%", scrub: true,
    onUpdate: s => { const n = Math.round(s.progress * items.length); items.forEach((w, i) => w.classList.toggle("on", i < n)); }
  });
})();

/* =========================================================
   04 Products — clip reveal, inner parallax, pills pop
   ========================================================= */
$$(".pcard").forEach(c => {
  gsap.from(c, { clipPath: "inset(16% 10% 0% 10% round 28px)", y: 70, duration: 1.6, ease: EASE, scrollTrigger: { trigger: c, start: "top 92%" } });
  gsap.fromTo($(".pc-img img", c), { yPercent: -10, scale: 1.12 }, { yPercent: 0, scale: 1, ease: "none", scrollTrigger: { trigger: c, start: "top bottom", end: "bottom top", scrub: true } });
  gsap.from($$(".pill-note, .chip", c), { scale: 0.6, opacity: 0, duration: 0.9, ease: "back.out(1.8)", stagger: 0.15, scrollTrigger: { trigger: c, start: "top 70%" } });
  gsap.from($$(".pc-copy > *", c), { y: 30, opacity: 0, duration: 1.1, ease: EASE, stagger: 0.08, scrollTrigger: { trigger: c, start: "top 65%" } });
});

/* =========================================================
   05 Band — rows slide in opposite directions with scroll; bolts spin
   ========================================================= */
gsap.fromTo(".band .r1", { xPercent: 0 }, { xPercent: -28, ease: "none", scrollTrigger: { trigger: ".band", start: "top bottom", end: "bottom top", scrub: 0.6 } });
gsap.fromTo(".band .r2", { xPercent: -28 }, { xPercent: 0, ease: "none", scrollTrigger: { trigger: ".band", start: "top bottom", end: "bottom top", scrub: 0.6 } });
gsap.to(".band-bolt", { rotate: 360, ease: "none", scrollTrigger: { trigger: ".band", start: "top bottom", end: "bottom top", scrub: 0.6 } });

/* =========================================================
   06 Global — orbit of flags + currency list + notifications
   ========================================================= */
(() => {
  const flags = ["gb", "us", "eu", "jp", "ca", "ng", "fr", "de", "in", "mx", "se", "ch"];
  const spin = $(".orbit-spin");
  flags.forEach((f, i) => {
    const a = (i / flags.length) * Math.PI * 2 - Math.PI / 2;
    const d = document.createElement("span");
    d.className = `orbit-flag f-${f}`;
    d.style.left = 50 + 46 * Math.cos(a) + "%";
    d.style.top = 50 + 46 * Math.sin(a) + "%";
    spin.append(d);
  });
  const st = { trigger: ".orbit-wrap", start: "top 75%" };
  gsap.from(".orbit-flag", { scale: 0, duration: 1, ease: "back.out(2)", stagger: 0.06, scrollTrigger: st });
  gsap.from(".orbit-ring circle", { strokeDashoffset: 300, duration: 2.4, ease: EASE, scrollTrigger: st });
  gsap.from(".orbit-pill, .orbit-cap", { scale: 0.7, opacity: 0, duration: 1.1, ease: "back.out(1.6)", delay: 0.4, scrollTrigger: st });
  gsap.from(".cur-card", { y: 60, opacity: 0, duration: 1.3, ease: EASE, scrollTrigger: { trigger: ".cur-card", start: "top 88%" } });

  const cur = [["US Dollar", "us", "1.0000"], ["Euro", "eu", "0.9214"], ["British Pound", "gb", "0.7893"], ["Japanese Yen", "jp", "149.21"],
    ["Canadian Dollar", "ca", "1.3712"], ["Nigerian Naira", "ng", "1,540.2"], ["Indian Rupee", "in", "83.412"], ["Mexican Peso", "mx", "17.904"],
    ["Swiss Franc", "ch", "0.8810"], ["Swedish Krona", "se", "10.512"], ["Singapore Dollar", "sg", "1.3481"], ["Norwegian Krone", "no", "10.684"]];
  const track = $(".cur-track");
  track.innerHTML = [...cur, ...cur].map(([n, f, r]) => `<div class="cur"><i class="f-${f}"></i>${n}<small>${r}</small></div>`).join("");
  // step one row at a time instead of a constant crawl
  const rows = cur.length, tl = gsap.timeline({ repeat: -1 });
  for (let i = 1; i <= rows; i++) tl.to(track, { yPercent: -(50 / rows) * i, duration: 0.8, ease: "expo.inOut" }, i * 1.4);
  tl.set(track, { yPercent: 0 });

  const msgs = [
    ["You have an incoming transfer", "You received ₦70,000,000 from Femi Ogunsanya"],
    ["Payout delivered", "€8,400.00 arrived in Lisbon in 9 seconds"],
    ["Invoice paid", "Nordlys AS paid $12,480.00 · Invoice #2048"],
    ["Budget topped up", "Team Design budget refilled to $5,000"]
  ];
  const nt = $(".notify"), nb = $(".notify>div>b"), ns = $(".notify>div>small");
  let k = 0;
  gsap.set(nt, { y: 30, opacity: 0, scale: 0.94 });
  ScrollTrigger.create({
    trigger: ".orbit-wrap", start: "top 60%", once: true, onEnter: () => {
      gsap.to(nt, { y: 0, opacity: 1, scale: 1, duration: 1, ease: "back.out(1.6)" });
      setInterval(() => {
        gsap.timeline()
          .to(nt, { y: -16, opacity: 0, duration: 0.45, ease: "power2.in" })
          .add(() => { k = (k + 1) % msgs.length; nb.textContent = msgs[k][0]; ns.textContent = msgs[k][1]; })
          .fromTo(nt, { y: 26, opacity: 0, scale: 0.94 }, { y: 0, opacity: 1, scale: 1, duration: 0.9, ease: "back.out(1.6)" });
      }, 4200);
    }
  });
})();

/* =========================================================
   07 Compare — live recipient amounts per provider
   ========================================================= */
(() => {
  const rate = { USD: 1, EUR: 0.9214, GBP: 0.7893, JPY: 149.21, INR: 83.412, NGN: 1540.2, CAD: 1.3712, MXN: 17.904 };
  const flag = { USD: "us", EUR: "eu", GBP: "gb", JPY: "jp", INR: "in", NGN: "ng", CAD: "ca", MXN: "mx" };
  const providers = [
    { name: "Amper", best: true, pct: 0.0041, fixed: 0, markup: 0, logo: '<svg style="width:48px;height:48px;color:#0d1f12"><use href="#mark"/></svg>' },
    { name: "High-street bank", pct: 0.005, fixed: 25, markup: 0.029, logo: "B", bg: "#dbe8ff", fg: "#1d4ed8" },
    { name: "Card network", pct: 0.01, fixed: 0, markup: 0.022, logo: "C", bg: "#ffe1dc", fg: "#c2410c" },
    { name: "Legacy wire", pct: 0, fixed: 35, markup: 0.016, logo: "W", bg: "#ece7ff", fg: "#6d28d9" }
  ];
  const amtEl = $("#cmpAmt"), fromEl = $("#cmpFrom"), toEl = $("#cmpTo"), rows = $("#cmpRows");
  const fromFlag = $(".cmp-field.sel .flag-dot"), toFlag = $("#toFlag");
  rows.innerHTML = providers.map(p => `<div class="cmp-row${p.best ? " best" : ""}"><span class="cmp-bar"></span>
    <span class="cmp-logo" style="${p.bg ? `background:${p.bg};color:${p.fg}` : ""}">${p.logo}</span>
    <span class="cmp-name"><b>${p.name}</b><small></small></span><span class="cmp-val"></span></div>`).join("");
  const rowEls = $$(".cmp-row", rows);
  const shown = providers.map(() => ({ v: 0 }));
  function calc() {
    const amt = parseFloat(amtEl.value.replace(/[^0-9.]/g, "")) || 0;
    let from = fromEl.value, to = toEl.value;
    if (from === to) { toEl.value = to = from === "EUR" ? "GBP" : "EUR"; }
    fromFlag.className = `flag-dot f-${flag[from]}`;
    toFlag.className = `flag-dot f-${flag[to]}`;
    const mid = rate[to] / rate[from], usd = 1 / rate[from], dec = to === "JPY" ? 0 : 2;
    const res = providers.map(p => {
      const fee = amt * p.pct + p.fixed / usd;
      const got = Math.max(0, (amt - fee) * mid * (1 - p.markup));
      return { got, cost: amt - got / mid };
    });
    const vals = res.map(r => r.got), max = Math.max(...vals), min = Math.min(...vals);
    const worst = Math.max(...res.map(r => r.cost));
    rowEls.forEach((row, i) => {
      row.style.setProperty("--w", (max === min ? 100 : 52 + 48 * (vals[i] - min) / (max - min)) + "%");
      $("small", row).textContent = i === 0 ? `Save up to ${fmt(worst - res[0].cost, 2)} ${from} in total fees` : `${fmt(res[i].cost, 2)} ${from} in total fees`;
      const el = $(".cmp-val", row);
      gsap.to(shown[i], { v: vals[i], duration: 0.9, ease: "power3.out", overwrite: true, onUpdate: () => el.textContent = `${fmt(shown[i].v, dec)} ${to}` });
    });
  }
  amtEl.addEventListener("input", () => {
    const raw = amtEl.value.replace(/[^0-9.]/g, ""), n = parseFloat(raw);
    if (!isNaN(n) && !raw.endsWith(".")) amtEl.value = n.toLocaleString("en-US", { maximumFractionDigits: 2 });
    calc();
  });
  fromEl.addEventListener("change", calc); toEl.addEventListener("change", calc);
  rowEls.forEach(r => r.style.setProperty("--w", "0%"));
  gsap.from(".cmp", { y: 80, opacity: 0, duration: 1.4, ease: EASE, scrollTrigger: { trigger: ".cmp", start: "top 92%" } });
  ScrollTrigger.create({ trigger: ".cmp", start: "top 70%", once: true, onEnter: calc });
})();

/* =========================================================
   08 Team — ring fills with scroll, contributions pop
   ========================================================= */
gsap.to(".tr-arc", { strokeDashoffset: 0.3, ease: "none", scrollTrigger: { trigger: ".team-card", start: "top 80%", end: "center 40%", scrub: 1 } });
gsap.from(".av-pill", { scale: 0.5, opacity: 0, duration: 0.9, ease: "back.out(1.8)", stagger: 0.25, scrollTrigger: { trigger: ".team-card", start: "top 60%" } });
gsap.fromTo(".team-img", { scale: 1.18 }, { scale: 1, ease: "none", scrollTrigger: { trigger: ".team-card", start: "top bottom", end: "bottom top", scrub: true } });
gsap.from(".team-word", { y: 40, opacity: 0, duration: 1.2, ease: EASE, scrollTrigger: { trigger: ".team-card", start: "top 65%" } });
gsap.from(".ticks li", { x: -20, opacity: 0, duration: 1, ease: EASE, stagger: 0.1, scrollTrigger: { trigger: ".ticks", start: "top 85%" } });

/* =========================================================
   09 Stat
   ========================================================= */
$(".stat-num .count").textContent = "0";
ScrollTrigger.create({ trigger: ".stat-num", start: "top 85%", once: true, onEnter: () => countUp($(".stat-num .count"), 2.4) });
gsap.from(".stat-photo", { clipPath: "inset(20% 12% 0 12% round 28px)", duration: 1.6, ease: EASE, scrollTrigger: { trigger: ".stat-photo", start: "top 90%" } });
gsap.fromTo(".stat-photo img", { yPercent: -25 }, { yPercent: 0, ease: "none", scrollTrigger: { trigger: ".stat-photo", start: "top bottom", end: "bottom top", scrub: true } });
gsap.from(".stat-num", { yPercent: 40, opacity: 0, duration: 1.4, ease: EASE, scrollTrigger: { trigger: ".stat-num", start: "top 90%" } });
gsap.from(".stat > .chip, .stat .btn, .stat-small", { y: 20, opacity: 0, duration: 1, ease: EASE, stagger: 0.1, scrollTrigger: { trigger: ".stat", start: "top 80%" } });

/* =========================================================
   10 Developers — counters, sliding tab highlight, typed code
   ========================================================= */
(() => {
  $$(".stat-card .count").forEach(c => { c.textContent = "0"; ScrollTrigger.create({ trigger: c, start: "top 90%", once: true, onEnter: () => countUp(c, 2) }); });
  gsap.from(".stat-card", { y: 60, opacity: 0, duration: 1.2, ease: EASE, stagger: 0.1, scrollTrigger: { trigger: ".dev-grid", start: "top 85%" } });

  const S = s => `<span class="s">${s}</span>`, K = s => `<span class="k">${s}</span>`, N = s => `<span class="n">${s}</span>`,
        C = s => `<span class="c">${s}</span>`, F = s => `<span class="f">${s}</span>`;
  const code = {
    node: [`${K("import")} Amper ${K("from")} ${S("'@amper/node'")};`, ``, `${K("const")} amper = ${K("new")} ${F("Amper")}(process.env.AMPER_KEY);`, ``,
      `${C("// Pay a contractor in Lisbon, in euros")}`, `${K("const")} transfer = ${K("await")} amper.transfers.${F("create")}({`, `  amount: ${N("8400_00")},`,
      `  currency: ${S("'EUR'")},`, `  from: ${S("'acct_usd_main'")},`, `  to: { iban: ${S("'PT50 0002 0123 1234 5678 9015 4'")} },`,
      `  reference: ${S("'Invoice 0192 — October'")},`, `});`, ``, `transfer.status; ${C("// → 'completed' in 9s")}`],
    python: [`${K("import")} amper`, ``, `client = amper.${F("Client")}(api_key=os.environ[${S('"AMPER_KEY"')}])`, ``, `${C("# Pay a contractor in Lisbon, in euros")}`,
      `transfer = client.transfers.${F("create")}(`, `    amount=${N("840000")},`, `    currency=${S('"EUR"')},`, `    source=${S('"acct_usd_main"')},`,
      `    destination={${S('"iban"')}: ${S('"PT50 0002 0123 1234 5678 9015 4"')}},`, `    reference=${S('"Invoice 0192 — October"')},`, `)`, ``,
      `transfer.status  ${C("# → 'completed' in 9s")}`],
    curl: [`curl https://api.amper.dev/v1/transfers \\`, `  -u ${S("$AMPER_KEY:")} \\`, `  -d amount=${N("840000")} \\`, `  -d currency=${S("EUR")} \\`,
      `  -d from=${S("acct_usd_main")} \\`, `  -d ${S('"to[iban]=PT50 0002 0123 1234 5678 9015 4"')} \\`, `  -d reference=${S('"Invoice 0192 — October"')}`, ``,
      `${C("# {")}`, `${C('#   "id": "tr_9Kd2…",')}`, `${C('#   "status": "completed",')}`, `${C('#   "arrived_in": "9s"')}`, `${C("# }")}`]
  };
  const el = $("#codeEl"), hl = $(".code-hl"), tabs = $$(".code-tabs button");
  // CSS transitions animate the highlight (see .code-hl)
  const place = b => { hl.style.transform = `translateX(${b.offsetLeft}px)`; hl.style.width = b.offsetWidth + "px"; };
  function show(lang) {
    el.innerHTML = code[lang].map(l => `<span class="code-ln">${l || " "}</span>`).join("") + `<span class="cur-blink"></span>`;
    gsap.from($$(".code-ln", el), { opacity: 0, x: -10, duration: 0.5, ease: "power2.out", stagger: 0.06 });
  }
  tabs.forEach(b => b.addEventListener("click", () => {
    tabs.forEach(x => x.classList.toggle("on", x === b));
    place(b); show(b.dataset.lang);
  }));
  requestAnimationFrame(() => place(tabs[0]));
  addEventListener("resize", () => place($(".code-tabs button.on")));
  ScrollTrigger.create({ trigger: ".code", start: "top 75%", once: true, onEnter: () => show("node") });
  gsap.from(".code", { y: 80, opacity: 0, duration: 1.4, ease: EASE, scrollTrigger: { trigger: ".code", start: "top 90%" } });
  gsap.from(".code-pill", { scale: 0.6, opacity: 0, duration: 0.9, ease: "back.out(1.8)", delay: 1.2, scrollTrigger: { trigger: ".code", start: "top 75%" } });
})();

/* =========================================================
   11 Stories — tiles deal in like cards
   ========================================================= */
$$(".tile").forEach((t, i) => {
  gsap.from(t, { y: 90, rotate: i % 2 ? 3 : -3, opacity: 0, duration: 1.3, ease: EASE, delay: (i % 4) * 0.08, scrollTrigger: { trigger: t, start: "top 95%" } });
  const img = $(":scope > img", t);
  if (img) gsap.fromTo(img, { scale: 1.2 }, { scale: 1, ease: "none", scrollTrigger: { trigger: t, start: "top bottom", end: "bottom top", scrub: true } });
});

/* =========================================================
   12 Security — cards rise; rows check in, chat types, stars fill
   ========================================================= */
gsap.from(".scard", { y: 80, rotate: 2, opacity: 0, duration: 1.3, ease: EASE, stagger: 0.1, scrollTrigger: { trigger: ".scards", start: "top 85%" } });
gsap.from(".s-rows span", { x: -20, opacity: 0, duration: 0.8, ease: EASE, stagger: 0.12, scrollTrigger: { trigger: ".scards", start: "top 65%" } });
gsap.from(".s-chat span", { scale: 0.6, opacity: 0, duration: 0.8, ease: "back.out(1.8)", stagger: 0.7, transformOrigin: (i) => i ? "100% 100%" : "0% 100%", scrollTrigger: { trigger: ".scards", start: "top 65%" } });
ScrollTrigger.create({ trigger: ".scards", start: "top 60%", once: true, onEnter: () => {
  $$(".s-stars svg").forEach((s, i) => setTimeout(() => s.classList.add("filled"), 120 * i));
  gsap.from(".s-stars svg", { scale: 0.4, duration: 0.6, ease: "back.out(3)", stagger: 0.12 });
} });

/* =========================================================
   13 Pricing — toggle knob + rolling prices
   ========================================================= */
(() => {
  const btns = $$(".toggle button"), knob = $(".toggle-knob");
  const place = b => gsap.set(knob, { x: b.offsetLeft, width: b.offsetWidth });
  requestAnimationFrame(() => place(btns[0]));
  addEventListener("resize", () => place($(".toggle button.on")));
  btns.forEach(b => b.addEventListener("click", () => {
    btns.forEach(x => x.classList.toggle("on", x === b));
    place(b);
    $$(".plan-price span").forEach(s => gsap.timeline()
      .to(s, { yPercent: -100, duration: 0.3, ease: "power2.in" })
      .add(() => s.textContent = s.dataset[b.dataset.bill])
      .fromTo(s, { yPercent: 100 }, { yPercent: 0, duration: 0.7, ease: EASE }));
  }));
  gsap.from(".plan", { y: 80, opacity: 0, duration: 1.3, ease: EASE, stagger: 0.1, scrollTrigger: { trigger: ".plans", start: "top 85%" } });
})();

/* =========================================================
   14 FAQ — animated <details>
   ========================================================= */
gsap.from(".qa", { y: 30, opacity: 0, duration: 1, ease: EASE, stagger: 0.06, scrollTrigger: { trigger: ".qa-list", start: "top 85%" } });
$$(".qa").forEach(d => {
  const s = $("summary", d), a = $(".qa-a", d);
  s.addEventListener("click", e => {
    e.preventDefault();
    if (d.open) gsap.to(a, { height: 0, duration: 0.5, ease: "power3.inOut", onComplete: () => { d.open = false; gsap.set(a, { clearProps: "height" }); ScrollTrigger.refresh(); } });
    else { d.open = true; gsap.from(a, { height: 0, duration: 0.7, ease: EASE, onComplete: () => ScrollTrigger.refresh() }); }
  });
});

/* =========================================================
   15 CTA + footer — letter rises; footer letters lift toward the cursor
   ========================================================= */
function letterSplit(el) {
  const txt = el.childNodes[0].textContent;
  el.childNodes[0].replaceWith(...[...txt].map(ch => {
    const m = document.createElement("span"); m.className = "fm";
    const i = document.createElement("span"); i.className = "fl"; i.textContent = /\s/.test(ch) ? "\u00a0" : ch;
    m.append(i); return m;
  }));
}
letterSplit($(".cta-word"));
gsap.from(".cta-word .fl", { yPercent: 105, duration: 1.3, ease: EASE, stagger: 0.05, onComplete: () => $$(".cta-word .fm").forEach(m => m.classList.add("done")), scrollTrigger: { trigger: ".cta-word", start: "top 88%" } });
gsap.fromTo(".cta-img", { scale: 1.2 }, { scale: 1, ease: "none", scrollTrigger: { trigger: ".cta", start: "top bottom", end: "bottom bottom", scrub: true } });
gsap.from(".cta-bot > *, .cta-top .chip", { y: 30, opacity: 0, duration: 1.1, ease: EASE, stagger: 0.1, scrollTrigger: { trigger: ".cta", start: "top 60%" } });

(() => {
  const fw = $(".foot-word");
  const dot = $(".dot", fw);
  letterSplit(fw);
  const dotWrap = document.createElement("span"); dotWrap.className = "fm";
  dot.classList.add("fl"); dot.replaceWith(dotWrap); dotWrap.append(dot);
  const letters = $$(".fl", fw);
  gsap.from(letters, { yPercent: 105, duration: 1.2, ease: EASE, stagger: 0.035, onComplete: () => $$(".fm", fw).forEach(m => m.classList.add("done")), scrollTrigger: { trigger: fw, start: "top 92%" } });
  const setters = letters.map(l => gsap.quickTo(l, "y", { duration: 0.6, ease: "power3.out" }));
  fw.addEventListener("mousemove", e => letters.forEach((l, i) => {
    const r = l.getBoundingClientRect(), d = Math.abs(e.clientX - (r.left + r.width / 2));
    setters[i](-Math.max(0, 1 - d / 220) * r.height * 0.18);
  }));
  fw.addEventListener("mouseleave", () => setters.forEach(s => s(0)));
})();

addEventListener("load", () => ScrollTrigger.refresh());
