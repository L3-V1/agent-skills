# Templates de artefato — fluxo spec-anchored

> Material compartilhado das skills de fase. Não é uma skill. Os quatro templates abaixo
> são a fonte única de verdade do formato dos artefatos em `docs/` — mantê-los idênticos
> entre as skills que os produzem.

Cada feature tem um **ID sequencial de 2 dígitos com zero à esquerda** (`01`, `02`, …),
atribuído na constituição (Fase 1) pela ordem em que a feature aparece na seção
"Features". Esse ID prefixa o nome do arquivo da feature em **todas as fases**, no
formato `NN-<slug>`: `docs/specs/02-checkout.md`, `docs/plans/02-checkout.md` e
`docs/tasks/02-checkout.md` referem-se todos à feature `checkout` (ID `02`, slug
`checkout`). O ID é estável — uma vez atribuído não muda, e IDs de features removidas
não são reaproveitados (gaps são permitidos). Quando uma fase roda isolada, sem
constituição, o ID vem da varredura da pasta `docs/` daquela fase (ver
`interview-specify.md`).

---

## Constituição → `docs/constitution/<slug-do-projeto>.md`

```markdown
# Constituição: <nome do projeto>

## Propósito
<1-3 frases: o que o projeto entrega e para quem>

## Princípios inegociáveis
- <decisões e restrições que nenhuma feature pode violar>

## Features
<!-- O número de cada feature é o ID dela (2 dígitos, zero à esquerda), na ordem de
     listagem. Ele prefixa os arquivos de spec/plano/tarefas como `NN-<slug>`. IDs são
     estáveis e não reaproveitados: ao atualizar esta constituição, features novas
     recebem o próximo ID livre (maior ID atual + 1). Dependências ficam por slug. -->
### 01. <Nome da feature> (`slug-da-feature`)
<descrição>
**Depende de:** <slugs, ou "nenhuma">

## Próximos passos
Próxima etapa por feature: `/specify <NN-slug-da-feature>`
```

---

## Especificação (EARS) → `docs/specs/<NN-slug-da-feature>.md`

```markdown
# Spec: <nome da feature>

**Status:** rascunho | gerado
**ID:** <NN>
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

## Próximos passos
Próxima etapa: `/plan <NN-slug>` (o slug sozinho também é aceito)
```

---

## Plano técnico → `docs/plans/<NN-slug-da-feature>.md`

```markdown
# Plano técnico: <nome da feature>

**Status:** rascunho | gerado
**ID:** <NN>
**Slug:** <slug>
**Spec de referência:** docs/specs/<NN-slug>.md

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

## Conformidade com o design
<Se a feature não tem superfície visual: "> sem superfície visual" e nada mais.
Caso contrário, referencie docs/blueprint/DESIGN.md:>
- Tokens aplicáveis: <cores/tipografia/espaçamento/raio — nomes reais da seção 2>
- Padrões de tela: <listagem | detalhe | formulário — seção 3>
- Componentes-base: <nomes da seção 4; "novo componente" só se justificado aqui>
- Estados obrigatórios: vazio, carregando, erro, sem permissão (seção 5)

## Riscos e mitigação
- ...

## Fora do escopo deste plano
- ...

## Rastreabilidade
Este plano cobre os critérios: AC-01, AC-02, AC-03... (liste todos os AC-XX da spec e
marque se algum ainda não tem abordagem técnica definida).

## Próximos passos
Próxima etapa: `/to-tasks <NN-slug>`
```

---

## Tarefas → `docs/tasks/<NN-slug-da-feature>.md`

```markdown
# Tarefas: <nome da feature>

**Status:** rascunho | gerado
**ID:** <NN>
**Slug:** <slug>
**Plano de referência:** docs/plans/<NN-slug>.md
**Paralelização:** sim | não

<!-- Em tarefas de UI, "Pronto quando" inclui conformidade com docs/blueprint/DESIGN.md:
     ex. "teste de AC-03 passa e a tela usa os tokens/componentes do DESIGN.md
     (sem cor/medida fora da escala)". -->

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

## Próximos passos
Próxima etapa: `/to-tdd <NN-slug>`
```
