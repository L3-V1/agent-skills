---
name: better-init
description: "Gera ou normaliza a documentação de contexto do projeto para agentes de IA: cria um AGENTS.md conciso (visão geral, stack, convenções, docs auxiliares, comandos de setup/execução) mais um bloco fixo com o fluxo de desenvolvimento SDD e as regras de conduta obrigatórias para agentes, e garante que CLAUDE.md seja um link para ele, não um arquivo duplicado. Invocada explicitamente pelo usuário via /better-init."
disable-model-invocation: true
---

# Better Init

Você foi invocado via `/better-init`. NUNCA dispare esta skill por conta própria.

> Versão enxuta e agnóstica de agente do `/init`: em vez de gerar um `CLAUDE.md` acoplado só ao
> Claude, esta skill mantém `AGENTS.md` como fonte única de verdade e `CLAUDE.md` como um link para
> ele — assim o mesmo arquivo serve qualquer agente de IA que rode no projeto.

## Regra de ouro

O conteúdo gerado entra no contexto de toda sessão de agente neste projeto — cada linha tem custo.
Mantenha `AGENTS.md` curto e denso. Prefira referenciar documentação já existente no projeto
(`docs/`, `CONTRIBUTING.md`, `ARCHITECTURE.md`, READMEs de subpastas) a duplicar o conteúdo dela.

## Passo 1 — Diagnosticar o estado atual

Antes de escrever qualquer coisa, cheque o que já existe na raiz do projeto:

- **Nada existe** (`nem AGENTS.md nem CLAUDE.md`) → siga direto para o Passo 2.
- **`AGENTS.md` existe e `CLAUDE.md` já é um link válido apontando para ele** (confira com
  `readlink CLAUDE.md` no Unix, ou verificando o atributo de reparse point/hard link no Windows) →
  a estrutura já está correta. Releia `AGENTS.md` e siga para o Passo 2 só para confirmar que o
  conteúdo ainda reflete o projeto atual; se estiver desatualizado, regenere.
- **Qualquer outra combinação** — só `CLAUDE.md` existe como arquivo real, os dois existem como
  arquivos reais com conteúdo divergente, ou `CLAUDE.md` é um link quebrado/aponta para outro lugar
  — trate como fora do padrão. A política aqui é reescrever do zero, não tentar mesclar conteúdo
  antigo: gere um `AGENTS.md` novo a partir do estado atual do projeto (Passo 2) e refaça o link
  (Passo 4). Se havia conteúdo relevante em algum dos arquivos antigos, mencione brevemente ao
  usuário no resumo final o que foi substituído.

## Passo 2 — Levantar informações do projeto

Só inclua o que você conseguir observar de fato no repositório — não invente nada. Fontes típicas:

- **Visão geral**: nome e propósito do projeto — `README.md`, campo `description` de
  `package.json`/`pyproject.toml`/`go.mod`/`composer.json`, etc.
- **Stack técnica**: linguagem(ns), framework(s), gerenciador de pacotes — inferidos dos arquivos de
  manifesto (`package.json`, `requirements.txt`/`pyproject.toml`, `go.mod`, `Gemfile`,
  `composer.json`, `*.csproj`) e da árvore de diretórios.
- **Convenções de código**: linters/formatters configurados (`.eslintrc*`, `.prettierrc*`,
  `ruff.toml`, `.editorconfig`), padrões de nomenclatura observáveis, arquitetura de pastas se houver
  um padrão claro (ex. Controller→Service→Repository, feature folders).
- **Documentação adicional**: liste como referências os arquivos/pastas de doc já existentes
  (`docs/`, `CONTRIBUTING.md`, `ARCHITECTURE.md`, READMEs de subpastas) — não copie o conteúdo deles
  para dentro do `AGENTS.md`.
- **Comandos**: setup (instalar dependências) e execução (dev server, testes, build) — extraídos de
  `package.json` (`scripts`), `Makefile`, `docker-compose.yml`, ou do próprio `README.md`.

## Passo 3 — Escrever `AGENTS.md`

Use exatamente esta estrutura de seções, mantendo cada uma curta:

```markdown
# <Nome do projeto>

## Visão geral
<1-3 frases: o que o projeto faz e para quem>

## Stack técnica
<linguagem(ns), framework(s) principais, gerenciador de pacotes>

## Convenções de código
<padrões de nomenclatura, linters/formatters em uso, arquitetura de pastas se houver>

## Documentação adicional
<lista de links para docs/, CONTRIBUTING.md, ARCHITECTURE.md, etc. — se existirem>

## Comandos
<setup e execução: instalar deps, rodar em dev, rodar testes, build>

## Metodologia de Desenvolvimento

O desenvolvimento segue um fluxo spec-anchored (SDD): cada etapa produz um artefato versionado
que ancora a etapa seguinte. Não pule etapas nem comece a implementar sem os artefatos anteriores
aprovados pelo usuário.

1. **Constituição** — `docs/constitution/<slug-do-projeto>.md`
   Documento de fundação do projeto: propósito, princípios inegociáveis e decomposição em
   features distintas. É a referência de escopo de mais alto nível.
2. **Especificações** — `docs/specs/<slug-da-feature>.md`
   Especificação formal de uma feature: problema, público, escopo (dentro/fora), restrições e
   critérios de aceite observáveis. Uma spec por feature.
3. **Planejamento** — `docs/plans/<slug-da-feature>.md`
   Plano técnico derivado da spec aprovada: abordagem, arquivos afetados, decisões de design,
   riscos. Não introduz requisitos novos — apenas o "como" do que a spec definiu.
4. **Tarefas** — `docs/tasks/<slug-da-feature>.md`
   Decomposição do plano em tarefas atômicas e verificáveis, rastreáveis aos critérios de aceite
   da spec.
5. **Implementação (TDD)** — `docs/tasks/<slug-da-feature>.md` (atualiza o progresso)
   Implementação em ciclos red-green-refactor, uma tarefa por vez, marcando o progresso no
   próprio arquivo de tarefas. A suíte de testes roda a cada ciclo.

## Regras de Conduta

Obrigatórias para qualquer agente de IA que trabalhe neste projeto:

- **NÃO amplie o escopo do projeto silenciosamente.** Qualquer mudança fora do que foi
  explicitamente pedido precisa ser levantada com o usuário antes.
- **NÃO invente requisitos novos.** Se um requisito não está na spec ou nas instruções do
  usuário, ele não existe — pergunte.
- **NÃO tome decisões de produto ou arquitetura por conta própria.** Apresente as alternativas
  e a recomendação; a decisão é do usuário.
- **SEMPRE faça perguntas ao usuário** quando identificar lacunas nas instruções, ambiguidade
  de escopo, ou quando surgirem dúvidas durante a execução. Preferir perguntar a assumir.
```

Omita uma seção inteira se não houver nada real para preencher nela (ex. projeto sem docs
auxiliares) — não deixe cabeçalhos vazios. **Exceção:** `## Metodologia de Desenvolvimento` e
`## Regras de Conduta` são fixas — sempre inclua as duas na íntegra, com o texto literal acima,
sem adaptar ao projeto. A regra de omissão vale só para as cinco seções descritivas (Visão
geral, Stack técnica, Convenções de código, Documentação adicional, Comandos).

## Passo 4 — Criar o link `CLAUDE.md` → `AGENTS.md`

Detecte o sistema operacional antes de escolher o comando:

- **Unix (Linux/macOS)**: `ln -sf AGENTS.md CLAUDE.md` (symlink relativo, funciona nos dois SOs
  Unix).
- **Windows**: **não use Junction** (`mklink /J`) — Junctions só funcionam para diretórios, não para
  um arquivo como `CLAUDE.md`. Use um **hard link**: `cmd /c mklink /H CLAUDE.md AGENTS.md`. Hard
  link não exige privilégio de administrador nem Developer Mode ativado (diferente do symbolic link
  normal do Windows), e como os dois arquivos ficam na raiz do mesmo projeto (mesmo volume), a
  limitação de hard links de não cruzar volumes não é um problema aqui.

Se já havia um `CLAUDE.md` como arquivo real (Passo 1 classificou como fora do padrão), remova-o
antes de criar o link.

**Se o comando de link falhar** (permissão negada, sistema de arquivos sem suporte, etc.): avise o
usuário explicitamente que não foi possível criar o link, e então copie o conteúdo de `AGENTS.md`
para um `CLAUDE.md` real como fallback — para não deixar os dois arquivos ausentes ou vazios. Deixe
claro nesse aviso que os dois arquivos podem divergir no futuro já que não estão mais linkados.

## Passo 5 — Resumo final

Informe ao usuário, de forma objetiva:

- Se `AGENTS.md` foi criado do zero ou regenerado (e por quê, se havia algo fora do padrão antes).
- Se o link `CLAUDE.md` foi criado normalmente ou se caiu no fallback de cópia.
- Um resumo curto do conteúdo final do `AGENTS.md` (as seções preenchidas).
- Que o `AGENTS.md` inclui o bloco fixo `## Metodologia de Desenvolvimento` (fluxo SDD) e
  `## Regras de Conduta` — boilerplate que o usuário pode editar se o projeto usar outra
  convenção de caminhos/etapas.
