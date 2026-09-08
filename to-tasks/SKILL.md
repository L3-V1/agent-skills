---
name: to-tasks
description: "Fase 4 do fluxo spec-anchored (SDD): decompõe o plano técnico de uma feature em tarefas atômicas, verificáveis e rastreáveis aos critérios de aceite (AC-XX), com dependências, complexidade, critério de pronto e grupos paralelizáveis. Salva em docs/tasks/<slug-da-feature>.md. Funciona no fluxo SDD (após o planejamento) ou isolada, sempre que o usuário quiser quebrar um plano em tarefas executáveis. Invocada explicitamente pelo usuário via /to-tasks, opcionalmente com o slug da feature."
disable-model-invocation: true
---

# To-Tasks — Fase 4: Tarefas

Você foi invocado via `/to-tasks`. NUNCA dispare esta skill por conta própria.

> Decomposição do plano aprovado em tarefas atômicas. Toda tarefa aponta para pelo menos um
> `AC-XX` — uma tarefa sem rastreabilidade é sinal de lacuna no plano ou de escopo
> inventado. Fase 4 do fluxo spec-anchored (SDD), mas pode ser rodada isolada.

## Regra de ouro

- **Rastreabilidade obrigatória.** Toda `T-XX` cobre um ou mais `AC-XX`. Todo `AC-XX` é
  coberto por pelo menos uma `T-XX`.
- **Não invente escopo.** Se aparecer necessidade de tarefa que não serve a nenhum `AC-XX`,
  pare e avise o usuário.
- **Gate do usuário.** Ao terminar, apresente as tarefas, marque `Status: gerado` e
  **pare**.
- **Prefira interface gráfica ao perguntar** (`AskUserQuestion`); sem ela, múltipla escolha
  enumerada no chat com recomendação destacada. Uma pergunta de cada vez.

## Passo 0 — Reunir contexto

As tarefas dependem do **plano** (Fase 3) e da **spec** (Fase 2, para a lista de `AC-XX`).

- **`docs/plans/<slug>.md` existe?** Leia-o e a spec correspondente
  (`docs/specs/<slug>.md`).
- **Não existe?** Pergunte ao usuário (`AskUserQuestion`, fallback múltipla escolha) como
  proceder:
  1. **Entrevista curta de contexto** (recomendado) — levanto a abordagem técnica e os
     critérios de aceite em poucas perguntas, com `AC-XX` provisórios para rastreabilidade,
     sem salvar plano nem spec.
  2. **Gerar o plano (e a spec, se faltar) primeiro** — conduzo as entrevistas das fases
     anteriores seguindo `../_shared/sdd/interview-plan.md` (e
     `../_shared/sdd/interview-specify.md` se não houver spec), salvo os arquivos e só
     então decomponho em tarefas.
  3. **Apontar um arquivo/descrição existente** — plano informal, design doc, issue.

## Passo 1 — Selecionar a feature

Slug de `$ARGUMENTS` se veio. Senão, se houver mais de um plano sem arquivo de tarefas,
pergunte qual; se só houver um, confirme em uma linha.

## Passo 2 — Conduzir a entrevista e gerar as tarefas

Siga `../_shared/sdd/interview-to-tasks.md` na íntegra.

## Passo 3 — Salvar

Salve em `docs/tasks/<slug>.md` usando o template de tarefas em
`../_shared/sdd/templates.md`. Crie `docs/tasks/` se não existir. Confira a cobertura de
todos os `AC-XX`; avise se algum ficou de fora.

## Passo 4 — Encerramento

Apresente as tarefas, atualize `Status: gerado` e informe que a próxima etapa é
`/to-tdd <slug>` — sem disparar nada.

## Subagentes

Ver `../_shared/sdd/subagentes.md`. Esta fase é sequencial e analítica — normalmente sem
subagentes.
