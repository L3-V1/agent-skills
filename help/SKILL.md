---
name: help
description: "Guia de uso das skills deste repositório: explica o fluxo SDD (spec-anchored), qual skill usar em cada situação, a ordem entre elas e onde ficam os artefatos gerados. Invocada explicitamente pelo usuário via /help."
disable-model-invocation: true
---

# Help

Você foi invocado via `/help`. NUNCA dispare esta skill por conta própria.

> Não gera nem edita nenhum arquivo. Responde no chat, usando o catálogo abaixo,
> perguntas do tipo "qual skill eu uso pra X", "o que vem depois do `/specify`",
> "onde fica o design system", "por onde eu começo um projeto novo".

## O fluxo SDD (spec-anchored)

Cinco fases, cada uma numa skill própria: `constitute` → `specify` → `plan` →
`to-tasks` → `to-tdd`. Cada fase gera um artefato versionado em `docs/` que é um
gate de revisão do usuário e ancora a fase seguinte — mas **cada skill roda isolada**
também, se o usuário fornecer o contexto necessário (ou deixar a skill levantá-lo).

Antes da constituição, `/blueprint` é o passo opcional de preparação: reúne a
descrição do projeto, a arquitetura técnica e o design system antes de qualquer
código.

## Quando usar cada skill

| Situação do usuário | Skill | Artefato |
|---|---|---|
| "Tenho uma ideia vaga, quero explorar antes de formalizar" | `/blueprint` (Etapa 1 — Projeto) | `docs/blueprint/PROJECT.md` |
| "Já sei o projeto, falta decidir stack/arquitetura/convenções" | `/blueprint` (Etapa 2 — Arquitetura) | `docs/blueprint/ARCHITECTURE.md` |
| "Preciso do design system antes de construir telas" | `/blueprint` (Etapa 3 — Design) | `docs/blueprint/DESIGN.md` |
| "Quero documentar o contexto do projeto para agentes de IA" | `/setup-project` | `AGENTS.md` ou `CLAUDE.md` |
| "Preciso formalizar propósito, princípios e as features do projeto" | `/constitute` | `docs/constitution/<slug-do-projeto>.md` |
| "Preciso definir o QUÊ de uma feature (critérios de aceite)" | `/specify` | `docs/specs/<slug-da-feature>.md` |
| "Preciso definir o COMO de uma feature (arquitetura/integração)" | `/plan` | `docs/plans/<slug-da-feature>.md` |
| "Preciso quebrar o plano em tarefas atômicas" | `/to-tasks` | `docs/tasks/<slug-da-feature>.md` |
| "Hora de implementar em TDD" | `/to-tdd` | atualiza `docs/tasks/<slug-da-feature>.md` |
| "Bati num erro obscuro/recorrente, ou resolvi algo que exigiu investigação" | `knowledge-base` (dispara sozinha) | `docs/knowledge/INDEX.md` + `docs/knowledge/<slug>.md` |

## Ordem recomendada de ponta a ponta

1. `/blueprint` (opcional, mas recomendado para projeto novo) — Projeto →
   Arquitetura → Design.
2. `/setup-project` — documenta o projeto para agentes de IA; pode encadear a
   constituição na mesma execução.
3. `/constitute` — formaliza propósito, princípios e decompõe em features.
4. Por feature: `/specify` → `/plan` → `/to-tasks` → `/to-tdd`.
5. `knowledge-base` fica ativa o tempo todo, disparando sozinha quando útil.

## Perguntas frequentes

- **"Preciso rodar `/blueprint` inteiro antes de tudo?"** Não — cada etapa dele
  (Projeto/Arquitetura/Design) é independente e pode ser pulada ou rodada isolada.
- **"As fases do SDD (`constitute`→`to-tdd`) se encadeiam automaticamente?"** Não —
  cada uma roda isolada se o usuário der o contexto necessário; a ordem acima é uma
  recomendação, não uma automação.
- **"Onde fica documentado o mapa completo de artefatos e skills?"** No `AGENTS.md`/
  `CLAUDE.md` gerado pelo `/setup-project` (bloco "Mapa de artefatos do projeto"),
  quando o usuário optar por incluí-lo.
- **"Que skill devo rodar depois de terminar uma feature?"** Volte ao passo 4 para a
  próxima feature (`/specify` → `/plan` → `/to-tasks` → `/to-tdd`).
