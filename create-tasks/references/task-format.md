# O que torna uma tarefa "verificável"

Uma tarefa verificável tem um critério de aceite que qualquer pessoa (ou o próprio Claude, em
outra sessão, sem memória da conversa) consegue checar de forma binária: feito ou não feito, sem
precisar interpretar intenção. Se o critério de aceite depende de julgamento subjetivo ("ficou
bom", "está performático o suficiente"), a tarefa ainda não está pronta para entrar na lista —
volte ao PRD e busque um número, um comportamento observável, ou um teste que resolva a
ambiguidade.

Duas perguntas para testar uma tarefa antes de colocá-la na lista:

1. **Alguém que não escreveu o código consegue verificar sozinho, sem perguntar nada?** Se a
   resposta exige contexto que só está na cabeça de quem implementou, o critério é vago demais.
2. **O critério aponta para uma ação concreta (rodar um comando, chamar um endpoint, abrir uma
   tela) ou para um estado abstrato ("está funcionando")?** Prefira sempre a ação concreta.

## Exemplos

**Vaga (evitar):**
- Título: "Melhorar a autenticação"
- Critério de aceite: "O login fica mais seguro"

Por que é vaga: "mais seguro" não é verificável — não dá para saber quando parar, e duas
pessoas podem discordar sobre se está pronto.

**Verificável (preferir):**
- Título: "Adicionar rate limiting no endpoint POST /login"
- Critério de aceite: "Após 5 tentativas de login com credenciais inválidas para o mesmo
  usuário em 60 segundos, a 6ª tentativa retorna HTTP 429, mesmo com credenciais corretas"

Por que funciona: dá para verificar com uma chamada de API real, sem ambiguidade sobre o
resultado esperado.

---

**Vaga (evitar):**
- Título: "Criar tela de listagem de pedidos"
- Critério de aceite: "A tela mostra os pedidos do usuário"

**Verificável (preferir):**
- Título: "Criar endpoint GET /orders paginado (20 itens por página) e a tela que o consome"
- Critério de aceite: "GET /orders?page=2 retorna os pedidos 21-40 do usuário autenticado,
  ordenados por data decrescente; a tela renderiza cada pedido com número, data e status"

---

**Vaga (evitar):**
- Título: "Deixar o app mais rápido"
- Critério de aceite: "Carregamento mais ágil"

**Verificável (preferir):**
- Título: "Adicionar índice na coluna `orders.user_id` e cachear a contagem de pedidos por
  usuário"
- Critério de aceite: "A query `SELECT COUNT(*) FROM orders WHERE user_id = ?` executa em menos
  de 50ms com 100k registros na tabela (medir com EXPLAIN ANALYZE ou benchmark equivalente)"

## Granularidade

Prefira tarefas pequenas o bastante para caber numa única sessão de implementação focada — se
ao escrever o critério de aceite você perceber que ele na verdade cobre duas coisas
independentes (ex.: "cria o endpoint E a tela"), considere quebrar em duas tarefas com uma
dependência entre elas, a não ser que sejam realmente inseparáveis (ex.: o endpoint não tem
utilidade nenhuma sem a tela, e vice-versa, e ambos são triviais).
