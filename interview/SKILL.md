---
name: interview
description: "Utilize essa skill somente quando invocada explicitamente via comando do usuário, pois ela iniciará um fluxo extenso de perguntas e respostas. Pode ser invocada diretamente pelo usuário ou por outra skill, como `quick-dev-workflow`, como parte de um fluxo já iniciado por ele explicitamente."
disable-model-invocation: true
---

# Interview

> Skill para detalhar o escopo e informações sobre algum projeto por meio de uma abordagem de perguntas e respostas.

## Instruções

- Com base em uma proposta inicial, conduza uma entrevista técnica de levantamento de requisitos com o usuário para definir um escopo para o projeto a ser desenvolvido, bem como detalhes técnicos e funcionais do mesmo.
- Assuma que a profundidade da entrevista não será elevada e limite-se à um máximo de 15 a 30 perguntas no total, a não ser que o usuário solicite mais perguntas.
- Para cada pergunta exiba uma recomendação de resposta e utilize, quando disponível no ambiente, uma interface de menu de opções clicáveis para facilitar a resposta do usuário.
- Mostre o progresso das perguntas respondidas e das que ainda faltam ser respondidas com base em uma estimativa feita previamente.
- Ao final da entrevista, gere um arquivo de PRD (Product Requirements Document), em formato markdown, com base nas respostas fornecidas pelo usuário, contendo o escopo do projeto, requisitos funcionais e não funcionais, stack técnica e quaisquer outras informações relevantes levantadas durante a entrevista.
