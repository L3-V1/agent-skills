---
name: diy
description: "Fluxo completo de desenvolvimento em um único comando e um único documento: ajuda a formular a ideia, faz uma entrevista curta de escopo/requisitos, monta um plano, decompõe em tarefas e implementa acompanhando o progresso, e no fim oferece uma revisão de código. É a versão enxuta e econômica em tokens das skills brainstorming/interview/sdd-*/kanban/audit — tudo vive em docs/diy/<slug>.md. Use quando o usuário quer sair de uma ideia e chegar a uma implementação funcionando sem orquestrar comando por comando, ou quando pede explicitamente 'faz tudo', 'do it yourself', 'toca o projeto do começo ao fim'. Para projetos grandes que exigem rastreabilidade formal, prefira o pipeline sdd-*. Invocada só via /diy, opcionalmente com uma descrição da ideia."
disable-model-invocation: true
---

# DIY — Do It Yourself

Você foi invocado via `/diy`. NUNCA dispare esta skill por conta própria — só quando o
usuário digitar o comando.

> Versão enxuta e econômica de um fluxo completo de desenvolvimento. Cobre, num único
> comando e num único documento (`docs/diy/<slug>.md`), o que as skills `brainstorming`,
> `interview`, `sdd-spec`/`sdd-plan`/`sdd-tasks`/`sdd-implement`, `kanban` e `audit` fazem
> separadamente: formular a ideia → entrevista de escopo → plano → tarefas →
> implementação com acompanhamento → revisão de código.

## Regra de ouro

- **Um único documento.** Toda informação levantada e todo o acompanhamento de progresso
  ficam em `docs/diy/<slug>.md`. Não crie `PRD.md`, `docs/specs/`, `.kanban/` nem nenhum
  outro artefato paralelo.
- **Economia de tokens é o ponto.** Entrevista curta, sem subagentes por padrão, sem
  reespecificar o que já está claro. Se o projeto for grande o bastante para justificar
  rastreabilidade formal (AC → tarefa → teste), diga isso ao usuário e sugira o pipeline
  `/feature` + `/sdd-*` em vez de inchar este fluxo.
- **Não delegue para outras skills.** O comportamento delas está reimplementado aqui de
  forma simplificada de propósito — não invoque `/interview`, `/kanban`, `/audit` etc.
- **Todo código implementado rastreia a uma tarefa `D-XX`.** Se durante a implementação
  aparecer necessidade de código que não serve a nenhuma tarefa, pare e pergunte — não
  decida sozinho "já que estou aqui, também faço X".
- **Pare e pergunte só em ambiguidade real.** Fora os gates explícitos (aprovação do
  plano e das tarefas), o fluxo anda sozinho. Interrompa quando o critério de aceite não
  resolve como implementar, ou quando a decisão só o usuário tem.

## Perguntas ao usuário

Faça as perguntas **uma de cada vez**, aguardando resposta antes da próxima — não dispare
listas. Pule qualquer pergunta cuja resposta já esteja clara pelo `$ARGUMENTS`, pela
conversa ou pelo contexto do repo; confirme o que entendeu em vez de perguntar de novo.

Sempre que o ambiente oferecer uma interface de opções selecionáveis (ex.:
`AskUserQuestion` na extensão Claude Code no VSCode), use-a — é mais rápido e reduz
ambiguidade. Só pergunte em texto livre pelo chat quando essa interface não existir no
ambiente atual (ex.: versão de terminal do codex) — e, mesmo assim, liste as alternativas
em formato de múltipla escolha enumerada, destacando a recomendada e o porquê. O usuário
responde pelo número ou escreve outra coisa.

## Passo 1 — Detectar estado / retomar

Procure `docs/diy/*.md`.

- **Nenhum arquivo:** modo novo, siga para o Passo 2.
- **Um arquivo:** leia-o inteiro. O campo `**Status:**` no topo é o marcador de retomada.
  Vá direto para a fase correspondente e continue de onde parou — não refaça entrevista,
  plano ou tarefas já preenchidos:
  - `ideia` → Passo 2
  - `requisitos` → Passo 6 (plano)
  - `plano` → Passo 7 (tarefas)
  - `implementação` → Passo 8 (próxima tarefa não marcada, respeitando dependências)
  - `revisão` → Passo 9
  - `concluído` → informe que o projeto já foi concluído e pergunte se o usuário quer
    adicionar novas tarefas ou abrir um novo `/diy`.
- **Vários arquivos:** liste-os (nome e status) e pergunte em qual continuar, ou se é um
  projeto novo.

O documento é o **único** estado que esta skill precisa para retomar entre sessões. O
usuário pode fechar o Claude a qualquer momento; ao rodar `/diy` de novo, este passo
reconstrói o contexto a partir do `Status:` e dos checkboxes.

## Passo 2 — Formular a ideia

O objetivo é chegar a um **pitch de 3 a 5 linhas**: que problema resolve, para quem, e o
que entrega.

- Se `$ARGUMENTS` ou a conversa já trazem uma ideia clara, sintetize o pitch e confirme
  com o usuário numa frase ("Entendi assim: … — fecha?").
- Se a ideia estiver vaga, faça poucas perguntas curtas (2 a 4) ou proponha 2-3 direções
  possíveis para o usuário escolher. Não conduza uma sessão de brainstorming completa —
  só o suficiente para o pitch ficar de pé.

## Passo 3 — Preparar o terreno

Antes de perguntar qualquer coisa de escopo, verifique o que já existe para não repetir
perguntas e manter a nomenclatura consistente:

- Leia `AGENTS.md` ou `CLAUDE.md` na raiz, e `docs/onboarding/ONBOARDING.md` se existir —
  visão geral, stack, convenções.
- Detecte a stack pelos arquivos de projeto (`package.json`, `composer.json`,
  `pyproject.toml`, `go.mod`, etc.) e se há um suite de testes.

Setup mínimo, conforme o estado do repo:

- **Repo vazio ou quase vazio:** rode `git init` se ainda não for um repositório, e crie
  a estrutura de pastas mínima que a ideia exige (ex.: `src/`, `tests/`). Não instale
  stack completa aqui.
- **Precisa de scaffold de uma stack inteira** (framework, toolchain, deps): pare e
  pergunte se o usuário quer encerrar o `/diy` agora para rodar `/scaffold` e depois
  voltar — o `/scaffold` faz esse trabalho melhor do que este fluxo.
- **Repo já com código/stack:** siga direto, trabalhe no que já existe.

## Passo 4 — Entrevista curta

Conduza uma entrevista de levantamento de escopo e requisitos. Roteiro mínimo, pulando o
que não se aplica ou o que o Passo 2/3 já respondeu:

1. **Problema e público-alvo** — confirme/expanda o pitch.
2. **Papéis e atores** — que tipos de usuário interagem com o sistema? Se houver só um,
   confirme e siga.
3. **Escopo** — o que está dentro e o que está explicitamente fora desta versão.
4. **Requisitos funcionais** — o que o sistema precisa fazer.
5. **Requisitos não funcionais** — performance, segurança, escala, disponibilidade, só
   quando forem relevantes para a ideia.
6. **Stack e restrições** — tecnologias já definidas, integrações, prazo. Aceite "nenhuma
   por enquanto".
7. **Critérios de sucesso** — como saberemos que está pronto.
8. **Riscos e casos de borda** — o que pode dar errado, o que não deve acontecer.

Mantenha entre **8 e 15 perguntas no total**, salvo se o usuário pedir mais profundidade.
Mostre o progresso ("Pergunta 4 de ~12", com base numa estimativa feita no início). Se
uma resposta já cobre uma pergunta seguinte, não repita — confirme e siga.

## Passo 5 — Gravar o documento

Sugira um slug em kebab-case a partir do nome do projeto (ex.: `colecao-vinis`,
`crud-tarefas`) e confirme com o usuário antes de escrever. Crie `docs/diy/` se não
existir e grave `docs/diy/<slug>.md` com o template abaixo, preenchendo **Ideia** e
**Requisitos** e deixando Plano/Tarefas/Revisão como placeholders. Defina `Status:
requisitos`.

```markdown
# DIY: <nome do projeto>

**Status:** requisitos
**Criado em:** <AAAA-MM-DD>

## Ideia
<pitch de 3-5 linhas: problema, público, o que entrega>

## Requisitos

### Escopo
**Dentro:**
- ...
**Fora:**
- ...

### Requisitos funcionais
- ...

### Requisitos não funcionais
- ...

### Stack e restrições
- ...

### Critérios de sucesso
- ...

### Riscos e casos de borda
- ...

## Plano
_(a preencher)_

## Tarefas
_(a preencher)_

## Revisão
_(a preencher ao final, se o usuário pedir)_
```

## Passo 6 — Plano

Preencha a seção **Plano** do documento, curta e direta:

- **Abordagem técnica** em 1 a 2 parágrafos — como a proposta será construída no contexto
  do repo.
- **Decisões-chave** — escolhas que valem registrar (biblioteca X em vez de Y, formato de
  dados, estrutura de módulos) e o motivo em uma linha.
- **Áreas/arquivos afetados** — onde o código vai mexer.
- **Reaproveitar** — funções, módulos e padrões que já existem no repo e devem ser usados
  em vez de reescrever.

Apresente o plano ao usuário e peça aprovação. Ao aprovar, atualize `Status: plano`.

## Passo 7 — Tarefas

Decomponha o plano em tarefas atômicas e verificáveis. Cada tarefa tem:

- **ID** sequencial — `D-01`, `D-02`, …
- **Título** — uma ação técnica concreta, não uma user story genérica.
- **Critério de aceite** — o que precisa ser verdade para a tarefa estar pronta, de um
  jeito que dá para checar rodando um teste, um comando, ou inspecionando o comportamento
  — não "funciona bem". Uma tarefa sem critério verificável é sinal de lacuna no plano:
  pare e pergunte em vez de inventar escopo.
- **Depende de** — outros `D-XX` que precisam estar concluídos antes, ou "nenhuma".

Grave as tarefas como checklist na seção **Tarefas**, na ordem em que devem ser
resolvidas:

```markdown
## Tarefas

- [ ] **D-01** — <título>
  - Depende de: nenhuma
  - Critério de aceite: <verificável>
- [ ] **D-02** — <título>
  - Depende de: D-01
  - Critério de aceite: <verificável>
```

Apresente a lista e peça aprovação:

> "Essas são as tarefas. Posso começar a implementar a partir de D-01, ou quer ajustar
> granularidade/dependências antes?"

Este é o **único gate manual** depois do plano — a partir daqui o loop avança sozinho de
tarefa em tarefa. Ao aprovar, atualize `Status: implementação`.

## Passo 8 — Loop de implementação

Para cada tarefa, na ordem de dependências:

1. Anote `(em andamento)` ao lado do `D-XX` na seção Tarefas e **salve o documento** —
   antes de mexer no código, para o doc refletir o estado real se a sessão for
   interrompida.
2. Implemente a tarefa. Reaproveite o que o plano marcou em "Reaproveitar".
3. Verifique o resultado contra o critério de aceite: rode os testes/lint/comando
   relevantes quando o projeto tiver. Só considere a tarefa pronta se o critério
   realmente foi satisfeito — critério que não pôde ser verificado fica pendente, não
   "concluído por otimismo".
4. Troque `- [ ]` por `- [x]`, remova o `(em andamento)` e **salve o documento** de novo.
5. Informe ao usuário em uma frase o que foi concluído e siga automaticamente para a
   próxima tarefa cujas dependências já estejam todas em `- [x]` — sem pedir confirmação
   a cada tarefa.

Pare o loop e chame o usuário (em vez de adivinhar) quando:

- Houver ambiguidade real sobre como implementar algo que o critério de aceite não
  resolve.
- A próxima tarefa depender de uma decisão ou informação que só o usuário tem.
- Todas as tarefas estiverem em `- [x]` — siga para o Passo 9.

## Passo 9 — Oferecer revisão

Com todas as tarefas concluídas, pergunte se o usuário quer uma revisão de código leve
das features desenvolvidas. Se não quiser, siga para o Passo 10.

Se quiser, revise o código implementado em três frentes:

- **Bugs de correção** — lógica errada, edge cases quebrados, comportamento que diverge
  do critério de aceite.
- **Simplificação** — duplicação, complexidade que dá para reduzir sem mudar
  comportamento.
- **Eficiência** — gargalos reais (queries N+1, loops redundantes), não microotimizações
  especulativas.

Segurança não é o foco desta revisão. Se notar algo sério nessa linha, mencione ao
usuário e sugira `/security-review`. Para uma auditoria de qualidade mais profunda e
persistente, sugira `/audit`.

Classifique cada achado por severidade (crítica / alta / média / baixa), apresente a
lista agrupada e pergunte quais devem virar itens de revisão. Grave só os aprovados na
seção **Revisão**:

```markdown
## Revisão

- [ ] **R-01** — <achado curto e concreto> (severidade: alta)
  - Arquivo: <caminho:linha>
  - Critério de resolução: <o que precisa ser verdade para considerar resolvido>
```

Se o usuário quiser resolver os itens agora, use o mesmo loop do Passo 8, com o "Critério
de resolução" no lugar do critério de aceite, movendo cada `R-XX` para `- [x]` ao
resolver. Atualize `Status: revisão` ao entrar nesta etapa e `Status: concluído` ao
terminar (ou ao usuário dispensar a revisão no Passo 10).

## Passo 10 — Resumo final

Informe, de forma objetiva:

- Quantas tarefas foram concluídas e quantas ficaram bloqueadas (se houver).
- Quais arquivos foram criados/alterados.
- O caminho do documento (`docs/diy/<slug>.md`).
- Se houver itens de revisão pendentes, quantos e a severidade mais alta.

Defina `Status: concluído` se não restou nada pendente.

## Subagentes

Evite subagentes por padrão — o custo de contexto é o que esta skill existe para cortar.
A entrevista e a conversa com o usuário são sempre do agente orquestrador. Em repos
grandes, é aceitável despachar leituras paralelas simples no Passo 1/3 (varrer vários
READMEs/docs) com um modelo mais barato; a síntese volta para o orquestrador.
