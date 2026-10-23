# Jogos Educativos CE 410

Portal em **HTML, CSS e JavaScript puros** (sem frameworks, sem instalação) que reúne os jogos educativos da equipe. A tela inicial mostra os jogos em cartões com imagem de capa e uma barra de pesquisa por palavras-chave.

---

## Sumário

1. [Estrutura de pastas](#1-estrutura-de-pastas)
2. [Como abrir o site](#2-como-abrir-o-site)
3. [Como adicionar um novo jogo (passo a passo)](#3-como-adicionar-um-novo-jogo-passo-a-passo)
4. [O que significa cada campo do cartão](#4-o-que-significa-cada-campo-do-cartão)
5. [Como funciona a pesquisa](#5-como-funciona-a-pesquisa)
6. [Imagem de capa](#6-imagem-de-capa)
7. [Como criar a pasta de um jogo](#7-como-criar-a-pasta-de-um-jogo)
8. [Personalização visual](#8-personalização-visual)
9. [Como publicar o site](#9-como-publicar-o-site)
10. [Problemas comuns](#10-problemas-comuns)
11. [Boas práticas para a equipe](#11-boas-práticas-para-a-equipe)

---

## 1. Estrutura de pastas

```
jogos-educativos-ce410/
├── index.html              <- página inicial (ÚNICO arquivo editado para cadastrar jogos)
├── README.md               <- este guia
├── css/
│   └── style.css           <- cores, layout e responsividade
├── js/
│   └── script.js           <- pesquisa e capa padrão (não precisa editar)
├── assets/
│   └── img/                <- imagens de capa dos jogos e favicon
└── games/
    └── exemplo-tabuada/    <- um jogo de exemplo (pode apagar)
        └── index.html
```

| Pasta / arquivo | Para que serve | Precisa editar? |
|---|---|---|
| `index.html` | Lista dos jogos | **Sim**, a cada novo jogo |
| `games/` | Uma subpasta por jogo | **Sim**, adicione a pasta do jogo |
| `assets/img/` | Imagens de capa | Sim, se o jogo tiver capa |
| `css/style.css` | Visual do site | Só para mudar cores/estilo |
| `js/script.js` | Pesquisa | Normalmente não |

---

## 2. Como abrir o site

**Opção simples:** dê dois cliques em `index.html`. Abre no navegador, sem servidor.

**Opção recomendada para testar jogos mais complexos** (que carregam arquivos, sons ou usam `fetch`): rode um servidor local na pasta do projeto.

```bash
# Python 3
python -m http.server 8000
# depois acesse: http://localhost:8000
```

Ou use a extensão **Live Server** do VS Code (botão direito em `index.html` > *Open with Live Server*).

---

## 3. Como adicionar um novo jogo (passo a passo)

### Passo 1: coloque o jogo na pasta `games/`

Crie uma pasta para o jogo e coloque nela os arquivos. O ponto de entrada deve se chamar **`index.html`**.

```
games/
└── forca-de-palavras/
    ├── index.html
    ├── style.css
    └── script.js
```

> Use nomes de pasta **sem espaços, sem acentos e em minúsculas**, separados por hífen: `forca-de-palavras`, não `Forca de Palavras`.

### Passo 2 (opcional): coloque a imagem de capa

Salve em `assets/img/`, por exemplo `assets/img/forca-de-palavras.png`.

### Passo 3: copie o modelo no `index.html`

Abra `index.html`, procure o comentário **"COLE OS NOVOS JOGOS AQUI"** e cole o bloco abaixo **antes** dele:

```html
<a class="game-card"
   href="games/forca-de-palavras/index.html"
   data-keywords="português palavras ortografia letras vocabulário">
  <div class="game-thumb">
    <img src="assets/img/forca-de-palavras.png" alt="Capa do jogo Forca de Palavras" loading="lazy">
  </div>
  <div class="game-info">
    <h2>Forca de Palavras</h2>
    <p>Descubra a palavra secreta antes que acabem as tentativas.</p>
  </div>
</a>
```

### Passo 4: salve e atualize o navegador

Pronto. O jogo aparece na tela inicial e já é encontrado pela pesquisa. **Nenhum CSS ou JavaScript precisa ser alterado.**

---

## 4. O que significa cada campo do cartão

| # | Campo | Onde fica | O que colocar |
|---|---|---|---|
| 1 | **Link do jogo** | `href="..."` | Caminho até o `index.html` do jogo: `games/NOME-DA-PASTA/index.html` |
| 2 | **Palavras-chave** | `data-keywords="..."` | Termos separados por espaço: assunto, sinônimos, série, habilidade |
| 3 | **Imagem de capa** | `<img src="...">` | Caminho da imagem: `assets/img/NOME.png`. Pode apagar a tag `<img>` se não houver capa |
| 4 | **Nome do jogo** | `<h2>...</h2>` | Título que aparece no cartão |
| 5 | **Descrição** | `<p>...</p>` | Uma ou duas frases curtas |

Atenção: o `alt` da imagem descreve a capa para leitores de tela. Mantenha-o preenchido.

---

## 5. Como funciona a pesquisa

A busca olha, ao mesmo tempo, **o nome, a descrição e as palavras-chave** de cada jogo.

- **Ignora acentos e maiúsculas:** `matematica`, `Matemática` e `MATEMÁTICA` dão o mesmo resultado.
- **Ignora palavras comuns:** `quero um jogo de matemática` é lido como `matematica`.
- **Aceita parte da palavra:** `mate` encontra `matemática`.
- **Vários termos:** `matemática multiplicação` mostra só jogos que tenham **os dois** termos.
- **Sem resultados:** aparece uma mensagem e um botão para voltar a ver todos.

### Como escolher boas palavras-chave

Pense em *como um professor procuraria esse jogo*:

| Jogo | Boas palavras-chave |
|---|---|
| Tabuada Rápida | `matemática multiplicação tabuada contas cálculo` |
| Forca de Palavras | `português ortografia letras vocabulário alfabetização` |
| Ciclo da Água | `ciências natureza água chuva meio ambiente` |

Dica: inclua a **disciplina** (matemática, português, ciências, história, geografia, inglês), o **tema** e, se fizer sentido, o **ano/série** (`5ano`, `fundamental`).

---

## 6. Imagem de capa

- Formato recomendado: **PNG, JPG, WebP ou SVG**.
- Proporção **16:9** (por exemplo, 640 x 360 px). Outras proporções são cortadas automaticamente para caber.
- Peso ideal: até **200 KB**, para o site carregar rápido no celular.
- **Sem imagem?** Apague a tag `<img>` do cartão. O site exibe uma capa vermelha com a **primeira letra** do nome do jogo.
- Se o caminho da imagem estiver errado, a mesma capa padrão aparece, então o site nunca fica com imagem quebrada.

---

## 7. Como criar a pasta de um jogo

O portal só precisa de **um link** para o jogo. Dentro da pasta, ele pode ser qualquer coisa que rode no navegador (HTML/CSS/JS, Phaser, Construct exportado, Scratch exportado etc.).

Regras para funcionar bem:

1. O arquivo principal deve ser `games/NOME-DA-PASTA/index.html`.
2. Use **caminhos relativos** dentro do jogo (`script.js`, `img/foto.png`), nunca caminhos absolutos como `C:\...`.
3. Para o jogador voltar ao portal, coloque no jogo um link: `<a href="../../index.html">Voltar para os jogos</a>`.
4. Mantenha todos os arquivos do jogo **dentro da própria pasta**, para um jogo não interferir em outro.

O jogo `games/exemplo-tabuada/` mostra um exemplo completo e funcional.

---

## 8. Personalização visual

Todas as cores ficam no topo de `css/style.css`, no bloco `:root`:

```css
:root {
  --red:      #c8102e;   /* cor principal */
  --red-dark: #9e0c24;   /* hover e foco */
  --text:     #000000;   /* fonte preta */
  --bg:       #fafaf8;   /* fundo claro */
}
```

Troque o valor e o site inteiro acompanha. Paleta atual: **vermelho** como cor predominante, **texto preto** e **fundo claro**.

O layout é responsivo: a grade usa 1 coluna no celular e adiciona colunas conforme a tela cresce.

---

## 9. Como publicar o site

Por ser um site estático, qualquer hospedagem simples serve:

- **GitHub Pages:** envie a pasta para um repositório > *Settings* > *Pages* > escolha a branch.
- **Netlify / Vercel / Cloudflare Pages:** arraste a pasta do projeto para o painel.
- **Servidor da escola/instituição:** copie todos os arquivos para a pasta pública do servidor, mantendo a estrutura.

Mantenha a estrutura de pastas intacta, porque os links são relativos.

---

## 10. Problemas comuns

| Problema | Causa provável | Solução |
|---|---|---|
| O jogo não abre (erro 404) | Caminho do `href` errado | Confira se é `games/NOME-DA-PASTA/index.html` e se a pasta existe |
| A capa não aparece | Caminho do `src` errado ou nome diferente (maiúsculas contam em servidores) | Confira o nome exato do arquivo, incluindo a extensão |
| O jogo não é encontrado na pesquisa | Faltam palavras-chave | Acrescente termos em `data-keywords` |
| Novo jogo não aparece | Bloco colado fora de `<section id="games-grid">` | Cole antes de "FIM DA LISTA DE JOGOS" |
| Cartões quebrados | Falta fechar uma tag (`</div>`, `</a>`) | Compare com o modelo e confira cada abertura/fechamento |
| Funciona no PC, mas não online | Maiúsculas/minúsculas ou espaços no nome | Use nomes minúsculos, sem espaços nem acentos |

---

## 11. Boas práticas para a equipe

- Um jogo = **uma pasta** em `games/` e **um bloco** no `index.html`.
- Antes de enviar, abra o site, procure o jogo pela pesquisa e clique nele para testar.
- Teste no celular (ou reduza a janela do navegador).
- Apague o jogo de exemplo (`games/exemplo-tabuada/` e seu bloco no `index.html`) quando publicar o primeiro jogo real.
- Se vários membros editam o `index.html`, avisem o grupo antes para evitar sobrescrever o trabalho uns dos outros (ou usem Git).

---

*Jogos Educativos CE 410*
