---
name: sdd-implement
description: "Executa as tarefas aprovadas em docs/tasks/ em loop de TDD (teste a partir do critério EARS, código, refactor), com despacho de subagentes para tarefas independentes. Quarta fase do workflow spec-anchored (sdd-spec → sdd-plan → sdd-tasks → sdd-implement → sdd-audit)."
disable-model-invocation: true
---

# sdd-implement — Implementação guiada por TDD

Você foi invocado via `/sdd-implement`. NUNCA dispare esta skill por conta própria.

## Regra de ouro

Todo código escrito nesta fase deve rastrear para uma tarefa (`T-XX`) e, através dela, para um
ou mais critérios de aceite (`AC-XX`). Se durante a implementação você perceber a necessidade
de código que não serve a nenhum `T-XX`, pare e pergunte ao usuário — não é para decidir
sozinho que "também vale a pena fazer X enquanto está aqui".

## Passo 1 — Localizar as tarefas aprovadas

- Leia `docs/tasks/<slug>.md` com `Status: aprovado`. Se houver mais de um conjunto de tarefas
  aprovadas e pendentes de implementação, pergunte qual.
- Leia também a spec e o plano correspondentes para ter o contexto completo dos critérios de
  aceite.

## Passo 2 — Entrevista curta

Diferente das fases anteriores, aqui a entrevista é mínima — a maior parte já foi decidida em
`sdd-tasks`. Confirme só o que muda a execução:

1. **Modo de execução.** Se o arquivo de tarefas marcou "Paralelização: sim", confirme:
   quer que eu já despache os grupos independentes em paralelo, ou prefere acompanhar tarefa
   por tarefa mesmo assim nesta rodada? (Recomendação: paralelo para os grupos marcados como
   independentes, sequencial para o resto — é o que o arquivo de tarefas já indica.)
2. **Parar em caso de falha.** Se um teste não passar após algumas tentativas de correção,
   prefere que eu pare e te chame, ou que eu continue tentando até resolver sozinho?
   (Recomendação: parar após ~3 tentativas malsucedidas na mesma tarefa — evita gastar tokens
   em loop sem sair do lugar, e problemas recorrentes geralmente indicam que a tarefa ou o
   plano têm uma lacuna que vale revisar com você.)

Não há gate de aprovação por tarefa — isso viraria microgerenciamento. O controle humano
acontece nas pontas: já passou pelos gates de spec e plano, e vai passar pelo gate final de
auditoria em `sdd-audit`.

## Passo 3 — Loop de TDD por tarefa

Para cada tarefa `T-XX`, na ordem definida por dependências:

1. Releia o(s) critério(s) de aceite (`AC-XX`) que essa tarefa cobre.
2. Escreva o teste que expressa esse critério antes de qualquer código de implementação. A
   forma do padrão EARS já sugere o teste: "Quando `<evento>`, deve `<resposta>`" vira um teste
   que provoca o evento e verifica a resposta.
3. Rode o teste e confirme que falha (evita teste que "passa por acidente").
4. Implemente o mínimo necessário para o teste passar.
5. Rode o teste de novo. Se passar, faça um passe de refactor (limpeza, remoção de duplicação)
   mantendo o teste verde.
6. Marque a tarefa como concluída em `docs/tasks/<slug>.md` (adicione um campo `Status:
   concluída` sob o `T-XX` correspondente).

Se o teste não passar depois do número de tentativas combinado no passo 2.2, pare essa tarefa,
registre o que foi tentado e o que falhou, e chame o usuário antes de prosseguir para a
próxima tarefa.

## Passo 4 — Despacho de subagentes (só para tarefas independentes)

Quando o arquivo de tarefas indicar um grupo de tarefas independentes entre si (sem
dependência mútua) e o usuário tiver confirmado paralelização no passo 2.1:

- Despache um subagente por tarefa do grupo, cada um seguindo o loop de TDD do passo 3
  isoladamente.
- Para tarefas marcadas como **complexidade baixa** no arquivo de tarefas, prefira rodar o
  subagente com um modelo mais barato (Haiku) — é uma tarefa de baixo risco onde a
  velocidade/custo compensam mais do que a capacidade extra de um modelo maior.
- Para complexidade **média ou alta**, mantenha o modelo padrão da sessão no subagente.
- Nunca paralelize tarefas que têm dependência entre si, mesmo que estejam no mesmo arquivo —
  só os grupos explicitamente marcados como independentes.
- Depois que os subagentes terminarem, você (orquestrador) revisa os resultados, resolve
  conflitos (ex.: dois subagentes tocando o mesmo arquivo de forma incompatível) e só então
  marca as tarefas como concluídas.

## Passo 5 — Ao concluir todas as tarefas

Apresente um resumo: quantas tarefas concluídas, quantas ficaram bloqueadas (se houver), e
quais arquivos foram alterados. Diga explicitamente que o próximo passo é `/sdd-audit` para o
gate final antes do merge — não rode a auditoria sozinho, ela é uma skill separada e
propositalmente independente de quem implementou.
