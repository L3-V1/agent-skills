---
name: onboarding
description: "Use esta skill sempre que o usuário assumir, herdar ou pedir ajuda para se situar em um projeto em andamento que não foi iniciado por ele — por exemplo \"acabei de assumir esse projeto\" ou \"esse código não é meu, me ajuda a entender o estado atual\" — e em qualquer pedido de mapear pendências, funcionalidades implementadas ou estado geral de um repositório existente antes de continuar o desenvolvimento. Também use para gerar ou atualizar um ONBOARDING.md."
---

# Onboarding

Skill para fazer o levantamento de um projeto assumido no meio do desenvolvimento (código legado, repositório herdado, projeto de outra pessoa/equipe) e transformar esse levantamento em um artefato:

- **`docs/onboarding/ONBOARDING.md`** — o levantamento completo, bruto e detalhado.

## Quando usar

Use esta skill quando o usuário estiver claramente "entrando" em um projeto que não começou do zero com ele: assumir manutenção, dar continuidade, fazer handover, revisar um projeto abandonado, etc. Não use para projetos que o próprio usuário está iniciando agora, nem para tarefas pontuais de código que não pedem contexto do projeto inteiro.

## Fluxo de trabalho

### Passo 1 — Levantamento (survey)

Antes de escrever qualquer arquivo, explore o repositório de forma sistemática. Use `Bash`, `Read` e `Grep` — nunca invente informação que não foi verificada no repositório.

**a) Estrutura e código**
- Liste a árvore do projeto (`view` no diretório raiz, 2 níveis) para entender a organização geral.
- Identifique stack, linguagem(ns) predominante(s), frameworks e gerenciador de dependências (`package.json`, `pyproject.toml`, `go.mod`, `pom.xml`, `Cargo.toml`, etc).
- Rode buscas por marcadores de pendência: `grep -rn "TODO\|FIXME\|XXX\|HACK" --include=*.{ext}` nas extensões relevantes do projeto.
- Identifique pontos de entrada, módulos principais e áreas que parecem incompletas (stubs, funções vazias, código comentado em bloco).

**b) Documentação existente**
- Leia `README.md`, `CHANGELOG.md`, `CONTRIBUTING.md`, arquivos em `docs/`, e qualquer `ROADMAP.md` ou similar.
- Note divergências entre o que a documentação promete e o que o código realmente entrega — isso é sinal de pendência ou de doc desatualizada.

**c) Histórico do git**
- `git log --oneline -n 100` para visão geral recente; `git log --stat` ou `git log -p` em trechos específicos quando precisar entender uma mudança.
- `git log --all --graph --oneline` para visualizar branches e possíveis trabalhos em andamento não mesclados.
- `git branch -a` para listar branches remotas/locais — branches ativas fora de main/master costumam indicar trabalho incompleto.
- `git shortlog -sn` para entender quem contribuiu e a distribuição de autoria.
- Preste atenção a mensagens de commit que referenciem tickets/issues (ex: `#123`, `JIRA-456`, `fixes`, `closes`, `wip`, `revert`) — são pistas de pendências e de rastreadores externos usados pelo projeto.

**d) Issues/tickets referenciados**
- Se houver arquivos de configuração de rastreadores (`.github/ISSUE_TEMPLATE`, arquivos `.md` com listas de tarefas, links para Jira/Linear/Trello em docs ou commits), registre essas referências e o que puderem indicar sobre pendências — sem inventar conteúdo de tickets que não estão acessíveis no repositório.
- Busque por checklists inacabados (`- [ ]` em arquivos markdown) como sinal direto de pendência.

**e) Testes**
- Localize a suíte de testes e identifique o framework usado.
- Rode a suíte se for rápido e seguro fazê-lo (sem efeitos colaterais destrutivos); caso contrário, ao menos mapeie quais módulos têm testes e quais não têm, pela estrutura de diretórios.
- Se houver relatório de cobertura configurado, rode e capture o número; se não houver, seja explícito no `ONBOARDING.md` que a cobertura é desconhecida — não estime.

Ao final do levantamento, você deve ter material suficiente para responder: *o que este projeto faz, o que já está pronto, o que está pela metade, o que está quebrado ou arriscado, e o que muito provavelmente falta fazer.*

### Passo 2 — Escrever o `ONBOARDING.md`

Crie (ou sobrescreva, avisando o usuário) o arquivo `docs/onboarding/ONBOARDING.md` com o levantamento completo. Crie a pasta `docs/onboarding/` se ela ainda não existir.

A estrutura é **flexível** — adapte as seções ao que o projeto realmente tem. Não force seções vazias. Como ponto de partida, considere algo como:

```markdown
# Onboarding — <nome do projeto>

> Levantamento gerado em <data>. Ponto de partida para quem está assumindo este projeto.

## Visão geral
O que o projeto faz, stack principal, como rodar localmente.

## Estado atual
Funcionalidades já implementadas e funcionando (com base no código verificado).

## Pendências identificadas
TODOs, FIXMEs, checklists inacabados, branches não mescladas, divergências entre docs e código.

## Histórico relevante
Principais marcos do git log, contribuidores, branches em aberto que merecem atenção.

## Testes e qualidade
O que está coberto por testes, o que não está, se a suíte passa.

## Riscos e áreas de atenção
Partes do código frágeis, gambiarras conhecidas, dívida técnica aparente.

## Próximos passos sugeridos
Uma lista pragmática do que provavelmente precisa ser feito a seguir, com base em tudo acima.
```

Regras importantes:
- **Só afirme o que foi verificado.** Se algo é incerto (ex: "parece que X não está terminado"), sinalize a incerteza — não apresente suposição como fato.
- Cite trechos de código, nomes de arquivo e hashes de commit relevantes para dar rastreabilidade a cada afirmação.
- Escreva no **idioma predominante do repositório** (olhe comentários no código, docs e mensagens de commit para decidir — se o projeto for majoritariamente em inglês, escreva em inglês; se for majoritariamente em português, escreva em português).

### Passo 3 — Reportar ao usuário

Ao final, resuma para o usuário em poucas frases (não repita o conteúdo inteiro do arquivo):
- O que foi encontrado de mais importante (2-4 pontos de maior destaque: pendências críticas, riscos, o que está mais maduro).
- Que o `docs/onboarding/ONBOARDING.md` foi criado/alterado.
- Se algo não pôde ser verificado (ex: testes não rodaram, tickets externos não acessíveis), avise explicitamente.