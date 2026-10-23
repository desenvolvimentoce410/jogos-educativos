/* LÓGICA DO JOGO + PONTUAÇÃO (sem mexer na tela; a tela fica em app.js) */
const Game = (() => {
  function shuffle(a) {                       // embaralha (Fisher-Yates)
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // Monta o baralho a partir da lista de pares (qualquer quantidade)
  function buildDeck(pairs, folder) {
    const deck = [];
    pairs.forEach(p => p.cards.forEach((c, i) =>
      deck.push({ uid: p.id + "-" + i, pair: p.id, src: folder + c.image, alt: c.alt })));
    return shuffle(deck);
  }

  function create(pairs, cfg, hooks) {
    const s = { deck: buildDeck(pairs, cfg.imagesFolder), open: [], matched: new Set(),
                score: 0, moves: 0, lock: false, total: pairs.length,
                start: Date.now(), end: null, timeoutId: null };

    function flip(uid) {
      const card = s.deck.find(c => c.uid === uid);
      // Ignora: carta inexistente, jogo travado (2 abertas), par já achado, mesma carta, jogo acabado
      if (!card || s.lock || s.end || s.matched.has(card.pair) || s.open.includes(card)) return;
      s.open.push(card);
      hooks.onFlip(card, s);
      if (s.open.length < 2) return;

      s.moves++;
      const [a, b] = s.open;
      if (a.pair === b.pair) {                // ACERTOU
        s.matched.add(a.pair);
        s.score += cfg.pointsPerPair;
        s.open = [];
        hooks.onMatch(a, b, s);
        if (s.matched.size === s.total) { s.end = Date.now(); hooks.onWin(s); }
      } else {                                // ERROU: trava cliques e desvira depois
        s.lock = true;
        hooks.onMiss(a, b, s);
        s.timeoutId = setTimeout(() => { s.open = []; s.lock = false; hooks.onHide(a, b, s); }, cfg.mismatchDelayMs);
      }
    }
    return { state: s, flip, stop: () => clearTimeout(s.timeoutId) };
  }
  return { create };
})();
if (typeof module !== "undefined") module.exports = Game;   // só para testes
