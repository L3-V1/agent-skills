---
name: sdd-tasks
description: "Decompõe um plano técnico aprovado em tarefas atômicas e rastreáveis, através de entrevista guiada sobre granularidade e dependências. Terceira fase do workflow spec-anchored (sdd-spec → sdd-plan → sdd-tasks → sdd-implement → sdd-audit)."
disable-model-invocation: true
---

# sdd-tasks — Decomposição em tarefas atômicas

Você foi invocado via `/sdd-tasks`. NUNCA dispare esta skill por conta própria.

## Regra de ouro

Toda tarefa precisa apontar para pelo menos um critério de aceite (`AC-XX`) da spec. Uma
tarefa sem rastreabilidade é sinal de que o plano tem lacunas ou que você está inventando
escopo — nesse caso, pare e avise o usuário em vez de criar a tarefa mesmo assim.

## Passo 1 — Localizar o plano de referência

- Liste `docs/plans/*.md`. Use o plano com `Status: aprovado` correspondente. Se houver mais
  de um candidato, pergunte qual.
- Se o plano ainda estiver `rascunho`, avise e confirme se o usuário quer seguir mesmo assim
  antes de continuar.
- Leia também a spec (`docs/specs/<slug>.md`) para ter a lista completa de AC-XX.

## Passo 2 — Entrevista

Sempre que o ambiente oferecer uma interface de opções selecionáveis para perguntas ao usuário
(ex.: `AskUserQuestion` na extensão Claude Code no VSCode), use-a para apresentar as
alternativas das perguntas abaixo — é mais rápido e reduz ambiguidade de leitura. Só faça a
pergunta em texto livre pelo chat quando esse tipo de interface não estiver disponível no
ambiente atual.

1. **Granularidade.** Prefere tarefas bem pequenas (uma função/endpoint por tarefa, mais
   controle e mais gates informais) ou tarefas maiores por área (menos overhead, menos
   granularidade)? Recomendação padrão: tarefas pequenas o bastante para serem implementadas
   e testadas em uma única sessão de foco (tipicamente menos de ~1h de trabalho de agente) —
   isso facilita tanto o loop de TDD em `sdd-implement` quanto a auditoria em `sdd-audit`.
2. **Ordem/dependências.** Existem tarefas que precisam necessariamente vir antes de outras
   (ex.: schema de dados antes do endpoint que o usa)? Ou a maior parte é independente entre
   si?
3. **Paralelização desejada.** Quando `sdd-implement` rodar, você quer que tarefas
   independentes entre si sejam despachadas em paralelo via subagentes (mais rápido, mais
   tokens gastos em paralelo) ou sempre sequencial (mais lento, mais fácil de acompanhar)?

## Passo 3 — Gerar as tarefas

Para cada critério de aceite (ou grupo de critérios relacionados), gere uma ou mais tarefas.
Cada tarefa é um item de checkbox markdown (`- [ ]`), com ID e título na mesma linha
(`- [ ] **T-01** — <título>`), e precisa ter:

- **ID** (`T-01`, `T-02`, ...)
- **Título** curto
- **AC-XX cobertos**
- **Dependências** (outros T-XX que precisam estar prontos antes, ou "nenhuma")
- **Complexidade** (baixa / média / alta) — isso orienta `sdd-implement` na escolha de modelo
  para subagentes: tarefas de complexidade baixa são candidatas a rodar em modelo mais barato
  (Haiku) quando despachadas como subagente.
- **Critério de pronto** — o que precisa ser verdade para marcar como concluída (geralmente:
  teste correspondente ao AC passando).

Marque explicitamente quais tarefas são **independentes entre si** (sem dependência mútua) —
essas são as candidatas a paralelização em `sdd-implement`.

## Passo 4 — Salvar

Crie `docs/tasks/` se não existir. Salve em `docs/tasks/<slug>.md`:

```markdown
# Tarefas: <nome da feature>

**Status:** rascunho | aprovado
**Slug:** <slug>
**Plano de referência:** docs/plans/<slug>.md
**Paralelização:** sim | não (decidido no passo 2.3)

- [ ] **T-01** — <título>
  - **Cobre:** AC-01, AC-02
  - **Depende de:** nenhuma
  - **Complexidade:** baixa
  - **Pronto quando:** teste de AC-01 e AC-02 passam

- [ ] **T-02** — <título>
  - **Cobre:** AC-03
  - **Depende de:** T-01
  - **Complexidade:** média
  - **Pronto quando:** ...

## Grupos paralelizáveis
- Grupo A (independentes entre si): T-01, T-03
- Sequencial: T-02 (depende de T-01), T-04 (depende de T-02)

## Rastreabilidade reversa
- AC-01 → T-01
- AC-02 → T-01
- AC-03 → T-02
```

## Passo 5 — Gate de aprovação (obrigatório)

Confira que todo AC-XX da spec está coberto por pelo menos uma tarefa. Se algum ficou de
fora, avise antes de pedir aprovação.

Pergunte:

> "Essas são as tarefas. Aprovadas para começar a implementação (`/sdd-implement`), ou quer
> reorganizar granularidade/dependências antes?"

Não avance sozinho. Ao aprovar, atualize `Status: aprovado`.

## Subagentes

Esta fase é majoritariamente analítica (ler plano e spec, decompor) — normalmente não precisa
de subagentes. Só considere despachar se o plano cobrir áreas muito distintas do código-base e
você precisar inspecionar cada uma para estimar complexidade/dependências com precisão; nesse
caso, uma inspeção por área, em paralelo, com modelo mais barato.
