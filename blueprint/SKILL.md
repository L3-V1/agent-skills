---
name: blueprint
description: "Passo inicial pré-constituição do fluxo SDD: conduz o usuário em 3 etapas — Projeto (ideação e levantamento até convergir numa descrição completa do projeto), Arquitetura (stack técnica, padrões arquiteturais e convenções de código) e Design (design system do projeto) — gerando docs/blueprint/PROJECT.md, docs/blueprint/ARCHITECTURE.md e docs/blueprint/DESIGN.md. Invocada explicitamente pelo usuário via /blueprint."
disable-model-invocation: true
---

# Blueprint

Você foi invocado via `/blueprint`. NUNCA dispare esta skill por conta própria.

> Reúne, antes de qualquer código ou constituição formal, os três documentos que
> descrevem um projeto: o que ele é (Projeto), com que stack e padrões é construído
> (Arquitetura) e como se apresenta visualmente (Design). Os três alimentam o
> `/constitute` e o `/setup-project`.

## Visão geral

- Três etapas sequenciais e independentes entre si: **Projeto** → **Arquitetura** →
  **Design**. Cada uma termina com seu próprio gate de aprovação e seu próprio
  arquivo em `docs/blueprint/`.
- Ao final de cada etapa, pergunte ao usuário se ele quer seguir para a próxima ou
  parar por aqui (prefira `AskUserQuestion`; no fallback de chat, múltipla escolha
  enumerada). Não é obrigatório rodar as três na mesma sessão.
- **Diagnóstico por etapa**: se o arquivo daquela etapa já existir em
  `docs/blueprint/`, pergunte como proceder antes de gerar conteúdo novo — mesma
  lógica nas três etapas (prefira `AskUserQuestion`; no fallback de chat, múltipla
  escolha enumerada com a recomendação destacada):
  - **Atualizar** (recomendado) — mesclar o que for levantado nesta execução,
    preservando decisões já registradas; ao final, listar o que mudou.
  - **Sobrescrever** — regenerar do zero, descartando o conteúdo atual.
  - **Abortar** — não mexer no arquivo e seguir para a próxima etapa (ou parar).

---

## Etapa 1 — Projeto

> Sugere ideias e guia o usuário na criação de produtos ou soluções de software,
> terminando numa **descrição completa do projeto**.

1. **Defina o objetivo**: peça para o usuário começar descrevendo o que deseja
   alcançar. Use `AskUserQuestion` para perguntas estruturadas de esclarecimento
   quando o objetivo estiver vago; sem essa interface, pergunta no chat em múltipla
   escolha enumerada, destacando a alternativa recomendada e o porquê.
2. **Forneça contexto**: quanto mais informação sobre tema, público-alvo, restrições
   e objetivos, melhor a qualidade das ideias geradas.
3. **Enumere ideias**: gere uma lista de ideias de software relacionadas ao
   objetivo. Se o tema pedir mais profundidade, consulte `references/tecnicas.md`
   (SCAMPER, Como Poderíamos, inversão, analogias).
4. **Refine as ideias**: após elaborar as sugestões e consultar o usuário, expanda,
   combine ou melhore algumas.
5. **Avalie e selecione**: analise, junto ao usuário, viabilidade, originalidade,
   impacto e esforço. Ajude-o a escolher **um único projeto** para levar adiante.
6. **Aprofunde o projeto escolhido**: faça perguntas de levantamento — agrupando as
   independentes numa só rodada (`AskUserQuestion`, até ~4), só em sequência quando a
   resposta de uma afeta a próxima — cobrindo os mesmos eixos da
   entrevista de constituição (ver `../_shared/sdd/interview-constitute.md`), no
   nível "descrição de projeto": problema e público-alvo; papéis e atores; escopo
   dentro/fora desta versão; requisitos funcionais principais; requisitos não
   funcionais relevantes (performance, segurança, escala) quando fizerem sentido;
   critérios de sucesso; riscos e casos de borda conhecidos; esboço de decomposição
   em features. Pule o que não se aplicar e não repita perguntas já respondidas.
   Este levantamento é um **esboço para acelerar a constituição** — não a
   substitui; a fase de constituição continua sendo o gate que confirma escopo,
   princípios e a lista final de features.

**Entrega** — salve em `docs/blueprint/PROJECT.md` (crie a pasta se não existir):

```markdown
# Projeto: <nome provisório do projeto>

> Descrição completa do projeto — Etapa 1 do blueprint. Alimenta a fase de
> constituição, que confirma escopo, princípios e a decomposição final em features.
> O slug do projeto só é definido na constituição.

## Resumo
<2-4 frases: o que o projeto entrega e para quem>

## Problema e público-alvo
<que problema resolve e para quem>

## Papéis e atores
<quem interage com o sistema e em que papel>

## Escopo
### Dentro desta versão
- ...
### Fora desta versão
- ...

## Requisitos funcionais
- ...

## Requisitos não funcionais
<performance, segurança, escala — ou "nenhum relevante nesta fase">

## Critérios de sucesso
<como saberemos que o projeto atingiu o objetivo>

## Riscos e casos de borda conhecidos
- ...

## Decomposição preliminar em features
<lista de features candidatas, 1-2 frases cada. A fase de constituição confirma, funde ou divide.>
- **<Nome da feature>** — <descrição curta>
```

Apresente o documento e pergunte se o usuário quer seguir para a Etapa 2 (Arquitetura).

---

## Etapa 2 — Arquitetura

> Ramificação da Etapa 1: decide, junto com o usuário, a stack técnica, os padrões
> arquiteturais e as convenções de código do projeto.

Agrupe perguntas independentes numa só rodada (`AskUserQuestion`, até ~4 por vez); no
fallback de chat, múltipla escolha enumerada com recomendação destacada. Faça em
sequência quando a resposta de uma afeta a próxima — é o caso das primeiras perguntas do
roteiro (1 stack → 2 padrão arquitetural → 3 estrutura de pastas). Roteiro (pule o que não
se aplicar):

1. **Stack técnica** — linguagem(ns) e framework(s) de backend/frontend, banco de
   dados. Se `docs/blueprint/PROJECT.md` já indicar restrições técnicas, confirme em
   vez de perguntar do zero.
2. **Padrão arquitetural** — camadas e responsabilidades (ex. Controller→Service→
   Repository, feature folders, hexagonal, monolito vs. serviços separados).
3. **Gerenciador de pacotes e estrutura de pastas** — convenção a adotar.
4. **Convenções de nomenclatura** — idioma (português/inglês), casing de
   arquivos/variáveis/rotas, padrões já estabelecidos que o time segue em outros
   projetos.
5. **Integrações e dependências externas conhecidas** — APIs, serviços de
   terceiros, autenticação.
6. **Restrições não funcionais que afetam a arquitetura** — escala esperada,
   requisitos de segurança/compliance, ambiente de deploy.

Em cada pergunta, ofereça recomendação + porquê, à luz do que já foi levantado na
Etapa 1.

**Entrega** — salve em `docs/blueprint/ARCHITECTURE.md`:

```markdown
# Arquitetura — <nome do projeto>

## Stack técnica
<linguagem(ns), framework(s), banco de dados, gerenciador de pacotes>

## Padrão arquitetural
<camadas/responsabilidades e o porquê da escolha>

## Estrutura de pastas
<convenção adotada, com exemplo>

## Convenções de código
<nomenclatura, idioma, casing, linters/formatters a configurar>

## Integrações e dependências externas
<APIs, serviços de terceiros, autenticação — ou "nenhuma nesta fase">

## Restrições e decisões
<decisões relevantes e o porquê — escala, segurança, deploy>
```

Apresente o documento e pergunte se o usuário quer seguir para a Etapa 3 (Design).

---

## Etapa 3 — Design

> Mesmo escopo de um design system de projeto: a linguagem visual e os padrões que
> valem para **todas** as telas — não o mockup de uma tela específica.

### Regra de ouro

O documento existe para que outro agente reproduza o design **pixel a pixel** sem
ter que adivinhar:

- **Valores concretos, não descrições vagas.** `#4F46E5` e `--color-primary`, não
  "um azul arroxeado". `0.5rem` / `8px`, não "espaçamento pequeno". `640px`, não
  "no mobile". Nome da classe/token real quando existir.
- **Não invente.** O que não foi verificado (análise de codebase/referências) ou
  não foi decidido pelo usuário (entrevista) vira `> A definir` explícito — nunca
  texto genérico de enchimento.
- **Decisões de design são do usuário.** Ao perguntar, sempre ofereça recomendação
  e o porquê.
- **Marque a procedência quando o valor for estimado.** Cores/medidas lidas de
  screenshot ou referência externa não são medições — diga isso na seção onde
  aparecem.

### Escolher a abordagem

Só uma abordagem por execução. Pergunte qual usar:

1. **Entrevista do zero** — cabe quando o projeto ainda não tem frontend, ou quando
   o usuário quer definir a linguagem visual agora em vez de herdá-la de algo.
2. **Analisar a codebase atual** — cabe quando já existe frontend real (CSS/tokens,
   biblioteca de componentes, telas prontas).
3. **Referências externas** — partir de sites/apps que o usuário quer espelhar, ou
   de imagens já importadas no projeto.

**Recomendação:** olhe rapidamente o repositório. Se há `tailwind.config.*`, `:root`
com custom properties, uma pasta de componentes com telas reais → recomende
**analisar a codebase**. Se o repositório é novo/vazio no frontend → recomende
**entrevista**. Se o usuário já mencionou um site/app de referência → recomende
**referências externas**.

#### Entrevista do zero

Agrupe perguntas independentes numa só rodada (`AskUserQuestion`, até ~4 por vez); só
faça em sequência quando a resposta de uma afeta a próxima. Roteiro (pule o que claramente
não se aplica; ~12–18 perguntas no total): personalidade visual (2-3 adjetivos); cor primária/de
marca (hex) e cores de estado derivadas; superfície e fundo (claro/escuro/os dois);
tipografia (família texto/título, escala, pesos); unidade de espaçamento e escala
(recomende base 4px); raio de borda; sombra/elevação; breakpoints e largura de
conteúdo; shell da aplicação (sidebar/topbar) e comportamento mobile; densidade;
padrões de tela (listagem/detalhe/formulário); biblioteca de componentes; estados
obrigatórios (vazio, carregando, erro, sem permissão); feedback e validação
(toast vs. inline); movimento (`prefers-reduced-motion`); iconografia;
acessibilidade (recomende WCAG AA).

#### Análise da codebase

Varra o repositório e extraia os padrões **reproduzíveis** (convenção do projeto),
separando-os de escolhas pontuais de uma tela. Fontes típicas: tokens e tema
(`tailwind.config.*`, custom properties em `:root`, variáveis SCSS/Less, arquivos
`tokens.*`); framework de estilo; biblioteca de componentes (dependências, presets);
shell e layout (componente de layout raiz); componentes-base próprios; padrões de
tela (2-3 telas reais de listagem/formulário); tema claro/escuro (mecanismo,
persistência).

Scans read-only e independentes podem ir para subagentes Haiku em paralelo — a
entrevista e a escrita final ficam sempre com o orquestrador. Onde a inferência for
ambígua, **pergunte ao usuário** qual é a convenção a documentar — não eleja uma
sozinho. O que não conseguir verificar vira `> A definir`.

#### Referências externas

O usuário fornece as referências: **URLs** de sites/apps a espelhar (use `WebFetch`;
se o Playwright MCP estiver disponível, navegue e tire screenshots) ou **imagens já
no projeto** (mockups, prints, PDFs de marca — leia com `Read`). Extraia paleta,
famílias e escala tipográfica, unidade de espaçamento aparente, raio de borda,
estilo de sombra, shell/layout, densidade, estilo de componentes e ícones. Se houver
mais de uma referência, aponte conflitos ao usuário e pergunte qual vence.
**Confirme a leitura com o usuário** antes de escrever, e deixe explícito que o
valor foi **estimado a partir de referência** (não medido no código do projeto).

### Entrega

Crie a pasta `docs/blueprint/` se não existir. Preencha **exatamente** o template
abaixo, no idioma predominante do repositório do projeto. Regra de preenchimento por
subseção: valor concreto **ou** `> A definir` — nada de texto genérico só para não
deixar a seção vazia.

```markdown
# Design — <nome do projeto>

**Status:** gerado
**Gerado em:** AAAA-MM-DD
**Origem:** entrevista | análise de codebase | referências externas

> Documento de referência para agentes de IA. Antes de construir ou revisar
> qualquer tela, leia este arquivo e reproduza os valores abaixo literalmente.

## 1. Princípios visuais
Personalidade em 2–3 adjetivos e o que cada um implica nas decisões. Regras gerais
que nenhuma tela deve violar.

## 2. Fundamentos / design tokens

### 2.1 Paleta de cores
Tabela: Token | Valor (hex) | Papel semântico | Onde usar.

### 2.2 Tipografia
Famílias (texto e título) com stack de fallback. Escala: nome | tamanho | peso |
line-height | uso.

### 2.3 Espaçamento e escala
Unidade base. Escala completa (valor → nome/classe). Regras de uso.

### 2.4 Raios, bordas e sombras
Raio(s) de borda por contexto. Espessura e cor de borda padrão. Níveis de
sombra/elevação.

### 2.5 Breakpoints e grid
Breakpoints (nome → min-width). Mobile-first ou desktop-first. Largura máxima do
container.

## 3. Layout e arquitetura de tela
Shell da aplicação e comportamento responsivo. Estrutura de uma página típica.
Densidade. Padrões de listagem, detalhe e formulário.

## 4. Componentes-base
Biblioteca de componentes em uso (nome + versão) ou "componentes próprios". Para
cada componente-chave: variantes, tamanhos, estados, markup/classe canônico.

## 5. Padrões de interação e estados
Estados obrigatórios de toda tela com dados. Hover/focus/active/disabled. Estratégia
de validação. Feedback de ação.

## 6. Movimento e transições
Duração e easing padrão. O que anima e o que não anima. `prefers-reduced-motion`.

## 7. Iconografia e imagens
Biblioteca de ícones, tamanho e estilo padrão. Avatares, thumbnails, estados sem
imagem.

## 8. Acessibilidade
Nível alvo. Contraste mínimo. Foco visível. Tamanho mínimo de alvo de toque.

## 9. Tema claro/escuro
Mecanismo e persistência. Mapeamento de como os tokens da seção 2.1 mudam entre os
temas. Se o projeto é tema único, diga isso aqui.

## 10. Referências e exemplos
URLs e prints usados como base. Trechos de código canônicos. Links para
tokens/preset no repositório.
```

---

## Resumo final

Ao concluir (ou interromper) o fluxo, informe ao usuário, de forma objetiva:

- Quais das três etapas foram concluídas nesta execução e quais ficaram pendentes.
- Quais arquivos foram criados/atualizados/sobrescritos em `docs/blueprint/`.
- Que o próximo passo é `/constitute` (consome `PROJECT.md` e pula perguntas já
  respondidas) ou `/setup-project` (documenta o projeto para agentes de IA e pode
  encadear a constituição).
- Que o `DESIGN.md`, além de alimentar as duas skills acima, é consumido adiante por
  `/plan` (vira a seção "Conformidade com o design" da feature) e por `/to-tdd` (guia a
  implementação da UI).

## Subagentes

- As **entrevistas** (Etapas 1, 2 e a entrevista da Etapa 3) ficam sempre com o
  orquestrador — não delegue.
- Os **scans read-only** da análise de codebase (Etapa 3) podem ser distribuídos em
  subagentes Haiku paralelos. Consolide os achados antes de decidir o que
  documentar.
