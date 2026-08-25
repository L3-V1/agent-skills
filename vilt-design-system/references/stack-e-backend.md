# Stack e Backend

## Stack técnica de referência

| Camada | Tecnologia | Por que a versão importa |
|---|---|---|
| Backend | PHP 8.3 + Laravel 13 | |
| Frontend | Vue 3 (Composition API, `<script setup>`) + Inertia.js v2 | |
| UI | PrimeVue 4 + PrimeIcons + PrimeFlex 3 + Tailwind CSS **v3** | Tailwind v4 muda a forma de configurar plugins/layers e quebra o build junto com `laravel-vite-plugin` no estilo v3. Não usar `@tailwindcss/vite`. |
| Banco de dados | MySQL para dados da aplicação; opcionalmente um diretório de identidade externo para autenticação/perfis corporativos (ver seção Autenticação) | |
| Build | Vite 4 + `laravel-vite-plugin` (estilo v3) | |
| Permissões | Spatie Laravel Permission | Tabelas renomeadas para português (ver abaixo) |
| Rotas no frontend | Ziggy **PHP** v2 (`window.route()`) | O pacote npm `ziggy-js` v1 é incompatível com o Ziggy PHP v2 — não instalar nem importar. Ver `armadilhas.md`. |

## Banco de dados: tudo em português

Nomes de tabelas, colunas, models e métodos são em português, consistentemente:

```php
// Todos os models, sem exceção
const CREATED_AT = 'criado_em';
const UPDATED_AT = 'atualizado_em';

// Models com exclusão lógica (não todos — só onde histórico/autoria importa)
const DELETED_AT = 'deletado_em';
```

Convenção de nomes de método nas camadas de Service/Repository: `listar()`, `buscar()`, `buscarComRelacoes()`, `criar()`, `atualizar()`, `deletar()`. Parâmetros: `$filtros`, `$dados`, `$usuario`. Variáveis de domínio no idioma do domínio (`$secretaria`, `$categoria`, `$sistema`).

Se o projeto usa Spatie Permission, renomeie as tabelas no `config/permission.php` para manter a consistência:
```php
'papeis', 'permissoes', 'modelo_tem_permissoes', 'modelo_tem_papeis', 'papel_tem_permissoes'
```

Em relações `belongsToMany` com timestamp customizado na pivot, use `withPivot('criado_em')` — **nunca** `withTimestamps()`, que assume `created_at`/`updated_at` em inglês e quebra com "Unknown column".

## Arquitetura em camadas

Fluxo obrigatório, sem pular camadas:

```
Controller  → valida a Request, chama o Service, devolve Inertia::render() ou redirect()
Service     → lógica de negócio, autorização via abort_unless(), recebe o usuário autenticado
              como parâmetro (nunca resolve auth() por conta própria dentro do Service)
Repository  → queries Eloquent, sem lógica de negócio
Model       → Eloquent puro: relacionamentos, casts, scopes
```

Injeção de dependência é via construtor; o Laravel resolve automaticamente classes concretas — não é necessário registrar nada em `AppServiceProvider` para isso funcionar.

```php
class SistemaController extends Controller
{
    public function __construct(private readonly SistemaService $sistemaService) {}
}

class SistemaService
{
    public function __construct(private readonly SistemaRepository $sistemaRepository) {}

    public function criar(array $dados, Autenticavel $usuario): Sistema
    {
        abort_unless($usuario->isAnalista(), 403, 'Acesso negado.');
        // ...
    }
}
```

Controllers não devem conter regra de negócio: se um método de Controller começa a acumular `if`s de autorização ou lógica condicional além de validar e delegar, essa lógica pertence ao Service.

## Validação, autorização e datas

- Validar toda entrada em Form Requests e autorizar em Policies (ou `abort_unless` no Service, como acima) — nunca confiar só em validação feita na interface. O frontend pode omitir `novalidate` ou ser contornado; a garantia real é sempre no backend.
- Transições de estado, auditoria e arquivamento lógico (ver `DELETED_AT = 'deletado_em'` acima) são regras de domínio: devem viver no Service, como métodos testáveis, não espalhadas em `if`s no Controller ou na página Vue.
- Textos, mensagens de validação e datas exibidas ao usuário são em pt-BR. Formate datas como `dd/mm/yyyy HH:mm:ss` por um utilitário reutilizável (ex. `resources/js/utils/data.js`) em vez de formatar inline em cada componente — garante consistência e facilita trocar o formato depois.

## Autenticação: integração com diretório externo

Alguns sistemas administrativos precisam autenticar contra um diretório de identidade externo (LDAP/Active Directory/SSO corporativo) além de (ou em vez de) uma tabela local de usuários. Quando isso acontece, o projeto tem dois guards configurados em `config/auth.php` (ex.: `web` para uma tabela local e um guard próprio, ex. `corporativo`, para o diretório externo) — e **o guard padrão da aplicação (`defaults.guard`) normalmente continua `web`**, mesmo que o login real aconteça no outro guard.

Isso tem uma consequência importante: dentro de rotas protegidas por `auth:<guard>`, o middleware `Authenticate` chama `Auth::shouldUse(<guard>)` automaticamente, então `$request->user()` sem argumento funciona. **Mas em qualquer rota pública/sem esse middleware**, `$request->user()` (sem guard explícito) resolve contra o guard padrão errado e retorna `null` mesmo com o usuário autenticado. Nessas rotas, sempre especifique o guard: `$request->user('corporativo')`. Isso é fácil de esquecer justamente em páginas públicas que também mostram conteúdo condicional para usuários logados (ex.: catálogo público com botão de "editar" para quem tem permissão) — teste manualmente esse caso.

Se o modelo de autenticação usa uma classe própria por guard (ex. `Usuario` para local, `UsuarioCorporativo` para o diretório externo), padronize os métodos de perfil (`isAdministrador()`, `isAnalista()`, `favoritos()`, etc.) atrás de uma interface comum (ex. `App\Contracts\Autenticavel`) implementada por ambos os models, e tipe os parâmetros de Service contra essa interface em vez da interface genérica `Illuminate\Contracts\Auth\Authenticatable` — que não declara esses métodos de domínio.

## Usuário admin padrão

Quando o projeto tem autenticação local (tabela `usuarios`, guard `web`), o seeder do usuário administrador padrão (`DatabaseSeeder`/`UsuarioSeeder`) deve sempre criar:

- **Login:** `admin`
- **Senha:** `password` (via `Hash::make`)

É convenção fixa do stack VILT — não uma escolha de projeto — para manter um ambiente de desenvolvimento/homologação previsível entre sistemas. Note que o campo de login aqui é username, diferente da skill `pms-design-system` (que usa e-mail institucional `admin@santos.sp.gov.br`) — não confundir as duas ao consultar ambas.

## Ziggy (rotas no frontend)

```html
<!-- app.blade.php — ordem obrigatória no <head> -->
@routes         {{-- injeta window.route() ANTES do JS carregar --}}
@vite([...])
```

```js
// app.js — NÃO importar ziggy-js; usar window.route via mixin
createApp(...)
    .mixin({ methods: { route: window.route } })
```

## Alias `@` no Vite

Os templates desta skill (`AppLayout.vue`, páginas) importam via `@/Layouts/AppLayout.vue` em vez de caminho relativo — isso não vem pronto de um `laravel new` comum, precisa de um `resolve.alias` explícito em `vite.config.js`:

```js
import path from 'node:path';

export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(import.meta.dirname, 'resources/js'),
        },
    },
    // ...demais plugins (laravel-vite-plugin, @vitejs/plugin-vue)
});
```

Sem isso, o build falha com `Failed to resolve import '@/Layouts/AppLayout.vue'`.

## Ambiente de desenvolvimento local sem depender de sistemas corporativos

Quando a autenticação real depende de um diretório externo (LDAP, SSO corporativo) que nem todo desenvolvedor tem acesso local, vale a pena um mecanismo de bypass **explicitamente restrito a ambiente local**, nunca habilitável em produção por engano:

```php
// config/algumsistema.php
'auth_bypass_diretorio_externo' => env('ALGUMSISTEMA_AUTH_BYPASS_DIRETORIO_EXTERNO', false),
```

```php
if (app()->environment('local') && config('algumsistema.auth_bypass_diretorio_externo')) {
    // login local sem tocar no diretório externo
}
```

Uma forma testada de implementar isso é um `UserProvider` fake registrado condicionalmente em `AppServiceProvider::boot()`, só quando as duas condições (`local` + flag) são verdadeiras. Documente essa flag no `.env.example` do novo projeto — não deixá-la implícita.
