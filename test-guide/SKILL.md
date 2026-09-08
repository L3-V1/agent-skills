---
name: test-guide
description: "Elabora um roteiro de testes visuais de frontend — passo a passo verificável, rastreável aos critérios de aceite quando existirem — e salva em docs/tests/<slug>.md. Se o Playwright MCP estiver disponível no ambiente, se oferece para executar o roteiro e anota o resultado no mesmo arquivo. Invocada explicitamente pelo usuário via /test-guide (opcionalmente com o slug de uma feature). Use ao terminar de implementar uma tela/componente de UI, quando o usuário pedir um plano de teste manual de frontend, um roteiro de QA visual, ou quiser que o agente clique pela interface verificando a feature. Funciona tanto num projeto que segue a metodologia SDD (docs/specs, docs/plans, docs/tasks) quanto isolado."
disable-model-invocation: true
---

# Test Guide — Roteiro de testes visuais de frontend

Você foi invocado via `/test-guide`. Esta skill NUNCA deve ser disparada
automaticamente pelo modelo — apenas quando o usuário digita o comando.

> Esta é a etapa de **verificação visual**: não é sobre testes automatizados
> (unit / integração / componente), que são responsabilidade da implementação.
> Aqui o objetivo é um roteiro de verificação pela interface —
> pré-condição, ação, resultado observável na tela — e, opcionalmente, sua
> execução assistida pelo agente via Playwright MCP.
>
> Na implementação em TDD o Playwright MCP não é usado: os testes de frontend lá
> usam o framework do projeto (testing-library, render headless, teste de
> componente). O Playwright MCP entra só aqui, nesta verificação visual.

## Regra de ouro

- **O roteiro vem antes da execução.** Só cogite rodar o Playwright depois de o
  roteiro estar elaborado e salvo — a automação segue o roteiro, não o substitui.
- **Rastreabilidade primeiro.** Se a feature tem spec com critérios de aceite
  (`AC-XX`), cada item do roteiro aponta para um `AC-XX`. Sem spec, agrupe por
  fluxo/tela.
- **Prefira interface gráfica ao perguntar.** Quando o ambiente oferecer
  `AskUserQuestion` (extensão Claude Code no VSCode), use-a. Sem ela, pergunte no
  chat em múltipla escolha enumerada, destacando a recomendação e o porquê.
  Perguntas de entrevista vão uma de cada vez.

## Passo 1 — Localizar contexto

Descubra sobre o que é o roteiro:

1. **Slug em `$ARGUMENTS`?** Use como nome da feature/arquivo.
2. **Projeto segue SDD?** Se existirem, leia `docs/tasks/<slug>.md` (idealmente
   com todas as checkboxes `- [x]`), `docs/specs/<slug>.md` e
   `docs/plans/<slug>.md`. Eles dão a feature, os `AC-XX` e a rastreabilidade já
   estabelecida.
   - Sem slug e havendo mais de uma feature com `docs/tasks/<slug>.md`, pergunte
     qual.
3. **Sem artefatos SDD (uso isolado):** faça uma entrevista curta, uma pergunta
   de cada vez:
   - O que precisa ser verificado? (feature/tela/mudança recém-implementada)
   - Quais fluxos ou telas o roteiro deve cobrir?
   - Como subir o ambiente/app para testar? (comando de dev server, URL, login de
     teste, dados de seed)
   - Escolha com o usuário um slug em kebab-case para nomear o arquivo.

## Passo 2 — Decidir se a feature tem recurso visual

Inspecione spec, plano e tarefas (ou as respostas da entrevista) em busca de
menção a UI, tela, componente visual, rota de frontend. Apresente a conclusão da
inferência ao usuário (via `AskUserQuestion` quando disponível, senão pergunta
única no chat) pedindo confirmação de 1 clique: "Detectei que esta feature
tem/não tem frontend implementado — está correto?".

- **"Sem frontend":** não crie `docs/tests/<slug>.md`. Registre a decisão — se
  existir `docs/tasks/<slug>.md`, anote lá `Testes visuais: N/A — sem frontend`;
  senão, mencione só no resumo final. **Pare aqui.**
- **"Com frontend":** continue.

## Passo 3 — Gerar o roteiro de teste manual

Para cada `AC-XX` da spec que tenha manifestação visual — ou, no modo isolado,
para cada fluxo/tela levantado na entrevista — gere um passo a passo objetivo e
verificável: pré-condição, ação do usuário, resultado esperado observável na
tela. Agrupe por fluxo/tela quando fizer sentido. Reaproveite a rastreabilidade
`AC-XX` já estabelecida nas etapas anteriores quando houver.

Um bom item de roteiro é conferível por qualquer pessoa sem contexto do código:
evite "verifique que o estado está correto"; prefira "o botão *Salvar* fica
desabilitado e aparece o texto *Campo obrigatório* abaixo do e-mail".

## Passo 4 — Salvar

Crie `docs/tests/` se não existir. Salve em `docs/tests/<slug>.md`:

```markdown
# Testes visuais: <nome da feature>

**Status:** rascunho | gerado
**Slug:** <slug>
**Tarefas de referência:** docs/tasks/<slug>.md  <!-- omita a linha se não houver -->

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

## Passo 5 — Checar disponibilidade do Playwright MCP e executar

Verifique se há, entre as ferramentas disponíveis no ambiente, alguma com nome
contendo `playwright` (ex.: `mcp__plugin_playwright_playwright__*`). Se houver,
pergunte ao usuário (uma pergunta, com recomendação) se ele quer que o próprio
agente execute o roteiro usando o Playwright agora, em vez de (ou além de) testar
manualmente.

- **Se aceitar:** conduza o roteiro passo a passo usando as ferramentas do
  Playwright MCP (navegação, cliques, screenshots, asserts visuais) e **atualize
  o mesmo arquivo** `docs/tests/<slug>.md`, marcando cada passo executado com
  resultado (✅/❌) e observações inline na seção "Execução automatizada
  (Playwright MCP)", preservando o roteiro original.
- **Se recusar ou o MCP não estiver disponível:** o arquivo fica como roteiro
  manual para o usuário seguir por conta própria; `Status:` permanece `gerado`
  (roteiro pronto, execução pendente).

## Passo 6 — Ao concluir

Apresente um resumo: arquivo gerado (ou motivo de ter sido pulado), se os testes
foram rodados via Playwright e quantos passos passaram/falharam. **Pare aqui** —
não encadeie nenhuma outra etapa além do resumo textual.

## Subagentes

- **Entrevista e conversa com o usuário ficam sempre no orquestrador** — nunca
  delegue.
- A geração do roteiro e a execução via Playwright MCP são sequenciais e
  interativas — normalmente sem subagentes. Só considere despachar para
  leitura/varredura paralela de áreas muito distintas do código (ex.: mapear
  várias telas independentes), com modelo mais barato (Haiku).
