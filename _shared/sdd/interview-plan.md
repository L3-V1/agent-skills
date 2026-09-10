# Entrevista — Fase 3: Planejamento

> Material compartilhado. Não é uma skill. Usado por `/plan` e por qualquer skill de fase
> posterior que precise gerar o plano ausente antes de prosseguir.

O plano nasce da spec aprovada. Não invente escopo — qualquer coisa fora dos `AC-XX` volta
para a etapa de especificação.

## Localizar a spec

`$ARGUMENTS` pode vir como `<slug>`, `<NN-slug>` ou só `<NN>` — resolva qualquer forma
localizando `docs/specs/*-<slug>.md` (ou `docs/specs/<NN>-*.md`). Se o slug não veio e
houver mais de uma spec sem plano, pergunte qual (mostre `NN — nome da feature`).

## Entrevista

Você pode agrupar perguntas independentes numa só rodada (`AskUserQuestion`, até ~4 por
vez); só faça em sequência quando a resposta de uma afeta a próxima — o que é comum aqui: a
pergunta 2 (decisões de arquitetura) costuma depender da 1 (pontos de integração) e da
investigação técnica. Sempre que houver mais de uma abordagem técnica razoável, apresente as
alternativas com uma recomendação e o porquê — a decisão final é do usuário.

1. **Pontos de integração.** Este plano toca sistemas/serviços/módulos existentes? Quais?
2. **Decisões de arquitetura em aberto.** Existe alguma decisão técnica que a spec não
   resolve (síncrono vs. assíncrono, onde armazenar um novo dado, reaproveitar componente
   existente vs. criar novo)? Para cada uma, ofereça 2–3 opções com trade-offs e uma
   recomendação.
3. **Impacto em dados.** Precisa de migração, nova tabela/coleção, mudança de schema?
4. **Riscos técnicos.** O que tem mais chance de dar errado ou atrasar? Vale um spike
   antes de decompor em tarefas?
5. **Superfície visual.** Esta feature tem telas ou componentes de UI? Se sim e existir
   `docs/blueprint/DESIGN.md`, leia-o e liste os tokens (cores, tipografia, espaçamento,
   raio), os padrões de tela (listagem/detalhe/formulário) e os componentes-base que se
   aplicam. Os estados obrigatórios da seção 5 do DESIGN.md (vazio, carregando, erro, sem
   permissão) valem para toda tela com dados. Isso vira a seção "Conformidade com o design"
   do plano.
6. **Fora do plano.** Algo que parece tentador mas deve ficar de fora deste incremento
   (débito técnico aceito, otimizações futuras)?

## Investigação técnica (se necessário)

Se a pergunta 2 revelar decisões que dependem de olhar o código existente, investigue
antes de recomendar. Se houver mais de uma área independente para inspecionar, despache
subagentes em paralelo — um por área — com modelo mais barato (Haiku) para a
leitura/varredura. O orquestrador sintetiza os achados e faz a recomendação.

## Salvar

Use o template de plano em `templates.md`. Crie `docs/plans/` se não existir. Salve em
`docs/plans/<NN-slug>.md` **reutilizando exatamente o prefixo `NN-<slug>` da spec de
origem** — nunca reatribua o ID. Se esta fase rodar isolada, sem spec, determine o ID pelo
fallback de numeração descrito em `interview-specify.md`, aplicado a `docs/plans/`. Confira
que todo `AC-XX` da spec tem cobertura
no plano; se algum não tiver, avise o usuário explicitamente. Se a feature tem UI, confira
também que a seção "Conformidade com o design" está preenchida (ou marcada como "sem
superfície visual").
