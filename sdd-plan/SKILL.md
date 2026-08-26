---
name: sdd-plan
description: "Deriva o plano técnico (arquitetura, decisões, trade-offs) a partir de uma spec já gerada em docs/specs/, através de entrevista guiada. Segunda fase do workflow spec-anchored (sdd-spec → sdd-plan → sdd-tasks → sdd-implement → sdd-audit)."
disable-model-invocation: true
---

# sdd-plan — Plano técnico

Você foi invocado via `/sdd-plan`. NUNCA dispare esta skill por conta própria — só quando o
usuário digitar o comando.

## Regra de ouro

Um plano técnico nasce de uma spec já gerada em `docs/specs/`. Não invente escopo aqui —
qualquer coisa que não esteja coberta pelos critérios de aceite (AC-XX) da spec deve voltar
para `/sdd-spec`, não ser decidida ad-hoc nesta fase.

## Passo 1 — Localizar a spec de referência

- Liste `docs/specs/*.md`. Se houver só uma spec sem plano correspondente em `docs/plans/`,
  use-a direto e confirme com o usuário em uma linha ("Vou usar a spec de
  checkout-parcelado, ok?").
- Se houver mais de uma spec sem plano, pergunte qual delas.

## Passo 2 — Entrevista

Uma pergunta de cada vez. Sempre que houver mais de uma abordagem técnica razoável, apresente
as alternativas com uma recomendação e o porquê — mas a decisão final é do usuário. Sempre que
o ambiente oferecer uma interface de opções selecionáveis para perguntas ao usuário (ex.:
`AskUserQuestion` na extensão Claude Code no VSCode), use-a para apresentar essas alternativas
— é mais rápido e reduz ambiguidade de leitura. Só faça a pergunta em texto livre pelo chat
quando esse tipo de interface não estiver disponível no ambiente atual.

1. **Pontos de integração.** Este plano toca sistemas/serviços/módulos existentes? Quais?
2. **Decisões de arquitetura em aberto.** Existe alguma decisão técnica que a spec não resolve
   (ex.: síncrono vs. assíncrono, onde armazenar um novo dado, reaproveitar componente
   existente vs. criar novo)? Para cada uma, ofereça 2-3 opções com trade-offs e uma
   recomendação.
3. **Impacto em dados.** Precisa de migração, nova tabela/coleção, mudança de schema?
4. **Riscos técnicos.** O que tem mais chance de dar errado ou atrasar? Vale investigar
   (spike) algo antes de decompor em tarefas?
5. **Fora do plano.** Alguma coisa que parece tentadora mas deve ficar de fora deste
   incremento (débito técnico aceito, otimizações futuras)?

## Passo 3 — Investigação técnica (se necessário)

Se a pergunta 2 revelar decisões que dependem de olhar o código existente (ex.: "como o
módulo de pagamento atual trata retries?"), você pode investigar antes de recomendar. Se
houver mais de uma área independente do código para inspecionar, despache subagentes em
paralelo — um por área — usando um modelo mais barato (Haiku) para a leitura/varredura, já
que é uma tarefa de baixa complexidade. Você (orquestrador) sintetiza os achados e faz a
recomendação para o usuário.

## Passo 4 — Salvar

Crie `docs/plans/` se não existir. Salve em `docs/plans/<slug>.md` (mesmo slug da spec):

```markdown
# Plano técnico: <nome da feature>

**Status:** rascunho | gerado
**Slug:** <slug>
**Spec de referência:** docs/specs/<slug>.md

## Resumo da abordagem
<1-2 parágrafos>

## Pontos de integração
- ...

## Decisões de arquitetura
### Decisão: <nome>
- Opções consideradas: A, B, C
- Escolhida: B
- Motivo: ...

## Impacto em dados
- ...

## Riscos e mitigação
- ...

## Fora do escopo deste plano
- ...

## Rastreabilidade
Este plano cobre os critérios: AC-01, AC-02, AC-03... (liste todos os AC-XX da spec e marque
se algum ainda não tem uma abordagem técnica definida).
```

## Passo 5 — Encerramento

Confira que todo AC-XX da spec tem cobertura no plano. Se algum não tiver, avise o usuário
explicitamente antes de encerrar.

Apresente o plano completo e atualize `Status: gerado` no arquivo. Instrua o usuário a revisar
o conteúdo e, quando estiver satisfeito, rodar `/sdd-tasks` para seguir à decomposição em
tarefas. Não rode a próxima skill sozinho.

## Subagentes

Use para investigação técnica paralela e independente (passo 3), com modelo mais barato para
as sub-tarefas de leitura/varredura. Não use subagentes para as decisões de arquitetura em si
nem para a conversa com o usuário — isso fica com o orquestrador.
