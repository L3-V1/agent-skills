# Qualidade de código

Convenções gerais para código Vue, Laravel e TypeScript dentro deste padrão — complementam a arquitetura e os componentes já descritos em `stack-e-backend.md` e `layout-e-componentes.md`, sem repeti-los.

## Antes de criar algo novo

Examine a estrutura e as convenções já adotadas no projeto (inclusive `composer.json`/`package.json`) antes de criar arquivos, camadas ou dependências novas. Preserve o que já existe e altere só o necessário para a tarefa — não aproveite para renomear, mover ou reformatar áreas não relacionadas.

## Vue

- Use Composition API com `<script setup>`, props e emits tipados.
- Não mute props diretamente; derive valores com `computed` e prefira isso a `watch` quando o resultado for só um valor derivado.
- Divida componentes que acumularem responsabilidades demais ou ficarem extensos demais para ler de uma vez.

## TypeScript

Quando o projeto tiver TypeScript configurado, evite `any` sem justificativa e tipe props, emits e respostas de API — corrija a causa de erros de tipagem em vez de silenciá-los com coerções.

## Validação final

Antes de considerar uma alteração concluída, rode as ferramentas já configuradas no projeto (Pint para PHP, ESLint/Prettier/`vue-tsc` para o frontend) e os testes relevantes existentes. Corrija o que a própria alteração introduziu; não é necessário sair corrigindo problemas antigos não relacionados à tarefa.
