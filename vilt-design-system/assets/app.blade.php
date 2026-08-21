{{--
    Template do blade principal. Copie para resources/views/app.blade.php e
    substitua __APP_PREFIX__ pela chave usada em localStorage no AppLayout.vue.

    Ordem no <head> é obrigatória:
    1. Script anti-flash (inline, primeiro elemento)
    2. @routes — injeta window.route() ANTES do JS carregar
    3. @vite([...])
    4. @inertiaHead
--}}
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ config('app.name', 'Sistema') }}</title>
    <script>
        (function () {
            if (localStorage.getItem('__APP_PREFIX__-theme') === 'dark') {
                document.documentElement.classList.add('dark');
            }
        })();
    </script>
    @routes
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    @inertiaHead
</head>
<body class="antialiased">
    @inertia
</body>
</html>
