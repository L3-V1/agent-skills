# Layout e Componentes

## Estrutura do layout principal

O layout principal (`AppLayout.vue`, usado por praticamente toda página autenticada e pela maioria das públicas) segue esta estrutura, de cima para baixo:

```
.{prefixo}-page                    (wrapper: min-height 100vh, flex-column)
  header.{prefixo}-header          (branco no claro / escuro no dark — logo do sistema)
    .{prefixo}-brand                 ícone/logo + nome do sistema + descrição curta
  nav.{prefixo}-nav                (sticky, sempre fundo colorido nos dois temas)
    .{prefixo}-nav-links             links de navegação principais (desktop)
    .{prefixo}-nav-actions           nome do usuário, toggle de tema, sair, botão mobile
    [.{prefixo}-mobile-menu]         menu colapsado, só visível abaixo do breakpoint mobile
  [flash message]                  toast de sessão (sucesso/erro/aviso), dispensável
  main.{prefixo}-content           conteúdo da página (slot)
  footer.{prefixo}-footer          nome do sistema/organização
```

Um botão flutuante de "Ajuda" no canto inferior direito (`position: fixed`) é um padrão recorrente nesses sistemas — considere incluir se o novo sistema tiver uma página de ajuda/FAQ.

## Logo do sistema

A logo do sistema (usada no header do `AppLayout` ao lado do nome, referenciada como `appLogo`/`VITE_APP_LOGO`) não está incluída nesta skill — é específica de cada projeto e precisa ser fornecida por quem está criando o novo sistema. O mesmo vale para uma eventual imagem de fundo da tela de login (ver seção "Login" abaixo): forneça a sua própria imagem, o layout já está preparado para recebê-la via `background-size: cover`.

## Login

A página de login não usa o `AppLayout` — é uma tela isolada, com sua própria identidade visual, e segue este padrão:

```
tela cheia, imagem de fundo do projeto (cover, centralizada)
  card estreito (~20em), fundo na cor de destaque do projeto (tom escuro), cantos arredondados, borda na cor de destaque
    logo do sistema centralizada (~120px)
    nome do sistema/organização (texto pequeno, centralizado)
    formulário (campos de identificação + senha, botão "Entrar" full-width)
    rodapé: nome do sistema/organização + sigla, se aplicável
  botão de alternar tema, fixo no canto superior direito da tela
```

O card do login usa uma cor de fundo ainda mais escura que o `--{prefixo}-bg-nav` do resto do sistema — é uma tela isolada, então pode se dar esse destaque extra sem quebrar consistência com o resto do sistema (que o usuário só vê depois de autenticado).

## Navegação condicionada a perfil

Links administrativos (categorias, secretarias, auditoria, etc.) devem aparecer só para quem tem o perfil adequado. Padrão:

```js
const usuario = computed(() => page.props.auth?.usuario);
const ehAnalista = computed(() => ['analista', 'administrador'].includes(usuario.value?.perfil));
```

Quando houver mais de dois ou três links administrativos, agrupe-os num menu suspenso (`Menu` do PrimeVue em modo `popup`) ancorado a um botão no mesmo estilo dos demais links de nav, em vez de poluir a barra com um link solto para cada tela — mas ainda assim, garanta que cada tela administrativa tenha *algum* ponto de entrada na navegação. É comum, ao construir uma tela administrativa nova, esquecer de linká-la em lugar nenhum — a tela fica funcional mas só acessível digitando a URL manualmente. Sempre que uma página nova responde por uma ação de "criar X"/"editar X"/"listar X administrativo", confirme que existe um botão ou link real levando até ela antes de considerar a tarefa concluída.

## Padrão de página: listagem

```
Título + contagem de registros           (h2 + "N registros encontrados")
Bloco de filtros                          (.{prefixo}-card, grid de Select/InputText, debounce ~400ms na busca livre)
Grid de cards OU DataTable                (cards para conteúdo "de vitrine"/público; DataTable para listagens administrativas)
Estado vazio                              (ícone grande + texto + CTA quando fizer sentido)
Paginador                                 (componente Paginator do PrimeVue, nunca links de paginação manuais)
```

**Gotcha do bloco de filtros**: um `Select`/`InputNumber`/etc. do PrimeVue dentro de uma célula de grid ou flex não encolhe abaixo do tamanho do próprio conteúdo por padrão (`min-width: auto` do CSS) — mesmo que a coluna do grid permita encolher, o campo estoura e sobrepõe o vizinho. Sempre que dois ou mais campos dividirem uma linha/coluna estreita (ex. "Ano" + "Semestre" lado a lado), adicione `min-w-0` ao item do grid/flex e use a prop `fluid` do próprio componente PrimeVue (não só `class="w-full"`) para ele ocupar 100% do espaço disponível de forma confiável.

## Ícones e ações de linha

Use **PrimeIcons** (`pi pi-*`) como biblioteca única de ícones em toda a aplicação — não introduza outra lib de ícones, já é a que o preset e os componentes existentes assumem. Para abrir a visualização de um registro numa listagem, use um botão `text`+`rounded` com ícone `pi pi-eye` e `aria-label` descrevendo a ação (o botão só-ícone não tem texto visível para leitores de tela).

## Padrão de página: detalhe

```
Breadcrumb                                (Listagem › Item)
Coluna principal (lg:col-8)               seções em cards empilhados, cada uma com título + ícone
Coluna lateral (lg:col-4)                 metadados/resumo em cards menores
```

Página de detalhe originada de uma listagem deve sempre oferecer um caminho de volta para a listagem (breadcrumb clicável), sem preservar filtros/paginação anteriores.

Os cards de conteúdo (coluna principal e coluna lateral) devem ocupar 100% da largura da sua coluna (`w-full`, nunca `max-w-*`/`w-fit`/`inline-block`), para que a borda esquerda/direita do bloco fique alinhada às mesmas margens do header/breadcrumb da página — os dois compartilham a classe `.{prefixo}-container` no `AppLayout`, então qualquer card que encolha para o tamanho do próprio conteúdo quebra esse alinhamento.

## Padrão de formulário: criar/editar

Para formulários pequenos (poucos campos, ex. categoria/secretaria), um `Dialog` modal sobre a própria listagem é suficiente. Para formulários grandes (muitos campos, seções distintas), prefira uma **página dedicada** em vez de espremer tudo num modal — o modal fica ilegível e o usuário perde o contexto de rolagem.

Convenções de formulário, nos dois casos:
- `useForm` do Inertia; erros exibidos junto ao campo (`form.errors.<campo>`), nunca só num alerta genérico no topo. O `<small>`/elemento de erro usa a classe `p-error` (estilizada via `--{prefixo}-color-error` em `assets/app.css` — o PrimeVue 4 não estiliza mais essa classe por padrão como fazia o v3).
- Botão de salvar com `:loading="form.processing"`.
- Ações destrutivas (excluir, revogar) sempre atrás de `ConfirmDialog`, nunca `window.confirm` nem exclusão direta ao clicar; use largura `min(44rem, calc(100vw - 2rem))` para o diálogo não ficar espremido em telas médias nem estourar no mobile.
- Mensagens de sucesso/erro como toast (`useToast`), consumidas uma única vez a partir de uma flash message do servidor — não duplicar essa lógica por página.
- **Modal de criar/editar reaproveitado na mesma listagem** (o caso comum de formulário pequeno acima): ao abrir o modal para **criar** um novo registro, não use `form.reset()` para limpar os campos. Depois de qualquer envio bem-sucedido, o Inertia atualiza os "defaults" internos do form para os dados que acabaram de ser salvos — então `reset()` devolve os valores do último registro criado/editado, não campos vazios. Limpe os campos manualmente (`form.nome = ''`, etc.) ao abrir o modal de criação.
- **Card do formulário em página dedicada (não modal)**: o `Card` que envolve o formulário deve ocupar `w-full` do `<main>`/container da página — nunca aplique `max-w-*`, `w-fit` ou deixe o Card como `inline-block`. O objetivo é que a borda esquerda/direita do Card fique exatamente alinhada à do header e do breadcrumb (ambos já usam `.{prefixo}-container`). Essa regra não se aplica ao `Dialog` do modal de criar/editar pequeno: o próprio `Dialog` já controla sua largura/posicionamento (ver a largura `min(44rem, calc(100vw - 2rem))` acima), então não precisa (e não deve) receber `w-full`.

```html
<!-- Página dedicada: Card ocupa a largura total do container -->
<main class="__APP_PREFIX__-content __APP_PREFIX__-container">
  <h2 class="__APP_PREFIX__-heading">Editar Categoria</h2>
  <Card class="w-full">
    <template #content>...</template>
  </Card>
</main>

<!-- Modal: Dialog já se autodimensiona, não precisa de w-full -->
<Dialog v-model:visible="visivel" modal header="Editar Categoria">
  ...
</Dialog>
```

## Responsividade

- Breakpoint principal de colapso: ~768px. Abaixo dele, os links de navegação somem e um botão de menu hambúrguer aparece, abrindo um menu vertical de largura total.
- Nome do usuário e labels de texto de botões de ação secundária (ex. "Modo escuro") somem no mobile, mantendo só o ícone.
- Grids de card (`col-12 md:col-6 lg:col-4` ou similar) sempre colapsam para uma coluna antes do card espremer o conteúdo.

## Estados de interface e acessibilidade

Todo fluxo interativo (listagem, formulário, ação assíncrona) precisa cobrir os estados de carregamento, vazio, erro, hover, foco e desabilitado — não só o caminho feliz. Mantenha foco visível em todos os elementos interativos, rótulos associados aos campos (`label for`/`aria-label`) e respeite `prefers-reduced-motion` em transições maiores. Ao revisar uma tela nova, confira claro/escuro, desktop/mobile, e o fluxo completo listagem → detalhe → listagem antes de considerar a tarefa concluída.
