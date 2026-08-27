---
name: kanban
description: "Decompõe os requisitos de um PRD (docs/interview/PRD.md, ou PRD.md na raiz) em tarefas técnicas verificáveis e gerencia sua implementação com um board kanban persistido em markdown (.kanban/board.md), separado em Pendentes / Em Andamento / Concluídas. Antes de iniciar ou retomar qualquer tarefa, verifica se há issues pendentes em .kanban/issues.md (geradas pelo /audit) e pergunta ao usuário se prefere resolvê-las primeiro. Invocada explicitamente pelo usuário via /kanban para iniciar a decomposição de um PRD em tarefas ou para retomar o progresso de um board existente."
disable-model-invocation: true
---

# Kanban

Você foi invocado via `/kanban`. NUNCA dispare esta skill por conta própria.

> Skill para decompor um PRD em tarefas técnicas verificáveis e conduzir a implementação
> dessas tarefas acompanhando o progresso por um board em markdown (`.kanban/board.md`).

Esta skill é independente e autossuficiente: não depende de nenhuma outra skill do repositório
nem espera artefatos gerados por elas — só precisa de um arquivo de PRD. Ela apenas *consome*, quando
existir, `.kanban/issues.md` gerado pelo `/audit` — não precisa dele para funcionar.

## Passo 1 — Verificar issues pendentes

Antes de decidir qualquer coisa sobre o board de tarefas, verifique se `.kanban/issues.md`
existe e tem itens em **Pendentes** ou **Em Andamento**. Faça essa checagem em toda chamada da
skill — inclusive quando já existir uma tarefa "Em Andamento" no `board.md` esperando para ser
retomada. Uma issue crítica não deve ficar esquecida só porque havia uma tarefa de feature no
meio do caminho.

- **Se não houver issues pendentes:** siga direto para o Passo 2, sem perguntar nada sobre isso.
- **Se houver:** leia todas, ordene por severidade (crítica → alta → média → baixa) e pergunte
  ao usuário (via `AskUserQuestion` quando disponível):

  > "Há N issues pendentes em `.kanban/issues.md` (X críticas, Y altas...). Quer resolvê-las
  > agora ou prefere continuar com as implementações pendentes do board?"

  - **Se o usuário quiser resolver:** trate cada issue, na ordem de severidade, com o mesmo
    loop de implementação do Passo 5 — só que a origem é `issues.md`, não `board.md`, e o
    "critério de aceite" é o campo "Critério de resolução" da issue. Mova cada issue de
    **Pendentes** → **Em Andamento** → **Resolvidas**, salvando o arquivo a cada transição,
    com a mesma disciplina de persistência usada no board de tarefas. Ao esgotar as issues que
    o usuário quis resolver (ou se ele decidir parar no meio), siga para o Passo 2 normalmente.
  - **Se o usuário quiser continuar com o board:** siga direto para o Passo 2. Não pergunte de
    novo sobre essas mesmas issues dentro desta mesma execução — a pergunta volta a aparecer na
    próxima vez que `/kanban` for chamado.

Essa checagem não altera em nada o formato ou o conteúdo de `board.md` — issues vivem
inteiramente em `issues.md`, mantendo o board focado em tarefas de feature.

## Passo 2 — Detectar o estado atual

Verifique se `.kanban/board.md` já existe no projeto.

- **Se existir → modo retomada.** Leia o board inteiro antes de fazer qualquer coisa. Ele é a
  única fonte da verdade do progresso — não assuma nada sobre o que já foi feito além do que
  está escrito nele. Identifique a tarefa em **Em Andamento** (se houver uma) ou a primeira de
  **Pendentes**, e vá direto para o Passo 5 (loop de implementação) a partir dela.
- **Se não existir → modo setup.** Procure o PRD em `docs/interview/PRD.md`; se não achar,
  procure `PRD.md` na raiz do projeto (compatibilidade com PRDs antigos). Se nenhum dos dois
  existir, pergunte ao usuário o caminho do arquivo antes de prosseguir — não invente requisitos.

## Passo 3 — Decompor o PRD em tarefas verificáveis

Leia o PRD e quebre a implementação em tarefas técnicas atômicas. O critério que separa
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

## Passo 4 — Gerar o board e pedir aprovação

Crie a pasta `.kanban/` se não existir e salve o board em `.kanban/board.md`:

```markdown
# Kanban: <nome da feature>

**PRD de referência:** <caminho real do PRD usado>

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

## Passo 5 — Loop de implementação

Para a tarefa ativa (a que veio do Passo 2 em modo retomada, ou a primeira de Pendentes após a
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
o Passo 2 já cuida de reconstruir o contexto a partir do board — não é necessário (nem
desejável) recriar tarefas já concluídas ou re-perguntar coisas já decididas no Passo 4. O
Passo 1 (checagem de issues) roda de novo a cada retomada, então uma issue crítica registrada
enquanto a sessão estava fechada não passa despercebida.
