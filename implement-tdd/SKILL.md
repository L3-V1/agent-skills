---
name: implement-tdd
description: "Conduz a implementação de uma lista de tarefas usando TDD com o ciclo red-green-refactor, um ciclo por tarefa. Consome docs/tasks/TASKS.md gerado pelo /create-tasks, ou uma lista de tarefas em outro caminho, ou tarefas coladas junto do comando. Roda a suíte de testes do projeto a cada ciclo e marca as tarefas concluídas no arquivo de origem. NÃO faz commits nem mexe em git. Invocada explicitamente via /implement-tdd."
disable-model-invocation: true
---

# implement-tdd — Implementação guiada por TDD

Você foi invocado via `/implement-tdd`. NUNCA dispare esta skill por conta própria.

> Skill para implementar uma lista de tarefas já decomposta — normalmente a saída do
> `/create-tasks` (`docs/tasks/TASKS.md`), mas também qualquer lista que o usuário indicar —
> aplicando **test-driven development** com a técnica **red-green-refactor**, um ciclo por
> tarefa. Roda a suíte de testes a cada ciclo e marca as checkboxes conforme conclui. Não
> commita nada: a revisão e o commit ficam com o usuário.

Esta skill não decompõe requisitos (isso é `/create-tasks` ou `/diy`) e não faz auditoria de
código (isso é `/audit`). Ela pega tarefas prontas e as implementa.

## Regra de ouro

Toda linha de código de produção nasce de um teste que falhou primeiro. Você não escreve
implementação antes de existir um teste vermelho que a exige — é isso que garante que cada
comportamento está de fato coberto e que o teste testa alguma coisa. Toda tarefa implementada
rastreia para um id da lista de origem (`T-XX`, `D-XX`, ou o rótulo que a lista usar) e para a
checkbox correspondente, que você marca só quando a suíte inteira está verde.

Se durante a implementação você perceber a necessidade de código que não serve a nenhuma
tarefa da lista, pare e pergunte ao usuário — não decida sozinho "já que estou aqui, aproveito
e faço X".

## Passo 1 — Localizar a lista de tarefas

Procure nesta ordem:

1. **Caminho ou texto passado junto do comando** — se o usuário indicou um arquivo
   (`docs/backlog.md`, `TODO.md`, etc.) ou colou as tarefas direto no chat, use isso.
2. **`docs/tasks/TASKS.md`** — a saída padrão do `/create-tasks`.
3. **Pergunte** — se nada disso existir, peça o caminho do arquivo ou a lista. Não invente
   tarefas.

Se as tarefas vieram coladas no chat sem arquivo, ofereça salvá-las em `docs/tasks/TASKS.md`
no formato do `/create-tasks` (checkbox + id + critério de aceite + dependências) para poder
marcar progresso de forma persistente. Se o usuário recusar, acompanhe o progresso só na
conversa.

Aceite qualquer esquema de id e formatação — `T-01`, `D-01`, bullets simples, numeração. Para
cada tarefa, extraia mentalmente: **o que fazer**, **critério de aceite** (o que precisa ser
verdade/observável) e **dependências**. Se uma tarefa não tem critério de aceite discernível,
peça o critério ao usuário antes de implementá-la — sem critério não dá para escrever o teste
do RED.

## Passo 2 — Preparar terreno

- Leia `AGENTS.md` / `CLAUDE.md` / `ONBOARDING.md` se existirem, para pegar convenções, stack
  e comandos do projeto.
- Detecte o test runner do projeto e o comando canônico de teste — o guia por stack está em
  `references/test-runners.md`. Leia esse arquivo na primeira vez que precisar identificar ou
  configurar um runner nesta sessão.
- **Se o projeto não tem infraestrutura de teste**, escolha o framework idiomático do stack
  (ver a referência), instale e configure o mínimo, crie um teste-canário trivial e confirme
  que a suíte roda. Só depois disso siga para o Passo 3. Um projeto sem runner é pré-requisito
  faltando, não motivo para pular o TDD.
- Anuncie ao usuário, em uma frase, qual runner e qual comando de teste você vai usar.

## Passo 3 — Escolher o modo de execução

Faça **uma** pergunta. Sempre que o ambiente oferecer uma interface de opções selecionáveis
(ex.: `AskUserQuestion` na extensão do VSCode), use-a. Quando não houver, apresente as
alternativas em múltipla escolha enumerada no chat, marcando a recomendada e o porquê; o
usuário responde pelo número.

- **Passo-a-passo** — implementa a próxima tarefa pendente cujas dependências estão todas
  concluídas, roda o ciclo completo e **para** para você revisar antes da próxima. Bom quando
  as tarefas têm risco ou você quer inspecionar cada incremento.
- **Lote** *(recomendado para listas de tarefas rotineiras)* — percorre a lista inteira,
  tarefa a tarefa, parando só em ambiguidade real ou decisão que cabe ao usuário. Bom quando a
  lista já foi bem revisada no `/create-tasks` e você confia na granularidade.

## Passo 4 — Loop de implementação (um ciclo red-green-refactor por tarefa)

Para cada tarefa elegível (dependências concluídas), na ordem da lista:

**Antes de tocar em código:** marque a tarefa como `(em andamento)` no arquivo de origem e
salve — assim, se a sessão cair, o próximo a abrir sabe onde você parou.

```markdown
- [ ] **T-03** — Endpoint POST /pedidos (em andamento)
```

### RED — escrever o teste e vê-lo falhar

Escreva o(s) teste(s) que expressam o critério de aceite da tarefa. Um critério bem escrito já
sugere o teste: "retorna 429 quando o cliente excede 100 req/min" vira um teste que dispara
101 requisições e verifica o status da última.

Rode a suíte e **confirme que o novo teste falha pelo motivo certo** — asserção não satisfeita
ou função/rota ainda inexistente, não erro de sintaxe, import quebrado ou fixture ausente. Um
teste que quebra por erro de setup não prova nada. Se o teste **passar** de primeira, ou a
feature já existe, ou o teste não está exercitando o que deveria — investigue antes de seguir.

### GREEN — código mínimo para passar

Escreva o código mínimo **razoável** para o teste passar. Mínimo é sobre escopo: não
implemente ramos, validações ou casos que nenhum teste cobre ainda. Não é para escrever
gambiarra — `return 42` fixo quando a lógica real são três linhas só cria trabalho de desfazer
no refactor. O alvo é a solução direta e honesta que faz o teste passar sem inventar escopo.

Rode a **suíte inteira** e confirme que tudo passa: o teste novo e todos os preexistentes.
Regressão em teste antigo é bloqueio — resolva antes de continuar.

### REFACTOR — melhorar com a suíte verde

Com todos os testes passando, melhore o código sem mudar comportamento: remova duplicação,
renomeie para clareza, extraia funções, encaixe na arquitetura e no estilo do projeto (design
system, camadas Controller→Service→Repository quando o projeto usa, convenções de nomenclatura
observadas no Passo 2). Rode a suíte de novo depois de cada mudança estrutural. Não adicione
comportamento novo aqui — se aparecer um caso não coberto, ele é um novo teste (novo ciclo, ou
uma nova tarefa se for grande).

### Fechar a tarefa

Rode a suíte uma última vez. Estando verde, troque `- [ ]` por `- [x]`, remova o
`(em andamento)` e salve o arquivo. Relate em 1–2 frases: qual tarefa, quais testes foram
criados, resultado da suíte (ex.: "T-03 concluída — 4 testes novos para POST /pedidos, suíte
com 37 testes, todos passando").

No modo **lote**, avance automaticamente para a próxima tarefa elegível. No modo
**passo-a-passo**, pare aqui e espere o usuário.

## Passo 5 — Quando a suíte não fica verde

Tente corrigir até cerca de 3 vezes na mesma tarefa. Se persistir, **pare**: deixe a tarefa
como `(em andamento)`, mostre a saída do teste que falha e o que você já tentou, e pergunte ao
usuário como proceder. Falha recorrente costuma sinalizar lacuna na tarefa ou no critério de
aceite, que vale revisar em vez de insistir gastando tokens.

Nunca marque `- [x]` com teste vermelho. Nunca comente, `skip`, marque como pendente ou delete
um teste só para a suíte ficar verde — isso destrói justamente a garantia que o TDD dá.

## Passo 6 — Encerramento

Apresente um resumo:

- Tarefas concluídas nesta sessão (ids) e arquivos alterados.
- Tarefas restantes ou bloqueadas.
- Estado da suíte (nº de testes, todos passando).
- Lembrete de que **nada foi commitado** — o usuário revisa o diff e commita.

Se a lista está em `docs/tasks/TASKS.md`, sugira rodar `/audit` numa próxima sessão para
revisão independente antes do merge. Não rode a auditoria sozinho.

## Quando NÃO usar

- **Decompor requisitos em tarefas** → `/create-tasks` ou `/diy`.
- **Commit, branch, PR, push** → fora do escopo; o usuário faz.
- **Auditoria de código** → `/audit`.
- **Pipeline SDD formal** (spec EARS + plano + rastreabilidade `AC-XX` + gate de merge) →
  `/sdd-implement`, que é a versão dessa mesma ideia amarrada ao fluxo `sdd-*`.

## Subagentes

No modo lote, quando a lista tiver um grupo de tarefas independentes entre si (nenhuma depende
de outra do grupo), você pode despachar um subagente por tarefa do grupo, cada um rodando seu
próprio ciclo red-green-refactor isoladamente:

- Tarefas explicitamente marcadas como baixa complexidade na lista: prefira um modelo mais
  barato (Haiku) no subagente — baixo risco, velocidade/custo compensam.
- Complexidade média/alta, ou não marcada: mantenha o modelo padrão da sessão.
- Nunca paralelize tarefas com dependência entre si.
- Depois que os subagentes terminarem, você (orquestrador) integra os resultados, resolve
  conflitos (dois subagentes tocando o mesmo arquivo de forma incompatível), roda a **suíte
  completa** no processo principal e só então marca as tarefas como concluídas.
