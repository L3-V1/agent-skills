# EARS — critérios de aceite

> Material compartilhado das skills de fase do fluxo spec-anchored. Não é uma skill.

Traduza as respostas da entrevista em critérios de aceite usando os cinco padrões EARS.
Use só os que fizerem sentido para a feature:

| Padrão | Forma | Quando usar |
|---|---|---|
| Ubíquo | "O sistema deve \<comportamento\>" | Regra sempre válida, sem gatilho |
| Orientado a evento | "Quando \<evento\>, o sistema deve \<resposta\>" | Reação a uma ação/evento |
| Orientado a estado | "Enquanto \<estado\>, o sistema deve \<comportamento\>" | Comportamento contínuo num estado |
| Feature opcional | "Onde \<recurso presente\>, o sistema deve \<comportamento\>" | Depende de config/plano/flag |
| Comportamento indesejado | "Se \<condição indesejada\>, então o sistema deve \<resposta\>" | Tratamento de erro/exceção |

## Numeração

Numere cada critério (`AC-01`, `AC-02`, ...) — essa numeração é o elo de rastreabilidade
das etapas seguintes (plano, tarefas, testes). Não pule numeração nem reordene depois de
gerada. Critérios de comportamento indesejado seguem a mesma sequência (`AC-0N`).
