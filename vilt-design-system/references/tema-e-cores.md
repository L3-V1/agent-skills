# Tema e Cores

## Paleta de cores (exemplo padrão: roxo Udemy/Hostinger)

Os templates desta skill vêm com uma paleta roxo/violeta de exemplo (inspirada nos temas do Udemy e da Hostinger), extraída de `assets/preset.js` e `assets/app.css`:

| Uso | Hex |
|---|---|
| Roxo escuro principal (nav, heading no claro) | `#4B3699` |
| Roxo oficial Hostinger (primitivo base) | `#674CC4` |
| Roxo escuro oficial (variante mais profunda, hover/active) | `#4B3699` |
| Roxo claro de destaque (links, highlight, hover em componentes) | `#8F7BDB` |
| Roxo claro de contraste (borda em foco) | `#B7A8ED` |

No tema escuro, o fundo **não** é um roxo escurecido — segue o padrão de fundo neutro escuro (inspirado no Udemy, `#0E0E10`/`#18181B`), com o roxo reservado só para heading, links, estados ativos e bordas de destaque. Texto de corpo/muted no escuro usa cinza neutro, não roxo.

Estas cores são só um exemplo funcional — ao contrário de um design system institucional, aqui a paleta **é** uma escolha de projeto. Troque livremente pelas cores da marca/produto que o sistema representa. O que muda de projeto para projeto (além da própria cor) é: o nome do sistema, sua sigla, sua descrição, e o prefixo usado nas variáveis CSS e classes utilitárias.

## Duas camadas de estilo

1. **Preset do PrimeVue** (`resources/js/preset.js`) — customiza os componentes PrimeVue em si (botões, DataTable, Select, Menubar, etc.) via `definePreset(Aura, {...})`, com três níveis: `primitive` (paleta bruta, ex. escala de azuis/cinzas), `semantic` (mapeia `primary`, `surface`, `content` etc. para os primitivos, com variantes `light`/`dark`), e `components` (overrides pontuais por componente, ex. header do DataTable com fundo colorido e texto branco). Use `assets/preset.js` como ponto de partida — ele já traz a paleta de exemplo.

2. **Variáveis CSS customizadas** (`resources/css/app.css`, prefixo `--{prefixo}-*`) — controlam a "pele" das páginas em si (fundo, texto, cards, nav), fora do que o PrimeVue já cobre. Exemplo (com um prefixo genérico `app`, substitua pelo prefixo escolhido no projeto):

```css
:root {
    --app-bg-page:      #f8f8fa;
    --app-bg-nav:       #4b3699;
    --app-bg-card:      #ffffff;
    --app-text-heading: #4b3699;
    --app-text-body:    #374151;
    --app-border:       #e2e8f0;
}
.dark {
    --app-bg-page:      #0e0e10;
    --app-bg-nav:       #18181b;
    --app-bg-card:      #18181b;
    --app-text-heading: #b7a8ed;
    --app-text-body:    #efeff1;
    --app-border:       #27272a;
}
```

No dark mode, o padrão não é uma versão roxa escurecida das mesmas cores — o fundo segue preto neutro (estilo Udemy), e só o heading/link/estado ativo/borda de destaque passam a usar tons claros de roxo sobre esse fundo quase preto. Texto de corpo e muted seguem cinza neutro claro, para manter legibilidade e reservar o roxo como cor de destaque, não de pintura geral.

**Regra central: nunca hardcode uma cor num componente Vue.** Sempre use as classes utilitárias que consomem essas variáveis (`.{prefixo}-heading`, `.{prefixo}-text`, `.{prefixo}-text-muted`, `.{prefixo}-card`, `.{prefixo}-card-alt`) ou, quando não houver classe pronta, a variável diretamente (`var(--{prefixo}-border)`). Isso é o que garante que qualquer tela nova funcione automaticamente nos dois temas sem trabalho extra — e é o erro mais comum ao adicionar uma tela nova (funciona no claro, "some" no escuro).

## Mecanismo claro/escuro

- Tailwind com `darkMode: 'class'`; PrimeVue com `darkModeSelector: '.dark'` — os dois seguem a mesma classe `.dark` no `<html>`.
- Persistência em `localStorage`, chave `{prefixo}-theme` (valores `'dark'`/`'light'`).
- **Script anti-flash**: precisa ser o *primeiro* elemento do `<head>`, antes de `@vite`, para aplicar a classe `.dark` antes do primeiro paint — senão a página pisca clara antes de escurecer. Veja `assets/app.blade.php`.
- Toggle no layout principal: lê a classe atual no `onMounted`, alterna a classe e grava no `localStorage` a cada clique. Veja `assets/AppLayout.vue`.

## Configuração do PrimeVue

```js
app.use(PrimeVue, {
    theme: {
        preset: appThemePreset, // seu preset customizado, não o Aura puro
        options: {
            prefix: '',
            darkModeSelector: '.dark',
            cssLayer: { name: 'primevue', order: 'tailwind-base, primevue, tailwind-utilities' },
        },
    },
    locale: ptBR, // objeto completo — ver "Locale pt-BR" abaixo, não basta dateFormat/firstDayOfWeek
});
```

Registre os componentes PrimeVue globalmente em `app.js` (não importe componente a componente em cada página) e registre `ToastService`/`ConfirmationService` globalmente também, já que toasts e confirmações são usados em praticamente todo fluxo de criação/edição/exclusão. Registre também o CSS do PrimeIcons (`primeicons/primeicons.css`) uma única vez.

### Locale pt-BR — não é só `dateFormat`

O PrimeVue 4 vem em inglês por padrão: texto de upload de arquivo ("Choose"/"No file chosen"), paginação ("Rows per page"), calendário (nomes de mês/dia), mensagens de filtro de `DataTable`, etc. — tudo isso vem de um único objeto `locale` na config do `PrimeVue`, e configurar só `dateFormat`/`firstDayOfWeek` (como no exemplo acima de versões antigas desta skill) deixa o resto em inglês.

O objeto default completo (todas as chaves que precisam de tradução) fica em `node_modules/@primevue/core/config/index.mjs`, propriedade `locale`. Copie esse objeto inteiro para um arquivo próprio (ex. `resources/js/primevue-locale-ptBR.js`, exportando `ptBR` como default) e traduza todas as chaves, não só as de data — inclusive o bloco `aria` (usado por leitores de tela). Sintoma típico de locale incompleto: um `FileUpload` mostrando "No file chosen" mesmo com `APP_LOCALE=pt_BR` no `.env` (isso é config do Laravel, não tem relação com o `locale` do PrimeVue, que é só do frontend).

## Tipografia e overrides pontuais

Um exemplo funcional é usar uma fonte sem serifa (ex. importada via Google Fonts) e ter um arquivo CSS complementar pequeno para ajustes que o preset do PrimeVue não cobre bem (ex. peso/tamanho de `label`, remover borda do `p-menubar`). Esse tipo de override pontual é aceitável, mas deve ficar concentrado num único arquivo (ex. `resources/css/overrides.css`) — não espalhado em `<style>` locais de componentes, para não perder rastreabilidade de "por que esse componente tem essa exceção".
