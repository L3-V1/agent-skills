# Armadilhas conhecidas

Erros já encontrados (e resolvidos) na construção de sistemas com esta stack. Vale revisar esta lista antes de configurar autenticação, Ziggy, tema ou build — são as causas mais prováveis de um erro estranho.

| # | Sintoma | Causa | Solução |
|---|---|---|---|
| 1 | `route is not defined` no Vue | Import do pacote npm `ziggy-js` (v1), incompatível com Ziggy PHP v2 | Remover o import; usar `window.route` via mixin do Vue |
| 2 | `Cannot read properties of undefined (reading 'login.attempt')` | Pacote `tightenco/ziggy` (PHP) não instalado; `@routes` não gera nada | `composer require tightenco/ziggy` |
| 3 | `Unknown column '..._favoritos.atualizado_em'` (ou qualquer pivot) | `withTimestamps()` numa pivot que só tem `criado_em` | Trocar por `withPivot('criado_em')` |
| 4 | `Unknown column 'usuarios.deletado_em'` | `SoftDeletes` num model que não tem essa coluna | Remover `SoftDeletes` desse model, ou adicionar a coluna via migration |
| 5 | Sessão quebrando de forma incomum | Tabela de sessões com colunas renomeadas para português (ex. `carga`, `ultima_atividade`) | A tabela de sessões do Laravel usa colunas padrão (`payload`, `last_activity`, etc.) — não renomear essas especificamente, mesmo com o resto do banco em português |
| 6 | Dark mode não funciona num componente específico (DataTable, etc.) | Props `pt` (passthrough) com cores hardcoded no componente | Remover `pt` com cores fixas; deixar o preset do PrimeVue controlar |
| 7 | Cores "somem" no dark mode | Cores hardcoded (hex direto) num componente Vue | Usar as variáveis `--{prefixo}-*` e classes utilitárias — ver `tema-e-cores.md` |
| 8 | Build falha ao configurar Tailwind | `@tailwindcss/vite` (plugin do Tailwind v4) configurado junto com Tailwind v3 | Usar só `@vitejs/plugin-vue` + `laravel-vite-plugin` estilo v3 |
| 9 | Flash de tema claro antes de escurecer | Script de aplicar `.dark` ausente ou não é o primeiro elemento do `<head>` | Script inline, primeiro elemento do `<head>`, antes de `@vite` |
| 10 | Uma tela (ex. detalhe público) não reconhece o usuário logado, mesmo com sessão válida (`$request->user()` retorna `null`) | A rota não passa pelo middleware `auth:<guard>`, então o guard padrão da aplicação nunca foi trocado para o guard real de login | Especificar o guard explicitamente: `$request->user('<guard>')` |
| 11 | Editor aponta "método indefinido" em algo como `Auth::getProvider()->setModel(...)` ou `Storage::disk(...)->download(...)` | O método chamado só existe na classe concreta, não na interface que o helper/facade declara como tipo de retorno | Ou usar um método que a interface garante (ex. `path()` em vez de `download()` direto no disk), ou checar com `instanceof` antes de chamar o método específico da classe concreta |
| 12 | Mensagens de validação em inglês mesmo com `APP_LOCALE=pt_BR` | Projeto novo não tem `lang/pt_BR/validation.php` — o Laravel moderno não publica esse arquivo por padrão, só cai no inglês embutido no framework como último fallback | Criar `lang/pt_BR/validation.php` com as traduções + um array `attributes` mapeando os nomes de campo para rótulos amigáveis em português, desde o início do projeto |
| 13 | Rota/controller referenciado no arquivo de rotas mas o `use` aponta para uma classe que não existe | Feature planejada mas nunca implementada — o import fica "morto" sem erro até alguém tentar de fato acessar a rota | Ao revisar rotas de um projeto herdado, cheque se toda classe importada em `routes/web.php` realmente existe antes de assumir que a feature está pronta |
| 14 | `Failed to resolve import '@primevue/themes/aura'` | `@primevue/themes` é um pacote npm separado, não vem junto de `primevue` | `npm install @primevue/themes` |
| 15 | Testes com `assertInertia()` falham com "Inertia page component file [...] does not exist", mesmo a aplicação funcionando normalmente no navegador | Versões recentes de `inertiajs/inertia-laravel` usam `resources/js/pages` (minúsculo) como padrão em `config('inertia.pages.paths')`; a convenção desta skill é `resources/js/Pages` (maiúsculo) | `php artisan vendor:publish --provider="Inertia\ServiceProvider"` e ajustar `pages.paths` para `resource_path('js/Pages')` em `config/inertia.php` |
| 16 | Build falha com `Failed to resolve import '@/Layouts/AppLayout.vue'` | Falta `resolve.alias` para `@` no `vite.config.js` | Ver seção "Alias `@` no Vite" em `stack-e-backend.md` |
| 17 | Campos de formulário (`Select`, `InputNumber`, etc.) se sobrepondo ou estourando a largura de um grid/flex de filtros | Item de grid/flex não encolhe abaixo do tamanho do próprio conteúdo por padrão (`min-width: auto`), mesmo com a coluna do grid podendo encolher | `min-w-0` no item do grid/flex + prop `fluid` no componente PrimeVue (não só `class="w-full"`) — ver `layout-e-componentes.md` |
| 18 | Mensagem de erro de formulário (`form.errors.<campo>`) aparece sem cor vermelha | `.p-error` não é mais estilizado por padrão no PrimeVue 4 (era um helper global do v3) | Usar a variável `--{prefixo}-color-error` + regra `.p-error` já presentes em `assets/app.css` |
| 19 | Modal de "criar" reaberto na mesma listagem mostra os valores do último registro salvo em vez de campos vazios | `form.reset()` do Inertia volta para os últimos dados enviados com **sucesso**, não para os valores originais do form | Limpar os campos manualmente (`form.campo = ''`) ao abrir o modal de criação, sem chamar `reset()` — ver `layout-e-componentes.md` |
| 20 | Card do formulário em página dedicada (criar/editar) fica alinhado à esquerda, sem acompanhar a largura do header/breadcrumb | `Card` sem `w-full` (ou com `max-w-*`/`inline-block`) encolhe para o tamanho do conteúdo em vez de ocupar o `<main>`/`.{prefixo}-container` | Adicionar `class="w-full"` ao `Card` da página; não confundir com o `Dialog` do modal, que já se autodimensiona — ver `layout-e-componentes.md` |

## Checklist rápido ao iniciar um projeto novo

- [ ] `tightenco/ziggy` instalado (Composer), `ziggy-js` **não** instalado (npm)
- [ ] `lang/pt_BR/validation.php` criado com `attributes` preenchido
- [ ] Script anti-flash é o primeiro elemento do `<head>`
- [ ] Tailwind configurado como v3, sem `@tailwindcss/vite`
- [ ] Se houver múltiplos guards de autenticação, todo `$request->user()` em rota pública especifica o guard
- [ ] Tabela de sessões usa as colunas padrão do Laravel, mesmo com o resto do schema em português
- [ ] `@primevue/themes` instalado via npm (separado de `primevue`)
- [ ] `config/inertia.php` publicado com `pages.paths` apontando para `resources/js/Pages`
- [ ] `resolve.alias` de `@` configurado em `vite.config.js`
- [ ] `locale` do PrimeVue com tradução pt-BR completa (não só `dateFormat`/`firstDayOfWeek`)
