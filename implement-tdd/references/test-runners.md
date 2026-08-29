# Detecção e configuração de test runner por stack

Regra geral: **use o runner que já está no projeto.** Só introduza um framework novo quando não
houver nenhum — e, nesse caso, escolha o padrão da comunidade daquele stack. Antes de decidir,
leia `AGENTS.md` / `CLAUDE.md` / `README` do projeto: muitas vezes o comando de teste está
documentado lá e não precisa ser adivinhado.

## Como detectar se já existe infraestrutura de teste

Sinais de que o projeto já tem runner (não configure nada, só use):

- Dependência de framework de teste no manifesto (`package.json`, `composer.json`,
  `pyproject.toml`, `Gemfile`, `Cargo.toml`, `go.mod`).
- Um diretório `tests/`, `test/`, `spec/`, `__tests__/` ou arquivos `*_test.*` / `*.test.*` /
  `*.spec.*`.
- Um script `test` definido (`package.json` → `scripts.test`; `Makefile` → alvo `test`).
- Config de runner na raiz (`jest.config.*`, `vitest.config.*`, `phpunit.xml`, `pytest.ini`,
  `.rspec`).

Se achar qualquer um desses, rode o comando canônico da tabela abaixo e confirme que a suíte
executa antes de começar o primeiro ciclo.

## Tabela por stack

| Stack | Já configurado? | Comando canônico | Framework padrão se ausente |
|---|---|---|---|
| **Node / TypeScript** | `package.json` tem `jest`/`vitest`/`mocha`, ou `scripts.test` | `npm test` (ou `pnpm test` / `yarn test` conforme o lockfile) | **Vitest** para projeto novo; **Jest** se já houver ecossistema Jest |
| **PHP / Laravel** | `composer.json` tem `phpunit`/`pestphp/pest`; existe `phpunit.xml` | `php artisan test` (Laravel) ou `./vendor/bin/pest` / `./vendor/bin/phpunit` | **Pest** (ou PHPUnit se o time preferir) |
| **Python** | `pytest`/`unittest` no `pyproject.toml`/`requirements*.txt`; `tests/` presente | `pytest` (ou `python -m pytest`) | **pytest** |
| **Go** | nativo — qualquer `*_test.go` | `go test ./...` | nativo, sem instalação |
| **Ruby / Rails** | `Gemfile` tem `rspec`/`minitest`; `spec/` ou `test/` | `bundle exec rspec` ou `bin/rails test` | **RSpec** (ou Minitest em projeto Rails padrão) |
| **Rust** | nativo — `#[test]` / `tests/` | `cargo test` | nativo, sem instalação |
| **Java** | `pom.xml` / `build.gradle` com JUnit | `mvn test` / `gradle test` | **JUnit 5** |
| **C# / .NET** | `.csproj` de teste com xUnit/NUnit | `dotnet test` | **xUnit** |

## Setup mínimo quando não há runner (exemplos)

O objetivo é o menor setup que faça `<comando de teste>` rodar um teste-canário verde. Não
configure cobertura, CI, matchers extras ou watch mode agora — só o essencial.

### Node + Vitest

1. `npm i -D vitest`
2. `package.json` → `"scripts": { "test": "vitest run" }`
3. Criar `tests/canary.test.ts` com um `expect(1 + 1).toBe(2)`.
4. Rodar `npm test` e confirmar verde.

### Laravel + Pest

1. `composer require --dev pestphp/pest --with-all-dependencies` e `php artisan pest:install`
   (ou usar o PHPUnit que já vem no scaffold do Laravel).
2. Confirmar `phpunit.xml` na raiz.
3. Rodar `php artisan test` e confirmar que a suíte de exemplo passa.

### Python + pytest

1. `pip install pytest` (registrar em `requirements-dev.txt` ou no grupo `dev` do
   `pyproject.toml`).
2. Criar `tests/test_canary.py` com `def test_canary(): assert 1 + 1 == 2`.
3. Rodar `pytest` e confirmar verde.

Para os demais stacks, siga o mesmo princípio: instalar o framework padrão, garantir o arquivo
de config que ele exige, criar um teste trivial, rodar o comando canônico e confirmar verde —
só então voltar ao Passo 3 da skill.
