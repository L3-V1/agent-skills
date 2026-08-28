---
name: prototype
description: "Conduz uma rodada de decisões de design (layout, responsividade, estados da tela) oferecendo recomendações, e gera um mockup visual (HTML/CSS com fidelidade real) publicado como Artifact para o usuário aprovar antes da implementação. Invocada explicitamente via /prototype, tanto de forma avulsa quanto sugerida pelo /kanban ao iniciar uma tarefa de frontend."
disable-model-invocation: true
---

# Prototype

Você foi invocado via `/prototype`. NUNCA dispare esta skill por conta própria.

> Skill para conduzir decisões de design de uma tela e produzir um mockup visual aprovável
> antes de partir para a implementação real.

## Passo 1 — Detectar contexto de origem

- Se existir `.kanban/board.md` no projeto **e** houver uma tarefa em **Em Andamento**, use o
  título e o critério de aceite dessa tarefa como ponto de partida do que prototipar — não
  pergunte de novo o que é a tela, essa informação já está no board.
- Caso contrário (sem `.kanban/board.md`, ou nenhuma tarefa Em Andamento), pergunte diretamente
  ao usuário o que ele quer prototipar: qual tela, para qual usuário, e o que ela precisa
  permitir fazer.

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

## Passo 4 — Gate de aprovação

Mostre o Artifact ao usuário e pergunte se está aprovado ou se algo precisa mudar (cor,
densidade, um estado faltando, hierarquia de ações). Ajustes pequenos devem republicar o mesmo
Artifact (mesmo `file_path`, mesma URL) em vez de criar um novo a cada iteração. Só avance para
o Passo 5 depois de aprovação explícita — não assuma aprovação pelo silêncio.

## Passo 5 — Registrar e devolver o controle

- **Se veio de um `/kanban` ativo** (Passo 1 encontrou uma tarefa Em Andamento): adicione uma
  linha `- Protótipo aprovado: <url do Artifact>` na tarefa correspondente em
  `.kanban/board.md`, preservando o restante da entrada (a tarefa continua em Em Andamento —
  marcar como concluída é responsabilidade do `/kanban`, na implementação real, não desta
  skill). Avise o usuário que pode rodar `/kanban` novamente para continuar a implementação a
  partir do protótipo aprovado.
- **Se rodou avulso** (sem contexto de kanban): apenas entregue o link do Artifact aprovado —
  não crie nem edite nenhum arquivo de board.
