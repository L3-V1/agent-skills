---
name: brainstorming
description: "Fase 0 (pré-constituição) do fluxo SDD: a partir de um tema ou ideia vaga, explora ideias de software, converge para um único projeto e produz uma descrição completa dele em docs/brainstorming/PROJECT.md — pronta para a constituição do /sdd e a decomposição em features. Invocada explicitamente pelo usuário via /brainstorming."
disable-model-invocation: true
---

# Brainstorming — Fase 0 pré-constituição do SDD

> Essa skill sugere ideias e guia o usuário na criação de produtos ou soluções de
> software, terminando numa **descrição completa do projeto** que antecede a constituição
> do `/sdd`.

## Visão Geral

- A partir de uma ideia vaga ou tema de atuação oferecido pelo usuário, o agente sugere
  ideias de software que se encaixem nesse escopo e ajuda a explorá-las.
- Perguntas podem ser feitas durante o processo para melhor guiar o usuário à ideia
  desejada.
- A sessão é **divergente no começo** (enumera e refina várias ideias) e **converge para
  um único projeto**. Uma vez escolhido, o agente aprofunda esse projeto até ter uma
  descrição completa.
- O entregável é `docs/brainstorming/PROJECT.md` — a descrição completa do projeto, no
  nível de "o que é o projeto", não de spec de feature. Ela alimenta a **constituição do
  `/sdd`**, que é o gate que valida escopo, princípios e a lista final de features. O slug
  do projeto só é definido na constituição — por isso o arquivo tem nome fixo.

---

## Instruções

> Siga esse fluxo para extrair as ideias e insights do usuário e chegar a uma descrição de
> projeto pronta para a constituição.

1. **Defina o objetivo**: Peça para o usuário começar descrevendo o que ele deseja
   alcançar. Use `AskUserQuestion` para perguntas estruturadas de esclarecimento quando o
   objetivo estiver vago. Sem essa interface (ex.: versão de terminal do codex), faça a
   pergunta no chat em formato de múltipla escolha enumerada, destacando a alternativa
   recomendada e o porquê; o usuário responde pelo número ou escreve outra coisa.

2. **Forneça contexto**: Quanto mais informações sobre o tema, público-alvo, restrições e
   objetivos, melhor a qualidade das ideias geradas.

3. **Enumere ideias**: Com base no contexto inicial, gere uma lista de ideias de software
   relacionadas ao objetivo. Se o tema pedir mais profundidade, consulte
   `references/tecnicas.md` para técnicas de ideação estruturadas (SCAMPER, Como
   Poderíamos, inversão, analogias).

4. **Refine as ideias**: Após elaborar as sugestões e consultar o usuário, expanda,
   combine ou melhore algumas das ideias apresentadas.

5. **Avalie e selecione**: Analise, junto ao usuário, as ideias geradas, considerando
   viabilidade, originalidade, impacto e esforço. Ajude-o a escolher **um único projeto**
   para levar adiante.

6. **Aprofunde o projeto escolhido (levantamento dirigido à constituição)**: Com o projeto
   definido, faça perguntas de levantamento — uma de cada vez, com preferência por
   `AskUserQuestion` — cobrindo os mesmos eixos da entrevista de constituição do `/sdd`
   (ver `sdd/SKILL.md`, Passo 2), no nível "descrição de projeto":
   - problema e público-alvo;
   - papéis e atores;
   - escopo dentro / fora desta versão;
   - requisitos funcionais principais;
   - requisitos não funcionais relevantes (performance, segurança, escala) quando fizerem sentido;
   - stack técnica e restrições conhecidas;
   - critérios de sucesso;
   - riscos e casos de borda conhecidos;
   - esboço de decomposição em features.

   Pule o que não se aplicar e não repita perguntas cuja resposta já apareceu. Este
   levantamento é um **esboço para acelerar a constituição** — não a substitui. A
   constituição do `/sdd` continua sendo o gate que confirma escopo, princípios e a lista
   final de features.

---

## Entrega

Salve a descrição completa do projeto em **`docs/brainstorming/PROJECT.md`** (nome fixo).
Crie a pasta `docs/brainstorming/` se ela não existir. Se `PROJECT.md` já existir, confirme
com o usuário antes de sobrescrever.

```markdown
# Projeto: <nome provisório do projeto>

> Descrição completa do projeto — Fase 0 (pré-constituição). Alimenta a constituição do
> `/sdd`, que confirma escopo, princípios e a decomposição final em features. O slug do
> projeto só é definido na constituição.

## Resumo
<2-4 frases: o que o projeto entrega e para quem>

## Problema e público-alvo
<que problema resolve e para quem>

## Papéis e atores
<quem interage com o sistema e em que papel>

## Escopo
### Dentro desta versão
- ...
### Fora desta versão
- ...

## Requisitos funcionais
- ...

## Requisitos não funcionais
<performance, segurança, escala — ou "nenhum relevante nesta fase">

## Stack e restrições técnicas
<stack pretendida, integrações existentes, restrições de negócio/time — ou "em aberto">

## Critérios de sucesso
<como saberemos que o projeto atingiu o objetivo>

## Riscos e casos de borda conhecidos
- ...

## Decomposição preliminar em features
<lista de features candidatas, 1-2 frases cada. A constituição do /sdd confirma, funde ou divide.>
- **<Nome da feature>** — <descrição curta>
```

Ao final, apresente o documento e informe que o próximo passo é `/init-dev` (para
configurar o projeto) ou `/sdd` (a constituição consome o `PROJECT.md` como contexto e
pula as perguntas já respondidas).
