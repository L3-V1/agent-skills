---
name: feature
description: "Decompõe uma proposta de implementação em features distintas, cada uma pronta para iniciar o ciclo SDD (/sdd-spec → /sdd-plan → /sdd-tasks → /sdd-implement → /sdd-audit). Invocada explicitamente pelo usuário via /feature, opcionalmente com uma descrição do que deseja desenvolver."
disable-model-invocation: true
---

# Feature — Decomposição de proposta em features

Você foi invocado via `/feature`. Esta skill NUNCA deve ser disparada automaticamente pelo
modelo — apenas quando o usuário digita o comando explicitamente.

> Ponto de entrada do ciclo spec-anchored: pega uma proposta de implementação (que pode cobrir
> várias funcionalidades de uma vez) e quebra em features distintas, cada uma pequena o bastante
> para virar uma spec isolada via `/sdd-spec <slug>`. Não substitui o `/sdd-spec` — só prepara o
> terreno para que ele rode uma vez por feature.

## Regra de ouro

O objetivo aqui é decompor o escopo, não especificá-lo a fundo. Critérios de aceite, EARS,
detalhes técnicos de cada feature ficam para `/sdd-spec`. Se a entrevista desta skill começar a
virar uma especificação completa de uma feature específica, é sinal de que passou do ponto —
volte para o nível "isso é uma unidade de escopo coerente" e siga em frente.

## Passo 1 — Entrada

- Se o usuário passou uma descrição junto de `/feature` (`$ARGUMENTS`), use como ponto de
  partida da proposta.
- Se `$ARGUMENTS` vier vazio, avise que vai fazer algumas perguntas rápidas antes de decompor, e
  siga para o Passo 2.

## Passo 2 — Checar contexto já existente no projeto

Antes de perguntar qualquer coisa (ou entre uma pergunta e outra, se já tiver descrição
inicial), verifique o que já existe no projeto para não repetir perguntas cuja resposta já está
documentada e para manter a nomenclatura consistente com o que já foi decidido:

- `ONBOARDING.md`, `AGENTS.md` ou `CLAUDE.md` na raiz — visão geral, stack, convenções.
- `docs/specs/` — specs já aprovadas (evite propor de novo uma feature que já virou spec).
- `docs/features/` — decomposições anteriores (se a proposta atual é uma extensão de uma
  proposta já quebrada antes, reaproveite os slugs existentes em vez de renomear).

## Passo 3 — Entrevista curta

Faça as perguntas abaixo **uma de cada vez**, aguardando resposta antes de seguir para a
próxima — não dispare todas de uma vez em lista. Pule qualquer pergunta cuja resposta já esteja
clara pela descrição inicial ou pelo contexto do Passo 2; confirme o que entendeu em vez de
perguntar de novo. Sempre que o ambiente oferecer uma interface de opções selecionáveis (ex.
`AskUserQuestion` na extensão Claude Code no VSCode), use-a — é mais rápido e reduz ambiguidade
de leitura. Só pergunte em texto livre pelo chat quando essa interface não estiver disponível.

1. **Objetivo geral e problema.** O que essa proposta resolve, e para quem?
2. **Escopo amplo.** O que está claramente dentro e o que está claramente fora desta rodada de
   desenvolvimento?
3. **Restrições conhecidas.** Stack já definida, integrações existentes, prazo, dependências
   entre partes do sistema — aceite "nenhuma por enquanto".
4. **Preferência de granularidade** (se a proposta for grande e ambígua): o usuário prefere
   features maiores e em menor número, ou menores e mais numerosas? Só pergunte isso se não for
   óbvio pelo tamanho da proposta.

Mantenha entre 3 e 8 perguntas no total — o suficiente para decompor com confiança, sem duplicar
o trabalho que `/sdd-spec` vai fazer depois em cada feature.

## Passo 4 — Decompor em features

A partir da proposta, das respostas e do contexto do repo, identifique features distintas:
unidades de escopo que fazem sentido como uma spec isolada cada. Calibre o tamanho — nem tão
grande que a feature "faz tudo" (isso não é decomposição), nem tão pequena que vire uma
subtarefa de implementação (isso é trabalho do `/sdd-tasks`, não daqui).

Para cada feature, defina:

- **Nome curto** — título legível.
- **Slug** — kebab-case, mesmo padrão usado por `/sdd-spec` (ex. `checkout-parcelado`,
  `auth-2fa`), pronto para `/sdd-spec <slug>`.
- **Descrição** — 2 a 4 frases: o que a feature entrega e por que faz sentido como unidade
  separada das outras.
- **Dependências** — se a feature só faz sentido depois de outra (ex. depende de autenticação
  existir primeiro), registre isso; caso contrário, "nenhuma".

## Passo 5 — Confirmar a decomposição com o usuário

Apresente a lista de features (nome, slug, descrição, dependências) antes de salvar qualquer
arquivo. Pergunte se o usuário quer ajustar — adicionar, remover, fundir ou dividir alguma
feature. Não prossiga para o Passo 6 sem essa confirmação; se o usuário pedir ajustes, refaça a
lista e apresente de novo.

## Passo 6 — Confirmar nome do arquivo

Sugira um nome de arquivo baseado no nome/tema da proposta (ex. `checkout-revamp` para uma
proposta sobre revisão do checkout) e pergunte ao usuário se confirma esse nome ou prefere outro,
antes de escrever.

## Passo 7 — Salvar

Crie `docs/features/` se não existir. Salve em `docs/features/<nome-confirmado>.md` com esta
estrutura:

```markdown
# Features: <nome da proposta>

## Contexto
<resumo curto da proposta original e do problema/objetivo geral>

## Features

### 1. <Nome da feature> (`slug-da-feature`)
<descrição>
**Depende de:** <slugs, ou "nenhuma">

### 2. <Nome da feature> (`slug-da-feature`)
<descrição>
**Depende de:** <slugs, ou "nenhuma">

## Próximos passos
Para iniciar o ciclo SDD de cada feature: `/sdd-spec <slug>`
```

## Passo 8 — Resumo final

Informe ao usuário, de forma objetiva: quantas features foram criadas, onde o arquivo foi salvo,
e que o próximo passo para cada feature é rodar `/sdd-spec <slug>`.

## Subagentes

Entrevista e decomposição são sequenciais e dependem de contexto acumulado — não despache
subagentes para elas. Se precisar varrer várias partes do repo em paralelo no Passo 2 (projeto
grande, múltiplos READMEs/docs espalhados), tarefas de leitura simples podem rodar em subagentes
com modelo mais barato; a síntese final e a conversa com o usuário permanecem no agente
orquestrador.
