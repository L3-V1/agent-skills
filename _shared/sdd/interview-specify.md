# Entrevista — Fase 2: Especificação (EARS)

> Material compartilhado. Não é uma skill. Usado por `/specify` e por qualquer skill de
> fase posterior que precise gerar a spec ausente antes de prosseguir.

Não gere nenhum artefato, não leia código do projeto, não faça suposições sobre escopo até
a entrevista estar completa e o usuário confirmar. Uma spec malfeita contamina todas as
etapas seguintes.

## Contexto existente

- O usuário passou `$ARGUMENTS`? Use como ponto de partida e pule perguntas já respondidas
  — mas confirme os pontos ambíguos.
- Existe `docs/constitution/<slug-do-projeto>.md` ou README na raiz que já responda
  parte do contexto de negócio? Leia antes de perguntar, para não repetir perguntas
  cuja resposta já está no projeto.

### Determinar o ID da feature

A feature é identificada por um **ID de 2 dígitos com zero à esquerda** (`01`, `02`, …)
que prefixa o nome do arquivo: `docs/specs/<NN-slug>.md`.

- **Constituição existe e lista a feature-alvo?** O ID é o número dela na seção
  "Features" (`### 03. …` → ID `03`).
- **Sem constituição (ou feature não listada nela)?** Varra `docs/specs/` por arquivos
  `NN-*.md` (dois dígitos + hífen), pegue o maior prefixo e use **o próximo**. Se a pasta
  não existir ou não tiver nenhum arquivo assim, o ID é `01`.

Esse é o **fallback padrão de numeração** — as fases seguintes que rodam isoladas
referenciam esta regra, aplicando-a à sua própria pasta (`docs/plans/`, `docs/tasks/`).

## Entrevista

Você pode agrupar mais de uma pergunta por vez, desde que as respostas sejam independentes
entre si — quando a resposta de uma muda o conteúdo ou a relevância da próxima, faça-as em
sequência. Prefira `AskUserQuestion` (aceita várias perguntas numa só chamada, até ~4 por
vez); no fallback de chat, múltipla escolha enumerada com a recomendação destacada.

1. **Nome/slug da feature.** Ex.: "checkout-parcelado", "auth-2fa". O slug, prefixado pelo
   ID (ver acima), vira o nome do arquivo: `docs/specs/<NN-slug>.md`.
2. **Problema e público.** Que problema isso resolve, e para quem (que tipo de
   usuário/ator)?
3. **Escopo.** O que está dentro e o que está explicitamente fora desta mudança? Se o
   usuário hesitar, sugira um escopo mínimo plausível como recomendação — fatiar em
   incrementos pequenos é mais saudável do que uma spec monolítica.
4. **Restrições conhecidas.** Técnicas (stack, integrações existentes), de negócio (prazo,
   compliance) ou de time. Aceite "nenhuma por enquanto".
5. **Critérios de sucesso.** Como saberemos que está pronto? Essas respostas viram
   diretamente os critérios de aceite em EARS — insista em respostas concretas e
   observáveis ("o usuário recebe confirmação em até 2s", não "funciona bem").
6. **Comportamentos indesejados / casos de borda.** O que NÃO deve acontecer? Erros
   conhecidos a evitar, condições de falha a tratar.

Se uma resposta já responder uma pergunta futura, não pergunte de novo — confirme o que
entendeu e siga. É a mesma lógica da regra acima: perguntas cuja resposta depende de outra
não vão na mesma rodada.

## Converter para EARS

Ver `ears.md`. Numere cada critério (`AC-01`, ...).

## Salvar

Use o template de spec em `templates.md`. Crie `docs/specs/` se não existir. Salve em
`docs/specs/<NN-slug>.md`, preenchendo os campos `**ID:**` e `**Slug:**`.
