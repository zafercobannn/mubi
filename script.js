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
  const btn = document.querySelector('[data-scene="2"] .btn');
  if (!gif) return;
  let done = false;
  gif.addEventListener("click", () => {
    if (done) return;
    done = true;
    gif.classList.add("spin");
    setTimeout(() => btn && btn.classList.remove("hidden"), 1400);
  });
})();

/* ── sudoku ── */
(function () {
  /* puzzle + solution (0 = empty) */
  const PUZZLE = [
    [0,0,0, 2,6,0, 7,0,1],
    [6,8,0, 0,7,0, 0,9,0],
    [1,9,0, 0,0,4, 5,0,0],
    [8,2,0, 1,0,0, 0,4,0],
    [0,0,4, 6,0,2, 9,0,0],
    [0,5,0, 0,0,3, 0,2,8],
    [0,0,9, 3,0,0, 0,7,4],
    [0,4,0, 0,5,0, 0,3,6],
    [7,0,3, 0,1,8, 0,0,0],
  ];
  const SOLUTION = [
    [4,3,5, 2,6,9, 7,8,1],
    [6,8,2, 5,7,1, 4,9,3],
    [1,9,7, 8,3,4, 5,6,2],
    [8,2,6, 1,9,5, 3,4,7],
    [3,7,4, 6,8,2, 9,1,5],
    [9,5,1, 7,4,3, 6,2,8],
    [5,1,9, 3,2,6, 8,7,4],
    [2,4,8, 9,5,7, 1,3,6],
    [7,6,3, 4,1,8, 2,5,9],
  ];

  /* ─── DEMO — gerçek cümle gelince sadece bu iki sabit değişecek ───
     CIPHER: her rakamın hangi harfe karşılık geleceği (1–9)
     MSG_CELLS: çözümde sırayla okunacak hücreler [satır, sütun] 1-indexli
     şu anki demo "SELAM" kelimesini oluşturuyor:
       1,9 → 1 (S)  ·  1,4 → 2 (E)  ·  1,2 → 3 (L)  ·  1,1 → 4 (A)  ·  1,3 → 5 (M)
  */
  const CIPHER = {
    1: "S", 2: "E", 3: "L", 4: "A", 5: "M",
    6: "N", 7: "Y", 8: "O", 9: "R",
  };
  const MSG_CELLS = [
    [1, 9], [1, 4], [1, 2], [1, 1], [1, 3],
  ];
  /* ─────────────────────────────────────────────────────────────── */

  const grid = document.getElementById("sudoku-grid");
  if (!grid) return;

  const state = PUZZLE.map(r => r.slice());
  const cells = [];
  let selected = null;
  let mode = "digit"; // "digit" | "letter"

  for (let r = 0; r < 9; r++) {
    cells[r] = [];
    for (let c = 0; c < 9; c++) {
      const div = document.createElement("div");
      div.className = "sud-cell";
      div.dataset.row = r;
      div.dataset.col = c;
      const v = PUZZLE[r][c];
      if (v !== 0) {
        div.textContent = v;
        div.classList.add("given");
      }
      div.addEventListener("click", () => selectCell(r, c));
      grid.appendChild(div);
      cells[r][c] = div;
    }
  }

  function selectCell(r, c) {
    const el = cells[r][c];
    if (mode === "digit") {
      if (PUZZLE[r][c] !== 0) { selected = null; highlight(r, c); return; }
      selected = { r, c };
      highlight(r, c);
    } else {
      if (!el.classList.contains("msg")) return;
      selected = { r, c };
      highlightMsg(r, c);
    }
  }

  function highlight(r, c) {
    const val = state[r][c];
    cells.forEach((row, ri) => row.forEach((el, ci) => {
      el.classList.remove("selected", "peer", "same-num");
      if (ri === r && ci === c) el.classList.add("selected");
      else if (ri === r || ci === c || (Math.floor(ri/3) === Math.floor(r/3) && Math.floor(ci/3) === Math.floor(c/3))) el.classList.add("peer");
      if (val !== 0 && state[ri][ci] === val && !(ri === r && ci === c)) el.classList.add("same-num");
    }));
  }

  function highlightMsg(r, c) {
    cells.forEach(row => row.forEach(el => el.classList.remove("selected", "peer", "same-num")));
    cells[r][c].classList.add("selected");
  }

  function placeDigit(n) {
    if (!selected || mode !== "digit") return;
    const { r, c } = selected;
    if (PUZZLE[r][c] !== 0) return;
    state[r][c] = n;
    const el = cells[r][c];
    el.textContent = n === 0 ? "" : n;
    el.classList.toggle("error", n !== 0 && n !== SOLUTION[r][c]);
    highlight(r, c);
    checkSolved();
  }

  function placeLetter(letter) {
    if (!selected || mode !== "letter") return;
    const { r, c } = selected;
    const el = cells[r][c];
    if (!el.classList.contains("msg")) return;
    if (letter === "") {
      el.textContent = "";
      el.classList.remove("msg-filled", "msg-wrong");
      return;
    }
    const up = letter.toLocaleUpperCase("tr");
    const expected = (el.dataset.expected || "").toLocaleUpperCase("tr");
    if (up === expected) {
      el.textContent = up;
      el.classList.add("msg-filled");
      el.classList.remove("msg-wrong");
      const order = +el.dataset.msgOrder;
      if (order < MSG_CELLS.length) {
        const [nr, nc] = MSG_CELLS[order];
        selectCell(nr - 1, nc - 1);
      }
      checkAllLettersFilled();
    } else {
      el.classList.remove("msg-filled");
      el.classList.add("msg-wrong");
      setTimeout(() => el.classList.remove("msg-wrong"), 420);
    }
  }

  function checkAllLettersFilled() {
    const all = MSG_CELLS.every(([r, c]) => cells[r - 1][c - 1].classList.contains("msg-filled"));
    if (all) {
      const btn = document.querySelector('[data-scene="1"] [data-next]');
      if (btn) btn.classList.remove("hidden");
    }
  }

  function bindDigitPad() {
    const pad = document.getElementById("sudoku-pad");
    pad.innerHTML = "";
    for (let i = 1; i <= 9; i++) {
      const b = document.createElement("button");
      b.className = "pad-btn";
      b.dataset.num = i;
      b.textContent = i;
      b.addEventListener("click", () => placeDigit(i));
      pad.appendChild(b);
    }
    const del = document.createElement("button");
    del.className = "pad-btn erase";
    del.textContent = "sil";
    del.addEventListener("click", () => placeDigit(0));
    pad.appendChild(del);
  }

  function renderLetterPad() {
    const pad = document.getElementById("sudoku-pad");
    pad.innerHTML = "";
    const letters = [];
    MSG_CELLS.forEach(([r, c]) => {
      const expected = CIPHER[SOLUTION[r - 1][c - 1]];
      if (expected && !letters.includes(expected)) letters.push(expected);
    });
    letters.forEach(l => {
      const b = document.createElement("button");
      b.className = "pad-btn";
      b.textContent = l;
      b.addEventListener("click", () => placeLetter(l));
      pad.appendChild(b);
    });
    const del = document.createElement("button");
    del.className = "pad-btn erase";
    del.textContent = "sil";
    del.addEventListener("click", () => placeLetter(""));
    pad.appendChild(del);
    pad.classList.add("letter-mode");
  }

  bindDigitPad();

  function autoSolve() {
    for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) {
      if (PUZZLE[r][c] === 0) {
        state[r][c] = SOLUTION[r][c];
        cells[r][c].textContent = SOLUTION[r][c];
        cells[r][c].classList.remove("error");
      }
    }
    checkSolved();
  }

  document.addEventListener("keydown", e => {
    const active = document.querySelector(".scene.active");
    if (!active || active.dataset.scene !== "1") return;
    if (e.altKey && (e.key === "a" || e.key === "A" || e.key === "å")) {
      e.preventDefault();
      if (mode === "digit") autoSolve();
      return;
    }
    if (!selected) return;
    if (mode === "digit") {
      if (/^[1-9]$/.test(e.key)) { placeDigit(+e.key); e.preventDefault(); }
      else if (e.key === "Backspace" || e.key === "Delete" || e.key === "0") { placeDigit(0); e.preventDefault(); }
    } else {
      if (/^[a-zA-ZçğıöşüÇĞİÖŞÜ]$/.test(e.key)) { placeLetter(e.key); e.preventDefault(); }
      else if (e.key === "Backspace" || e.key === "Delete") { placeLetter(""); e.preventDefault(); }
    }
  });

  function checkSolved() {
    for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) {
      if (state[r][c] !== SOLUTION[r][c]) return;
    }
    reveal();
  }

  function reveal() {
    mode = "letter";
    MSG_CELLS.forEach(([r, c], i) => {
      const el = cells[r - 1]?.[c - 1];
      if (!el) return;
      el.classList.add("msg");
      el.classList.remove("given", "selected", "peer", "same-num", "error");
      el.dataset.msgOrder = i + 1;
      el.dataset.expected = CIPHER[SOLUTION[r - 1][c - 1]] || "";
      el.textContent = "";
    });
    const cb = document.getElementById("cipher-box");
    cb.innerHTML = "";
    for (let n = 1; n <= 9; n++) {
      const s = document.createElement("div");
      s.className = "chip";
      s.innerHTML = `<b>${n}</b><i>${CIPHER[n] || "?"}</i>`;
      cb.appendChild(s);
    }
    document.getElementById("sudoku-reveal").classList.remove("hidden");
    renderLetterPad();
    const [fr, fc] = MSG_CELLS[0];
    selectCell(fr - 1, fc - 1);
  }
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
  if (n === 3) pause("tolga-video");
  if (n === 10) pause("sibel-video");
}

/* ── enter hooks ── */
function onEnter(n) {
  const play = id => { const v = document.getElementById(id); if (v) { v.currentTime = 0; v.play().catch(() => {}); }};
  if (n === 10) play("sibel-video");
}

updateProgress();
