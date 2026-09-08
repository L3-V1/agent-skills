---
name: to-tdd
description: "Fase 5 do fluxo spec-anchored (SDD): implementa as tarefas de uma feature em abordagem TDD, com o ciclo RED → GREEN → REFACTOR, rodando a suíte a cada ciclo e atualizando o progresso no arquivo de tarefas (marcando - [x]) quando ele existir. Funciona no fluxo SDD (após a decomposição em tarefas) ou isolada, sempre que o usuário quiser implementar algo dirigido por testes. Não usa o Playwright MCP — testes de frontend usam o framework do projeto. Invocada explicitamente pelo usuário via /to-tdd, opcionalmente com o slug da feature."
disable-model-invocation: true
---

# To-TDD — Fase 5: Implementação (TDD)

Você foi invocado via `/to-tdd`. NUNCA dispare esta skill por conta própria.

> Implementação em ciclos RED → GREEN → REFACTOR. Todo código escrito serve a uma tarefa
> (`T-XX`) e, por ela, a um ou mais `AC-XX`. Se aparecer necessidade de código que não
> serve a nenhuma tarefa/critério, pare e pergunte ao usuário. Fase 5 do fluxo
> spec-anchored (SDD), mas pode ser rodada isolada.

> **Esta skill NÃO usa o Playwright MCP.** Mesmo que ferramentas `*playwright*` estejam
> disponíveis, não as utilize aqui. Isso não proíbe testar frontend — só que os testes são
> escritos pelo framework do projeto (testing-library / DOM testing, teste de componente,
> render headless, unit/integration de UI). Verificação visual por navegador é um passo
> separado, fora desta skill.

## Regra de ouro

- **Teste antes do código.** Todo `T-XX` começa por um teste que falha.
- **Rastreabilidade.** Cada teste expressa um `AC-XX`. Sem rastreabilidade, pare.
- **Sem aprovação por tarefa.** A revisão humana acontece nas pontas, não a cada tarefa —
  isso viraria microgerenciamento.
- **Prefira interface gráfica ao perguntar** (`AskUserQuestion`); sem ela, múltipla escolha
  enumerada no chat com recomendação destacada.

## Passo 0 — Reunir contexto

A implementação depende das **tarefas** (Fase 4), idealmente com spec e plano por trás.

- **`docs/tasks/<slug>.md` existe?** Leia-o e também `docs/specs/<slug>.md` e
  `docs/plans/<slug>.md` para o contexto completo dos critérios de aceite. O progresso
  será marcado neste arquivo (`- [ ]` → `- [x]`).
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

A maior parte já foi decidida na Fase 4. Confirme só o que muda a execução:

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
   visual, use o framework de teste do projeto — nunca o Playwright MCP. Se o comportamento
   só puder ser verificado com navegador real, registre-o para cobrir depois num passo de
   verificação visual e siga.
3. Rode o teste e confirme que **falha** (evita teste que "passa por acidente").
4. Implemente o mínimo necessário para o teste passar.
5. Rode o teste de novo. Se passar, faça um passe de refactor (limpeza, remoção de
   duplicação) mantendo o teste verde. Rode a suíte a cada ciclo.
6. Se houver `docs/tasks/<slug>.md`, marque a tarefa como concluída (troque `- [ ]` por
   `- [x]` no checkbox do `T-XX`).

Se o teste não passar depois do número de tentativas combinado, pare essa tarefa, registre
o que foi tentado e o que falhou, e chame o usuário antes de prosseguir.

## Passo 4 — Despacho de subagentes (só para tarefas independentes)

Quando o arquivo indicar um grupo de tarefas independentes entre si e o usuário tiver
confirmado paralelização, siga `../_shared/sdd/subagentes.md`: um subagente por tarefa do
grupo (Haiku para complexidade baixa, modelo padrão para média/alta), cada um no loop de
TDD sem Playwright MCP; o orquestrador consolida, resolve conflitos e só então marca as
tarefas.

## Passo 5 — Encerramento

Apresente um resumo: quantas tarefas concluídas, quantas bloqueadas (se houver) e quais
arquivos foram alterados. A revisão de código e o merge ficam a cargo do usuário. **Pare
aqui** — não encadeie nenhuma outra etapa.
