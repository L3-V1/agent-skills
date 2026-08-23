---
name: vilt-design-system
description: Documenta os padrões técnicos de backend/frontend do stack VILT (Laravel + Inertia + Vue 3 + PrimeVue/PrimeIcons + Tailwind), a arquitetura Controller→Service→Repository, nomenclatura em português e tema claro/escuro, usados como base para sistemas administrativos/institucionais. Use ao criar um novo sistema Laravel+Inertia+Vue+PrimeVue seguindo este design system, ao adicionar páginas/layouts/temas/telas a um projeto que já segue esse padrão (mesmo sem o termo "design system"), ou ao revisar se uma tela nova está consistente com o resto do sistema.
---

# Design System VILT

## O que isto é

Sistemas administrativos construídos em Vue + Inertia + Laravel + Tailwind (VILT) seguem uma stack e uma arquitetura bem definidas. Esta skill captura esse padrão para dois usos:

1. **Bootstrap de um sistema novo** — mesma stack, mesma arquitetura, mesmo mecanismo de tema, para que o projeto comece com convenções consistentes em vez de decisões ad-hoc.
2. **Consistência ao evoluir um sistema existente** que já segue este padrão — novas páginas/componentes devem parecer que sempre estiveram ali.

Se você tiver acesso ao código de outro sistema que já segue este padrão, ele é uma boa fonte da verdade para detalhes não cobertos aqui — mas prefira sempre a documentação abaixo, que já filtra o que é convenção do stack (deve ser replicado) do que é decisão específica de um projeto em particular (não deve).

## Paleta de cores

Os templates desta skill (`assets/app.css`, `assets/preset.js`) vêm com uma paleta roxo/violeta de exemplo (inspirada na identidade da Twitch) — ela existe só para os templates funcionarem prontos para uso, **não** é uma identidade fixa. Ao contrário de um design system institucional, aqui a paleta é uma escolha de projeto: troque livremente pelas cores da marca/produto que o sistema representa. O que não muda é o *mecanismo* — variáveis CSS com prefixo do projeto e preset do PrimeVue com as três camadas (`primitive`/`semantic`/`components`), documentado em `references/tema-e-cores.md`.

## Bootstrap de um projeto novo

1. Confirme a stack com o usuário — ela deve ser: PHP 8.3+/Laravel 13, Inertia.js v2 + Vue 3 (Composition API), PrimeVue 4 (preset Aura customizado) + PrimeIcons + Tailwind v3 (não v4), Ziggy PHP v2, Spatie Permission. Veja `references/stack-e-backend.md` para detalhes de instalação e por que cada versão importa (ex.: Tailwind v4 quebra o build).
2. Defina com o usuário: nome do sistema, sigla, descrição curta, e um prefixo curto em minúsculas para variáveis CSS/classes (ex.: um sistema "Portal de Convênios" poderia usar `pconv`).
3. Copie os arquivos de `assets/` para o novo projeto:
   - `assets/app.css` → `resources/css/app.css` — substitua o placeholder `__APP_PREFIX__` pelo prefixo escolhido em todas as ocorrências (variáveis CSS, classes); troque a paleta de exemplo pelas cores do projeto se já estiverem definidas.
   - `assets/preset.js` → `resources/js/preset.js` — substitua `__APP_PREFIX__` se necessário e ajuste a paleta `primitive` conforme a cor definida pelo projeto.
   - `assets/AppLayout.vue` → `resources/js/Layouts/AppLayout.vue` — substitua `__APP_PREFIX__` (classes, chave de `localStorage`), adapte os links de navegação ao domínio do novo sistema, e aponte `VITE_APP_LOGO`/`VITE_APP_ORGANIZACAO` para os valores do projeto.
   - `assets/app.blade.php` → `resources/views/app.blade.php` — substitua `__APP_PREFIX__` (chave de `localStorage`).
   - Forneça a logo do sistema (o projeto precisa da sua própria imagem — esta skill não inclui nenhuma imagem pronta).
4. Configure o backend seguindo `references/stack-e-backend.md`: guards de autenticação, tabelas em português, arquitetura Controller→Service→Repository.
5. Leia `references/armadilhas.md` **antes** de configurar Ziggy, autenticação multi-guard e o build do Vite — são os erros mais prováveis de reproduzir do zero.
6. Monte a página de login seguindo o padrão descrito em `references/layout-e-componentes.md` (seção "Login") — é a primeira tela que qualquer usuário vê.

### Variante sem autenticação

Nem todo projeto precisa de login (guard local e/ou diretório de identidade externo, ver `references/stack-e-backend.md`). Já foi usado um caso legítimo de projeto **pessoal/local sem autenticação nenhuma** (reaproveitando só a arquitetura em camadas e o tema, sem multiusuário). Nesse caso, adapte o bootstrap:

- Em `AppLayout.vue`: remova os computeds `usuario`/`ehAnalista`, o menu de "Administração" condicionado a perfil, o botão "Sair" e o método `logout` — não há sessão de usuário para exibir ou encerrar. A nav vira uma lista fixa de links do domínio do projeto.
- Pule inteiramente o passo 6 acima e a seção "Login" de `layout-e-componentes.md` — não existe tela de login.
- Pule a seção "Autenticação: integração com diretório externo" de `stack-e-backend.md` — não há guards para configurar.
- Nos Services, não recebem `$usuario`/`Autenticavel` como parâmetro (não existe usuário autenticado para autorizar contra).
- O resto do padrão (arquitetura em camadas, nomenclatura pt-BR, tema claro/escuro) continua valendo normalmente.

## Evoluindo um sistema existente

Ao adicionar uma página, componente ou tela administrativa a um sistema que já segue este padrão:

- Nunca hardcode cores — use as variáveis `--{prefixo}-*` e as classes utilitárias (`.{prefixo}-card`, `.{prefixo}-heading`, etc.), documentadas em `references/tema-e-cores.md`. Isso é o que garante que o tema claro/escuro funcione automaticamente em qualquer tela nova.
- Siga a estrutura de página já estabelecida: título com `.{prefixo}-heading`, cards com `.{prefixo}-card`, breadcrumb quando a página for de detalhe. Veja `references/layout-e-componentes.md`.
- Reaproveite os componentes PrimeVue já registrados globalmente e os ícones do PrimeIcons (não introduza outra lib de componentes ou de ícones).
- No backend, siga o fluxo Controller → Service → Repository já estabelecido (nomes de método em português: `listar`, `buscar`, `criar`, `atualizar`, `deletar`) — não coloque lógica de negócio direto no Controller. Detalhes em `references/stack-e-backend.md`.
- Componentes globais (nav, header, layout) devem tolerar propriedades compartilhadas do Inertia ainda ausentes na primeira renderização — não assuma que `page.props.auth.usuario` (ou equivalente) já existe antes do primeiro round-trip.
- Antes de considerar uma tela administrativa concluída, confirme que a autorização também é aplicada no backend (Policy/`abort_unless` no Service) — um link escondido no menu não impede acesso direto pela URL.

## Referências

| Arquivo | Quando consultar |
|---|---|
| `references/stack-e-backend.md` | Definindo a stack, autenticação multi-guard, arquitetura de camadas, nomenclatura pt-BR, Ziggy |
| `references/tema-e-cores.md` | Trabalhando com cores, tema claro/escuro, o preset do PrimeVue |
| `references/layout-e-componentes.md` | Construindo ou revisando o layout principal, páginas de listagem/detalhe, responsividade |
| `references/armadilhas.md` | Antes de configurar autenticação, Ziggy, build do Vite, ou ao ver um erro estranho de "método indefinido"/"rota não definida" |
| `references/qualidade-de-codigo.md` | Ao escrever ou revisar código Vue/Laravel/TypeScript — convenções gerais de legibilidade e organização que valem para qualquer sistema deste padrão |

## Assets copiáveis

- `assets/preset.js`, `assets/app.css`, `assets/AppLayout.vue`, `assets/app.blade.php` — templates de código prontos para copiar num projeto novo, com `__APP_PREFIX__` como placeholder a substituir e uma paleta de exemplo (roxo Twitch/cinza) livre para trocar.
- Não há imagens incluídas — logo do sistema e eventual imagem de fundo do login são fornecidas por quem cria o novo projeto.

Veja a seção "Bootstrap de um projeto novo" acima para onde cada arquivo vai.