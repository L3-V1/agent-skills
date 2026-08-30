---
name: add-feature
description: "Acrescenta UMA nova feature a uma decomposição já existente em docs/features/<arquivo>.md (gerada pelo /to-features), sem recriar o documento nem re-decompor o escopo inteiro. Preserva as features já listadas, o contexto e a numeração, e só adiciona o novo item — pronto para /sdd-spec <slug>. Use quando o usuário quer incluir mais uma feature na listagem atual em vez de rodar /to-features de novo (que criaria outro arquivo). Invocada explicitamente via /add-feature, opcionalmente com a descrição da feature nova."
disable-model-invocation: true
---

# Add-feature — Acrescentar uma feature à decomposição existente

Você foi invocado via `/add-feature`. Esta skill NUNCA deve ser disparada automaticamente pelo
modelo — apenas quando o usuário digita o comando explicitamente.

> Variante incremental do `/to-features`. Enquanto `/to-features` pega uma proposta inteira e a
> quebra num arquivo novo em `docs/features/`, esta skill adiciona **um único item** a uma
> decomposição que já existe. Rodar `/to-features` de novo criaria outro documento; use
> `/add-feature` quando o que você quer é só mais uma linha na listagem atual.

## Regra de ouro

O escopo aqui é de **uma feature só**. Critérios de aceite, EARS e detalhes técnicos continuam
sendo trabalho do `/sdd-spec` — se a conversa começar a virar uma spec completa, passou do
ponto. E não reabra a decomposição das features já listadas: elas foram confirmadas antes,
mexer nelas agora é retrabalho e quebra a rastreabilidade de quem já rodou `/sdd-spec` a partir
delas.

## Passo 1 — Localizar o arquivo de features

Procure `docs/features/*.md`.

- **Nenhum arquivo** — não há decomposição ainda. Avise o usuário que, como não existe listagem,
  você vai criar uma nova (o Passo 6 cuida disso, com a feature nova como item 1) e siga em
  frente.
- **Um arquivo** — use esse. Confirme o nome com o usuário antes de editar.
- **Vários arquivos** — liste-os e peça para o usuário escolher qual receberá a feature. Use
  `AskUserQuestion` quando o ambiente oferecer interface de seleção (ex. extensão Claude Code no
  VSCode); sem ela (ex. terminal do codex), apresente uma lista enumerada e peça o número.

## Passo 2 — Ler o arquivo escolhido inteiro

Antes de perguntar qualquer coisa, leia o arquivo do começo ao fim e absorva:

- o `## Contexto` — a proposta original que originou a decomposição;
- os **nomes e slugs já usados** — o slug da nova feature não pode colidir com nenhum deles;
- a **numeração atual** das features (`### 1.`, `### 2.`, ...) — a nova continua a sequência;
- as **dependências** já registradas — a nova feature pode depender de uma delas.

Isso mantém a nomenclatura consistente com o que já foi decidido e evita slug duplicado.

## Passo 3 — Checar contexto do projeto

Verifique rapidamente o que já existe, para não repetir perguntas cuja resposta já está
documentada:

- `AGENTS.md` ou `CLAUDE.md` na raiz, ou `docs/onboarding/ONBOARDING.md` — visão geral, stack,
  convenções.
- `docs/specs/` — specs já aprovadas. Se a feature que o usuário quer adicionar já virou spec,
  avise — provavelmente não faz sentido registrá-la de novo aqui.

## Passo 4 — Entrevista curta

Faça as perguntas abaixo **uma de cada vez**, aguardando resposta antes de seguir. Pule
qualquer uma cuja resposta já esteja clara pela descrição passada em `/add-feature`
(`$ARGUMENTS`) ou pelo contexto dos passos 2 e 3 — confirme o que entendeu em vez de perguntar
de novo. Sempre que o ambiente oferecer interface de opções selecionáveis (ex.
`AskUserQuestion`), use-a. Sem ela, liste as alternativas em formato de múltipla escolha
enumerada, destacando a recomendada e o porquê.

1. **O que a feature entrega** e que problema ela resolve.
2. **Por que é uma unidade separada** das features já listadas — e não parte de uma delas.
3. **Dependências** — ela só faz sentido depois de alguma feature já listada, ou é independente?
4. **Restrições conhecidas** (opcional) — stack, integrações, prazo. Aceite "nenhuma".

Mantenha entre 2 e 5 perguntas — o suficiente para descrever a feature com confiança, sem
duplicar o que `/sdd-spec` vai fazer depois.

## Passo 5 — Montar e confirmar o item

Defina, para a feature nova:

- **Nome curto** — título legível.
- **Slug** — kebab-case, mesmo padrão do `/sdd-spec` (ex. `notificacoes-email`, `export-csv`),
  **sem colidir** com nenhum slug já presente no arquivo.
- **Descrição** — 2 a 4 frases: o que entrega e por que é uma unidade separada das outras.
- **Depende de** — slugs de features já listadas, ou "nenhuma".

Apresente esse bloco ao usuário antes de gravar qualquer coisa. Se ele pedir ajuste, refaça e
apresente de novo.

## Passo 6 — Gravar

### Se o arquivo já existe

Insira o novo bloco **ao fim da seção `## Features`**, com o próximo número sequencial
(continue a partir do maior `### N.` presente no arquivo), no mesmo formato dos itens
existentes:

```markdown
### N. <Nome da feature> (`slug-da-feature`)
<descrição>
**Depende de:** <slugs, ou "nenhuma">
```

Não reescreva o `## Contexto`, os itens anteriores nem a seção `## Próximos passos` — só
acrescente.

### Se não existe nenhum arquivo

Sugira um nome de arquivo baseado no tema da feature e confirme com o usuário. Crie
`docs/features/` se necessário e escreva o arquivo completo com a feature nova como item 1:

```markdown
# Features: <tema da proposta>

## Contexto
<resumo curto do que motivou a feature>

## Features

### 1. <Nome da feature> (`slug-da-feature`)
<descrição>
**Depende de:** <slugs, ou "nenhuma">

## Próximos passos
Para iniciar o ciclo SDD de cada feature: `/sdd-spec <slug>`
```

## Passo 7 — Resumo final

Informe ao usuário, de forma objetiva: em qual arquivo a feature entrou, qual o slug, de que
outras features ela depende (se alguma), e que o próximo passo é `/sdd-spec <slug>`.

## Subagentes

A entrevista é sequencial e depende de contexto acumulado — não despache subagentes para ela.
Se precisar varrer várias partes do repo em paralelo no Passo 3 (projeto grande, docs
espalhados), tarefas de leitura simples podem rodar em subagentes com modelo mais barato; a
síntese e a conversa com o usuário permanecem no agente orquestrador.
