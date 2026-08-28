---
name: brainstorming
description: "Utilize esta skill para conduzir uma sessão de brainstorming e gerar ideias criativas e inovadoras com foco em produtos e soluções de software. O brainstorming é uma técnica que estimula a criatividade e ajuda a explorar diferentes perspectivas."
---

# Brainstorming

> Essa skill deve sugerir ideias e guiar o usuário na criação de conteúdo, produtos ou soluções inovadoras com foco em software e tecnologia.

## Visão Geral

- A partir de uma ideia vaga ou tema de atuação oferecido pelo usuário, o agente deverá sugerir ideias de softwares que se encaixem nesse escopo
- Perguntas podem ser feitas durante o processo para melhor guiar o usuário a sua ideia desejada
- Quando o usuário decidir qual ideia implementar, o agente irá montar uma proposta de produto (pitch inicial)

---

## Instruções

> Siga esse fluxo para extrair as ideias e insights do usuário e ajudá-lo a desenvolver um projeto criativo.

1. **Defina o objetivo**: Peça para o usuário começar descrevendo o que ele deseja alcançar com o brainstorming. Pode ser um novo produto, uma campanha de marketing, um artigo ou qualquer outro projeto criativo. Use a ferramenta `AskUserQuestion` para perguntas estruturadas de esclarecimento quando o objetivo estiver vago. Sem essa interface (ex.: versão de terminal do codex), faça a pergunta no chat mesmo assim em formato de múltipla escolha enumerada, destacando a alternativa recomendada e o porquê; o usuário responde pelo número ou escreve outra coisa.

2. **Forneça contexto**: Quanto mais informações você obter sobre o tema, público-alvo, restrições e objetivos, melhor será a qualidade das ideias geradas.

3. **Enumere ideias**: Com base no contexto inicial, gere uma lista de ideias relacionadas ao objetivo descrito pelo usuário. Se o tema pedir mais profundidade, consulte `references/tecnicas.md` para técnicas de ideação estruturadas (SCAMPER, Como Poderíamos, inversão, analogias).

4. **Refine as ideias**: Após elaborar as sugestões e consultar o usuário, você pode tentar expandir, combinar ou melhorar algumas das ideias apresentadas.

5. **Avalie e selecione**: Analise, junto ao usuário, as ideias geradas, considerando viabilidade, originalidade, impacto e esforço. Ajude-o a escolher as que mais se alinham com seus objetivos e que têm maior potencial de sucesso.

---

## Entrega

- Após a idea ser definida, elabore uma proposta de produto (pitch inicial) no arquivo `docs/brainstorming/<slug-do-produto>.md` (slug em kebab-case do nome do produto escolhido). Crie a pasta `docs/brainstorming/` se ela ainda não existir. A proposta deve incluir:
  - Nome do produto
  - Descrição do produto
  - Público-alvo
  - Problema que o produto resolve
  - Principais funcionalidades