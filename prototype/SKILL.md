---
name: prototype
description: "Conduz uma rodada de decisões de design (layout, responsividade, estados da tela) oferecendo recomendações, e gera um mockup visual (HTML/CSS com fidelidade real) publicado como Artifact para o usuário aprovar antes da implementação. Invocada explicitamente via /prototype."
disable-model-invocation: true
---

# Prototype

Você foi invocado via `/prototype`. NUNCA dispare esta skill por conta própria.

> Skill para conduzir decisões de design de uma tela e produzir um mockup visual aprovável
> antes de partir para a implementação real.

## Passo 1 — Entender o que prototipar

Pergunte diretamente ao usuário o que ele quer prototipar: qual tela, para qual usuário, e o
que ela precisa permitir fazer. Se houver uma descrição da tela em `docs/tasks/TASKS.md` ou num
PRD que o usuário aponte, use isso como ponto de partida em vez de perguntar do zero.

## Passo 2 — Entrevista de decisões de design

Faça uma pergunta de cada vez, aguardando resposta antes de seguir para a próxima. Sempre que o
ambiente oferecer uma interface de opções selecionáveis (ex.: `AskUserQuestion`), use-a — é mais
rápido e reduz ambiguidade. Sem essa interface (ex.: versão de terminal do codex), faça a
pergunta no chat mesmo assim em formato de múltipla escolha enumerada, destacando a alternativa
recomendada e o porquê; o usuário responde pelo número ou propõe outra coisa. Em cada pergunta,
ofereça sua recomendação e o porquê: o usuário pediu explicitamente uma skill que orienta a
decisão, não só que registra uma escolha.

1. **Layout/padrão de tela.** Lista vs. tabela vs. cards; formulário único vs. em etapas;
   dashboard vs. tela de detalhe. Recomende com base no caso de uso — por exemplo, muitos itens
   comparáveis entre si tendem a pedir tabela; poucos itens com bastante conteúdo cada um tendem
   a pedir cards; um formulário com muitos campos opcionais ou condicionais tende a se beneficiar
   de etapas.
2. **Responsividade/plataforma alvo.** Mobile, desktop, ou os dois desde já. Quando o contexto
   não deixar claro, recomende com base no tipo de produto (ex.: uma ferramenta interna B2B
   usada em escritório pesa para desktop-first; um fluxo de consumo do dia a dia pesa para
   mobile-first).
3. **Estados da tela.** Além do caminho feliz (dados carregados normalmente), quais estados
   prototipar: vazio (sem dados ainda), carregando, erro, lista longa/paginação. Recomende cobrir
   pelo menos vazio e erro sempre que a tela envolver dados dinâmicos — é onde a maioria das
   telas reais falha visualmente por terem sido desenhadas só pensando no caminho feliz.

Se a resposta a uma pergunta já esclarecer uma pergunta seguinte, não pergunte de novo — confirme
o que você entendeu e siga.

## Passo 3 — Gerar o mockup como Artifact

Antes de escrever qualquer HTML, carregue a skill `artifact-design` — isso é um requisito do
próprio mecanismo de Artifact nesta sessão, não uma etapa opcional aqui.

Produza um mockup com fidelidade visual real: cores, tipografia e espaçamento coerentes entre
si, não um wireframe de caixas genéricas com labels. Represente cada estado decidido no Passo 2
dentro do mesmo Artifact (por exemplo, como seções ou abas navegáveis), para que o usuário
avalie todos de uma vez sem pedir um mockup por estado. Publique via `Artifact`.

Ao publicar, defina um `title` estável e curto para o Artifact — ele vira o nome do arquivo em
`docs/prototypes/` no Passo 5, e precisa continuar o mesmo em republicações.

## Passo 4 — Gate de aprovação

Mostre o Artifact ao usuário e pergunte se está aprovado ou se algo precisa mudar (cor,
densidade, um estado faltando, hierarquia de ações). Ajustes pequenos devem republicar o mesmo
Artifact (mesmo `file_path`, mesma URL) em vez de criar um novo a cada iteração. Só avance para
o Passo 5 depois de aprovação explícita — não assuma aprovação pelo silêncio.

## Passo 5 — Persistir o registro do protótipo

Só execute este passo **depois da aprovação explícita do Passo 4**. O registro vive no
repositório da aplicação, em `docs/prototypes/`:

- `docs/prototypes/INDEX.md` — índice em tabela: Tela | Arquivo | Data | Link do Artifact.
- `docs/prototypes/<slug>.md` — uma entrada por tela.

1. **Evitar duplicata.** Se `docs/prototypes/INDEX.md` existe, procure uma linha da mesma
   tela. Se existir, **edite** essa entrada (e republique o mesmo Artifact) em vez de criar
   arquivos novos.
2. **Criar/atualizar a entrada.** `docs/prototypes/<slug>.md` a partir do template abaixo. O
   slug é curto, em kebab-case, derivado da tela — ex.: `cadastro-de-fornecedores.md`,
   `dashboard-financeiro.md`. Preencha as decisões com o que foi definido nos Passos 1–2 e
   inclua a URL do Artifact aprovado.
3. **Atualizar o índice.** Adicione ou atualize a linha no `INDEX.md` (crie o arquivo se não
   existir). Faça isso na mesma leva de edições — não deixe para depois.
4. **Devolver o controle.** Entregue ao usuário o caminho do markdown criado e o link do
   Artifact, para usar como referência visual na implementação da tela.

Não crie nem edite arquivos de tarefas (`docs/tasks/*`) — este passo só mexe em
`docs/prototypes/`.

### Template da entrada

```markdown
# Protótipo — <nome da tela>

- **Data:** AAAA-MM-DD
- **Artifact:** <URL do Artifact aprovado>
- **Público/uso:** <para qual usuário, o que a tela permite fazer>

## Decisões de design
- **Layout/padrão:** <escolha do Passo 2.1> — <porquê>
- **Responsividade/plataforma:** <escolha do Passo 2.2>
- **Estados prototipados:** <ex.: caminho feliz, vazio, erro>

## Notas de implementação
Pontos que a implementação da tela deve respeitar (hierarquia de ações, densidade,
componentes, comportamento por estado).
```
