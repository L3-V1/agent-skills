---
name: plan
description: "Fase 3 do fluxo spec-anchored (SDD): define a abordagem técnica de COMO uma feature será implementada — pontos de integração, decisões de arquitetura com trade-offs, impacto em dados, riscos — derivada da spec aprovada e rastreada aos critérios de aceite (AC-XX). Salva em docs/plans/<slug-da-feature>.md. Funciona no fluxo SDD (após a especificação) ou isolada, sempre que o usuário quiser um plano técnico de uma feature. Invocada explicitamente pelo usuário via /plan, opcionalmente com o slug da feature."
disable-model-invocation: true
---

# Plan — Fase 3: Planejamento

Você foi invocado via `/plan`. NUNCA dispare esta skill por conta própria.

> Plano técnico derivado da spec aprovada: o "COMO". Não introduz requisitos novos —
> qualquer coisa fora dos `AC-XX` da spec volta para a etapa de especificação. Fase 3 do
> fluxo spec-anchored (SDD), mas pode ser rodada isolada.

## Regra de ouro

- **Não invente escopo.** Todo `AC-XX` da spec deve ter cobertura no plano; nada além dos
  `AC-XX` entra.
- **Decisões de arquitetura são do usuário.** Apresente 2–3 opções com trade-offs e uma
  recomendação; a escolha é dele.
- **Gate do usuário.** Ao terminar, apresente o plano, marque `Status: gerado` e **pare**.
- **Prefira interface gráfica ao perguntar** (`AskUserQuestion`); sem ela, múltipla escolha
  enumerada no chat com recomendação destacada. Uma pergunta de cada vez.

## Passo 0 — Reunir contexto

O plano depende da **spec** (Fase 2).

- **`docs/specs/<slug>.md` existe?** Leia-a e leia também `docs/constitution/*.md` se
  existir, para contexto. Extraia a lista completa de `AC-XX`.
- **Não existe?** Pergunte ao usuário (`AskUserQuestion`, fallback múltipla escolha) como
  proceder:
  1. **Entrevista curta de contexto** (recomendado) — levanto em poucas perguntas o
     problema, o escopo e os critérios de aceite observáveis da feature, numerando `AC-XX`
     provisórios para dar rastreabilidade ao plano, sem salvar a spec.
  2. **Gerar a spec primeiro** — conduzo a entrevista completa da Fase 2 seguindo
     `../_shared/sdd/interview-specify.md` + `../_shared/sdd/ears.md`, salvo
     `docs/specs/<slug>.md` e só então sigo para o plano. (Se faltar contexto de projeto,
     essa entrevista já cobre o mínimo necessário — não suba até a constituição salvo
     pedido do usuário.)
  3. **Apontar um arquivo/descrição existente** — PRD, issue, nota; uso como ponto de
     partida e derivo os `AC-XX`.

## Passo 1 — Selecionar a feature

Slug de `$ARGUMENTS` se veio. Senão, se houver mais de uma spec sem plano, pergunte qual;
se só houver uma, confirme em uma linha.

## Passo 2 — Conduzir a entrevista e a investigação técnica

Siga `../_shared/sdd/interview-plan.md` na íntegra.

## Passo 3 — Salvar

Salve em `docs/plans/<slug>.md` (mesmo slug da spec) usando o template de plano em
`../_shared/sdd/templates.md`. Crie `docs/plans/` se não existir. Confira que todo `AC-XX`
tem cobertura; avise explicitamente se algum não tiver.

## Passo 4 — Encerramento

Apresente o plano, atualize `Status: gerado` e informe que a próxima etapa é
`/to-tasks <slug>` — sem disparar nada.

## Subagentes

Ver `../_shared/sdd/subagentes.md`. Use subagentes (Haiku) só para investigação técnica
paralela e independente do código; as decisões de arquitetura ficam no orquestrador.
