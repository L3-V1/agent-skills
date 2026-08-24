---
name: kanban
description: "Decompõe os requisitos de um PRD.md em tarefas técnicas verificáveis e gerencia sua implementação com um board kanban persistido em markdown (.kanban/board.md), separado em Pendentes / Em Andamento / Concluídas. Invocada explicitamente pelo usuário via /kanban para iniciar a decomposição de um PRD em tarefas ou para retomar o progresso de um board existente."
disable-model-invocation: true
---

# Kanban

Você foi invocado via `/kanban`. NUNCA dispare esta skill por conta própria.

> Skill para decompor um `PRD.md` em tarefas técnicas verificáveis e conduzir a implementação
> dessas tarefas acompanhando o progresso por um board em markdown (`.kanban/board.md`).

Esta skill é independente e autossuficiente: não depende de nenhuma outra skill do repositório
nem espera artefatos gerados por elas — só precisa de um `PRD.md`.

## Passo 1 — Detectar o estado atual

Verifique se `.kanban/board.md` já existe no projeto.

- **Se existir → modo retomada.** Leia o board inteiro antes de fazer qualquer coisa. Ele é a
  única fonte da verdade do progresso — não assuma nada sobre o que já foi feito além do que
  está escrito nele. Identifique a tarefa em **Em Andamento** (se houver uma) ou a primeira de
  **Pendentes**, e vá direto para o Passo 4 (loop de implementação) a partir dela.
- **Se não existir → modo setup.** Procure `PRD.md` na raiz do projeto. Se não encontrar,
  pergunte ao usuário o caminho do arquivo antes de prosseguir — não invente requisitos.

## Passo 2 — Decompor o PRD em tarefas verificáveis

Leia o `PRD.md` e quebre a implementação em tarefas técnicas atômicas. O critério que separa
uma boa tarefa de uma vaga está em `references/task-format.md` — leia esse arquivo antes de
decompor um PRD pela primeira vez numa sessão, especialmente se o PRD for grande ou tocar
várias áreas do sistema.

Cada tarefa precisa ter:

- **ID** curto (`K-01`, `K-02`, ...)
- **Título** — uma ação técnica concreta, não uma user story genérica
- **Critério de aceite** — o que precisa ser verdade, testável ou observável para considerar a
  tarefa concluída (idealmente algo que dá para checar rodando um teste, um comando, ou
  inspecionando o comportamento — não "funciona bem")
- **Dependências** — outras `K-XX` que precisam estar concluídas antes, ou "nenhuma"

Uma tarefa sem critério de aceite verificável é sinal de que o PRD tem uma lacuna ou de que
você está inventando escopo — pare e pergunte ao usuário em vez de criar a tarefa mesmo assim.

## Passo 3 — Gerar o board e pedir aprovação

Crie a pasta `.kanban/` se não existir e salve o board em `.kanban/board.md`:

```markdown
# Kanban: <nome da feature>

**PRD de referência:** <caminho do PRD.md>

## Pendentes
- [ ] **K-02** — <título>
  - Depende de: K-01
  - Critério de aceite: <...>

## Em Andamento
(vazio)

## Concluídas
(vazio)
```

Todas as tarefas começam em **Pendentes**, na ordem em que devem ser resolvidas (respeitando
dependências). Mostre o board ao usuário e pergunte:

> "Essas são as tarefas. Posso começar a implementar a partir de K-01, ou quer reorganizar
> granularidade/dependências antes?"

Não comece a implementar sem essa confirmação — é o único gate manual do fluxo; depois disso a
skill avança sozinha de tarefa em tarefa.

## Passo 4 — Loop de implementação

Para a tarefa ativa (a que veio do Passo 1 em modo retomada, ou a primeira de Pendentes após a
aprovação):

1. Mova a tarefa de **Pendentes** para **Em Andamento** no `board.md` e salve o arquivo — isso
   precisa acontecer antes de começar a mexer no código, para que o board reflita o estado real
   mesmo se a sessão for interrompida no meio da tarefa.
2. Se o título ou o critério de aceite da tarefa mencionar elementos de UI (tela, componente
   visual, layout, formulário, dashboard, página, interface — use julgamento pelo contexto, não
   uma lista fechada) **e** a tarefa ainda não tiver uma linha "Protótipo aprovado" no board,
   pare aqui e pergunte:

   > "Essa tarefa parece envolver desenho de tela. Quer usar `/prototype` para validar o layout
   > antes de eu implementar, ou sigo direto para a implementação?"

   - Se o usuário quiser prototipar: encerre o loop nesse ponto (a tarefa já está marcada Em
     Andamento no board, o que serve como marcador de retomada) e informe que ele deve rodar
     `/prototype` agora, e depois `/kanban` de novo para continuar a partir do protótipo
     aprovado.
   - Se o usuário preferir pular: siga para o item 3 abaixo, e não pergunte de novo para essa
     tarefa.
   - Se a tarefa já tiver uma linha "Protótipo aprovado" (por exemplo, numa retomada após
     `/prototype` ter rodado), pule esta pergunta e siga direto para o item 3, usando o link do
     protótipo como referência visual da implementação.
3. Implemente a tarefa.
4. Verifique o resultado contra o critério de aceite (rode os testes/lint/comandos relevantes
   quando aplicável). Só marque como concluída se o critério realmente foi satisfeito — um
   critério de aceite que não pôde ser verificado deve ser tratado como pendente, não como
   concluído por otimismo.
5. Mova a tarefa de **Em Andamento** para **Concluídas** (checklist marcado) e salve o
   `board.md` novamente.
6. Informe ao usuário, em uma frase, o que foi concluído, e siga automaticamente para a próxima
   tarefa Pendente cujas dependências já estejam todas em Concluídas — sem esperar confirmação
   a cada tarefa.

Pare o loop e avise o usuário (em vez de adivinhar) quando:
- Encontrar uma ambiguidade real sobre como implementar algo que o critério de aceite não
  resolve.
- A próxima tarefa Pendente depender de uma decisão ou informação que só o usuário tem.
- O board esgotar (todas as tarefas em Concluídas) — reporte que a implementação terminou.

## Retomada entre sessões

O `board.md` é o único estado que esta skill precisa para continuar de onde parou. Isso é
intencional: o usuário pode fechar o Claude a qualquer momento e, ao rodar `/kanban` de novo,
o Passo 1 já cuida de reconstruir o contexto a partir do board — não é necessário (nem
desejável) recriar tarefas já concluídas ou re-perguntar coisas já decididas no Passo 3.
