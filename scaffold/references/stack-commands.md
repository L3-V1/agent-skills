# Comandos de scaffold por stack

Comandos padrão pra iniciar um projeto novo, por stack/gerenciador. Use como referência antes de
rodar o Passo 4 do `SKILL.md`. Se a stack pedida pelo usuário não estiver aqui, pergunte a ele o
comando exato em vez de adivinhar — não invente flags ou templates.

## JavaScript / TypeScript (frontend)

| Stack | Comando |
|---|---|
| Vite (React/Vue/Svelte/Vanilla) | `npm create vite@latest <nome> -- --template <react\|react-ts\|vue\|vue-ts\|svelte\|svelte-ts>` |
| Next.js | `npx create-next-app@latest <nome>` (perguntar TypeScript, Tailwind, App Router nos prompts interativos) |
| Nuxt | `npx nuxi@latest init <nome>` |
| Astro | `npm create astro@latest <nome>` |

## Node (backend)

| Stack | Comando |
|---|---|
| Node genérico | `mkdir <nome> && cd <nome> && npm init -y` |
| Express | após `npm init -y`: `npm install express` |
| NestJS | `npx @nestjs/cli new <nome>` |

## PHP

| Stack | Comando |
|---|---|
| Laravel | `composer create-project laravel/laravel <nome>` |
| Laravel + Inertia + Vue | `composer create-project laravel/laravel <nome>`, depois instalar Inertia/Vue conforme a doc oficial da stack (pergunte ao usuário se ele tem um starter kit preferido) |

## Python

| Stack | Comando |
|---|---|
| Projeto genérico (uv) | `uv init <nome>` |
| Django | `django-admin startproject <nome>` (requer `pip install django` antes) |
| FastAPI | `mkdir <nome> && cd <nome> && uv init . && uv add fastapi uvicorn` |

## Go

| Stack | Comando |
|---|---|
| Módulo Go | `mkdir <nome> && cd <nome> && go mod init <nome>` |

## Ruby

| Stack | Comando |
|---|---|
| Rails | `rails new <nome>` |

## Configs iniciais comuns (pós-scaffold)

- **Git**: `git init` (se o scaffolder não já inicializar) + primeiro commit depois que os arquivos base existirem.
- **Lint/format**: instalar conforme a stack (ex. ESLint+Prettier pra JS/TS, Ruff pra Python) só se o usuário pediu.
- **Testes**: instalar o runner padrão da stack (ex. Vitest/Jest pra JS, Pytest pra Python) só se o usuário pediu.
