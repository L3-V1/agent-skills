---
name: create-tasks
description: "Decompõe requisitos em uma lista sequencial de tarefas técnicas verificáveis, salva em docs/tasks/TASKS.md, cada tarefa com uma checkbox markdown para ser marcada durante a implementação em outra sessão. Os requisitos vêm de um PRD (docs/interview/PRD.md, ou PRD.md na raiz) ou de uma descrição passada direto no comando. Esta skill NÃO implementa nada nem acompanha progresso — só produz a lista de tarefas. Invocada explicitamente pelo usuário via /create-tasks."
disable-model-invocation: true
---

# Create Tasks

Você foi invocado via `/create-tasks`. NUNCA dispare esta skill por conta própria.

> Skill para decompor requisitos em uma lista sequencial de tarefas técnicas verificáveis,
> salva em `docs/tasks/TASKS.md`. Cada tarefa tem uma checkbox markdown que será marcada
> durante a implementação — que acontece em **outra sessão**, não aqui.

Esta skill é independente e autossuficiente. Ela só decompõe requisitos em tarefas; não
implementa código, não roda testes, não acompanha progresso e não gerencia board.

## Passo 1 — Obter os requisitos

- **Se o usuário passou uma descrição junto do comando:** use esse texto como fonte dos
  requisitos.
- **Senão:** procure o PRD em `docs/interview/PRD.md`; se não achar, procure `PRD.md` na raiz
  do projeto (compatibilidade com PRDs antigos).
- **Se nada disso existir:** pergunte ao usuário o caminho do arquivo de requisitos ou peça a
  descrição direto no chat. Não invente requisitos.

## Passo 2 — Decompor em tarefas verificáveis

Leia os requisitos e quebre a implementação em tarefas técnicas atômicas. O critério que separa
uma boa tarefa de uma vaga está em `references/task-format.md` — leia esse arquivo antes de
decompor requisitos pela primeira vez numa sessão, especialmente se forem grandes ou tocarem
várias áreas do sistema.

Cada tarefa precisa ter:

- **ID** curto (`T-01`, `T-02`, ...)
- **Título** — uma ação técnica concreta, não uma user story genérica
- **Critério de aceite** — o que precisa ser verdade, testável ou observável para considerar a
  tarefa concluída (idealmente algo que dá para checar rodando um teste, um comando, ou
  inspecionando o comportamento — não "funciona bem")
- **Dependências** — outras `T-XX` que precisam estar concluídas antes, ou "nenhuma"

Uma tarefa sem critério de aceite verificável é sinal de que os requisitos têm uma lacuna ou de
que você está inventando escopo — pare e pergunte ao usuário em vez de criar a tarefa mesmo
assim.

## Passo 3 — Mostrar e pedir aprovação

Mostre a lista de tarefas ao usuário (na ordem em que devem ser resolvidas, respeitando
dependências) e pergunte:

> "Essas são as tarefas. Posso salvar em `docs/tasks/TASKS.md`, ou quer ajustar
> granularidade / ordem / dependências antes?"

Não salve o arquivo sem essa confirmação.

## Passo 4 — Salvar

Crie a pasta `docs/tasks/` se não existir e salve a lista em `docs/tasks/TASKS.md`:

```markdown
# Tarefas: <nome da feature>

**Requisitos de referência:** <caminho real do PRD usado, ou "descrição fornecida no comando">

- [ ] **T-01** — <título>
  - Depende de: nenhuma
  - Critério de aceite: <...>
- [ ] **T-02** — <título>
  - Depende de: T-01
  - Critério de aceite: <...>
```

Todas as tarefas começam desmarcadas (`- [ ]`), na ordem em que devem ser resolvidas.

## Passo 5 — Encerrar

Informe ao usuário que `docs/tasks/TASKS.md` foi gerado e que a implementação — e a marcação
das checkboxes conforme cada tarefa for concluída — acontece em outra sessão.

**Se `docs/tasks/TASKS.md` já existir** numa nova chamada de `/create-tasks`: leia o arquivo
inteiro primeiro. Preserve as tarefas já marcadas (`- [x]`) e o texto das tarefas existentes.
Só acrescente as novas tarefas ou reorganize dependências — e pergunte ao usuário antes de
alterar qualquer tarefa que já esteja no arquivo.
