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
| [`diy`](./diy/) | Fluxo completo ponta a ponta em **um único comando e um único documento** (`docs/diy/<slug>.md`): formular a ideia → entrevista curta → plano → tarefas → implementação com acompanhamento → revisão de código. Versão enxuta e econômica em tokens das skills abaixo + `brainstorming`/`interview`/`create-tasks`/`audit`; para projetos grandes com rastreabilidade formal, use o pipeline `sdd-*`. |
| [`feature`](./feature/) | Fase 0: decompõe uma proposta de implementação em features distintas, cada uma pronta para iniciar o ciclo via `/sdd-spec <slug>`. |
| [`sdd-spec`](./sdd-spec/) | 1ª fase do workflow spec-anchored: especificação formal em notação EARS via entrevista guiada. |
| [`sdd-plan`](./sdd-plan/) | 2ª fase: deriva o plano técnico a partir de uma spec aprovada. |
| [`sdd-tasks`](./sdd-tasks/) | 3ª fase: decompõe o plano em tarefas atômicas e rastreáveis. |
| [`sdd-implement`](./sdd-implement/) | 4ª fase: implementa as tarefas aprovadas em loop de TDD. |
| [`sdd-audit`](./sdd-audit/) | 5ª e última fase: auditoria independente de rastreabilidade e gate final de merge. |

### Skills de apoio

Reutilizadas pelos workflows acima, mas também podem ser invocadas diretamente.

| Skill | Descrição |
|---|---|
| [`brainstorming`](./brainstorming/) | Conduz uma sessão de brainstorming de produto/solução a partir de um tema e gera um pitch em `docs/brainstorming/`. |
| [`interview`](./interview/) | Conduz uma entrevista de levantamento de requisitos e gera `docs/interview/PRD.md`. |
| [`create-tasks`](./create-tasks/) | Decompõe requisitos — de um PRD (`docs/interview/PRD.md`, ou `PRD.md` na raiz) ou de uma descrição passada no comando — em uma lista sequencial de tarefas verificáveis com checkbox markdown, salva em `docs/tasks/TASKS.md`. Só decompõe; a implementação e a marcação das checkboxes acontecem em outra sessão. |
| [`implement-tdd`](./implement-tdd/) | Implementa uma lista de tarefas já decomposta (`docs/tasks/TASKS.md` do `/create-tasks`, outro arquivo, ou tarefas coladas no comando) com TDD red-green-refactor, um ciclo por tarefa. Roda a suíte de testes a cada ciclo e marca as checkboxes; não commita. |
| [`audit`](./audit/) | Revisa código (bugs, performance, simplificação) e registra os achados aprovados como issues com checkbox em `docs/tasks/ISSUES.md`, para serem resolvidas numa sessão de implementação; funciona standalone. |
| [`prototype`](./prototype/) | Conduz decisões de design e gera um mockup visual como Artifact para aprovação antes da implementação de uma tela; após aprovado, registra o protótipo em `docs/prototypes/<slug>.md` + `INDEX.md`. |

### Design systems

| Skill | Descrição |
|---|---|
| [`vilt-design-system`](./vilt-design-system/) | Padrões técnicos e de layout para sistemas Vue + Inertia + Laravel + Tailwind (PrimeVue/PrimeIcons), arquitetura Controller→Service→Repository e tema claro/escuro. |

### Utilitários de projeto

| Skill | Descrição |
|---|---|
| [`onboarding`](./onboarding/) | Mapeia o estado de um projeto herdado/existente e gera `docs/onboarding/ONBOARDING.md`. |
| [`knowledge-base`](./knowledge-base/) | Acervo consultável de armadilhas já resolvidas no projeto (`docs/knowledge/` + `INDEX.md`). Auto-dispara para consultar antes de brigar com um erro obscuro/recorrente e para registrar problema + causa + solução depois de resolver algo não-óbvio. |
| [`better-init`](./better-init/) | Gera um `AGENTS.md` conciso e agnóstico de agente, com `CLAUDE.md` linkado a ele (symlink no Unix, hard link no Windows) em vez de duplicado. |
| [`scaffold`](./scaffold/) | Entrevista sobre stack, configs iniciais e skills deste repositório a linkar, e cria a fundação de um projeto novo (estrutura, scaffolder da stack, `git init`, deps, symlinks de skills). |
