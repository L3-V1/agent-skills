# Skills

Coleção pessoal de skills do [Claude Code](https://claude.com/claude-code), mantida como fonte única de verdade e reaproveitada conforme novos projetos são criados.

## O que é uma skill aqui

Cada skill é uma pasta contendo um `SKILL.md` com frontmatter YAML:

```yaml
---
name: nome-da-skill
description: "Quando e por que usar esta skill — usado pelo modelo para decidir se deve invocá-la automaticamente."
disable-model-invocation: true # opcional
---
```

- `name` — identificador da skill, deve bater com o nome da pasta.
- `description` — usada pelo Claude Code para decidir, a partir do contexto da conversa, quando disparar a skill automaticamente.
- `disable-model-invocation: true` — impede o disparo automático por descrição; a skill só é executada quando invocada explicitamente pelo usuário (via comando).

A pasta `_shared/` **não é uma skill** (não tem `SKILL.md`): é material comum — templates de artefato, roteiros de entrevista, tabela EARS — referenciado pelas skills de fase do fluxo SDD por caminho relativo (`../_shared/sdd/...`).

## Como usar em um novo projeto

Clone este repositório e crie um symlink das skills para o diretório de skills do Claude Code:

```bash
git clone <url-deste-repositorio> ~/.agents/skills
ln -s ~/.agents/skills/* ~/.claude/skills/
```

Depois de criar ou atualizar os symlinks, rode `/reload-skills` no Claude Code para que as skills sejam reconhecidas.

## Skills disponíveis

### Workflow de desenvolvimento

O fluxo spec-anchored (SDD) é cinco fases, cada uma numa skill própria: `constitute` →
`specify` → `plan` → `to-tasks` → `to-tdd`. Cada fase gera um artefato versionado em `docs/`
que é um gate para revisão do usuário e ancora a fase seguinte — mas **cada skill roda
isolada** também, se o usuário fornecer o contexto necessário (ou deixar a skill levantá-lo).
As skills não se encadeiam sozinhas nem se referenciam entre si.

| Skill | Descrição |
|---|---|
| [`brainstorming`](./brainstorming/) | Fase 0 (pré-constituição, opcional) do SDD: a partir de um tema ou ideia vaga, explora ideias de software, converge para um único projeto e gera uma **descrição completa do projeto** em `docs/brainstorming/PROJECT.md` (nome fixo — o slug só é definido na constituição). Alimenta o `/init-dev` ou o `/constitute`, que pula as perguntas já respondidas. Consulta `references/tecnicas.md` (SCAMPER, HMW, inversão, analogias) quando o tema pede mais profundidade. |
| [`constitute`](./constitute/) | **Fase 1 — Constituição.** Entrevista técnica de levantamento de requisitos e decomposição do projeto em features distintas → `docs/constitution/<slug-do-projeto>.md` (propósito, princípios inegociáveis, features com dependências). Consome `docs/brainstorming/PROJECT.md` se existir. |
| [`specify`](./specify/) | **Fase 2 — Especificação.** Define **o QUÊ** será implementado numa feature — problema, escopo, restrições e critérios de aceite observáveis em EARS (`AC-XX`) → `docs/specs/<slug-da-feature>.md`. |
| [`plan`](./plan/) | **Fase 3 — Planejamento.** Define **o COMO** — pontos de integração, decisões de arquitetura, impacto em dados, riscos — derivado da spec e rastreado aos `AC-XX` → `docs/plans/<slug-da-feature>.md`. |
| [`to-tasks`](./to-tasks/) | **Fase 4 — Tarefas.** Decompõe o plano em tarefas atômicas verificáveis (`T-XX`), com dependências, complexidade e grupos paralelizáveis, rastreadas aos `AC-XX` → `docs/tasks/<slug-da-feature>.md`. |
| [`to-tdd`](./to-tdd/) | **Fase 5 — Implementação.** Implementa as tarefas em TDD (RED → GREEN → REFACTOR), roda a suíte a cada ciclo e marca o progresso no arquivo de tarefas (`- [x]`). Não usa o Playwright MCP. |
| [`test-guide`](./test-guide/) | Elabora um roteiro de testes visuais de frontend (`docs/tests/<slug>.md`) — passo a passo verificável, rastreável aos critérios de aceite quando existirem — e, se o Playwright MCP estiver disponível, se oferece para executar o roteiro e anotar o resultado no mesmo arquivo. Funciona como passo opcional após a implementação ou isolada em qualquer projeto. |

### Utilitários de projeto

| Skill | Descrição |
|---|---|
| [`prototype`](./prototype/) | Conduz decisões de design e gera um mockup visual como Artifact para aprovação antes da implementação de uma tela; após aprovado, registra o protótipo em `docs/prototypes/<slug>.md` + `INDEX.md`. |
| [`create-design-system`](./create-design-system/) | Monta o design system do projeto e o registra em `docs/ui/DESIGN.md` (template fixo: tokens, layout, arquitetura de tela, componentes, interação, acessibilidade, tema) — documento único consultável por agentes de IA. Escolhe uma de três abordagens por execução: entrevista do zero, análise da codebase, ou referências externas. |
| [`onboarding`](./onboarding/) | Mapeia o estado de um projeto herdado/existente e gera `docs/onboarding/ONBOARDING.md`. |
| [`knowledge-base`](./knowledge-base/) | Acervo consultável de armadilhas já resolvidas no projeto (`docs/knowledge/` + `INDEX.md`). Auto-dispara para consultar antes de brigar com um erro obscuro/recorrente e para registrar problema + causa + solução depois de resolver algo não-óbvio. |
| [`init-dev`](./init-dev/) | Gera um `AGENTS.md` conciso e agnóstico de agente (mais blocos fixos com o fluxo SDD, um mapa de onde ficam os artefatos de cada etapa e as regras de conduta obrigatórias para agentes), com `CLAUDE.md` linkado a ele (symlink no Unix, hard link no Windows) em vez de duplicado. Pode conduzir a 1ª fase do fluxo SDD (constituição) na mesma execução. |
| [`scaffold`](./scaffold/) | Entrevista sobre stack, configs iniciais e skills deste repositório a linkar, e cria a fundação de um projeto novo (estrutura, scaffolder da stack, `git init`, deps, symlinks de skills). |
