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
- `disable-model-invocation: true` — impede o disparo automático por descrição; a skill só é executada quando invocada explicitamente pelo usuário (via comando) ou chamada por outra skill como parte de um fluxo já iniciado.

## Como usar em um novo projeto

Clone este repositório e crie um symlink das skills para o diretório de skills do Claude Code:

```bash
git clone <url-deste-repositorio> ~/.agents/skills
ln -s ~/.agents/skills/* ~/.claude/skills/
```

Depois de criar ou atualizar os symlinks, rode `/reload-skills` no Claude Code para que as skills sejam reconhecidas.

## Skills disponíveis

### Workflow de desenvolvimento

| Skill | Descrição |
|---|---|
| [`sdd`](./sdd/) | Conduz o fluxo spec-anchored (SDD) completo de uma feature, ponta a ponta, numa única skill: **constituição** (`docs/constitution/<slug>.md`, decompõe o projeto em features) → **especificação** em EARS (`docs/specs/<slug>.md`) → **plano técnico** (`docs/plans/<slug>.md`) → **tarefas atômicas** (`docs/tasks/<slug>.md`) → **implementação em TDD** (atualiza o progresso no arquivo de tarefas). Ao ser invocada, avalia o estado atual do projeto e retoma da etapa pendente. Cada etapa que gera artefato é um gate para revisão do usuário. |

### Utilitários de projeto

| Skill | Descrição |
|---|---|
| [`prototype`](./prototype/) | Conduz decisões de design e gera um mockup visual como Artifact para aprovação antes da implementação de uma tela; após aprovado, registra o protótipo em `docs/prototypes/<slug>.md` + `INDEX.md`. |
| [`onboarding`](./onboarding/) | Mapeia o estado de um projeto herdado/existente e gera `docs/onboarding/ONBOARDING.md`. |
| [`knowledge-base`](./knowledge-base/) | Acervo consultável de armadilhas já resolvidas no projeto (`docs/knowledge/` + `INDEX.md`). Auto-dispara para consultar antes de brigar com um erro obscuro/recorrente e para registrar problema + causa + solução depois de resolver algo não-óbvio. |
| [`init-dev`](./init-dev/) | Gera um `AGENTS.md` conciso e agnóstico de agente (mais um bloco fixo com o fluxo SDD e as regras de conduta obrigatórias para agentes), com `CLAUDE.md` linkado a ele (symlink no Unix, hard link no Windows) em vez de duplicado. Pode encadear a 1ª etapa do `/sdd` (constituição). |
| [`scaffold`](./scaffold/) | Entrevista sobre stack, configs iniciais e skills deste repositório a linkar, e cria a fundação de um projeto novo (estrutura, scaffolder da stack, `git init`, deps, symlinks de skills). |
