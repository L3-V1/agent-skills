---
name: knowledge-base
description: "Base de conhecimento do projeto (docs/knowledge/): problemas já resolvidos e suas soluções. Use sem esperar o usuário pedir — para CONSULTAR ao travar num erro obscuro/recorrente ou área que já deu dor de cabeça antes ('esse erro de novo', 'já tentei de tudo'); para REGISTRAR logo após resolver algo que exigiu investigação real. Não usar para dúvidas triviais nem decisões de arquitetura/produto."
---

# Knowledge Base — base de conhecimento do projeto

> Um acervo vivo de armadilhas já resolvidas. Antes de brigar com um problema, veja
> se alguém (ou você, noutra sessão) já resolveu. Depois de resolver algo que deu
> trabalho, deixe registrado. O objetivo é que nenhuma armadilha custe caro duas vezes.

O acervo vive em `docs/knowledge/` no repositório do projeto:

- `docs/knowledge/INDEX.md` — índice em tabela, o ponto de entrada para consulta.
- `docs/knowledge/<slug>.md` — uma entrada por problema.

## Quando usar

**Consultar** quando o problema à frente tem cara de armadilha, não de tarefa comum:

- Um erro obscuro, de mensagem confusa, ou que já apareceu antes.
- Build, ambiente, container, migration, CI ou dependência se comportando de forma
  inesperada.
- Você já tentou uma correção e não funcionou.
- Vai mexer numa área/arquivo/integração que historicamente deu dor de cabeça.

**Registrar** depois de resolver um problema que se qualifica como "não-óbvio":

- Custou mais de uma tentativa, ou
- Exigiu pesquisa, leitura de código-fonte de terceiros, ou tentativa e erro, ou
- A causa raiz não era dedutível só da mensagem de erro.

## Quando NÃO usar

- Erros triviais: digitação, import faltando, typo de nome de variável.
- Decisões de arquitetura ou de produto — isso é do fluxo `/sdd`.
- Preferências de estilo de código — isso é decisão de estilo / revisão de código, não base de conhecimento.
- "Como usar a biblioteca X" em geral — a base é sobre *o que deu errado neste
  projeto*, não documentação de API.

## Fluxo de consulta

1. **Abrir o índice.** Ler `docs/knowledge/INDEX.md` (não abra as entradas
   individuais ainda). Se `docs/knowledge/` não existe, siga com a tarefa — a
   base começa vazia e você a cria no primeiro registro.
2. **Casar.** Na tabela do índice, procurar por palavras-chave do erro / tags /
   área. Abrir só 1–3 entradas candidatas que parecerem batidas — nunca a base
   inteira.
3. **Aplicar.** Usar a solução. Se precisou adaptá-la, **atualize a entrada**
   (acrescente a variação em "Solução", atualize a data) e avise o usuário em
   uma linha — sem interromper o fluxo do trabalho.

## Fluxo de registro

1. **Evitar duplicata.** Procure no `INDEX.md` uma entrada do mesmo sintoma. Se
   existir, **edite** essa entrada em vez de criar outra.
2. **Criar a entrada.** `docs/knowledge/<slug>.md` a partir do template abaixo,
   slug curto em kebab-case derivado do sintoma (ex.: `vite-hmr-wsl.md`).
3. **Atualizar o índice.** Adicione/atualize a linha no `INDEX.md` na mesma leva
   de edições da correção — não deixe "para depois".

## Template da entrada

```markdown
# <título curto do problema>

- **Data:** AAAA-MM-DD
- **Tags:** <stack>, <área>, <sintoma>
- **Status:** resolvido | contornado | parcial

## Contexto
Stack e versões relevantes; o que se tentava fazer quando o problema apareceu.

## Sintoma
Mensagem de erro exata (verbatim, em bloco de código) ou comportamento observado.

## Causa raiz
Por que acontecia — a explicação que não era óbvia a partir da mensagem de erro.

## Solução
Passos aplicados, com comando / diff / trecho de config quando ajuda a reproduzir
a correção.

## Como evitar ou detectar antes
Sinal de alerta, checagem rápida, ou nota de onde documentar isso no próprio código
(comentário, README, AGENTS.md) para não cair de novo.

## Referências
Issues, PRs, commits, páginas consultadas.
```

## Template do INDEX.md

```markdown
# Base de conhecimento

Problemas já resolvidos neste projeto e onde está a solução. Consulte antes de
gastar tempo com um erro; registre depois de resolver algo que deu trabalho.

| Problema | Arquivo | Tags | Data | Status |
|---|---|---|---|---|
| Vite HMR não atualiza sob WSL | [vite-hmr-nao-atualiza-em-wsl.md](./vite-hmr-nao-atualiza-em-wsl.md) | vite, wsl, hmr | 2026-08-28 | resolvido |
```

## Regras

- **Idioma:** escreva as entradas no idioma predominante do repositório do projeto
  (a skill é em português, mas o acervo segue o projeto).
- **Nunca grave segredos:** tokens, senhas, chaves, dados sensíveis. Referencie a
  variável ou o arquivo (`APP_KEY`, `.env`), nunca o valor.
- **Uma entrada = um problema.** Se um fix resolveu dois sintomas distintos, faça
  duas entradas curtas em vez de uma longa.
- **Seja específico e conciso.** Sintoma verbatim e causa raiz são o que torna a
  entrada útil na próxima busca; encha menos linhas de prosa.
