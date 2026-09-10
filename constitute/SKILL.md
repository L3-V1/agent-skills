---
name: constitute
description: "Fase 1 do fluxo spec-anchored (SDD): entrevista técnica de levantamento de requisitos e decomposição do projeto em features distintas, gerando docs/constitution/<slug-do-projeto>.md. Funciona como início do fluxo SDD ou isolada — sempre que o usuário quiser um documento de fundação do projeto (propósito, princípios inegociáveis, lista de features com dependências). Consome docs/blueprint/PROJECT.md e docs/blueprint/ARCHITECTURE.md como contexto se existirem. Invocada explicitamente pelo usuário via /constitute."
disable-model-invocation: true
---

# Constitute — Fase 1: Constituição

Você foi invocado via `/constitute`. NUNCA dispare esta skill por conta própria.

> Documento de fundação do projeto: propósito, princípios inegociáveis e decomposição do
> projeto em features distintas — a referência de escopo de mais alto nível. É a Fase 1 do
> fluxo spec-anchored (SDD), mas pode ser rodada isolada. A própria skill conduz a
> entrevista — não delega.

## Regra de ouro

- **Não invente escopo.** A decomposição em features sai da entrevista e é confirmada com o
  usuário antes de salvar.
- **Gate do usuário.** Ao terminar, apresente o resultado, marque `Status`/anote que foi
  gerado e **pare**. Não encadeie a próxima fase.
- **Prefira interface gráfica ao perguntar.** Quando o ambiente oferecer `AskUserQuestion`
  (extensão Claude Code no VSCode), use-a. Sem essa interface, pergunte no chat em múltipla
  escolha enumerada, sempre destacando a recomendação e o porquê. Agrupe perguntas
  independentes numa só rodada (`AskUserQuestion`, até ~4); só faça em sequência quando a
  resposta de uma afeta o conteúdo ou a relevância da próxima.

## Passo 0 — Reunir contexto

A constituição é a primeira fase, então não há artefato anterior obrigatório. Verifique só:

- **`docs/constitution/<slug>.md` já existe?** Leia. Pergunte ao usuário se quer
  **atualizar** (mesclar o levantamento desta execução, preservando o que já está
  registrado), **sobrescrever** (regenerar do zero) ou **abortar**.
- **`docs/blueprint/PROJECT.md` existe?** É a Etapa 1 do `/blueprint` (opcional).
  Leia antes de perguntar qualquer coisa e use como ponto de partida.
- **`docs/blueprint/ARCHITECTURE.md` existe?** É a Etapa 2 do `/blueprint`
  (opcional). Leia para não repetir perguntas sobre stack técnica e restrições
  já decididas.

## Passo 1 — Conduzir a entrevista e a decomposição

Siga `../_shared/sdd/interview-constitute.md` na íntegra: contexto existente → entrevista
técnica (perguntas independentes agrupadas) → decomposição em features → confirmação com o
usuário.

## Passo 2 — Salvar

Salve em `docs/constitution/<slug-do-projeto>.md` (crie a pasta se não existir) usando o
template de constituição em `../_shared/sdd/templates.md`. No modo **atualizar**, mescle
preservando as decisões já registradas.

## Passo 3 — Encerramento

Apresente o documento completo e informe, de forma objetiva:

- Que `docs/constitution/<slug>.md` foi criado / atualizado / sobrescrito.
- A lista de features decompostas (ID + nome + slug). O ID de 2 dígitos prefixa os
  arquivos de todas as fases seguintes (`docs/specs/<NN-slug>.md`, etc.).
- Que a próxima etapa por feature é `/specify <NN-slug>` — sem disparar nada.

## Subagentes

Ver `../_shared/sdd/subagentes.md`. Esta fase é sequencial e analítica — normalmente sem
subagentes.
