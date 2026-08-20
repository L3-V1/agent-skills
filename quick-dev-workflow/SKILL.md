---
name: quick-dev-workflow
description: "Utilize essa skill somente quando invocada explicitamente pelo comando do usuário, pois se trata de um fluxo extenso de desenvolvimento de software, então é necessário ter a certeza de que esse é o caminho que o usuário deseja seguir."
disable-model-invocation: true
---

# Software Development Workflow

> Essa skill define um workflow de desenvolvimento adaptativo onde o agente irá interagir com o usuário de forma natural e produzir arquivos de documentação verificáveis ao final de cada ciclo

## Brainstorming

- Invoque a skill `brainstorming` para conduzir esta etapa (geração de ideias a partir do tema do usuário e elaboração do pitch inicial).
- Só avance para a próxima etapa depois que o usuário decidir qual ideia/pitch seguir.

---

## PRD (Product Requirements Interview)

- Com a proposta do produto em mãos, invoque a skill `interview` para conduzir o levantamento de requisitos e gerar o `PRD.md`.
- Só avance para a próxima etapa com o `PRD.md` finalizado e aprovado pelo usuário.

---

## Kanban

- Após obter o PRD, o agente agora deve elaborar um plano de implementação seguindo uma estratégia de Kanban
- Ele irá dividir o processo de desenvolvimento em etapas bem definidas, e, para cada etapa, serão criados "tickets" (kanban), descrevendo pequenas tarefas verificáveis e que serão acompanhadas ao longo de todo projeto
- Registre e mantenha esses tickets num arquivo `KANBAN.md` (colunas ou seções por status, ex. A Fazer / Em Andamento / Concluído), atualizado a cada mudança de status — é o artefato verificável desta etapa, no mesmo padrão do pitch e do `PRD.md` das etapas anteriores
- Cada etapa concluída deve vir acompanhada de uma rodada de testes e validação de código
- As etapas só podem avançar com a autorização prévia do usuário
