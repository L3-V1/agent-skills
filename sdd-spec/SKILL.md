---
name: sdd-spec
description: "Inicia a especificação formal de uma feature ou mudança, em notação EARS, através de uma entrevista guiada ao usuário. Primeira fase do workflow spec-anchored (sdd-spec → sdd-plan → sdd-tasks → sdd-implement → sdd-audit)."
disable-model-invocation: true
---

# sdd-spec — Especificação em EARS

Você foi invocado via `/sdd-spec`. Esta skill NUNCA deve ser disparada automaticamente pelo
modelo — apenas quando o usuário digita o comando explicitamente.

## Regra de ouro

Não gere nenhum artefato, não leia código do projeto, não faça suposições sobre escopo até
a entrevista estar completa e o usuário confirmar que está tudo certo. Uma spec malfeita
contamina todas as fases seguintes.

## Passo 1 — Verificar se já existe contexto

Antes de perguntar qualquer coisa, verifique:
- Existe `docs/specs/` no projeto? Se não, será criado ao salvar (não crie agora).
- O usuário passou `$ARGUMENTS`? Se sim, use como ponto de partida e pule perguntas já
  respondidas — mas ainda assim confirme os pontos que ficaram ambíguos.
- Existe um README ou `ONBOARDING.md` na raiz do projeto (gerado pela skill `onboarding`, se
  ela já rodou) que já responda parte do contexto de negócio? Leia antes de perguntar, para
  não repetir perguntas cuja resposta já está no projeto.

## Passo 2 — Entrevista

Faça as perguntas abaixo **uma de cada vez**, aguardando resposta antes de seguir para a
próxima. Não dispare todas de uma vez em uma lista — isso sobrecarrega quem está respondendo
e produz respostas rasas. Quando existir uma escolha comum e um caminho recomendável, ofereça
alternativas com uma recomendação explícita (e o porquê), mas deixe claro que o usuário pode
propor outra coisa. Sempre que o ambiente oferecer uma interface de opções selecionáveis para
perguntas ao usuário (ex.: `AskUserQuestion` na extensão Claude Code no VSCode), use-a para
apresentar essas alternativas — é mais rápido e reduz ambiguidade de leitura. Só faça a
pergunta em texto livre pelo chat quando esse tipo de interface não estiver disponível no
ambiente atual.

1. **Nome/slug da feature.** Ex.: "checkout-parcelado", "auth-2fa". Vira o nome do arquivo.
2. **Problema e público.** Que problema isso resolve, e para quem (que tipo de usuário/ator)?
3. **Escopo.** O que está dentro e o que está explicitamente fora desta mudança? Se o usuário
   hesitar, sugira um escopo mínimo plausível como recomendação e pergunte se topa começar
   por aí (fatiar em incrementos pequenos é mais saudável do que uma spec monolítica).
4. **Restrições conhecidas.** Técnicas (stack, integrações existentes), de negócio (prazo,
   compliance) ou de time. Pergunte, mas aceite "nenhuma por enquanto".
5. **Critérios de sucesso.** Como saberemos que está pronto? Essas respostas viram
   diretamente os critérios de aceite em EARS no passo 3 — insista em respostas concretas e
   observáveis, não vagas ("funciona bem" não serve; "o usuário recebe confirmação em até 2s"
   serve).
6. **Comportamentos indesejados / casos de borda.** O que NÃO deve acontecer? Erros conhecidos
   a evitar, condições de falha a tratar.

Se em qualquer ponto a resposta do usuário já responder uma pergunta futura, não pergunte de
novo — confirme o que você entendeu e siga.

## Passo 3 — Converter para EARS

Traduza as respostas em critérios de aceite usando os cinco padrões EARS. Não force todos os
padrões — use os que fizerem sentido para a feature:

| Padrão | Forma | Quando usar |
|---|---|---|
| Ubíquo | "O sistema deve \<comportamento\>" | Regra sempre válida, sem gatilho |
| Orientado a evento | "Quando \<evento\>, o sistema deve \<resposta\>" | Reação a uma ação/evento |
| Orientado a estado | "Enquanto \<estado\>, o sistema deve \<comportamento\>" | Comportamento contínuo num estado |
| Feature opcional | "Onde \<recurso presente\>, o sistema deve \<comportamento\>" | Depende de config/plano/flag |
| Comportamento indesejado | "Se \<condição indesejada\>, então o sistema deve \<resposta\>" | Tratamento de erro/exceção |

Numere cada critério (`AC-01`, `AC-02`, ...) — essa numeração é o elo de rastreabilidade que
`sdd-tasks` e `sdd-audit` vão usar depois. Não pule numeração nem reordene depois de aprovado.

## Passo 4 — Salvar

Crie `docs/specs/` se não existir. Salve em `docs/specs/<slug>.md` com esta estrutura:

```markdown
# Spec: <nome da feature>

**Status:** rascunho | aprovado
**Slug:** <slug>

## Problema
<resumo do problema e público-alvo>

## Escopo
### Dentro
- ...
### Fora
- ...

## Restrições
- ...

## Critérios de aceite (EARS)
- **AC-01** — Quando ..., o sistema deve ...
- **AC-02** — ...

## Comportamentos indesejados
- **AC-0N** — Se ..., então o sistema deve ...
```

## Passo 5 — Gate de aprovação (obrigatório)

Apresente o documento completo e pergunte explicitamente:

> "Essa é a especificação. Aprovada para seguir pro plano técnico (`/sdd-plan`), ou quer
> ajustar algo antes?"

Não prossiga para nenhuma outra fase sozinho. Se o usuário pedir ajustes, edite e apresente
de novo até a aprovação explícita. Ao aprovar, atualize `Status: aprovado` no arquivo.

## Subagentes

Geralmente não há trabalho paralelizável nesta fase — é uma entrevista sequencial. Não
despache subagentes aqui, exceto se o usuário pedir para você pesquisar/ler múltiplas partes
independentes do código-base em paralelo para embasar as restrições técnicas (passo 2.4); nesse
caso, tarefas de leitura/varredura simples podem rodar em subagentes com modelo mais barato
(Haiku), já a síntese final e a conversa com o usuário permanecem no agente orquestrador.
