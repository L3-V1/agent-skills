---
name: interview
description: "Utilize essa skill somente quando invocada explicitamente via comando do usuário, pois ela iniciará um fluxo extenso de perguntas e respostas. Pode ser invocada diretamente pelo usuário ou por outra skill, como parte de um fluxo já iniciado por ele explicitamente."
disable-model-invocation: true
---

# Interview

> Skill para detalhar o escopo e informações sobre algum projeto por meio de uma abordagem de perguntas e respostas.

## Instruções

- Com base em uma proposta inicial, conduza uma entrevista técnica de levantamento de requisitos com o usuário para definir um escopo para o projeto a ser desenvolvido, bem como detalhes técnicos e funcionais do mesmo. Use como roteiro mínimo as categorias abaixo, pulando as que não se aplicarem ao projeto:
  1. **Problema e público-alvo** — que problema isso resolve, e para quem?
  2. **Papéis e atores** — quais tipos de usuário/ator interagem com o sistema (ex.: admin, usuário final, convidado)? Se houver só um papel, confirme e siga.
  3. **Escopo** — o que está dentro e o que está explicitamente fora desta versão?
  4. **Requisitos funcionais** — o que o sistema precisa fazer?
  5. **Requisitos não funcionais** — performance, segurança, escala, disponibilidade, quando relevantes.
  6. **Stack técnica e restrições** — tecnologias já definidas, integrações existentes, prazo, time.
  7. **Critérios de sucesso** — como saberemos que está pronto?
  8. **Riscos e casos de borda conhecidos** — o que pode dar errado, o que não deve acontecer.
- Assuma que a profundidade da entrevista não será elevada e limite-se à um máximo de 15 a 30 perguntas no total, a não ser que o usuário solicite mais perguntas.
- Faça as perguntas **uma de cada vez**, aguardando resposta antes de seguir para a próxima — não dispare todas de uma vez em uma lista. Se a resposta do usuário já responder uma pergunta futura, não pergunte de novo — confirme o que você entendeu e siga.
- Para cada pergunta exiba uma recomendação de resposta. Sempre que o ambiente oferecer uma interface de opções selecionáveis para perguntas ao usuário (ex.: `AskUserQuestion` na extensão Claude Code no VSCode), use-a para apresentar as alternativas de resposta — é mais rápido e reduz ambiguidade de leitura. Só faça a pergunta em texto livre pelo chat quando esse tipo de interface não estiver disponível no ambiente atual.
- Mostre o progresso das perguntas respondidas e das que ainda faltam, com base numa estimativa feita previamente (ex.: "Pergunta 4 de ~20").
- Ao final da entrevista, sintetize as **User Stories** a partir dos papéis/atores e dos requisitos funcionais já levantados — não é necessário perguntar uma a uma ao usuário, a síntese é feita na montagem do PRD. Cada story pode combinar mais de um requisito funcional e deve refletir um cenário de uso real sob a perspectiva do ator.
- Ao final da entrevista, gere um arquivo `PRD.md` (Product Requirements Document) com as respostas fornecidas pelo usuário, seguindo este esqueleto:

```markdown
# PRD: <nome do projeto>

## Problema e público-alvo
<resumo do problema e para quem>

## Escopo
### Dentro
- ...
### Fora
- ...

## Requisitos funcionais
- ...

## User Stories
- Como um [papel], eu quero [desejo], para que [benefício]
- Como um [papel], eu quero [desejo], para que [benefício]
- Como um [papel], eu quero [desejo], para que [benefício]

## Requisitos não funcionais
- ...

## Stack técnica e restrições
- ...

## Critérios de sucesso
- ...

## Riscos e casos de borda conhecidos
- ...
```
