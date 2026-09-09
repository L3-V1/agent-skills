---
name: to-tdd
description: "Fase 5 do fluxo spec-anchored (SDD): implementa as tarefas de uma feature em abordagem TDD, com o ciclo RED → GREEN → REFACTOR, rodando a suíte a cada ciclo e atualizando o progresso no arquivo de tarefas (marcando - [x]) quando ele existir. Funciona no fluxo SDD (após a decomposição em tarefas) ou isolada, sempre que o usuário quiser implementar algo dirigido por testes. Testes de frontend usam o framework do projeto; critérios com manifestação visual podem incluir testes de navegador via Playwright MCP quando ele estiver disponível. Invocada explicitamente pelo usuário via /to-tdd, opcionalmente com o slug da feature."
disable-model-invocation: true
---

# To-TDD — Fase 5: Implementação (TDD)

Você foi invocado via `/to-tdd`. NUNCA dispare esta skill por conta própria.

> Implementação em ciclos RED → GREEN → REFACTOR. Todo código escrito serve a uma tarefa
> (`T-XX`) e, por ela, a um ou mais `AC-XX`. Se aparecer necessidade de código que não
> serve a nenhuma tarefa/critério, pare e pergunte ao usuário. Fase 5 do fluxo
> spec-anchored (SDD), mas pode ser rodada isolada.

> **Testes de frontend usam o framework do projeto** (testing-library / DOM testing, teste
> de componente, render headless, unit/integration de UI) — é a forma padrão e preferida.
> **Exceção:** quando um `AC-XX` só puder ser verificado com navegador real (layout,
> regressão visual, fluxo ponta a ponta na UI) e o **Playwright MCP estiver disponível**,
> escreva um teste visual com ele dentro do mesmo ciclo RED → GREEN → REFACTOR. Se o
> Playwright MCP não estiver disponível, registre o critério para um passo de verificação
> visual posterior e siga.

## Regra de ouro

- **Teste antes do código.** Todo `T-XX` começa por um teste que falha.
- **Rastreabilidade.** Cada teste expressa um `AC-XX`. Sem rastreabilidade, pare.
- **Sem aprovação por tarefa.** A revisão humana acontece nas pontas, não a cada tarefa —
  isso viraria microgerenciamento.
- **Prefira interface gráfica ao perguntar** (`AskUserQuestion`); sem ela, múltipla escolha
  enumerada no chat com recomendação destacada. Agrupe perguntas independentes numa só
  rodada (até ~4); só em sequência quando a resposta de uma afeta a próxima.
- **UI obedece o design system.** Quando `docs/blueprint/DESIGN.md` existir, todo código de
  interface usa os tokens, componentes e padrões de tela dele. Valor fora da escala/token,
  ou componente ad-hoc quando já há equivalente no DESIGN.md → pare e confirme com o usuário
  (é decisão de design, não implementação livre).

## Passo 0 — Reunir contexto

A implementação depende das **tarefas** (Fase 4), idealmente com spec e plano por trás.

- **`docs/tasks/<slug>.md` existe?** Leia-o e também `docs/specs/<slug>.md` e
  `docs/plans/<slug>.md` para o contexto completo dos critérios de aceite. Se a feature
  tocar UI e existir `docs/blueprint/DESIGN.md`, leia-o também. O progresso
  será marcado no arquivo de tarefas (`- [ ]` → `- [x]`).
- **Não existe?** Pergunte ao usuário (`AskUserQuestion`, fallback múltipla escolha) como
  proceder:
  1. **Entrevista curta de contexto** (recomendado) — levanto o que implementar, os
     critérios observáveis de pronto e a ordem das etapas em poucas perguntas; conduzo o
     TDD sem arquivo de tarefas (o progresso vai só no resumo final).
  2. **Gerar o arquivo de tarefas (e o que faltar acima) primeiro** — conduzo as
     entrevistas das fases anteriores seguindo `../_shared/sdd/interview-to-tasks.md` (e
     `interview-plan.md` / `interview-specify.md` conforme faltar), salvo os artefatos e só
     então implemento, marcando o progresso em `docs/tasks/<slug>.md`.
  3. **Apontar um arquivo/descrição existente** — checklist informal, issue, design doc.

## Passo 1 — Selecionar a feature

Slug de `$ARGUMENTS` se veio. Senão, se houver mais de um `docs/tasks/<slug>.md` com
tarefas pendentes, pergunte qual; se só houver um, confirme em uma linha.

## Passo 2 — Entrevista curta

A maior parte já foi decidida na Fase 4. Confirme só o que muda a execução — as duas
perguntas são independentes, pergunte as duas de uma vez:

1. **Modo de execução.** Se o arquivo marcou "Paralelização: sim", confirme: despachar os
   grupos independentes em paralelo, ou acompanhar tarefa por tarefa mesmo assim?
   (Recomendação: paralelo para os grupos marcados como independentes, sequencial para o
   resto.)
2. **Parar em caso de falha.** Se um teste não passar após algumas tentativas, parar e
   chamar o usuário, ou continuar tentando? (Recomendação: parar após ~3 tentativas
   malsucedidas na mesma tarefa — problemas recorrentes geralmente indicam lacuna na
   tarefa ou no plano.)

## Passo 3 — Loop de TDD por tarefa

Para cada tarefa `T-XX` (ou, no modo sem arquivo, cada item levantado na entrevista), na
ordem definida por dependências:

1. Releia o(s) critério(s) de aceite (`AC-XX`) que essa tarefa cobre.
2. Escreva o teste que expressa esse critério **antes** de qualquer código de
   implementação. A forma EARS já sugere o teste: "Quando `<evento>`, deve `<resposta>`"
   vira um teste que provoca o evento e verifica a resposta. Para `AC-XX` com manifestação
   visual, releia antes a seção aplicável do `docs/blueprint/DESIGN.md` e a seção
   "Conformidade com o design" do plano, e prefira o framework de teste do projeto. Se o
   comportamento só puder ser verificado com navegador real: use o Playwright MCP quando
   disponível (navegue, interaja e verifique/tire screenshot dentro do ciclo, conferindo
   contra os valores do `DESIGN.md`); se indisponível, registre o critério para um passo de
   verificação visual posterior e siga.
3. Rode o teste e confirme que **falha** (evita teste que "passa por acidente").
4. Implemente o mínimo necessário para o teste passar.
5. Rode o teste de novo. Se passar, faça um passe de refactor (limpeza, remoção de
   duplicação) mantendo o teste verde. Em tarefas de UI, confirme nesse passe que o markup
   final usa tokens/classes reais do `DESIGN.md`, não valores hardcoded fora da escala. Rode
   a suíte a cada ciclo.
6. Se houver `docs/tasks/<slug>.md`, marque a tarefa como concluída (troque `- [ ]` por
   `- [x]` no checkbox do `T-XX`).

Se o teste não passar depois do número de tentativas combinado, pare essa tarefa, registre
o que foi tentado e o que falhou, e chame o usuário antes de prosseguir.

## Passo 4 — Despacho de subagentes (só para tarefas independentes)

Quando o arquivo indicar um grupo de tarefas independentes entre si e o usuário tiver
confirmado paralelização, siga `../_shared/sdd/subagentes.md`: um subagente por tarefa do
grupo (Haiku para complexidade baixa, modelo padrão para média/alta), cada um no loop de
TDD; o orquestrador consolida, resolve conflitos e só então marca as tarefas. Testes
visuais com Playwright MCP ficam a cargo do orquestrador (execução serial), não dos
subagentes paralelos.

## Passo 5 — Encerramento

Apresente um resumo: quantas tarefas concluídas, quantas bloqueadas (se houver) e quais
arquivos foram alterados. Se a feature tocou UI, registre em uma linha que a implementação
seguiu o `docs/blueprint/DESIGN.md` (ou aponte os desvios conscientes que o usuário aprovou).
A revisão de código e o merge ficam a cargo do usuário. **Pare aqui** — não encadeie nenhuma
outra etapa.
