/* ==========================================================================
   Reta Numérica dos Racionais - 7º ano
   Descritor: associar números racionais em diferentes representações
   (fração, decimal, número misto) a pontos da reta numérica.

   Tipos de pergunta:
     "place"  -> o aluno marca na reta o ponto que representa um número
     "letter" -> o aluno escolhe a letra do ponto que representa um número
     "number" -> o aluno escolhe o número que o ponto P representa

   Para mudar a quantidade de perguntas, altere QUESTIONS_PER_GAME.
   Para ajustar os níveis, altere o objeto LEVELS.
   ========================================================================== */
(function () {
  "use strict";

  var MINUS = "\u2212";
  var QUESTIONS_PER_GAME = 10;
  var POINTS_OK = 10, POINTS_HINT = 5;

  // denoms: denominadores usados | negatives: usa números negativos | reps: representações
  var LEVELS = {
    1: { denoms: [2, 4, 5, 10],        negatives: false, reps: ["frac", "dec"] },
    2: { denoms: [2, 4, 5, 10],        negatives: true,  reps: ["frac", "dec", "mixed"] },
    3: { denoms: [3, 4, 5, 6, 8, 10],  negatives: true,  reps: ["frac", "dec", "mixed", "eq"] }
  };
  // Quantos inteiros a reta mostra, conforme o denominador (mantém a reta legível)
  var WIDTH = { 2: 3, 3: 3, 4: 2, 5: 2, 6: 2, 8: 2, 10: 1 };

  /* ---------- utilidades ---------- */
  function rnd(n) { return Math.floor(Math.random() * n); }
  function pick(a) { return a[rnd(a.length)]; }
  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = rnd(i + 1), t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a || 1; }
  function reduce(k, d) { var g = gcd(k, d); return { n: k / g, d: d / g }; }
  function $(id) { return document.getElementById(id); }

  /* ---------- representações dos números ---------- */
  function fracHtml(n, d) { return '<span class="frac"><span>' + n + "</span><span>" + d + "</span></span>"; }
  function sign(n) { return n < 0 ? MINUS : ""; }

  function canRep(v, kind) {
    if (v.d === 1) return kind === "frac";
    if (kind === "dec") return [2, 4, 5, 8, 10].indexOf(v.d) !== -1;
    if (kind === "mixed") return Math.abs(v.n) > v.d;
    return true;
  }
  function rep(v, kind) {
    var an = Math.abs(v.n), sg = sign(v.n);
    if (v.d === 1) return sg + an;
    if (kind === "dec") {
      return sg + (an / v.d).toFixed(3).replace(/0+$/, "").replace(/\.$/, "").replace(".", ",");
    }
    if (kind === "mixed" && an > v.d) return sg + Math.floor(an / v.d) + " " + fracHtml(an % v.d, v.d);
    if (kind === "eq") { var m = pick([2, 3]); return sg + fracHtml(an * m, v.d * m); }
    return sg + fracHtml(an, v.d);
  }
  function plain(html) {
    return html.replace(/<span class="frac"><span>(\d+)<\/span><span>(\d+)<\/span><\/span>/g, "$1/$2");
  }
  function randomRep(v, kinds) {
    var ok = kinds.filter(function (k) { return canRep(v, k); });
    return rep(v, ok.length ? pick(ok) : "frac");
  }

  /* ---------- construção das perguntas ---------- */
  function makeBase(cfg) {
    var d = pick(cfg.denoms), W = WIDTH[d], s = 0;
    if (cfg.negatives) {
      if (W === 1) s = pick([-1, 0]);
      else if (W === 2) s = -1;
      else s = pick([-1, -2]);
    }
    var N = W * d, i;
    do { i = 1 + rnd(N - 1); } while ((s * d + i) % d === 0); // nunca cai num inteiro
    return { d: d, W: W, s: s, N: N, i: i, min: s, max: s + W, k: s * d + i };
  }
  function valueAt(q, i) { return reduce(q.s * q.d + i, q.d); }

  // Índices de marcas "tentadoras" para erro: vizinhas, e a simétrica
  function distractors(q, count) {
    var mirror = q.N - q.i;
    var near = shuffle([q.i - 1, q.i + 1, q.i - 2, q.i + 2, mirror]);
    var seen = {}, out = [];
    seen[q.i] = true;
    near.concat(shuffle(Array.apply(null, { length: q.N + 1 }).map(function (_, x) { return x; })))
      .forEach(function (x) {
        if (out.length < count && x >= 0 && x <= q.N && !seen[x]) { seen[x] = true; out.push(x); }
      });
    return out;
  }

  function buildQuestion(type, level, used) {
    var cfg = LEVELS[level], q, tries = 0;
    do { q = makeBase(cfg); tries++; } while (used[q.k + "/" + q.d] && tries < 60);
    used[q.k + "/" + q.d] = true;
    q.type = type;
    q.value = valueAt(q, q.i);
    q.kinds = cfg.reps;
    if (type === "place" || type === "letter") q.targetHtml = randomRep(q.value, cfg.reps);
    if (type === "letter") {
      var idx = distractors(q, 3).concat([q.i]).sort(function (a, b) { return a - b; });
      q.points = idx.map(function (x, n) { return { i: x, letter: "ABCD".charAt(n) }; });
    }
    if (type === "number") {
      var opts = distractors(q, 3).concat([q.i]).map(function (x) {
        return { i: x, html: randomRep(valueAt(q, x), cfg.reps) };
      });
      q.options = shuffle(opts);
    }
    return q;
  }

  function buildGame(level) {
    var types = shuffle(["place", "place", "place", "place", "letter", "letter", "letter", "number", "number", "number"]);
    var used = {};
    return types.slice(0, QUESTIONS_PER_GAME).map(function (t) { return buildQuestion(t, level, used); });
  }

  /* ---------- explicações ---------- */
  function hintText(q) {
    return "Conte quantas partes iguais há entre dois números inteiros seguidos: são " + q.d +
      ". Então cada marca vale " + fracHtml(1, q.d) + ".";
  }
  function explanation(q) {
    var v = q.value, steps = Math.abs(q.k), dir = q.k < 0 ? "esquerda" : "direita";
    var forms = [], seen = {};
    ["frac", "dec", "mixed"].forEach(function (kind) {
      if (canRep(v, kind)) {
        var h = rep(v, kind), p = plain(h);
        if (!seen[p]) { seen[p] = true; forms.push(h); }
      }
    });
    var unreduced = sign(q.k) + fracHtml(steps, q.d);
    if (!seen[plain(unreduced)]) forms.unshift(unreduced);
    return "Entre dois inteiros seguidos há " + q.d + " partes iguais, então cada marca vale " + fracHtml(1, q.d) +
      ". Partindo do 0, o ponto fica " + steps + (steps === 1 ? " marca" : " marcas") + " para a " + dir +
      ". Esse ponto representa: " + forms.join(" = ") + ".";
  }

  /* ---------- desenho da reta (SVG) ---------- */
  var NS = "http://www.w3.org/2000/svg";
  var VW = 760, X0 = 50, X1 = 710, AY = 120;
  function svgEl(name, attrs, text) {
    var e = document.createElementNS(NS, name);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (text !== undefined) e.textContent = text;
    return e;
  }
  function xOf(i, N) { return X0 + (X1 - X0) * i / N; }

  function drawAxis(svg, q) {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    svg.appendChild(svgEl("line", { x1: 20, y1: AY, x2: 740, y2: AY, stroke: "#000", "stroke-width": 3 }));
    svg.appendChild(svgEl("polygon", { points: "738," + (AY - 8) + " 756," + AY + " 738," + (AY + 8), fill: "#000" }));
    svg.appendChild(svgEl("polygon", { points: "22," + (AY - 8) + " 4," + AY + " 22," + (AY + 8), fill: "#000" }));
    for (var i = 0; i <= q.N; i++) {
      var k = q.s * q.d + i, isInt = k % q.d === 0, x = xOf(i, q.N);
      svg.appendChild(svgEl("line", {
        x1: x, y1: AY - (isInt ? 14 : 8), x2: x, y2: AY + (isInt ? 14 : 8),
        stroke: "#000", "stroke-width": isInt ? 3 : 2
      }));
      if (isInt) {
        var n = k / q.d;
        svg.appendChild(svgEl("text", {
          x: x, y: AY + 42, "text-anchor": "middle", "font-size": 24, "font-weight": 700, fill: "#000"
        }, (n < 0 ? MINUS : "") + Math.abs(n)));
      }
    }
  }

  // Ponto com bolha e letra acima da reta
  function drawPoint(svg, q, i, label, fill, clickable) {
    var g = svgEl("g", { transform: "translate(" + xOf(i, q.N) + ",0)", "class": clickable ? "pt" : "" });
    g.appendChild(svgEl("line", { x1: 0, y1: AY - 36, x2: 0, y2: AY - 6, stroke: "#000", "stroke-width": 2 }));
    g.appendChild(svgEl("circle", { cx: 0, cy: AY, r: 6, fill: "#000" }));
    g.appendChild(svgEl("circle", { cx: 0, cy: AY - 54, r: 19, fill: fill, stroke: "#000", "stroke-width": 3, "class": "bubble" }));
    g.appendChild(svgEl("text", {
      x: 0, y: AY - 46, "text-anchor": "middle", "font-size": 22, "font-weight": 700,
      fill: fill === "#fff" ? "#000" : "#fff", "class": "plabel"
    }, label));
    svg.appendChild(g);
    return g;
  }
  function recolor(g, fill, label) {
    g.querySelector(".bubble").setAttribute("fill", fill);
    var t = g.querySelector(".plabel");
    t.setAttribute("fill", "#fff");
    if (label) t.textContent = label;
  }

  /* ---------- estado e telas ---------- */
  var COLOR_OK = "#1b7f3b", COLOR_BAD = "#9e0c24", COLOR_RED = "#c8102e";
  var state = { level: 1, qs: [], idx: 0, score: 0, right: 0, locked: false, hint: false, mark: null };
  var svg = $("line");

  function show(id) {
    ["screen-start", "screen-game", "screen-end"].forEach(function (s) { $(s).hidden = s !== id; });
    window.scrollTo(0, 0);
  }

  function startGame(level) {
    state.level = level; state.qs = buildGame(level);
    state.idx = 0; state.score = 0; state.right = 0;
    show("screen-game");
    showQuestion();
  }

  function updateStatus() {
    $("st-q").textContent = "Pergunta " + (state.idx + 1) + " de " + state.qs.length;
    $("st-score").textContent = "Pontos: " + state.score;
    $("bar").style.width = (state.idx / state.qs.length * 100) + "%";
  }

  function showQuestion() {
    var q = state.qs[state.idx];
    state.locked = false; state.hint = false; state.mark = null;
    updateStatus();
    $("feedback").hidden = true;
    $("hint").hidden = true;
    $("btn-hint").hidden = false;
    $("options").hidden = true; $("options").innerHTML = "";
    $("controls").hidden = true;
    $("target").hidden = true;
    svg.removeAttribute("tabindex");
    svg.onkeydown = null; svg.onpointerdown = null; svg.onpointermove = null;

    drawAxis(svg, q);

    if (q.type === "place") setupPlace(q);
    else if (q.type === "letter") setupLetter(q);
    else setupNumber(q);
  }

  /* --- tipo 1: marcar na reta --- */
  function setupPlace(q) {
    $("prompt").textContent = "Marque na reta o ponto que representa o número:";
    $("target").innerHTML = q.targetHtml; $("target").hidden = false;
    $("controls").hidden = false;
    $("btn-ok").disabled = true;

    var marker = svgEl("g", { visibility: "hidden" });
    marker.appendChild(svgEl("line", { x1: 0, y1: AY - 36, x2: 0, y2: AY - 6, stroke: "#000", "stroke-width": 2 }));
    marker.appendChild(svgEl("circle", { cx: 0, cy: AY, r: 11, fill: COLOR_RED, stroke: "#000", "stroke-width": 3, "class": "dot" }));
    marker.appendChild(svgEl("text", { x: 0, y: AY - 42, "text-anchor": "middle", "font-size": 28, "font-weight": 700, fill: COLOR_RED, "class": "mk" }, "?"));
    svg.appendChild(marker);

    function setMark(i) {
      if (state.locked) return;
      i = Math.max(0, Math.min(q.N, i));
      state.mark = i;
      marker.setAttribute("transform", "translate(" + xOf(i, q.N) + ",0)");
      marker.setAttribute("visibility", "visible");
      $("btn-ok").disabled = false;
      svg.setAttribute("aria-valuetext", "marca " + i + " de " + q.N);
    }
    function idxFromEvent(ev) {
      var r = svg.getBoundingClientRect();
      var x = (ev.clientX - r.left) * VW / r.width;
      return Math.round((x - X0) / (X1 - X0) * q.N);
    }
    var dragging = false;
    svg.onpointerdown = function (ev) { dragging = true; setMark(idxFromEvent(ev)); };
    svg.onpointermove = function (ev) { if (dragging) setMark(idxFromEvent(ev)); };
    window.onpointerup = function () { dragging = false; };
    function nudge(step) {
      if (state.mark === null) setMark(Math.round(q.N / 2)); else setMark(state.mark + step);
    }
    svg.setAttribute("tabindex", "0");
    svg.setAttribute("role", "slider");
    svg.setAttribute("aria-label", "Reta numérica: use as setas para mover a marca");
    svg.onkeydown = function (ev) {
      if (ev.key === "ArrowLeft") { nudge(-1); ev.preventDefault(); }
      else if (ev.key === "ArrowRight") { nudge(1); ev.preventDefault(); }
      else if (ev.key === "Enter" && state.mark !== null) { $("btn-ok").click(); }
    };
    $("btn-left").onclick = function () { nudge(-1); };
    $("btn-right").onclick = function () { nudge(1); };
    $("btn-ok").onclick = function () {
      if (state.locked || state.mark === null) return;
      state.locked = true;
      $("btn-ok").disabled = true;
      var ok = state.mark === q.i;
      marker.querySelector(".dot").setAttribute("fill", ok ? COLOR_OK : COLOR_BAD);
      marker.querySelector(".mk").setAttribute("fill", ok ? COLOR_OK : COLOR_BAD);
      marker.querySelector(".mk").textContent = ok ? "\u2713" : "\u2717";
      if (!ok) drawPoint(svg, q, q.i, "\u2713", COLOR_OK, false);
      finish(q, ok);
    };
  }

  /* --- tipo 2: qual ponto (A, B, C, D)? --- */
  function setupLetter(q) {
    svg.setAttribute("role", "group");
    svg.setAttribute("aria-label", "Reta numérica com os pontos A, B, C e D");
    $("prompt").textContent = "Qual ponto representa o número:";
    $("target").innerHTML = q.targetHtml; $("target").hidden = false;
    var groups = {};
    q.points.forEach(function (p) {
      var g = drawPoint(svg, q, p.i, p.letter, "#fff", true);
      g.setAttribute("tabindex", "0");
      g.setAttribute("role", "button");
      g.setAttribute("aria-label", "Ponto " + p.letter);
      groups[p.i] = g;
      function choose() {
        if (state.locked) return;
        state.locked = true;
        var ok = p.i === q.i;
        recolor(g, ok ? COLOR_OK : COLOR_BAD);
        if (!ok) recolor(groups[q.i], COLOR_OK);
        q.points.forEach(function (o) { groups[o.i].classList.remove("pt"); groups[o.i].style.cursor = "default"; });
        finish(q, ok);
      }
      g.addEventListener("click", choose);
      g.addEventListener("keydown", function (ev) {
        if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); choose(); }
      });
    });
  }

  /* --- tipo 3: qual número o ponto P representa? --- */
  function setupNumber(q) {
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", "Reta numérica com o ponto P");
    $("prompt").textContent = "Qual número está representado pelo ponto P?";
    drawPoint(svg, q, q.i, "P", COLOR_RED, false);
    var box = $("options");
    box.hidden = false;
    q.options.forEach(function (o) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "opt"; b.innerHTML = o.html;
      b.addEventListener("click", function () {
        if (state.locked) return;
        state.locked = true;
        var ok = o.i === q.i;
        Array.prototype.forEach.call(box.children, function (c, n) {
          c.disabled = true;
          if (q.options[n].i === q.i) c.classList.add("right");
        });
        if (!ok) b.classList.add("wrong");
        finish(q, ok);
      });
      box.appendChild(b);
    });
  }

  /* --- fim da pergunta --- */
  function finish(q, ok) {
    var gained = ok ? (state.hint ? POINTS_HINT : POINTS_OK) : 0;
    state.score += gained;
    if (ok) state.right++;
    updateStatus();
    $("btn-hint").hidden = true; $("hint").hidden = true;
    $("controls").hidden = true;
    var fb = $("feedback");
    fb.className = "feedback" + (ok ? " good" : "");
    $("fb-title").textContent = ok ? "Correto! +" + gained + " pontos" : "Não foi dessa vez.";
    $("fb-text").innerHTML = explanation(q);
    $("btn-next").textContent = state.idx === state.qs.length - 1 ? "Ver resultado" : "Próxima pergunta";
    fb.hidden = false;
    $("btn-next").focus({ preventScroll: true });
    fb.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }

  function next() {
    if (state.idx < state.qs.length - 1) { state.idx++; showQuestion(); }
    else endGame();
  }

  function endGame() {
    var total = state.qs.length * POINTS_OK;
    var pct = state.score / total;
    var stars = pct >= 0.9 ? 3 : pct >= 0.6 ? 2 : pct >= 0.3 ? 1 : 0;
    $("end-stars").textContent = new Array(stars + 1).join("\u2605") + new Array(4 - stars).join("\u2606");
    $("end-score").textContent = state.score + " de " + total + " pontos (" + state.right + " de " + state.qs.length + " acertos)";
    $("end-msg").textContent = pct >= 0.9 ? "Excelente! Você domina a reta numérica."
      : pct >= 0.6 ? "Muito bem! Tente de novo para chegar às 3 estrelas."
      : "Bom começo! Use as dicas e jogue novamente para melhorar.";
    show("screen-end");
  }

  /* ---------- eventos ---------- */
  Array.prototype.forEach.call(document.querySelectorAll(".level"), function (b) {
    b.addEventListener("click", function () { startGame(parseInt(b.getAttribute("data-level"), 10)); });
  });
  $("btn-next").addEventListener("click", next);
  $("btn-hint").addEventListener("click", function () {
    var q = state.qs[state.idx];
    state.hint = true;
    $("hint").innerHTML = hintText(q) + " (Com dica, o acerto vale " + POINTS_HINT + " pontos.)";
    $("hint").hidden = false;
  });
  $("btn-again").addEventListener("click", function () { startGame(state.level); });
  $("btn-levels").addEventListener("click", function () { show("screen-start"); });
})();
