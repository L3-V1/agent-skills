---
name: scaffold
description: "Guia a criação da fundação inicial de um projeto novo: entrevista sobre stack, configs iniciais e quais skills deste repositório devem ficar disponíveis no projeto, confirma com o usuário e então executa (cria estrutura, roda o scaffolder da stack, git init, instala deps, symlinka skills escolhidas). Aceita contexto inicial via /scaffold <contexto> pra já implementar funcionalidades previamente descritas depois do scaffold básico. Invocada explicitamente pelo usuário via /scaffold."
disable-model-invocation: true
---

# Scaffold

Você foi invocado via `/scaffold`. NUNCA dispare esta skill por conta própria — ela cria arquivos e
roda comandos reais no disco.

> Complementa `better-init`: `scaffold` cria a fundação do projeto (stack, config, deps, skills
> disponíveis); `better-init` documenta o que existe (`AGENTS.md`). Rode `scaffold` primeiro, sugira
> `better-init` no final.

## Passo 1 — Ler contexto inicial

Se o usuário passou algo junto com `/scaffold <contexto>`, extraia dali o que já responde a
entrevista do Passo 2 (stack, nome/caminho do projeto, funcionalidades a implementar depois do
scaffold básico). Só pergunte no Passo 2 o que não ficou claro.

## Passo 2 — Entrevista essencial

Use `AskUserQuestion` para o que faltar (pule pergunta já respondida pelo contexto inicial).
Sem essa interface (ex.: versão de terminal do codex), faça cada pergunta no chat mesmo assim em
formato de múltipla escolha enumerada, destacando a alternativa recomendada e o porquê; o usuário
responde pelo número ou escreve outra coisa.

- **Nome/caminho do projeto** — diretório novo ou pasta atual.
- **Stack** — linguagem, framework, gerenciador de pacotes. Campo livre, não trave em nenhuma stack
  específica. Se a resposta for Laravel + Inertia + Vue + PrimeVue, avise que dá pra usar as skills
  `vilt-design-system`/`pms-design-system` depois (mas não force a escolha).
  Consulte `references/stack-commands.md` para comandos de scaffold conhecidos; se a stack pedida
  não estiver lá, pergunte ao usuário o comando exato em vez de adivinhar.
- **Configs iniciais** — só as que fazem sentido pra stack escolhida (ex. TypeScript sim/não,
  linter/formatter, testes, `git init`, licença).
- **Skills deste repositório a linkar no projeto** — liste as skills disponíveis em
  `~/.agents/skills` (leia os `name` + primeira linha da `description` de cada `SKILL.md`) e deixe o
  usuário escolher várias ou nenhuma.

## Passo 3 — Resumo de confirmação

Antes de tocar no disco, mostre um checklist do que vai ser feito: diretório, comando(s) de
scaffold, configs a aplicar, skills a linkar. Peça confirmação explícita do usuário — isso tem
efeito real no filesystem, então não pule essa etapa mesmo a skill já exigindo invocação explícita.

## Passo 4 — Executar

1. Crie o diretório do projeto se necessário.
2. Rode o comando de scaffold da stack (veja `references/stack-commands.md`).
3. Aplique as configs iniciais escolhidas (`git init`, arquivos de lint/format, etc.).
4. Instale as dependências.
5. Symlinke cada skill escolhida:
   ```bash
   mkdir -p <projeto>/.claude/skills
   ln -s ~/.agents/skills/<skill> <projeto>/.claude/skills/<skill>
   ```
   Mesmo mecanismo do `README.md` deste repositório, mas escopado ao projeto em vez de global.

Se algum comando falhar (ex. scaffolder não instalado), avise o usuário e continue com o resto do
checklist em vez de abortar tudo.

## Passo 5 — Funcionalidades prévias do contexto inicial

Se o contexto inicial (`ARGUMENTS`) pediu para já implementar alguma funcionalidade além do scaffold
puro, implemente-a agora, depois que a fundação (Passo 4) estiver de pé. Não misture com o Passo 4.

## Passo 6 — Sugerir próximos passos

Mencione que `/better-init` gera `AGENTS.md`/`CLAUDE.md` pro projeto novo. Não dispare `/better-init`
sozinho — só sugira.

## Passo 7 — Resumo final

Informe objetivamente: o que foi criado, comandos rodados, skills linkadas, e o que ficou pendente ou
falhou.

## Referências

| Arquivo | Quando consultar |
|---|---|
| `references/stack-commands.md` | Antes de rodar o comando de scaffold — para saber o comando padrão da stack/gerenciador escolhido pelo usuário. |
