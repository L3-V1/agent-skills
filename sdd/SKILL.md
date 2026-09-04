---
name: sdd
description: "Conduz o fluxo de desenvolvimento spec-anchored (SDD) completo de uma feature, ponta a ponta, numa única skill: constituição → especificação (EARS) → plano técnico → tarefas atômicas → implementação em TDD. Ao ser invocada, avalia o estado atual da aplicação para detectar em que etapa do fluxo o projeto/feature está e continua dali. Invocada explicitamente pelo usuário via /sdd, opcionalmente com o slug de uma feature."
disable-model-invocation: true
---

# SDD — Fluxo spec-anchored completo

Você foi invocado via `/sdd`. Esta skill NUNCA deve ser disparada automaticamente pelo
modelo — apenas quando o usuário digita o comando explicitamente.

> Consolida num único comando o ciclo que antes eram várias skills encadeadas: constituição
> → especificação → plano → tarefas → implementação. Cada etapa produz um artefato
> versionado em `docs/` que ancora a etapa seguinte.

## Regra de ouro

- **Não pule etapas.** Cada etapa depende do artefato aprovado da anterior. Não comece a
  planejar sem spec aprovada, não decomponha em tarefas sem plano aprovado, não implemente
  sem tarefas aprovadas.
- **Não invente escopo.** Qualquer coisa que não esteja coberta pelos critérios de aceite
  (`AC-XX`) da spec volta para a etapa de especificação — não é decidida ad-hoc numa etapa
  posterior.
- **Gates são do usuário.** Ao terminar uma etapa que produz artefato (spec, plano,
  tarefas), apresente o resultado, atualize `Status: gerado` e pare. Quem decide avançar é
  o usuário rodando `/sdd` de novo. Nunca encadeie a próxima etapa sozinho.
- **Todo código rastreia.** Na implementação, todo código escrito serve a uma tarefa
  (`T-XX`) e, por ela, a um ou mais `AC-XX`. Se aparecer necessidade de código que não
  serve a nenhum `T-XX`, pare e pergunte ao usuário.
- **Prefira interface gráfica ao perguntar.** Quando o ambiente oferecer `AskUserQuestion`
  (extensão Claude Code no VSCode), use-a. Sem essa interface (ex.: terminal do codex),
  pergunte no chat em múltipla escolha enumerada, sempre destacando a recomendação e o
  porquê. Perguntas de entrevista vão **uma de cada vez**, aguardando resposta antes da
  próxima.

## Passo 1 — Avaliar o estado atual e escolher a etapa

Antes de qualquer pergunta, inspecione o repositório para descobrir em que ponto do fluxo
ele está:

1. **Sem `docs/constitution/*.md`** → nenhuma feature foi decomposta ainda. Vá para o
   **Passo 2 (Constituição)**.
2. **Com `docs/constitution/<slug>.md`** → leia a constituição e extraia a lista de
   features (nome + slug). Para cada feature, verifique o estágio concluído:
   - `docs/specs/<slug>.md` existe e `Status: gerado`? → especificação feita.
   - `docs/plans/<slug>.md` existe e `Status: gerado`? → plano feito.
   - `docs/tasks/<slug>.md` existe e `Status: gerado`? → tarefas feitas.
   - Em `docs/tasks/<slug>.md`, todas as checkboxes `- [x]`? → implementação concluída.
   - `docs/tests/<slug>.md` existe e `Status: gerado` (ou marcado como `N/A — sem frontend`)?
     → testes visuais feitos.
   Monte mentalmente uma tabela feature × próxima etapa pendente.
3. **Seleção da feature:**
   - Se o usuário passou um slug em `$ARGUMENTS`, trabalhe nessa feature.
   - Senão, apresente a tabela (feature → próxima etapa pendente) via `AskUserQuestion` e
     pergunte qual feature avançar. Se só houver uma feature pendente, confirme em uma
     linha em vez de perguntar.
4. Entre na etapa pendente daquela feature (Passo 3 a 6). **Não refaça** etapas já
   concluídas e aprovadas — releia os artefatos existentes para ter contexto e siga da
   próxima.

Se `docs/constitution/` já existe porque `/init-dev` conduziu a constituição, apenas
use-a — não refaça o Passo 2.

## Passo 2 — Etapa 1: Constituição → `docs/constitution/<slug-do-projeto>.md`

Documento de fundação: propósito, princípios inegociáveis e decomposição do projeto em
features distintas. A própria skill conduz — não delegue.

1. **Entrevista técnica de levantamento de requisitos.** Perguntas uma de cada vez, com
   preferência por `AskUserQuestion`. Roteiro mínimo (pule o que não se aplicar): problema
   e público-alvo; papéis e atores; escopo dentro/fora desta versão; requisitos
   funcionais; requisitos não funcionais (performance, segurança, escala) quando
   relevantes; stack técnica e restrições; critérios de sucesso; riscos e casos de borda
   conhecidos. Entre ~10 e 20 perguntas no total, salvo pedido do usuário por mais.
2. **Decomposição em features.** Identifique features distintas — unidades de escopo
   coerentes, cada uma pequena o bastante para virar uma spec isolada, nem tão grande que
   "faça tudo" nem tão pequena que seja subtarefa de implementação. Para cada uma: nome
   curto, slug em kebab-case, descrição de 2–4 frases e dependências ("nenhuma" se não
   houver).
3. **Confirme a decomposição com o usuário** antes de salvar — adicionar, remover, fundir
   ou dividir features. Não salve sem essa confirmação.
4. **Salve** em `docs/constitution/<slug-do-projeto>.md` (crie a pasta se não existir):

```markdown
# Constituição: <nome do projeto>

## Propósito
<1-3 frases: o que o projeto entrega e para quem>

## Princípios inegociáveis
- <decisões e restrições que nenhuma feature pode violar>

## Features
### 1. <Nome da feature> (`slug-da-feature`)
<descrição>
**Depende de:** <slugs, ou "nenhuma">

## Próximos passos
Para conduzir o ciclo SDD de cada feature: `/sdd <slug>`
```

Ao terminar, pergunte ao usuário qual feature especificar primeiro e siga para o Passo 3
(ou pare, se ele preferir revisar a constituição antes).

## Passo 3 — Etapa 2: Especificação (EARS) → `docs/specs/<slug-da-feature>.md`

Não gere nenhum artefato, não leia código do projeto, não faça suposições sobre escopo até
a entrevista estar completa e o usuário confirmar. Uma spec malfeita contamina todas as
etapas seguintes.

### Contexto existente

- O usuário passou `$ARGUMENTS`? Use como ponto de partida e pule perguntas já
  respondidas — mas confirme os pontos ambíguos.
- Existe README na raiz ou `docs/onboarding/ONBOARDING.md` que já responda parte do
  contexto de negócio? Leia antes de perguntar, para não repetir perguntas cuja resposta
  já está no projeto.

### Entrevista

Perguntas uma de cada vez:

1. **Nome/slug da feature.** Ex.: "checkout-parcelado", "auth-2fa". Vira o nome do arquivo.
2. **Problema e público.** Que problema isso resolve, e para quem (que tipo de
   usuário/ator)?
3. **Escopo.** O que está dentro e o que está explicitamente fora desta mudança? Se o
   usuário hesitar, sugira um escopo mínimo plausível como recomendação — fatiar em
   incrementos pequenos é mais saudável do que uma spec monolítica.
4. **Restrições conhecidas.** Técnicas (stack, integrações existentes), de negócio (prazo,
   compliance) ou de time. Aceite "nenhuma por enquanto".
5. **Critérios de sucesso.** Como saberemos que está pronto? Essas respostas viram
   diretamente os critérios de aceite em EARS — insista em respostas concretas e
   observáveis ("o usuário recebe confirmação em até 2s", não "funciona bem").
6. **Comportamentos indesejados / casos de borda.** O que NÃO deve acontecer? Erros
   conhecidos a evitar, condições de falha a tratar.

Se uma resposta já responder uma pergunta futura, não pergunte de novo — confirme o que
entendeu e siga.

### Converter para EARS

Traduza as respostas em critérios de aceite usando os cinco padrões EARS. Use só os que
fizerem sentido para a feature:

| Padrão | Forma | Quando usar |
|---|---|---|
| Ubíquo | "O sistema deve \<comportamento\>" | Regra sempre válida, sem gatilho |
| Orientado a evento | "Quando \<evento\>, o sistema deve \<resposta\>" | Reação a uma ação/evento |
| Orientado a estado | "Enquanto \<estado\>, o sistema deve \<comportamento\>" | Comportamento contínuo num estado |
| Feature opcional | "Onde \<recurso presente\>, o sistema deve \<comportamento\>" | Depende de config/plano/flag |
| Comportamento indesejado | "Se \<condição indesejada\>, então o sistema deve \<resposta\>" | Tratamento de erro/exceção |

Numere cada critério (`AC-01`, `AC-02`, ...) — essa numeração é o elo de rastreabilidade
das etapas seguintes. Não pule numeração nem reordene depois de gerada.

### Salvar

Crie `docs/specs/` se não existir. Salve em `docs/specs/<slug>.md`:

```markdown
# Spec: <nome da feature>

**Status:** rascunho | gerado
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

Apresente o documento completo, atualize `Status: gerado` e instrua o usuário a revisar e
rodar `/sdd <slug>` de novo para seguir ao plano. **Pare aqui.**

## Passo 4 — Etapa 3: Planejamento → `docs/plans/<slug-da-feature>.md`

O plano nasce da spec aprovada. Não invente escopo — qualquer coisa fora dos `AC-XX` volta
para a etapa de especificação.

### Localizar a spec

Leia `docs/specs/<slug>.md`. Se o slug não veio em `$ARGUMENTS` e houver mais de uma spec
sem plano, pergunte qual.

### Entrevista

Uma pergunta de cada vez. Sempre que houver mais de uma abordagem técnica razoável,
apresente as alternativas com uma recomendação e o porquê — a decisão final é do usuário.

1. **Pontos de integração.** Este plano toca sistemas/serviços/módulos existentes? Quais?
2. **Decisões de arquitetura em aberto.** Existe alguma decisão técnica que a spec não
   resolve (síncrono vs. assíncrono, onde armazenar um novo dado, reaproveitar componente
   existente vs. criar novo)? Para cada uma, ofereça 2–3 opções com trade-offs e uma
   recomendação.
3. **Impacto em dados.** Precisa de migração, nova tabela/coleção, mudança de schema?
4. **Riscos técnicos.** O que tem mais chance de dar errado ou atrasar? Vale um spike
   antes de decompor em tarefas?
5. **Fora do plano.** Algo que parece tentador mas deve ficar de fora deste incremento
   (débito técnico aceito, otimizações futuras)?

### Investigação técnica (se necessário)

Se a pergunta 2 revelar decisões que dependem de olhar o código existente, investigue
antes de recomendar. Se houver mais de uma área independente para inspecionar, despache
subagentes em paralelo — um por área — com modelo mais barato (Haiku) para a
leitura/varredura. Você (orquestrador) sintetiza os achados e faz a recomendação.

### Salvar

Crie `docs/plans/` se não existir. Salve em `docs/plans/<slug>.md` (mesmo slug da spec):

```markdown
# Plano técnico: <nome da feature>

**Status:** rascunho | gerado
**Slug:** <slug>
**Spec de referência:** docs/specs/<slug>.md

## Resumo da abordagem
<1-2 parágrafos>

## Pontos de integração
- ...

## Decisões de arquitetura
### Decisão: <nome>
- Opções consideradas: A, B, C
- Escolhida: B
- Motivo: ...

## Impacto em dados
- ...

## Riscos e mitigação
- ...

## Fora do escopo deste plano
- ...

## Rastreabilidade
Este plano cobre os critérios: AC-01, AC-02, AC-03... (liste todos os AC-XX da spec e
marque se algum ainda não tem abordagem técnica definida).
```

Confira que todo `AC-XX` da spec tem cobertura no plano; se algum não tiver, avise o
usuário explicitamente. Apresente o plano, atualize `Status: gerado` e instrua o usuário a
revisar e rodar `/sdd <slug>` para seguir à decomposição em tarefas. **Pare aqui.**

## Passo 5 — Etapa 4: Tarefas → `docs/tasks/<slug-da-feature>.md`

Toda tarefa precisa apontar para pelo menos um `AC-XX` da spec. Uma tarefa sem
rastreabilidade é sinal de que o plano tem lacunas ou de que você está inventando escopo —
pare e avise o usuário em vez de criar a tarefa mesmo assim.

### Localizar o plano

Leia `docs/plans/<slug>.md` e a spec (`docs/specs/<slug>.md`) para ter a lista completa de
`AC-XX`.

### Entrevista

1. **Granularidade.** Tarefas bem pequenas (uma função/endpoint por tarefa) ou maiores por
   área? Recomendação: pequenas o bastante para serem implementadas e testadas em uma
   única sessão de foco (tipicamente < ~1h de trabalho de agente).
2. **Ordem/dependências.** Existem tarefas que precisam necessariamente vir antes de
   outras (ex.: schema de dados antes do endpoint que o usa)? Ou a maior parte é
   independente?
3. **Paralelização desejada.** Na implementação, tarefas independentes entre si devem ser
   despachadas em paralelo via subagentes (mais rápido, mais tokens em paralelo) ou sempre
   sequencial (mais lento, mais fácil de acompanhar)?

### Gerar as tarefas

Para cada critério (ou grupo de critérios relacionados), gere uma ou mais tarefas. Cada
tarefa é um item de checkbox markdown com ID e título na mesma linha, e precisa ter: ID
(`T-01`, ...), título curto, `AC-XX` cobertos, dependências (outros `T-XX` ou "nenhuma"),
complexidade (baixa/média/alta — orienta a escolha de modelo para subagentes) e critério
de pronto (geralmente: teste correspondente ao AC passando). Marque explicitamente quais
tarefas são independentes entre si.

### Salvar

Crie `docs/tasks/` se não existir. Salve em `docs/tasks/<slug>.md`:

```markdown
# Tarefas: <nome da feature>

**Status:** rascunho | gerado
**Slug:** <slug>
**Plano de referência:** docs/plans/<slug>.md
**Paralelização:** sim | não

- [ ] **T-01** — <título>
  - **Cobre:** AC-01, AC-02
  - **Depende de:** nenhuma
  - **Complexidade:** baixa
  - **Pronto quando:** teste de AC-01 e AC-02 passam

- [ ] **T-02** — <título>
  - **Cobre:** AC-03
  - **Depende de:** T-01
  - **Complexidade:** média
  - **Pronto quando:** ...

## Grupos paralelizáveis
- Grupo A (independentes entre si): T-01, T-03
- Sequencial: T-02 (depende de T-01), T-04 (depende de T-02)

## Rastreabilidade reversa
- AC-01 → T-01
- AC-02 → T-01
- AC-03 → T-02
```

Confira que todo `AC-XX` está coberto por pelo menos uma tarefa; se algum ficou de fora,
avise antes de encerrar. Apresente as tarefas, atualize `Status: gerado` e instrua o
usuário a revisar granularidade/dependências e rodar `/sdd <slug>` para começar a
implementação. **Pare aqui.**

## Passo 6 — Etapa 5: Implementação (TDD) → atualiza `docs/tasks/<slug-da-feature>.md`

### Localizar as tarefas

Leia `docs/tasks/<slug>.md` e também a spec e o plano correspondentes para o contexto
completo dos critérios de aceite.

### Entrevista curta

A maior parte já foi decidida na etapa de tarefas. Confirme só o que muda a execução:

1. **Modo de execução.** Se o arquivo marcou "Paralelização: sim", confirme: despachar os
   grupos independentes em paralelo, ou acompanhar tarefa por tarefa mesmo assim?
   (Recomendação: paralelo para os grupos marcados como independentes, sequencial para o
   resto.)
2. **Parar em caso de falha.** Se um teste não passar após algumas tentativas, parar e
   chamar o usuário, ou continuar tentando? (Recomendação: parar após ~3 tentativas
   malsucedidas na mesma tarefa — problemas recorrentes geralmente indicam lacuna na
   tarefa ou no plano.)

Não há aprovação por tarefa — isso viraria microgerenciamento. A revisão humana acontece
nas pontas.

### Loop de TDD por tarefa

Para cada tarefa `T-XX`, na ordem definida por dependências:

1. Releia o(s) critério(s) de aceite (`AC-XX`) que essa tarefa cobre.
2. Escreva o teste que expressa esse critério antes de qualquer código de implementação. A
   forma EARS já sugere o teste: "Quando `<evento>`, deve `<resposta>`" vira um teste que
   provoca o evento e verifica a resposta.
3. Rode o teste e confirme que falha (evita teste que "passa por acidente").
4. Implemente o mínimo necessário para o teste passar.
5. Rode o teste de novo. Se passar, faça um passe de refactor (limpeza, remoção de
   duplicação) mantendo o teste verde. Rode a suíte a cada ciclo.
6. Marque a tarefa como concluída em `docs/tasks/<slug>.md` (troque `- [ ]` por `- [x]` no
   checkbox do `T-XX`).

Se o teste não passar depois do número de tentativas combinado, pare essa tarefa, registre
o que foi tentado e o que falhou, e chame o usuário antes de prosseguir.

### Despacho de subagentes (só para tarefas independentes)

Quando o arquivo indicar um grupo de tarefas independentes entre si e o usuário tiver
confirmado paralelização:

- Um subagente por tarefa do grupo, cada um seguindo o loop de TDD isoladamente.
- Tarefas de **complexidade baixa** → subagente com modelo mais barato (Haiku).
- Complexidade **média ou alta** → modelo padrão da sessão.
- Nunca paralelize tarefas com dependência entre si.
- Depois que os subagentes terminarem, você (orquestrador) revisa os resultados, resolve
  conflitos (ex.: dois subagentes tocando o mesmo arquivo de forma incompatível) e só
  então marca as tarefas como concluídas.

### Ao concluir

Apresente um resumo: quantas tarefas concluídas, quantas bloqueadas (se houver) e quais
arquivos foram alterados.

## Passo 7 — Etapa 6: Testes visuais → `docs/tests/<slug-da-feature>.md`

Só se aplica a features com recurso visual (tela, componente de UI) implementado. Não é
sobre testes automatizados — isso já aconteceu no Passo 6 (TDD). Aqui o objetivo é um
roteiro de verificação visual, e opcionalmente sua execução assistida via Playwright MCP.

### Localizar contexto

Leia `docs/tasks/<slug>.md` (deve estar com todas as checkboxes `- [x]`), a spec
(`docs/specs/<slug>.md`) e o plano (`docs/plans/<slug>.md`).

### Decidir se a feature tem recurso visual

Inspecione spec, plano e tarefas em busca de menção a UI, tela, componente visual, rota de
frontend etc. Apresente a conclusão da inferência ao usuário (via `AskUserQuestion` quando
disponível, senão pergunta única no chat) pedindo confirmação de 1 clique: "Detectei que
esta feature tem/não tem frontend implementado — está correto?".

- Se a resposta for "sem frontend": não crie `docs/tests/<slug>.md`. Registre isso (ex.:
  anotação em `docs/tasks/<slug>.md` ou apenas no resumo apresentado) e siga para o
  Encerramento.
- Se "com frontend": continue.

### Gerar o roteiro de teste manual

Para cada `AC-XX` da spec que tenha manifestação visual, gere um passo a passo objetivo e
verificável: pré-condição, ação do usuário, resultado esperado observável na tela. Agrupe
por fluxo/tela quando fizer sentido. Reaproveite a rastreabilidade `AC-XX` já estabelecida
nas etapas anteriores.

### Salvar

Crie `docs/tests/` se não existir. Salve em `docs/tests/<slug>.md`:

```markdown
# Testes visuais: <nome da feature>

**Status:** rascunho | gerado
**Slug:** <slug>
**Tarefas de referência:** docs/tasks/<slug>.md

## Como testar
<instruções gerais: como subir o ambiente/app antes de seguir o roteiro>

## Roteiro
### <AC-XX ou nome do fluxo>
- [ ] Pré-condição: ...
- [ ] Ação: ...
- [ ] Resultado esperado: ...

## Execução automatizada (Playwright MCP)
<preenchido só se o agente rodou o roteiro via Playwright; por passo: ✅/❌ + observação>
```

### Checar disponibilidade do Playwright MCP

Verifique se há, entre as ferramentas disponíveis no ambiente, alguma com nome contendo
`playwright` (ex.: `mcp__plugin_playwright_playwright__*`). Se houver, pergunte ao usuário
(uma pergunta, com recomendação) se ele quer que o próprio agente execute o roteiro usando o
Playwright agora, em vez de (ou além de) testar manualmente.

- **Se aceitar:** conduza o roteiro passo a passo usando as ferramentas do Playwright MCP
  (navegação, cliques, screenshots, asserts visuais) e **atualize o mesmo arquivo**
  `docs/tests/<slug>.md`, marcando cada passo executado com resultado (✅/❌) e observações
  inline na seção "Execução automatizada (Playwright MCP)", preservando o roteiro original.
- **Se recusar ou o MCP não estiver disponível:** o arquivo fica como roteiro manual para o
  usuário seguir por conta própria; `Status:` permanece `gerado` (roteiro pronto, execução
  pendente).

### Ao concluir

Apresente um resumo: arquivo gerado (ou motivo de ter sido pulado), se os testes foram
rodados via Playwright e quantos passos passaram/falharam. **Pare aqui** — não encadeie o
Encerramento além do resumo textual.

## Passo 8 — Encerramento

Informe ao usuário, de forma objetiva:

- Em que etapa do fluxo o trabalho parou e qual o próximo passo.
- Que rodar `/sdd` (ou `/sdd <slug>`) de novo retoma exatamente dali — a skill reavalia o
  estado a cada invocação.
- Se um artefato foi gerado, que ele está com `Status: gerado` e aguarda revisão do
  usuário antes de avançar.
- Se a implementação foi concluída, que o próximo passo (revisão de código, merge) fica a
  cargo do usuário.

## Subagentes

- **Entrevista e conversa com o usuário ficam sempre no orquestrador** — nunca delegue.
- **Constituição / especificação / tarefas:** etapas majoritariamente sequenciais e
  analíticas — normalmente sem subagentes. Só considere despachar para leitura/varredura
  paralela de áreas muito distintas do código, com modelo mais barato (Haiku).
- **Planejamento:** subagentes para investigação técnica paralela e independente, Haiku
  para a leitura/varredura. As decisões de arquitetura em si ficam no orquestrador.
- **Implementação:** subagentes para grupos de tarefas explicitamente independentes; Haiku
  para tarefas de complexidade baixa, modelo padrão para média/alta.
