# Entrevista — Fase 3: Planejamento

> Material compartilhado. Não é uma skill. Usado por `/plan` e por qualquer skill de fase
> posterior que precise gerar o plano ausente antes de prosseguir.

O plano nasce da spec aprovada. Não invente escopo — qualquer coisa fora dos `AC-XX` volta
para a etapa de especificação.

## Localizar a spec

Leia `docs/specs/<slug>.md`. Se o slug não veio em `$ARGUMENTS` e houver mais de uma spec
sem plano, pergunte qual.

## Entrevista

Uma pergunta de cada vez. Sempre que houver mais de uma abordagem técnica razoável,
apresente as alternativas com uma recomendação e o porquê — a decisão final é do usuário.

1. **Pontos de integração.** Este plano toca sistemas/serviços/módulos existentes? Quais?
2. **Decisões de arquitetura em aberto.** Existe alguma decisão técnica que a spec não
   resolve (síncrono vs. assíncrono, onde armazenar um novo dado, reaproveitar componente
   existente vs. criar novo)? Para cada uma, ofereça 2–3 opções com trade-offs e uma
   recomendação.
3. **Impacto em dados.** Precisa de migração, nova tabela/coleção, mudança de schema?
4. **Riscos técnicos.** O que tem mais chance de dar errado ou atrasar? Vale um spike
   antes de decompor em tarefas?
5. **Fora do plano.** Algo que parece tentador mas deve ficar de fora deste incremento
   (débito técnico aceito, otimizações futuras)?

## Investigação técnica (se necessário)

Se a pergunta 2 revelar decisões que dependem de olhar o código existente, investigue
antes de recomendar. Se houver mais de uma área independente para inspecionar, despache
subagentes em paralelo — um por área — com modelo mais barato (Haiku) para a
leitura/varredura. O orquestrador sintetiza os achados e faz a recomendação.

## Salvar

Use o template de plano em `templates.md`. Crie `docs/plans/` se não existir. Salve em
`docs/plans/<slug>.md` (mesmo slug da spec). Confira que todo `AC-XX` da spec tem cobertura
no plano; se algum não tiver, avise o usuário explicitamente.
