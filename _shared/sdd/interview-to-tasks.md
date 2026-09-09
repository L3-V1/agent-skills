# Entrevista — Fase 4: Tarefas

> Material compartilhado. Não é uma skill. Usado por `/to-tasks` e por `/to-tdd` quando
> precisar gerar o arquivo de tarefas ausente antes de implementar.

Toda tarefa precisa apontar para pelo menos um `AC-XX` da spec. Uma tarefa sem
rastreabilidade é sinal de que o plano tem lacunas ou de que você está inventando escopo —
pare e avise o usuário em vez de criar a tarefa mesmo assim.

## Localizar o plano

Leia `docs/plans/<slug>.md` e a spec (`docs/specs/<slug>.md`) para ter a lista completa de
`AC-XX`.

## Entrevista

As três perguntas abaixo são independentes entre si — pode fazê-las numa só rodada
(`AskUserQuestion`, até ~4 por vez); no fallback de chat, múltipla escolha enumerada com a
recomendação destacada.

1. **Granularidade.** Tarefas bem pequenas (uma função/endpoint por tarefa) ou maiores por
   área? Recomendação: pequenas o bastante para serem implementadas e testadas em uma
   única sessão de foco (tipicamente < ~1h de trabalho de agente).
2. **Ordem/dependências.** Existem tarefas que precisam necessariamente vir antes de
   outras (ex.: schema de dados antes do endpoint que o usa)? Ou a maior parte é
   independente?
3. **Paralelização desejada.** Na implementação, tarefas independentes entre si devem ser
   despachadas em paralelo via subagentes (mais rápido, mais tokens em paralelo) ou sempre
   sequencial (mais lento, mais fácil de acompanhar)?

## Gerar as tarefas

Para cada critério (ou grupo de critérios relacionados), gere uma ou mais tarefas. Cada
tarefa é um item de checkbox markdown com ID e título na mesma linha, e precisa ter: ID
(`T-01`, ...), título curto, `AC-XX` cobertos, dependências (outros `T-XX` ou "nenhuma"),
complexidade (baixa/média/alta — orienta a escolha de modelo para subagentes) e critério
de pronto (geralmente: teste correspondente ao AC passando). Para tarefas com manifestação
visual, o critério de pronto inclui conformidade com `docs/blueprint/DESIGN.md` — a tela usa
os tokens, componentes e padrões da seção "Conformidade com o design" do plano, sem cor ou
medida fora da escala. Marque explicitamente quais tarefas são independentes entre si.

## Salvar

Use o template de tarefas em `templates.md`. Crie `docs/tasks/` se não existir. Salve em
`docs/tasks/<slug>.md`. Confira que todo `AC-XX` está coberto por pelo menos uma tarefa; se
algum ficou de fora, avise antes de encerrar.
