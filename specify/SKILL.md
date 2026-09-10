---
name: specify
description: "Fase 2 do fluxo spec-anchored (SDD): define O QUÊ será implementado numa feature — problema, público, escopo (dentro/fora), restrições e critérios de aceite observáveis em notação EARS — e salva em docs/specs/<NN-slug-da-feature>.md (NN = ID sequencial da feature). Funciona no fluxo SDD (após a constituição) ou isolada, sempre que o usuário quiser uma especificação formal de uma feature. Invocada explicitamente pelo usuário via /specify, opcionalmente com o slug da feature."
disable-model-invocation: true
---

# Specify — Fase 2: Especificação (EARS)

Você foi invocado via `/specify`. NUNCA dispare esta skill por conta própria.

> Especificação formal de uma feature: o "O QUÊ", não o "COMO". Fase 2 do fluxo
> spec-anchored (SDD), mas pode ser rodada isolada. Uma spec por feature. Os critérios de
> aceite (`AC-XX`) que ela numera são o elo de rastreabilidade de todas as etapas
> seguintes.

## Regra de ouro

- **Não gere nada antes da entrevista terminar.** Não leia código do projeto, não faça
  suposições sobre escopo até o usuário confirmar. Uma spec malfeita contamina tudo.
- **Não invente escopo.** Só entra na spec o que saiu da entrevista.
- **Gate do usuário.** Ao terminar, apresente a spec, marque `Status: gerado` e **pare**.
- **Prefira interface gráfica ao perguntar** (`AskUserQuestion`); sem ela, múltipla escolha
  enumerada no chat com recomendação destacada. Agrupe perguntas independentes numa só
  rodada (até ~4); só em sequência quando a resposta de uma afeta a próxima.

## Passo 0 — Reunir contexto

A spec depende da **constituição** (Fase 1) — mas só como contexto, não como bloqueio.

- **`docs/constitution/<slug-do-projeto>.md` existe?** Leia para entender o projeto e a
  feature-alvo dentro da decomposição. O **ID** da feature (prefixo `NN-` do arquivo) é o
  número dela na seção "Features"; sem constituição, ele vem da varredura de `docs/specs/`
  — ver `../_shared/sdd/interview-specify.md`.
- **Não existe?** Pergunte ao usuário (`AskUserQuestion`, fallback múltipla escolha) como
  proceder:
  1. **Entrevista curta de contexto** (recomendado) — descrevo em 2–3 perguntas o projeto
     e onde a feature se encaixa, sem gerar a constituição.
  2. **Gerar a constituição primeiro** — conduzo a entrevista completa da Fase 1 seguindo
     `../_shared/sdd/interview-constitute.md`, salvo `docs/constitution/<slug>.md` e só
     então sigo para a spec.
  3. **Apontar um arquivo/descrição existente** — README, PRD, nota; uso como ponto de
     partida.

## Passo 1 — Selecionar a feature

Se o usuário passou um slug (ou `NN-slug`) em `$ARGUMENTS`, use-o. Senão, se a constituição
listar várias features sem `docs/specs/<NN-slug>.md`, pergunte qual via `AskUserQuestion`;
se só houver uma pendente, confirme em uma linha.

## Passo 2 — Conduzir a entrevista e converter para EARS

Siga `../_shared/sdd/interview-specify.md` na íntegra e a tabela EARS em
`../_shared/sdd/ears.md`.

## Passo 3 — Salvar

Salve em `docs/specs/<NN-slug>.md` usando o template de spec em
`../_shared/sdd/templates.md`. Crie `docs/specs/` se não existir.

## Passo 4 — Encerramento

Apresente a spec completa, atualize `Status: gerado` e informe que a próxima etapa é
`/plan <NN-slug>` — sem disparar nada.

## Subagentes

Ver `../_shared/sdd/subagentes.md`. Esta fase é sequencial e analítica — normalmente sem
subagentes.
