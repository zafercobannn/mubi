/* sana */

const TOLGA = "Yönetmen Gülmekten Ara İstedi🤣 #Shorts #TolgaÇevik #ArkadaşımHoşgeldin - Arkadaşım Hoşgeldin (1080p).mp4";
const SIBEL = "Sibel Can'ın Çikolata Aşkı! #sibelcan - 5 dakika magazin (474p).mp4";

const scenes = Array.from(document.querySelectorAll(".scene"));
let current  = 0;

/* ── navigation ── */
function goTo(idx) {
  if (idx < 0 || idx >= scenes.length) return;
  onLeave(current + 1);
  scenes[current].classList.remove("active");
  current = idx;
  scenes[current].classList.add("active");
  updateProgress();
  onEnter(current + 1);
}
const next = () => goTo(current + 1);

document.querySelectorAll("[data-next]").forEach(b => b.addEventListener("click", next));
document.addEventListener("keydown", e => {
  if (e.key === "ArrowRight" || e.key === " ") {
    const b = scenes[current].querySelector(".btn:not(.hidden)");
    if (b) { e.preventDefault(); b.click(); }
  }
});

/* ── progress ── */
function updateProgress() {
  const bar = document.getElementById("progress-bar");
  if (bar) bar.style.width = Math.round(((current + 1) / scenes.length) * 100) + "%";
}

/* ── cat spin ── */
(function () {
  const gif = document.getElementById("cat-gif");
  const btn = document.querySelector('[data-scene="1"] .btn');
  if (!gif) return;
  let done = false;
  gif.addEventListener("click", () => {
    if (done) return;
    done = true;
    gif.classList.add("spin");
    setTimeout(() => btn && btn.classList.remove("hidden"), 1400);
  });
})();

/* ── video sources ── */
(function () {
  const set = (id, file) => {
    const el = document.getElementById(id);
    if (el) el.src = encodeURIComponent(file);
  };
  set("tolga-video", TOLGA);
  set("sibel-video", SIBEL);
})();

/* ── leave hooks ── */
function onLeave(n) {
  const pause = id => { const v = document.getElementById(id); v && !v.paused && v.pause(); };
  if (n === 2) pause("tolga-video");
  if (n === 10) pause("sibel-video");
}

/* ── enter hooks ── */
function onEnter(n) {
  const play = id => { const v = document.getElementById(id); if (v) { v.currentTime = 0; v.play().catch(() => {}); }};
  if (n === 10) play("sibel-video");
}

updateProgress();
