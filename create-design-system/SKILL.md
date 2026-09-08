---
name: create-design-system
description: "Conduz a criação do design system do projeto e o registra num documento único, `docs/ui/DESIGN.md`, com detalhe suficiente para um agente de IA reproduzir o design fielmente (tokens, layout, arquitetura de tela, componentes, padrões de interação, acessibilidade, tema). Escolhe uma de três abordagens por execução — entrevista do zero, análise da codebase atual, ou referências externas (sites/apps/imagens). Invocada explicitamente pelo usuário via /create-design-system."
disable-model-invocation: true
---

# Create Design System

Você foi invocado via `/create-design-system`. NUNCA dispare esta skill por conta própria.

> Gera o design system do projeto inteiro num arquivo único, `docs/ui/DESIGN.md`, feito para
> ser lido por agentes de IA antes de construir ou revisar qualquer tela. O escopo aqui é a
> linguagem visual e os padrões que valem para **todas** as telas — não o mockup de uma
> tela específica. O `docs/ui/DESIGN.md` deve ser referenciado no `AGENTS.md` do projeto.

## Regra de ouro

O documento existe para que outro agente reproduza o design **pixel a pixel** sem ter que
adivinhar. Isso muda como você o preenche:

- **Valores concretos, não descrições vagas.** `#4F46E5` e `--color-primary`, não "um azul
  arroxeado". `0.5rem` / `8px`, não "espaçamento pequeno". `640px`, não "no mobile". Nome da
  classe/token real quando existir.
- **Não invente.** O que você não verificou (Passo 3B/3C) ou o usuário não decidiu (Passo 3A)
  vira `> A definir` explícito na seção — nunca texto genérico de enchimento para "completar"
  o template.
- **Decisões de design são do usuário.** Ao perguntar, sempre ofereça uma recomendação e o
  porquê, à luz do contexto do projeto — o usuário pediu uma skill que orienta a decisão, não
  só que registra a escolha.
- **Marque a procedência quando o valor for estimado.** Cores/medidas lidas de screenshot ou
  referência externa não são medições — diga isso na seção onde aparecem.

## Passo 1 — Diagnosticar o estado

Antes de tudo, cheque se `docs/ui/DESIGN.md` já existe.

- **Não existe** → siga para o Passo 2.
- **Existe** → pergunte ao usuário como proceder (prefira `AskUserQuestion`; no fallback de
  chat, múltipla escolha enumerada com a recomendação destacada):
  - **Atualizar** (recomendado) — mesclar o que for levantado nesta execução, preservando as
    decisões já registradas; ao final, listar o que mudou.
  - **Sobrescrever** — regenerar do zero, descartando o conteúdo atual.
  - **Abortar** — não mexer no arquivo.

## Passo 2 — Escolher a abordagem

Só uma abordagem por execução. Pergunte qual usar (mesma preferência de interface do Passo 1):

1. **Entrevista do zero** — montar o design system a partir das respostas do usuário. Cabe
   quando o projeto ainda não tem frontend, ou quando o usuário quer definir a linguagem
   visual agora em vez de herdá-la de algo.
2. **Analisar a codebase atual** — inferir os padrões já adotados no código e documentá-los.
   Cabe quando já existe frontend real (CSS/tokens, biblioteca de componentes, telas prontas).
3. **Referências externas** — partir de sites/apps que o usuário quer espelhar, ou de imagens
   já importadas no projeto. Cabe quando existe um alvo visual claro fora do projeto.

**Recomendação:** olhe rapidamente o repositório. Se há `tailwind.config.*`, `:root`
com custom properties, uma pasta de componentes com telas reais → recomende **analisar a
codebase**. Se o repositório é novo/vazio no frontend → recomende **entrevista**. Se o usuário
já mencionou um site/app de referência → recomende **referências externas**.

Depois de escolhida, execute só o passo correspondente (3A, 3B **ou** 3C) e siga para o Passo 4.

## Passo 3A — Entrevista do zero

Faça **uma pergunta de cada vez**, aguardando a resposta antes da próxima. Prefira
`AskUserQuestion`; no fallback de chat, múltipla escolha enumerada. Em cada pergunta, ofereça
recomendação + porquê. Se uma resposta já resolver uma pergunta seguinte, confirme e siga.

Roteiro (pule o que claramente não se aplica; ~12–18 perguntas no total):

1. **Personalidade visual** — 2–3 adjetivos (ex.: sóbrio e denso; amigável e espaçoso;
   técnico e neutro). Define o tom das decisões seguintes.
2. **Cor primária / de marca** — peça o hex. A partir dela, recomende as cores de estado
   (sucesso/atenção/erro/info) e a escala de neutros.
3. **Superfície e fundo** — claro, escuro, ou os dois; cor de fundo da app e dos cards.
4. **Tipografia** — família para texto e para títulos (recomende uma stack de sistema ou uma
   fonte Google se o usuário não tiver preferência); escala de tamanhos; pesos usados.
5. **Unidade de espaçamento e escala** — base (recomende 4px) e a escala derivada
   (4/8/12/16/24/32…).
6. **Raio de borda** — cantos retos, sutis (4–6px) ou bem arredondados; se há um valor único
   ou variação por componente.
7. **Sombra/elevação** — se usa sombras, quantos níveis e para quê (card, dropdown, modal).
8. **Breakpoints e largura de conteúdo** — alvos (mobile-first? desktop-first?), largura
   máxima do container.
9. **Shell da aplicação** — sidebar fixa, topbar, ambos; comportamento no mobile
   (drawer/colapso).
10. **Densidade** — confortável vs. compacta; afeta paddings de tabela, altura de linha,
    tamanho de input.
11. **Padrões de tela** — como são listagem, detalhe e formulário (tabela vs. cards; form
    único vs. em etapas; onde ficam as ações primárias).
12. **Biblioteca de componentes** — usa uma (PrimeVue, shadcn/ui, MUI, Radix…) ou componentes
    próprios; isso define a anatomia da seção 4.
13. **Estados obrigatórios** — quais estados toda tela com dados deve tratar (vazio, carregando,
    erro, sem permissão) e como são apresentados.
14. **Feedback e validação** — toast vs. inline; quando validar (blur/submit); onde a mensagem
    de erro aparece.
15. **Movimento** — nada, transições sutis (150–200ms) ou animação expressiva; se há
    `prefers-reduced-motion`.
16. **Iconografia** — biblioteca de ícones, tamanho padrão, estilo (outline/filled).
17. **Acessibilidade** — nível alvo (recomende WCAG AA): contraste mínimo, foco visível
    sempre, tamanho mínimo de alvo de toque.

## Passo 3B — Análise da codebase

Varra o repositório e extraia os padrões **reproduzíveis** (convenção do projeto), separando-os
de escolhas pontuais de uma tela. Fontes típicas:

- **Tokens e tema** — `tailwind.config.*` (`theme`, `extend`, cores, `fontFamily`, `spacing`,
  `screens`, `borderRadius`, `boxShadow`); custom properties em `:root` / arquivos de tema;
  variáveis SCSS/Less; arquivos `tokens.*`, `design-tokens.*`, presets de UI libs.
- **Framework de estilo** — Tailwind, CSS Modules, styled-components, vanilla CSS; versão.
- **Biblioteca de componentes** — dependências (`package.json`), imports mais frequentes,
  presets/configuração (ex.: preset do PrimeVue, `components.json` do shadcn).
- **Shell e layout** — componente de layout raiz (`AppLayout`, `RootLayout`, `_app`,
  `app.blade.php`): sidebar/topbar, container, breakpoints em uso.
- **Componentes-base próprios** — pasta de UI (`components/ui`, `Shared`, `common`): anatomia
  de botão, input, card, tabela, modal; variantes e tamanhos.
- **Padrões de tela** — 2–3 telas de listagem e de formulário reais: como repetem estrutura,
  onde ficam ações, como tratam estados vazio/erro/loading.
- **Tema claro/escuro** — mecanismo (`dark:` do Tailwind, classe no `html`, `data-theme`,
  `prefers-color-scheme`), chave de `localStorage`, mapeamento de tokens.

Scans read-only e independentes podem ir para subagentes Haiku em paralelo (ver `## Subagentes`).

Antes de escrever: onde a inferência for ambígua (dois botões diferentes, escala de
espaçamento inconsistente, cor hardcoded que pode ou não ser token), **pergunte ao usuário**
qual é a convenção a documentar — não eleja uma sozinho. O que você não conseguir verificar
vira `> A definir`.

## Passo 3C — Referências externas

O usuário fornece as referências. Duas origens:

- **URLs** de sites/apps a espelhar → use `WebFetch` para estrutura/CSS. Se o Playwright MCP
  estiver disponível, navegue e tire screenshots para ler paleta, tipografia, espaçamento e
  layout com fidelidade.
- **Imagens já no projeto** (mockups, prints, PDFs de marca) → `Read` nos arquivos que o
  usuário apontar.

De cada referência, extraia: paleta (hex aproximados), famílias e escala tipográfica, unidade
de espaçamento aparente, raio de borda, estilo de sombra, shell/layout, densidade, estilo de
componentes e de ícones. Se houver mais de uma referência, aponte conflitos ao usuário e
pergunte qual vence.

**Confirme a leitura com o usuário** antes de escrever, e deixe explícito na seção de cada
valor que ele foi **estimado a partir de referência** (não medido no código do projeto).

## Passo 4 — Escrever `docs/ui/DESIGN.md`

Crie a pasta `docs/ui/` se não existir. Preencha **exatamente** o template abaixo. Escreva o
conteúdo no idioma predominante do repositório do projeto (a skill é em português, mas o
documento segue o projeto — olhe comentários, docs e commits para decidir).

No modo **atualizar** (Passo 1): abra o arquivo existente, mescle os novos achados preservando
as decisões já registradas, e no Passo 5 liste ao usuário o que mudou. No modo **sobrescrever**:
regenere do zero.

Regra de preenchimento por subseção: valor concreto **ou** `> A definir` — nada de texto
genérico só para não deixar a seção vazia.

```markdown
# Design System — <nome do projeto>

**Status:** gerado
**Gerado em:** AAAA-MM-DD
**Origem:** entrevista | análise de codebase | referências externas

> Documento de referência para agentes de IA. Antes de construir ou revisar qualquer tela,
> leia este arquivo e reproduza os valores abaixo literalmente.

## 1. Princípios visuais
Personalidade em 2–3 adjetivos e o que cada um implica nas decisões (ex.: "denso" → paddings
menores, tabelas compactas). Regras gerais que nenhuma tela deve violar.

## 2. Fundamentos / design tokens

### 2.1 Paleta de cores
Tabela: Token | Valor (hex) | Papel semântico | Onde usar. Cubra marca/primária, cores de
estado (sucesso, atenção, erro, info), escala de neutros, cor de fundo da app e de superfície.

### 2.2 Tipografia
Famílias (texto e título) com stack de fallback. Escala: nome | tamanho (rem/px) | peso |
line-height | uso. Pesos disponíveis.

### 2.3 Espaçamento e escala
Unidade base. Escala completa (valor → nome/classe). Regras de uso (gap entre seções, padding
de card, etc.).

### 2.4 Raios, bordas e sombras
Raio(s) de borda por contexto. Espessura e cor de borda padrão. Níveis de sombra/elevação com
o valor CSS de cada um e quando aplicar.

### 2.5 Breakpoints e grid
Breakpoints (nome → min-width). Mobile-first ou desktop-first. Largura máxima do container.
Sistema de grid/colunas se houver.

## 3. Layout e arquitetura de tela
Shell da aplicação (sidebar/topbar/ambos) e comportamento responsivo. Estrutura de uma página
típica (cabeçalho, breadcrumb, área de conteúdo, ações). Densidade. Padrões de listagem,
detalhe e formulário — incluindo onde ficam as ações primárias e secundárias.

## 4. Componentes-base
Biblioteca de componentes em uso (nome + versão) ou "componentes próprios". Para cada
componente-chave (botão, input/select, card, tabela, modal/drawer, tabs, toast): variantes,
tamanhos, estados, e o markup/classe canônico quando existir.

## 5. Padrões de interação e estados
Estados obrigatórios de toda tela com dados: vazio, carregando, erro, sem permissão — como
cada um é apresentado. Hover/focus/active/disabled. Estratégia de validação (quando validar,
onde a mensagem aparece). Feedback de ação (toast vs. inline).

## 6. Movimento e transições
Duração e easing padrão. O que anima e o que não anima. Tratamento de `prefers-reduced-motion`.

## 7. Iconografia e imagens
Biblioteca de ícones, tamanho e estilo padrão. Tratamento de avatares, thumbnails, estados
sem imagem. Ilustrações de estado vazio se houver.

## 8. Acessibilidade
Nível alvo (ex.: WCAG AA). Contraste mínimo. Foco visível. Tamanho mínimo de alvo de toque.
Regras de semântica/ARIA que se repetem.

## 9. Tema claro/escuro
Mecanismo (classe, `data-theme`, `prefers-color-scheme`) e persistência. Mapeamento de como
os tokens da seção 2.1 mudam entre os temas. Se o projeto é tema único, diga isso aqui.

## 10. Referências e exemplos
URLs e prints usados como base. Trechos de código canônicos (uma tela ou componente que
serve de modelo). Links para tokens/preset no repositório.
```

## Passo 5 — Resumo final

Informe ao usuário, de forma objetiva:

- Que `docs/ui/DESIGN.md` foi criado / atualizado / sobrescrito, e por qual abordagem.
- Quais seções ficaram preenchidas e quais ficaram como `> A definir` (o que ainda falta
  decidir ou verificar).
- No modo atualizar: o que mudou em relação à versão anterior.
- Que o arquivo deve ser referenciado no contexto dos agentes do projeto — via `AGENTS.md`.

## Subagentes

- A **entrevista** (Passo 3A) fica sempre com o orquestrador — não delegue.
- Os **scans read-only** do Passo 3B podem ser distribuídos em subagentes Haiku paralelos
  (ex.: um para tokens/tema, um para componentes-base, um para telas/layout). Consolide os
  achados antes de decidir o que documentar.
- A confirmação de inferências ambíguas e a escrita final do arquivo ficam com o orquestrador.
