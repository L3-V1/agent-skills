---
name: audit
description: "Revisa código em busca de bugs de correção, gargalos de performance/eficiência e oportunidades de simplificação, e transforma os achados em issues acionáveis salvas em docs/tasks/ISSUES.md — uma lista com checkbox markdown para ser resolvida numa sessão de implementação. Diferente do /sdd-audit (que verifica conformidade contra specs formais do pipeline sdd-*), esta skill não exige nenhum artefato prévio: funciona standalone em qualquer projeto. Use sempre que o usuário pedir uma revisão de código, auditoria de qualidade, caça a bugs/débito técnico, ou quiser abrir issues a partir de problemas encontrados no código. Invocada explicitamente pelo usuário via /audit."
disable-model-invocation: true
---

# Audit

Você foi invocado via `/audit`. NUNCA dispare esta skill por conta própria.

> Skill para revisar código em busca de problemas concretos (bugs, performance, simplificação)
> e registrá-los como issues em `docs/tasks/ISSUES.md`, prontas para serem resolvidas numa
> sessão de implementação.

Esta skill é independente do `/sdd-audit` (que audita conformidade contra specs formais) e do
`/code-review` (revisão de diff pontual sem persistência). Ela não exige nenhum artefato
prévio — funciona em qualquer projeto.

## Passo 1 — Definir o escopo

Pergunte ao usuário o que revisar antes de começar — não assuma:

- O diff/branch atual em relação à base (`git diff` contra `main`/branch base)
- Uma pasta ou módulo específico
- O codebase completo

O escopo muda completamente o volume de achados e o tempo da revisão, então vale confirmar
mesmo quando o usuário já deu uma pista (ex: "revisa esse PR" sugere diff, mas confirme).

## Passo 2 — Carregar issues já conhecidas

Se `docs/tasks/ISSUES.md` já existir, leia o arquivo inteiro (marcadas e não marcadas) antes de
revisar qualquer coisa. Isso evita duas armadilhas: reportar de novo um problema já registrado,
e reabrir como "novo" algo que já foi resolvido antes.

Se o arquivo não existir, siga normalmente — é o primeiro `/audit` do projeto.

## Passo 3 — Revisar o código

Busque problemas concretos e acionáveis nestas três categorias:

- **Bugs de correção** — lógica errada, edge cases quebrados, comportamento que diverge do que
  o código deveria fazer.
- **Performance/eficiência** — gargalos reais (queries N+1, loops redundantes, recomputação
  desnecessária), não microotimizações especulativas.
- **Qualidade/simplificação** — duplicação, complexidade que pode ser reduzida sem mudar
  comportamento, abstrações que atrapalham mais do que ajudam.

Segurança (OWASP e afins) não é uma categoria padrão desta skill — se encontrar algo sério
nessa linha, mencione ao usuário e sugira `/security-review`, mas não gaste o orçamento da
revisão caçando vulnerabilidades por padrão.

Para cada achado real, você precisa conseguir apontar um arquivo/trecho concreto e descrever o
problema de um jeito que outra pessoa (ou você mesmo, sem o contexto de agora) consiga entender
e verificar depois. Um achado vago demais para virar uma issue acionável não deve ser reportado
— ou você refina a descrição até ficar concreta, ou descarta.

Classifique cada achado por severidade:

- **Crítica** — quebra funcionalidade em produção, causa perda de dados, ou é um bug ativo
  atingindo usuários.
- **Alta** — bug real mas com workaround, ou gargalo de performance que já incomoda.
- **Média** — problema legítimo mas de impacto limitado ou raro.
- **Baixa** — melhoria de qualidade/simplificação sem impacto funcional direto.

## Passo 4 — Apresentar os achados e pedir aprovação

Antes de escrever qualquer coisa em `ISSUES.md`, mostre a lista de achados ao usuário,
agrupados por severidade, e sinalize claramente quais já existem em `ISSUES.md` (Passo 2) para
não duplicar. Pergunte quais devem virar issues de fato — use `AskUserQuestion` quando a lista
for pequena o suficiente para uma escolha múltipla, ou liste em texto e peça confirmação/edição
quando for grande ou precisar de nuance. Sem interface de seleção (ex.: versão de terminal do
codex), apresente a lista no chat mesmo assim em formato de múltipla escolha enumerada,
destacando quais você recomenda promover a issue e o porquê.

Não grave achados que o usuário não aprovou. O objetivo é manter `ISSUES.md` como uma lista
confiável de problemas reais, não um despejo de tudo que a revisão notou.

## Passo 5 — Gravar em `docs/tasks/ISSUES.md`

Crie a pasta `docs/tasks/` se ainda não existir e salve/atualize `docs/tasks/ISSUES.md`:

```markdown
# Issues: <projeto/módulo>

- [ ] **I-01** — <título curto e concreto> (severidade: crítica)
  - Arquivo: <caminho:linha>
  - Descrição: <o problema encontrado, específico o bastante para ser verificável>
  - Critério de resolução: <o que precisa ser verdade para considerar resolvida>
```

IDs são sequenciais (`I-01`, `I-02`, ...) e nunca reaproveitados, mesmo entre execuções
diferentes do `/audit` — continue a numeração a partir do maior `I-XX` já presente no arquivo.
Novas issues aprovadas entram desmarcadas (`- [ ]`), ordenadas por severidade (crítica no
topo). Preserve as issues já marcadas (`- [x]`) e o texto das já existentes.

## Passo 6 — Resumo final

Informe quantas issues foram adicionadas e qual a severidade mais alta entre elas. Lembre o
usuário de que a resolução das issues acontece numa sessão de implementação, marcando cada
checkbox conforme for corrigida.
