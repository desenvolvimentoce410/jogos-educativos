# Jogo da Memória — Dona Baratinha (Gêneros textuais)

## Estrutura
- `index.html` – telas (início, jogo, final, modo professor)
- `css/style.css` – cores e estilos (variáveis no topo)
- `js/config.js` – **título, pontuação e LISTA DE PARES** (edite aqui)
- `js/game.js` – lógica e pontuação
- `js/app.js` – interface, animações, sons, confete, modo professor
- `assets/cards/` – imagens das cartas (parN_a.png / parN_b.png)

## Executar localmente
Dê dois cliques em `index.html`. Não precisa instalar nada nem ter internet.

## Publicar para os alunos
Envie a pasta inteira para qualquer hospedagem de arquivos estáticos: o servidor da escola, GitHub Pages
ou Netlify (arraste a pasta em app.netlify.com/drop). Passe o link aos alunos.

## Adicionar / trocar / remover pares
1. Coloque as duas imagens novas em `assets/cards/`.
2. Em `js/config.js`, copie um bloco de `PAIRS` e ajuste `image` e `alt`.
3. Para remover, apague o bloco. O tabuleiro se ajusta sozinho (N pares = 2×N cartas).

## Modo professor
Botão ⚙️ no canto superior direito: ver nº de pares, mudar título, ligar/desligar sons e cronômetro, restaurar padrão.
As escolhas ficam só no navegador daquele computador (sem login, servidor ou dados pessoais).
