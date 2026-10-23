/* ==========================================================================
   Jogos Educativos CE 410 - Pesquisa de jogos
   Você NÃO precisa editar este arquivo para adicionar jogos.
   Os jogos são cadastrados diretamente no index.html.
   ========================================================================== */

(function () {
  "use strict";

  var input     = document.getElementById("search-input");
  var grid      = document.getElementById("games-grid");
  var info      = document.getElementById("results-info");
  var emptyBox  = document.getElementById("empty-state");
  var clearBtn  = document.getElementById("clear-search");
  var cards     = Array.prototype.slice.call(grid.querySelectorAll(".game-card"));

  // Palavras comuns ignoradas na pesquisa
  // ("quero um jogo de matemática" vira apenas "matematica")
  var STOP_WORDS = [
    "quero", "queria", "gostaria", "procuro", "busco", "preciso", "tem", "ha",
    "um", "uma", "uns", "umas", "o", "a", "os", "as", "de", "do", "da", "dos",
    "das", "em", "no", "na", "nos", "nas", "para", "pra", "por", "com", "sobre",
    "que", "e", "ou", "meu", "minha", "jogo", "jogos", "game", "games",
    "jogar", "educativo", "educativos", "atividade", "atividades"
  ];

  // Minúsculas, sem acentos e sem pontuação
  function normalize(text) {
    return (text || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  // Texto pesquisável de cada jogo: nome + descrição + palavras-chave
  var index = cards.map(function (card) {
    var title = card.querySelector("h2");
    var desc  = card.querySelector("p");
    return normalize([
      title ? title.textContent : "",
      desc ? desc.textContent : "",
      card.getAttribute("data-keywords")
    ].join(" "));
  });

  function search() {
    var terms = normalize(input.value).split(" ").filter(function (t) {
      return t && STOP_WORDS.indexOf(t) === -1;
    });

    var visible = 0;
    cards.forEach(function (card, i) {
      // Todos os termos precisam aparecer (parte da palavra já vale: "mate" acha "matemática")
      var match = terms.every(function (t) { return index[i].indexOf(t) !== -1; });
      card.hidden = !match;
      if (match) visible++;
    });

    emptyBox.hidden = visible !== 0;
    grid.hidden = visible === 0;

    if (terms.length === 0) {
      info.textContent = cards.length + (cards.length === 1 ? " jogo disponível" : " jogos disponíveis");
    } else if (visible === 0) {
      info.textContent = "";
    } else {
      info.textContent = visible + (visible === 1 ? " jogo encontrado" : " jogos encontrados");
    }
  }

  // Capa padrão quando o jogo não tem imagem ou a imagem não carrega
  function setupThumbs() {
    cards.forEach(function (card) {
      var thumb = card.querySelector(".game-thumb");
      var title = card.querySelector("h2");
      if (!thumb) return;

      thumb.setAttribute("data-initial", title ? title.textContent.trim().charAt(0).toUpperCase() : "?");

      var img = thumb.querySelector("img");
      if (!img) { thumb.classList.add("no-img"); return; }

      function fallback() { img.remove(); thumb.classList.add("no-img"); }
      img.addEventListener("error", fallback);
      if (img.complete && img.naturalWidth === 0) fallback();
    });
  }

  input.addEventListener("input", search);
  clearBtn.addEventListener("click", function () {
    input.value = "";
    search();
    input.focus();
  });

  setupThumbs();
  search();
})();
