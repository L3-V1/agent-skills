# Entrevista — Fase 1: Constituição

> Material compartilhado. Não é uma skill. Usado por `/constitute` e por qualquer skill de
> fase posterior que precise gerar a constituição ausente antes de prosseguir.

## 0. Contexto existente

Se `docs/blueprint/PROJECT.md` existir, leia-o antes de perguntar qualquer coisa e
use-o como ponto de partida: pule as perguntas já respondidas, confirme só os pontos
ambíguos e leve a "Decomposição preliminar em features" como base para o passo 2. O gate de
confirmação da decomposição com o usuário (passo 3) continua valendo. Se
`docs/blueprint/ARCHITECTURE.md` também existir, releia-o para não repetir perguntas
sobre stack técnica e restrições já decididas.

## 1. Entrevista técnica de levantamento de requisitos

Você pode agrupar mais de uma pergunta por vez, desde que as respostas sejam independentes
entre si — quando a resposta de uma pergunta muda o conteúdo ou a relevância da próxima,
faça-as em sequência. Prefira `AskUserQuestion` (que aceita várias perguntas numa só chamada,
até ~4 por vez); no fallback de chat, múltipla escolha enumerada com a recomendação
destacada. Roteiro mínimo (pule o que não se aplicar): problema e público-alvo; papéis e atores; escopo dentro/fora desta versão;
requisitos funcionais; requisitos não funcionais (performance, segurança, escala) quando
relevantes; stack técnica e restrições; critérios de sucesso; riscos e casos de borda
conhecidos. Entre ~10 e 20 perguntas no total, salvo pedido do usuário por mais.

## 2. Decomposição em features

Identifique features distintas — unidades de escopo coerentes, cada uma pequena o bastante
para virar uma spec isolada, nem tão grande que "faça tudo" nem tão pequena que seja
subtarefa de implementação. Para cada uma: nome curto, slug em kebab-case, descrição de
2–4 frases e dependências ("nenhuma" se não houver).

## 3. Confirme a decomposição com o usuário

Antes de salvar — adicionar, remover, fundir ou dividir features. Não salve sem essa
confirmação.

## 4. Salvar

Use o template de constituição em `templates.md`. Crie `docs/constitution/` se não existir.
Salve em `docs/constitution/<slug-do-projeto>.md`.
