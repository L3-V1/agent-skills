---
name: setup-project
description: "Gera a documentação de contexto do projeto para agentes de IA num único arquivo, `AGENTS.md` ou `CLAUDE.md` (o usuário escolhe qual): visão geral, stack, convenções, docs auxiliares, comandos de setup/execução e, mediante confirmação do usuário, um mapa de onde ficam os artefatos de cada etapa do fluxo SDD e as regras de conduta para agentes — podendo inclusive já encadear a 1ª etapa (constituição). Invocada explicitamente pelo usuário via /setup-project."
disable-model-invocation: true
---

# Setup Project

Você foi invocado via `/setup-project`. NUNCA dispare esta skill por conta própria.

> Versão enxuta e agnóstica de agente do `/init`: gera um único arquivo de contexto
> — `AGENTS.md` ou `CLAUDE.md`, à escolha do usuário — em vez de assumir sempre o
> segundo.

## Regra de ouro

O conteúdo gerado entra no contexto de toda sessão de agente neste projeto — cada linha tem custo.
Mantenha o arquivo curto e denso. Prefira referenciar documentação já existente no projeto
(`docs/`, `CONTRIBUTING.md`, `ARCHITECTURE.md`, READMEs de subpastas) a duplicar o conteúdo dela.

## Passo 1 — Escolher o arquivo

Pergunte ao usuário qual arquivo gerar (prefira `AskUserQuestion`; no fallback de
chat, múltipla escolha enumerada, destacando a recomendação):

- **`AGENTS.md`** (recomendado) — agnóstico de agente, serve qualquer ferramenta de
  IA que rode no projeto.
- **`CLAUDE.md`** — específico do Claude Code.

Só um dos dois é criado; não há link nem cópia entre eles. Guarde a escolha para os
próximos passos — daqui em diante, "o arquivo" se refere ao nome escolhido aqui.

## Passo 2 — Diagnosticar o estado atual

Antes de escrever qualquer coisa, cheque se o arquivo escolhido já existe na raiz do
projeto:

- **Não existe** → siga direto para o Passo 3.
- **Existe** → releia o conteúdo e siga para o Passo 3 só para confirmar que ainda
  reflete o projeto atual; se estiver desatualizado, regenere. Avise no resumo final
  (Passo 7) que o arquivo foi regenerado, e por quê.

## Passo 3 — Levantar informações do projeto

Só inclua o que você conseguir observar de fato no repositório — não invente nada. Fontes típicas:

- **Visão geral**: nome e propósito do projeto — `README.md`, campo `description` de
  `package.json`/`pyproject.toml`/`go.mod`/`composer.json`, etc.
- **Stack técnica**: linguagem(ns), framework(s), gerenciador de pacotes — inferidos dos arquivos de
  manifesto (`package.json`, `requirements.txt`/`pyproject.toml`, `go.mod`, `Gemfile`,
  `composer.json`, `*.csproj`) e da árvore de diretórios.
- **Convenções de código**: linters/formatters configurados (`.eslintrc*`, `.prettierrc*`,
  `ruff.toml`, `.editorconfig`), padrões de nomenclatura observáveis, arquitetura de pastas se houver
  um padrão claro (ex. Controller→Service→Repository, feature folders). Se
  `docs/blueprint/ARCHITECTURE.md` existir, releia-o antes e prefira citá-lo em vez
  de reconstruir essa análise do zero.
- **Documentação adicional**: liste como referências os arquivos/pastas de doc já existentes
  (`docs/`, `CONTRIBUTING.md`, `ARCHITECTURE.md`, READMEs de subpastas) — não copie o conteúdo deles
  para dentro do arquivo.
- **Comandos**: setup (instalar dependências) e execução (dev server, testes, build) — extraídos de
  `package.json` (`scripts`), `Makefile`, `docker-compose.yml`, ou do próprio `README.md`.

## Passo 4 — Perguntar sobre o mapa de artefatos e as regras de conduta

Antes de escrever o arquivo, pergunte ao usuário se ele quer incluir o bloco com o
mapa de onde ficam os artefatos das skills deste repositório e as regras de conduta
para agentes. Sempre que o ambiente oferecer uma interface de opções selecionáveis
(ex.: `AskUserQuestion` na extensão Claude Code no VSCode), use-a. Caso contrário,
pergunte pelo chat em formato de múltipla escolha enumerada. Nos dois casos,
destaque a recomendação: **incluir** (este repositório é centrado no fluxo SDD).

- **Se o usuário recusar:** o arquivo sai só com as cinco seções descritivas — omita
  os blocos `## Mapa de artefatos do projeto` e `## Regras de Conduta`. Siga para o
  Passo 5 e pule o Passo 6.
- **Se o usuário aceitar:** os dois blocos entram no arquivo (Passo 5). Em seguida,
  faça uma segunda pergunta (mesma preferência de interface): **deseja já iniciar
  agora a 1ª etapa do fluxo SDD, a "constituição"?** — uma entrevista técnica de
  levantamento de requisitos seguida da decomposição do projeto em features.
  Recomendação: iniciar agora se o projeto ainda não tem `docs/constitution/`.
  Guarde a resposta para o Passo 6; ela não altera a geração do arquivo.

## Passo 5 — Escrever o arquivo

Use exatamente esta estrutura de seções, mantendo cada uma curta:

```markdown
# <Nome do projeto>

## Visão geral
<1-3 frases: o que o projeto faz e para quem>

## Stack técnica
<linguagem(ns), framework(s) principais, gerenciador de pacotes>

## Convenções de código
<padrões de nomenclatura, linters/formatters em uso, arquitetura de pastas se houver>

## Documentação adicional
<lista de links para docs/, CONTRIBUTING.md, ARCHITECTURE.md, etc. — se existirem>

## Comandos
<setup e execução: instalar deps, rodar em dev, rodar testes, build>

<!-- Os dois blocos abaixo só entram se o usuário aceitou incluí-los no Passo 4. -->

## Mapa de artefatos do projeto

Índice de onde ficam os artefatos versionados produzidos pelas skills de desenvolvimento.
`<slug-do-projeto>` e `<slug-da-feature>` são definidos ao longo do fluxo (sempre kebab-case);
enquanto não existirem, valem apenas as pastas e o padrão de nome abaixo. O slug de uma feature é
o mesmo em todas as etapas: `docs/specs/checkout.md`, `docs/plans/checkout.md` e
`docs/tasks/checkout.md` referem-se todos à feature `checkout`.

| Artefato | Local | Skill que produz |
|---|---|---|
| Descrição do projeto, arquitetura e design (fase 0, opcional) | `docs/blueprint/PROJECT.md`, `ARCHITECTURE.md`, `DESIGN.md` | `/blueprint` |
| Constituição (propósito + features do projeto) | `docs/constitution/<slug-do-projeto>.md` | `/constitute`, `/setup-project` |
| Especificação da feature (critérios de aceite EARS) | `docs/specs/<slug-da-feature>.md` | `/specify` |
| Plano técnico da feature | `docs/plans/<slug-da-feature>.md` | `/plan` |
| Tarefas atômicas + progresso da implementação | `docs/tasks/<slug-da-feature>.md` | `/to-tasks` (produz), `/to-tdd` (atualiza progresso) |
| Base de conhecimento (armadilhas já resolvidas) | `docs/knowledge/INDEX.md` + `docs/knowledge/<slug>.md` | `knowledge-base` |

## Regras de Conduta

Obrigatórias para qualquer agente de IA que trabalhe neste projeto:

- **NÃO amplie o escopo do projeto silenciosamente.** Qualquer mudança fora do que foi
  explicitamente pedido precisa ser levantada com o usuário antes.
- **NÃO invente requisitos novos.** Se um requisito não está na spec ou nas instruções do
  usuário, ele não existe — pergunte.
- **NÃO tome decisões de produto ou arquitetura por conta própria.** Apresente as alternativas
  e a recomendação; a decisão é do usuário.
- **SEMPRE faça perguntas ao usuário** quando identificar lacunas nas instruções, ambiguidade
  de escopo, ou quando surgirem dúvidas durante a execução. Preferir perguntar a assumir.
- **SIGA o design system.** Quando existir `docs/blueprint/DESIGN.md`, implemente e revise
  qualquer UI com os tokens, componentes e padrões de tela definidos nele — valores literais,
  sem improviso. Desvio necessário se levanta com o usuário antes.
- **PREFIRA interface gráfica ao perguntar ao usuário.** Quando o ambiente oferecer uma
  interface de opções selecionáveis (ex. `AskUserQuestion` na extensão Claude Code no VSCode),
  use-a. Se não houver interface disponível no ambiente, faça as perguntas pelo chat em formato
  de múltipla escolha enumerada, sempre oferecendo e destacando a alternativa recomendada e o
  porquê, dado o contexto atual do projeto.
```

Omita uma seção inteira se não houver nada real para preencher nela (ex. projeto sem docs
auxiliares) — não deixe cabeçalhos vazios. **Blocos condicionais:** `## Mapa de artefatos do
projeto` e `## Regras de Conduta` só entram se o usuário aceitou incluí-los no Passo 4; quando
entram, é na íntegra, com o texto literal acima, sem adaptar ao projeto (a tabela do mapa também
sai sem preencher slugs reais); quando o usuário recusa, os dois são omitidos por completo. A
regra de omissão por falta de conteúdo real vale para as cinco seções descritivas (Visão geral,
Stack técnica, Convenções de código, Documentação adicional, Comandos).

## Passo 6 — Iniciar a constituição (se solicitado)

Execute este passo **só se** o usuário aceitou incluir os blocos no Passo 4 **e**
respondeu que quer iniciar a constituição agora. Caso contrário, pule direto para o
Passo 7.

A própria skill conduz a etapa — não delegue para outras skills:

0. **Contexto existente.** Se `docs/blueprint/PROJECT.md` existir (Etapa 1 do
   `/blueprint`), leia-o antes de perguntar qualquer coisa e use-o como ponto de
   partida: pule as perguntas já respondidas, confirme só os pontos ambíguos e leve
   a "Decomposição preliminar em features" como base para o passo 2. Se
   `docs/blueprint/ARCHITECTURE.md` também existir, releia-o para não repetir
   perguntas sobre stack/arquitetura.
1. **Entrevista técnica de levantamento de requisitos.** Agrupe perguntas independentes numa
   só rodada (`AskUserQuestion`, até ~4 por vez); só faça em sequência quando a resposta de
   uma afeta o conteúdo ou a relevância da próxima. No fallback de chat, múltipla escolha
   enumerada com recomendação destacada. Roteiro mínimo (pule o que não se aplicar): problema e público-alvo; papéis e
   atores; escopo dentro/fora desta versão; requisitos funcionais; requisitos não funcionais
   (performance, segurança, escala) quando relevantes; stack técnica e restrições; critérios de
   sucesso; riscos e casos de borda conhecidos. Mantenha entre ~10 e 20 perguntas no total, a
   menos que o usuário peça mais.
2. **Decomposição em features.** A partir das respostas, identifique features distintas —
   unidades de escopo coerentes, cada uma pequena o bastante para virar uma spec isolada, nem
   tão grande que "faça tudo" nem tão pequena que seja subtarefa de implementação. Para cada
   uma: nome curto, slug em kebab-case, descrição de 2–4 frases e dependências ("nenhuma" se não
   houver).
3. **Confirme a decomposição com o usuário** antes de salvar — adicionar, remover, fundir ou
   dividir features. Não salve sem essa confirmação.
4. **Salve** em `docs/constitution/<slug-do-projeto>.md` (crie a pasta se não existir):

```markdown
# Constituição: <nome do projeto>

## Propósito
<1-3 frases: o que o projeto entrega e para quem>

## Princípios inegociáveis
- <decisões e restrições que nenhuma feature pode violar>

## Features
### 1. <Nome da feature> (`slug-da-feature`)
<descrição>
**Depende de:** <slugs, ou "nenhuma">

## Próximos passos
Próxima etapa por feature: `/specify <slug>`
```

## Passo 7 — Resumo final

Informe ao usuário, de forma objetiva:

- Qual arquivo foi gerado (`AGENTS.md` ou `CLAUDE.md`) e se foi criado do zero ou regenerado
  (e por quê, se estava desatualizado).
- Um resumo curto do conteúdo final (as seções preenchidas).
- Se os blocos `## Mapa de artefatos do projeto` e `## Regras de Conduta` foram
  incluídos ou omitidos, conforme a escolha do usuário no Passo 4 — quando
  incluídos, são boilerplate que o usuário pode editar se o projeto usar outra
  convenção de caminhos/etapas.
- Se a constituição foi conduzida: que `docs/constitution/<slug>.md` foi criado e que o próximo
  passo é `/specify <slug>` por feature. Se não foi: que a etapa de Constituição fica pendente
  como próximo passo do fluxo SDD (a skill `/constitute` a conduz).
