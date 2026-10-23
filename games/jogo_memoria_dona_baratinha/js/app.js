/* INTERFACE: telas, tabuleiro, animações, sons, confete e modo professor */
(() => {
  const $ = id => document.getElementById(id);
  const DEFAULTS = { title: GAME_CONFIG.title, sound: GAME_CONFIG.soundDefault, timer: GAME_CONFIG.timerDefault };
  const KEY = "memoria-baratinha-config";
  let settings = Object.assign({}, DEFAULTS);
  try { Object.assign(settings, JSON.parse(localStorage.getItem(KEY) || "{}")); } catch (e) {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(settings)); } catch (e) {} };

  // Valida os pares: cada um precisa ter exatamente 2 cartas
  const pairs = PAIRS.filter(p => {
    const ok = p.cards && p.cards.length === 2;
    if (!ok) console.warn("Par ignorado (precisa de 2 cartas):", p.id);
    return ok;
  });

  let game = null, timerId = null;

  /* ---------- telas ---------- */
  function show(name) {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    $("screen" + name).classList.add("active");
    window.scrollTo(0, 0);
  }
  function applyTexts() {
    $("title").textContent = settings.title;
    $("subtitle").textContent = GAME_CONFIG.subtitle;
    document.title = settings.title;
    $("timerBox").hidden = !settings.timer;
  }

  /* ---------- sons discretos (Web Audio, sem arquivos) ---------- */
  let ctx = null;
  function beep(freqs) {
    if (!settings.sound) return;
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      freqs.forEach((f, i) => {
        const o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime + i * 0.12;
        o.frequency.value = f; g.gain.setValueAtTime(0.05, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
        o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + 0.2);
      });
    } catch (e) {}
  }

  /* ---------- tabuleiro ---------- */
  function layout(n) {            // escolhe colunas x linhas: poucas lacunas e formato que cabe na tela
    const target = window.innerWidth > window.innerHeight ? 1.3 : 0.8;   // proporção ideal largura/altura
    let best = 2, bestScore = Infinity;
    for (let cols = 2; cols <= n; cols++) {
      const rows = Math.ceil(n / cols), empty = cols * rows - n;
      const score = empty * 1.5 + Math.abs(Math.log((cols / rows) / target));
      if (score < bestScore) { bestScore = score; best = cols; }
    }
    $("board").style.setProperty("--cols", best);
    $("board").style.setProperty("--rows", Math.ceil(n / best));
  }
  const cardEl = uid => document.querySelector('.card[data-uid="' + uid + '"]');
  function setLabel(el, card, i, open) {
    el.setAttribute("aria-label", "Carta " + (i + 1) + (open ? ": " + card.alt : ", virada para baixo"));
    el.querySelector(".front").setAttribute("aria-hidden", open ? "false" : "true");
  }
  function say(t) { $("message").textContent = t; }
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const fmt = ms => { const s = Math.floor(ms / 1000); return String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0"); };

  function update(s) {
    $("score").textContent = s.score;
    $("pairs").textContent = s.matched.size + " / " + s.total;
    $("moves").textContent = s.moves;
  }

  function start() {
    if (game) game.stop();
    clearInterval(timerId);
    $("confetti").innerHTML = "";
    const board = $("board");
    board.innerHTML = "";
    game = Game.create(pairs, GAME_CONFIG, {
      onFlip(card) { const el = cardEl(card.uid); el.classList.add("is-flipped"); setLabel(el, card, +el.dataset.i, true); beep([440]); },
      onMatch(a, b, s) {
        [a, b].forEach(c => { const el = cardEl(c.uid); el.classList.add("is-matched"); el.disabled = true; });
        update(s); say(pick(["Você encontrou um par!", "Muito bem!", "Boa memória!"])); beep([523, 659]);
      },
      onMiss(a, b, s) {
        [a, b].forEach(c => cardEl(c.uid).classList.add("is-miss"));
        update(s); say("Quase! Tente de novo."); beep([300]);
      },
      onHide(a, b) {
        [a, b].forEach(c => { const el = cardEl(c.uid); el.classList.remove("is-flipped", "is-miss"); setLabel(el, c, +el.dataset.i, false); });
        say("Continue!");
      },
      onWin(s) { clearInterval(timerId); beep([523, 659, 784, 1046]); setTimeout(() => finish(s), 900); }
    });
    game.state.deck.forEach((c, i) => {
      const b = document.createElement("button");
      b.className = "card"; b.dataset.uid = c.uid; b.dataset.i = i; b.type = "button";
      b.innerHTML = '<span class="inner"><span class="face back" aria-hidden="true"><span>📖</span><small>⭐ Dona Baratinha ⭐</small></span>' +
                    '<span class="face front"><img alt="" draggable="false"></span></span>';
      b.querySelector("img").src = c.src;
      setLabel(b, c, i, false);
      b.addEventListener("click", () => game.flip(c.uid));
      board.appendChild(b);
    });
    layout(game.state.deck.length);
    update(game.state); say("Vire uma carta!");
    $("timer").textContent = "00:00";
    timerId = setInterval(() => { $("timer").textContent = fmt(Date.now() - game.state.start); }, 500);
    show("Game");
  }

  function finish(s) {
    $("endScore").textContent = s.score;
    $("endPairs").textContent = s.matched.size + " / " + s.total;
    $("endMoves").textContent = s.moves;
    $("endTime").textContent = fmt(s.end - s.start);
    $("endTimeBox").hidden = !settings.timer;
    show("End");
    confetti();
  }

  function confetti() {            // confete simples (desligado se o aparelho pedir menos animação)
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const box = $("confetti"), colors = ["#ff4d8d", "#ffd23f", "#3ec1ff", "#5bd35b", "#a56bff"];
    for (let i = 0; i < 70; i++) {
      const p = document.createElement("i");
      p.style.cssText = "left:" + Math.random() * 100 + "%;background:" + pick(colors) +
        ";animation-delay:" + Math.random() * 1.5 + "s;animation-duration:" + (2.5 + Math.random() * 2) + "s";
      box.appendChild(p);
    }
    setTimeout(() => { box.innerHTML = ""; }, 6000);
  }

  /* ---------- botões ---------- */
  const goHome = () => { if (game) game.stop(); clearInterval(timerId); $("confetti").innerHTML = ""; show("Start"); };
  $("btnPlay").onclick = start;
  $("btnAgain").onclick = start;
  $("btnHome").onclick = goHome;
  $("btnEndHome").onclick = goHome;
  window.addEventListener("resize", () => { if (game) layout(game.state.deck.length); });

  /* ---------- modo professor ---------- */
  const dlg = $("dlgTeacher");
  $("btnTeacher").onclick = () => {
    $("tPairs").textContent = pairs.length; $("tCards").textContent = pairs.length * 2;
    $("tTitle").value = settings.title; $("tSound").checked = settings.sound; $("tTimer").checked = settings.timer;
    dlg.showModal();
  };
  $("tSave").onclick = () => {
    settings.title = $("tTitle").value.trim() || DEFAULTS.title;
    settings.sound = $("tSound").checked; settings.timer = $("tTimer").checked;
    save(); applyTexts(); dlg.close();
  };
  $("tReset").onclick = () => { settings = Object.assign({}, DEFAULTS); save(); applyTexts(); dlg.close(); };
  $("tClose").onclick = () => dlg.close();

  applyTexts();
})();
