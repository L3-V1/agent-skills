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
| [`brainstorming`](./brainstorming/) | Fase 0 (pré-constituição, opcional) do SDD: a partir de um tema ou ideia vaga, explora ideias de software, converge para um único projeto e gera uma **descrição completa do projeto** em `docs/brainstorming/PROJECT.md` (nome fixo — o slug só é definido na constituição). Alimenta o `/init-dev` ou a constituição do `/sdd`, que pula as perguntas já respondidas. Consulta `references/tecnicas.md` (SCAMPER, HMW, inversão, analogias) quando o tema pede mais profundidade. |
| [`sdd`](./sdd/) | Conduz o fluxo spec-anchored (SDD) completo de uma feature, ponta a ponta, numa única skill: **constituição** (`docs/constitution/<slug>.md`, decompõe o projeto em features) → **especificação** em EARS (`docs/specs/<slug>.md`) → **plano técnico** (`docs/plans/<slug>.md`) → **tarefas atômicas** (`docs/tasks/<slug>.md`) → **implementação em TDD** (atualiza o progresso no arquivo de tarefas). Ao ser invocada, avalia o estado atual do projeto e retoma da etapa pendente. Cada etapa que gera artefato é um gate para revisão do usuário. Testes visuais de frontend são um passo opcional separado — ver `/test-guide`. |
| [`test-guide`](./test-guide/) | Elabora um roteiro de testes visuais de frontend (`docs/tests/<slug>.md`) — passo a passo verificável, rastreável aos critérios de aceite quando existirem — e, se o Playwright MCP estiver disponível, se oferece para executar o roteiro e anotar o resultado no mesmo arquivo. Funciona como sequência opcional do `/sdd` ou isolada em qualquer projeto. |

### Utilitários de projeto

| Skill | Descrição |
|---|---|
| [`prototype`](./prototype/) | Conduz decisões de design e gera um mockup visual como Artifact para aprovação antes da implementação de uma tela; após aprovado, registra o protótipo em `docs/prototypes/<slug>.md` + `INDEX.md`. |
| [`create-design-system`](./create-design-system/) | Monta o design system do projeto e o registra em `docs/ui/DESIGN.md` (template fixo: tokens, layout, arquitetura de tela, componentes, interação, acessibilidade, tema) — documento único consultável por agentes de IA. Escolhe uma de três abordagens por execução: entrevista do zero, análise da codebase, ou referências externas. |
| [`onboarding`](./onboarding/) | Mapeia o estado de um projeto herdado/existente e gera `docs/onboarding/ONBOARDING.md`. |
| [`knowledge-base`](./knowledge-base/) | Acervo consultável de armadilhas já resolvidas no projeto (`docs/knowledge/` + `INDEX.md`). Auto-dispara para consultar antes de brigar com um erro obscuro/recorrente e para registrar problema + causa + solução depois de resolver algo não-óbvio. |
| [`init-dev`](./init-dev/) | Gera um `AGENTS.md` conciso e agnóstico de agente (mais blocos fixos com o fluxo SDD, um mapa de onde ficam os artefatos de cada etapa e as regras de conduta obrigatórias para agentes), com `CLAUDE.md` linkado a ele (symlink no Unix, hard link no Windows) em vez de duplicado. Pode encadear a 1ª etapa do `/sdd` (constituição). |
| [`scaffold`](./scaffold/) | Entrevista sobre stack, configs iniciais e skills deste repositório a linkar, e cria a fundação de um projeto novo (estrutura, scaffolder da stack, `git init`, deps, symlinks de skills). |
