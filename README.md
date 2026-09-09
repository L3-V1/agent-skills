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

### Preparação

| Skill | Descrição |
|---|---|
| [`blueprint`](./blueprint/) | **Fase 0 (opcional), em 3 etapas independentes.** **Projeto** — a partir de um tema ou ideia vaga, explora ideias de software, converge para um único projeto e gera uma descrição completa em `docs/blueprint/PROJECT.md`. **Arquitetura** — entrevista sobre stack técnica, padrões arquiteturais e convenções de código → `docs/blueprint/ARCHITECTURE.md`. **Design** — monta o design system do projeto (entrevista do zero, análise da codebase ou referências externas) → `docs/blueprint/DESIGN.md`. Alimenta o `/setup-project` e o `/constitute`, que pulam perguntas já respondidas. |
| [`setup-project`](./setup-project/) | Gera um único arquivo de contexto para agentes de IA — `AGENTS.md` ou `CLAUDE.md`, à escolha do usuário — com visão geral, stack, convenções, docs e comandos; mediante confirmação, inclui também um mapa de onde ficam os artefatos de cada etapa e as regras de conduta obrigatórias para agentes. Pode conduzir a 1ª fase do fluxo SDD (constituição) na mesma execução. |

### Workflow de desenvolvimento

O fluxo spec-anchored (SDD) é cinco fases, cada uma numa skill própria: `constitute` →
`specify` → `plan` → `to-tasks` → `to-tdd`. Cada fase gera um artefato versionado em `docs/`
que é um gate para revisão do usuário e ancora a fase seguinte — mas **cada skill roda
isolada** também, se o usuário fornecer o contexto necessário (ou deixar a skill levantá-lo).
As skills não se encadeiam sozinhas nem se referenciam entre si.

| Skill | Descrição |
|---|---|
| [`constitute`](./constitute/) | **Fase 1 — Constituição.** Entrevista técnica de levantamento de requisitos e decomposição do projeto em features distintas → `docs/constitution/<slug-do-projeto>.md` (propósito, princípios inegociáveis, features com dependências). Consome `docs/blueprint/PROJECT.md` e `docs/blueprint/ARCHITECTURE.md` se existirem. |
| [`specify`](./specify/) | **Fase 2 — Especificação.** Define **o QUÊ** será implementado numa feature — problema, escopo, restrições e critérios de aceite observáveis em EARS (`AC-XX`) → `docs/specs/<slug-da-feature>.md`. |
| [`plan`](./plan/) | **Fase 3 — Planejamento.** Define **o COMO** — pontos de integração, decisões de arquitetura, impacto em dados, riscos — derivado da spec e rastreado aos `AC-XX` → `docs/plans/<slug-da-feature>.md`. |
| [`to-tasks`](./to-tasks/) | **Fase 4 — Tarefas.** Decompõe o plano em tarefas atômicas verificáveis (`T-XX`), com dependências, complexidade e grupos paralelizáveis, rastreadas aos `AC-XX` → `docs/tasks/<slug-da-feature>.md`. |
| [`to-tdd`](./to-tdd/) | **Fase 5 — Implementação.** Implementa as tarefas em TDD (RED → GREEN → REFACTOR), roda a suíte a cada ciclo e marca o progresso no arquivo de tarefas (`- [x]`). Critérios com manifestação visual podem usar testes de navegador via Playwright MCP quando disponível. |

### Utilitários de projeto

| Skill | Descrição |
|---|---|
| [`help`](./help/) | Guia de uso das skills deste repositório: explica o fluxo SDD, qual skill usar em cada situação, a ordem entre elas e onde ficam os artefatos gerados. Não gera nem edita arquivos. |
| [`knowledge-base`](./knowledge-base/) | Acervo consultável de armadilhas já resolvidas no projeto (`docs/knowledge/` + `INDEX.md`). Auto-dispara para consultar antes de brigar com um erro obscuro/recorrente e para registrar problema + causa + solução depois de resolver algo não-óbvio. |
