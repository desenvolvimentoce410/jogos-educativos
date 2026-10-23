/* =====================================================================
   CONFIGURAÇÃO DO JOGO — é AQUI que o professor/OED edita tudo.
   ===================================================================== */

window.GAME_CONFIG = {
  title: "JOGO DA MEMÓRIA — DONA BARATINHA",
  subtitle: "Encontre os pares e divirta-se!",
  pointsPerPair: 10,        // pontos por par encontrado
  mismatchDelayMs: 1100,    // tempo (ms) que o erro fica visível antes de desvirar
  soundDefault: true,       // sons ligados por padrão
  timerDefault: true,       // cronômetro visível por padrão
  imagesFolder: "assets/cards/"
};

/* LISTA DE PARES
   Cada par tem exatamente 2 cartas (as duas imagens que combinam).
   Para ADICIONAR um par: coloque as 2 imagens em assets/cards/ e copie um bloco abaixo.
   Para REMOVER: apague o bloco. O tabuleiro se ajusta sozinho (N pares = 2×N cartas).
   "alt" = texto lido por leitores de tela (usa o texto visível na carta).

   ATENÇÃO: os pares abaixo foram definidos pela posição na folha original
   (cada par = as duas cartas lado a lado dentro do mesmo recorte pontilhado).
   Se algum par não for o que a professora pretendia, basta trocar os arquivos de lugar aqui. */
window.PAIRS = [
  { id: "par1", cards: [ { image: "par1_a.png", alt: "CONTO" }, { image: "par1_b.png", alt: "História com personagens, tempo e lugar." } ] },
  { id: "par2", cards: [ { image: "par2_a.png", alt: "CONTO" }, { image: "par2_b.png", alt: "Possui começo, meio e fim." } ] },
  { id: "par3", cards: [ { image: "par3_a.png", alt: "CARTA" }, { image: "par3_b.png", alt: "Mensagem enviada para alguém." } ] },
  { id: "par4", cards: [ { image: "par4_a.png", alt: "CARTA" }, { image: "par4_b.png", alt: "Possui saudação e despedida." } ] },
  { id: "par5", cards: [ { image: "par5_a.png", alt: "CARTA" }, { image: "par5_b.png", alt: "Local e data aparecem no início." } ] },
  { id: "par6", cards: [ { image: "par6_a.png", alt: "NOTÍCIA" }, { image: "par6_b.png", alt: "Informa sobre um fato acontecido." } ] },
  { id: "par7", cards: [ { image: "par7_a.png", alt: "NOTÍCIA" }, { image: "par7_b.png", alt: "Responde: o quê, quem, quando e onde?" } ] },
  { id: "par8", cards: [ { image: "par8_a.png", alt: "NOTÍCIA" }, { image: "par8_b.png", alt: "Encontrada em jornais e sites de notícias." } ] }
];
