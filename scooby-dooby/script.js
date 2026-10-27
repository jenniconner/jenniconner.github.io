// ============================================================
//  EDIT THESE LISTS to match the files you put in each folder.
//  Paths are relative to index.html.
// ============================================================
const SCOOBY_SOUNDS = [
  "audio/scooby/scooby1.mp3",
  "audio/scooby/scooby2.mp3",
  "audio/scooby/scooby3.mp3",
  "audio/scooby/scooby4.mp3",
  "audio/scooby/scooby5.mp3",
];

const DOOBY_SOUNDS = [
  "audio/dooby/dooby1.mp3",
  "audio/dooby/dooby2.mp3",
  "audio/dooby/dooby3.mp3",
  "audio/dooby/dooby4.mp3",
  "audio/dooby/dooby5.mp3",
];

// Your own image files (put them in the images/ folder).
// If none load, the page falls back to emoji so you can still test it.
const IMAGES = [
  "images/scooby1.png",
  "images/scooby2.png",
  "images/scooby3.png",
  "images/scooby4.png",
];

const FALLBACK_EMOJI = ["🐾", "🦴", "👻", "🔦", "🍔"];
const SPRITES_PER_PRESS = 18;
const BURST_DURATION_MS = 3500;
// ============================================================

const burst = document.getElementById("burst");
const btnScooby = document.getElementById("btn-scooby");
const btnDooby = document.getElementById("btn-dooby");

const lastPlayed = { scooby: -1, dooby: -1 };
let currentAudio = null;
let clearTimer = null;

const rand = (min, max) => Math.random() * (max - min) + min;

function pickIndex(list, last) {
  if (list.length <= 1) return 0;
  let i;
  do { i = Math.floor(Math.random() * list.length); } while (i === last);
  return i;
}

function playRandom(kind) {
  const list = kind === "scooby" ? SCOOBY_SOUNDS : DOOBY_SOUNDS;
  if (!list.length) return;
  const i = pickIndex(list, lastPlayed[kind]);
  lastPlayed[kind] = i;

  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }
  currentAudio = new Audio(list[i]);
  currentAudio.play().catch(() => {
    console.warn("Couldn't play", list[i], "- check the file name and path.");
  });
}

function makeSprite() {
  const el = document.createElement("div");
  el.className = "sprite";

  const useImage = IMAGES.length > 0;
  if (useImage) {
    const img = new Image();
    img.src = IMAGES[Math.floor(Math.random() * IMAGES.length)];
    img.alt = "";
    img.onerror = () => {
      el.textContent = FALLBACK_EMOJI[Math.floor(Math.random() * FALLBACK_EMOJI.length)];
    };
    el.appendChild(img);
  } else {
    el.textContent = FALLBACK_EMOJI[Math.floor(Math.random() * FALLBACK_EMOJI.length)];
  }

  el.style.left = rand(0, 92) + "vw";
  el.style.top = rand(0, 88) + "vh";
  return el;
}

function spawnBurst() {
  burst.innerHTML = "";
  clearTimeout(clearTimer);

  for (let n = 0; n < SPRITES_PER_PRESS; n++) {
    const el = makeSprite();
    burst.appendChild(el);

    const spin = (Math.random() < 0.5 ? -1 : 1) * rand(360, 1080);
    const small = rand(0.3, 0.7);
    const big = rand(1.5, 2.8);
    const dur = rand(1200, 2400);

    el.animate(
      [
        { transform: `rotate(0deg) scale(${small})`, opacity: 0 },
        { transform: `rotate(${spin * 0.25}deg) scale(${big})`, opacity: 1, offset: 0.25 },
        { transform: `rotate(${spin * 0.5}deg) scale(${small})`, opacity: 1, offset: 0.5 },
        { transform: `rotate(${spin * 0.75}deg) scale(${big})`, opacity: 1, offset: 0.75 },
        { transform: `rotate(${spin}deg) scale(${small})`, opacity: 1 },
      ],
      { duration: dur, iterations: Infinity, delay: rand(0, 300), easing: "ease-in-out" }
    );
  }

  clearTimer = setTimeout(() => {
    burst.querySelectorAll(".sprite").forEach((el) => {
      el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400, fill: "forwards" });
    });
    setTimeout(() => (burst.innerHTML = ""), 420);
  }, BURST_DURATION_MS);
}

function trigger(kind) {
  playRandom(kind);
  spawnBurst();
  const btn = kind === "scooby" ? btnScooby : btnDooby;
  btn.classList.add("pressed");
  setTimeout(() => btn.classList.remove("pressed"), 120);
}

btnScooby.addEventListener("click", () => trigger("scooby"));
btnDooby.addEventListener("click", () => trigger("dooby"));

document.addEventListener("keydown", (e) => {
  if (e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
  const k = e.key.toLowerCase();
  if (k === "s") trigger("scooby");
  else if (k === "d") trigger("dooby");
});
