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

### Workflows de desenvolvimento

| Skill | Descrição |
|---|---|
| [`sdd-spec`](./sdd-spec/) | 1ª fase do workflow spec-anchored: especificação formal em notação EARS via entrevista guiada. |
| [`sdd-plan`](./sdd-plan/) | 2ª fase: deriva o plano técnico a partir de uma spec aprovada. |
| [`sdd-tasks`](./sdd-tasks/) | 3ª fase: decompõe o plano em tarefas atômicas e rastreáveis. |
| [`sdd-implement`](./sdd-implement/) | 4ª fase: implementa as tarefas aprovadas em loop de TDD. |
| [`sdd-audit`](./sdd-audit/) | 5ª e última fase: auditoria independente de rastreabilidade e gate final de merge. |

### Skills de apoio

Reutilizadas pelos workflows acima, mas também podem ser invocadas diretamente.

| Skill | Descrição |
|---|---|
| [`brainstorming`](./brainstorming/) | Conduz uma sessão de brainstorming de produto/solução a partir de um tema. |
| [`interview`](./interview/) | Conduz uma entrevista de levantamento de requisitos e gera um `PRD.md`. |
| [`kanban`](./kanban/) | Decompõe um `PRD.md` em tarefas verificáveis e gerencia a implementação com um board em `.kanban/board.md`. |

### Design systems

| Skill | Descrição |
|---|---|
| [`vilt-design-system`](./vilt-design-system/) | Padrões técnicos e de layout para sistemas Vue + Inertia + Laravel + Tailwind (PrimeVue/PrimeIcons), arquitetura Controller→Service→Repository e tema claro/escuro. |

### Utilitários de projeto

| Skill | Descrição |
|---|---|
| [`onboarding`](./onboarding/) | Mapeia o estado de um projeto herdado/existente e gera `ONBOARDING.md`. |
