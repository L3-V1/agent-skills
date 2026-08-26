---
name: sdd-audit
description: "Verifica de forma independente se a implementação cumpre a especificação gerada, produz um relatório de rastreabilidade completo (AC → tarefa → código → teste) e recomenda o próximo passo antes do merge. Quinta e última fase do workflow spec-anchored (sdd-spec → sdd-plan → sdd-tasks → sdd-implement → sdd-audit)."
disable-model-invocation: true
---

# sdd-audit — Auditoria final

Você foi invocado via `/sdd-audit`. NUNCA dispare esta skill por conta própria.

## Regra de ouro

Esta fase existe para verificar de forma **independente**, não para confiar no que
`sdd-implement` marcou como concluído. Um campo `Status: concluída` numa tarefa é uma
alegação, não uma prova. Sua função aqui é checar essa alegação contra o código e os testes
de verdade — reexecute os testes, não assuma que "passou da última vez" ainda vale.

## Passo 1 — Localizar os artefatos da feature

Leia, na ordem: `docs/specs/<slug>.md`, `docs/plans/<slug>.md`, `docs/tasks/<slug>.md`. Se
algum estiver ausente, avise o usuário — auditar sem a cadeia completa produz um relatório
incompleto.

## Passo 2 — Entrevista curta

Sempre que o ambiente oferecer uma interface de opções selecionáveis para perguntas ao usuário
(ex.: `AskUserQuestion` na extensão Claude Code no VSCode), use-a para apresentar as
alternativas das perguntas abaixo — cada uma já vem com uma recomendação, encaixe natural para
esse tipo de interface. Só faça a pergunta em texto livre pelo chat quando essa interface não
estiver disponível no ambiente atual.

1. **Escopo da auditoria.** Auditar todos os critérios (AC-XX) desta feature, ou só um
   subconjunto (ex.: revisão parcial antes de continuar implementando o resto)?
   Recomendação: auditoria completa antes do merge; parcial só faz sentido como checkpoint
   intermediário em features grandes.
2. **Rigor de verificação.** Além de reexecutar os testes existentes, quer que eu também
   procure ativamente por casos de borda não cobertos pelos critérios originais (auditoria
   mais rigorosa, mais tokens) ou só confirmar que o que foi especificado está implementado
   (auditoria mais rápida, fiel estritamente ao escopo da spec)? Recomendação: verificação
   estrita ao escopo — buscar casos de borda não especificados é útil, mas deveria virar uma
   nova entrada em uma spec futura via `/sdd-spec`, não uma expansão de escopo silenciosa
   dentro da auditoria.

## Passo 3 — Verificação por critério

Para cada `AC-XX` no escopo definido no passo 2:

1. Identifique qual(is) tarefa(s) `T-XX` alegam cobri-lo.
2. Localize o teste correspondente e **reexecute-o**. Não confie em relatos anteriores de que
   passou.
3. Leia o código de implementação e confirme que ele de fato implementa o que o critério EARS
   descreve — não só que "algum teste verde" existe. Testes mal escritos podem passar sem
   testar o comportamento certo.
4. Classifique o critério como: **atende**, **atende parcialmente** (com o que falta), ou
   **não atende** (com o motivo).

## Passo 4 — Despacho de subagentes

A verificação por critério é naturalmente paralelizável quando os critérios tocam partes
independentes do código. Despache um subagente por `AC-XX` (ou por grupo de AC-XX que
compartilham a mesma área de código), cada um seguindo o passo 3 isoladamente e retornando o
veredito. Para verificações diretas (rodar teste existente e conferir se bate com o critério),
prefira modelo mais barato (Haiku) — é checagem de baixa complexidade. Reserve o modelo padrão
da sessão para os casos em que a verificação exigir julgamento mais sutil (ex.: avaliar se um
teste testa mesmo o comportamento certo, ou investigar uma divergência). Você (orquestrador)
consolida os vereditos no relatório final.

## Passo 5 — Salvar o relatório

Crie `docs/audits/` se não existir. Salve em `docs/audits/<slug>.md`:

```markdown
# Auditoria: <nome da feature>

**Status:** gerado — critérios atendidos | gerado — pendências encontradas
**Slug:** <slug>
**Escopo:** completo | parcial (<detalhe>)

## Resultado por critério
- **AC-01** — atende — teste `<nome>` reexecutado, ok.
- **AC-02** — atende parcialmente — falta tratar `<caso>`.
- **AC-03** — não atende — `<motivo>`.

## Rastreabilidade completa
AC-01 → T-01 → `<arquivos alterados>` → teste `<nome>`
AC-02 → T-02 → ...

## Achados fora do escopo original (se houver)
- <observações que não bloqueiam o merge, mas valem virar spec futura>

## Recomendação
<aprovar para merge / bloquear até resolver os itens X, Y>
```

## Passo 6 — Encerramento

Se todos os critérios no escopo auditado atendem: apresente o relatório, marque
`Status: gerado — critérios atendidos` e recomende ao usuário revisar o relatório e seguir com
o merge por conta própria. Não pergunte — apenas recomende.

Se algum critério não atende ou atende parcialmente: marque
`Status: gerado — pendências encontradas`, apresente o que falta e recomende (sem perguntar)
rodar `/sdd-implement` para corrigir ou, se o problema for mais fundamental (a spec ou o plano
tinham uma lacuna), voltar para `/sdd-spec` ou `/sdd-plan`. Nunca classifique como "critérios
atendidos" com pendências reais — registre exatamente o que falta e deixe a decisão de merge
com o usuário.
