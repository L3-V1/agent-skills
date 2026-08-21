<!--
    Esqueleto do layout principal. Copie para resources/js/Layouts/AppLayout.vue,
    substitua __APP_PREFIX__ por todo o arquivo, e adapte:
      - os links de .{prefixo}-nav-links / .{prefixo}-mobile-menu ao domínio do projeto
      - o caminho da imagem de logo em imgUrl()
      - os itens do menu "Administração" (ou remova se o projeto não tiver área admin)
      - se o projeto NÃO tiver autenticação (variante pessoal/local, ver SKILL.md),
        remova usuario/ehAnalista, o menu de Administração, o botão "Sair" e o
        computed logout — não há sessão de usuário para exibir/encerrar
-->
<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { Head, router, usePage, Link } from '@inertiajs/vue3';

defineProps({ title: String });

const page = usePage();
const usuario = computed(() => page.props.auth?.usuario);
const flash = computed(() => page.props.flash);
const ehAnalista = computed(() => ['analista', 'administrador'].includes(usuario.value?.perfil));

// Cada visita do Inertia entrega um objeto `flash` novo — usamos essa troca de
// referência para forçar a remontagem do <Message>, mesmo quando o texto é
// idêntico ao da mensagem anterior (ex.: duas exclusões seguidas). Sem isso,
// se o usuário já tiver fechado a mensagem, o componente reaproveitado
// continua com seu estado interno "fechado" e a próxima flash não aparece.
const flashKey = ref(0);
watch(() => page.props.flash, () => {
    if (page.props.flash?.mensagem) {
        flashKey.value++;
    }
});

const appName = import.meta.env.VITE_APP_NAME ?? 'SISTEMA';
const appDescribe = import.meta.env.VITE_APP_DESCRIBE ?? '';
const appOrganizacao = import.meta.env.VITE_APP_ORGANIZACAO ?? '';
const appLogo = import.meta.env.VITE_APP_LOGO;

function imgUrl(name) {
    return new URL(`../../img/${name}`, import.meta.url).href;
}

// Tema claro/escuro
const isDark = ref(false);

onMounted(() => {
    isDark.value = document.documentElement.classList.contains('dark');
});

const toggleTheme = () => {
    isDark.value = !isDark.value;
    if (isDark.value) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('__APP_PREFIX__-theme', 'dark');
    } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('__APP_PREFIX__-theme', 'light');
    }
};

// Menu mobile
const mobileOpen = ref(false);
const toggleMobile = () => { mobileOpen.value = !mobileOpen.value; };

const logout = () => {
    mobileOpen.value = false;
    router.post(window.route('logout'));
};

// Menu Administração (popup) — remova se o projeto não tiver telas admin
const adminMenu = ref();
const adminMenuItems = [
    // { label: 'Categorias', icon: 'pi pi-tags', command: () => router.visit(route('admin.categorias.index')) },
];
const toggleAdminMenu = (event) => { adminMenu.value.toggle(event); };

// Helper de rota ativa
const url = computed(() => page.url);
const isActive = (prefix) => url.value === prefix || url.value.startsWith(prefix + '/') || url.value.startsWith(prefix + '?');
</script>

<template>
    <Head :title="title" />
    <Toast />
    <ConfirmDialog />

    <div class="__APP_PREFIX__-page">

        <!-- Header: logo do sistema -->
        <header class="__APP_PREFIX__-header">
            <div class="__APP_PREFIX__-container __APP_PREFIX__-header-inner">
                <div class="__APP_PREFIX__-brand">
                    <img v-if="appLogo" :src="imgUrl(appLogo)" alt="Logo" class="__APP_PREFIX__-logo-img" />
                    <div>
                        <div class="__APP_PREFIX__-brand-name">{{ appName }}</div>
                        <div class="__APP_PREFIX__-brand-desc">{{ appDescribe }}</div>
                    </div>
                </div>
            </div>
        </header>

        <!-- Navbar -->
        <nav class="__APP_PREFIX__-nav">
            <div class="__APP_PREFIX__-container __APP_PREFIX__-nav-inner">

                <div class="__APP_PREFIX__-nav-links">
                    <Link :href="route('dashboard')"
                          :class="['__APP_PREFIX__-nav-link', isActive('/dashboard') && '__APP_PREFIX__-active']">
                        <i class="pi pi-home"></i>
                        <span>Início</span>
                    </Link>
                    <!-- adicione os links de navegação do domínio do projeto aqui -->

                    <button v-if="ehAnalista && adminMenuItems.length" @click="toggleAdminMenu"
                            :class="['__APP_PREFIX__-nav-link', isActive('/admin') && '__APP_PREFIX__-active']"
                            style="background: none; border: none; cursor: pointer;">
                        <i class="pi pi-cog"></i>
                        <span>Administração</span>
                        <i class="pi pi-angle-down text-xs"></i>
                    </button>
                    <Menu ref="adminMenu" :model="adminMenuItems" :popup="true" />
                </div>

                <div class="__APP_PREFIX__-nav-actions">
                    <span class="__APP_PREFIX__-user-name hidden md:block">{{ usuario?.nome }}</span>

                    <button @click="toggleTheme" class="__APP_PREFIX__-btn-nav"
                            :title="isDark ? 'Alternar para modo claro' : 'Alternar para modo escuro'">
                        <i :class="isDark ? 'pi pi-sun' : 'pi pi-moon'"></i>
                        <span>{{ isDark ? 'Modo claro' : 'Modo escuro' }}</span>
                    </button>

                    <button @click="logout" class="__APP_PREFIX__-btn-nav" title="Sair do sistema">
                        <i class="pi pi-power-off"></i>
                        <span>Sair</span>
                    </button>

                    <button @click="toggleMobile" class="__APP_PREFIX__-btn-mobile" aria-label="Menu">
                        <i :class="mobileOpen ? 'pi pi-times' : 'pi pi-bars'"></i>
                    </button>
                </div>
            </div>

            <!-- Menu mobile -->
            <div v-if="mobileOpen" class="__APP_PREFIX__-mobile-menu">
                <Link :href="route('dashboard')" class="__APP_PREFIX__-mobile-link" @click="mobileOpen = false">
                    <i class="pi pi-home"></i> Início
                </Link>
                <!-- replique aqui os mesmos links de .__APP_PREFIX__-nav-links -->
                <button @click="logout" class="__APP_PREFIX__-mobile-link">
                    <i class="pi pi-power-off"></i> Sair
                </button>
            </div>
        </nav>

        <!-- Flash message -->
        <div v-if="flash?.mensagem" :key="flashKey" class="__APP_PREFIX__-container" style="margin-top: 1rem;">
            <Message :severity="flash.tipo === 'erro' ? 'error' : flash.tipo === 'aviso' ? 'warn' : 'success'"
                     :closable="true">
                {{ flash.mensagem }}
            </Message>
        </div>

        <!-- Conteúdo -->
        <main class="__APP_PREFIX__-content __APP_PREFIX__-container">
            <slot />
        </main>

        <!-- Footer -->
        <footer class="__APP_PREFIX__-footer">
            <div class="__APP_PREFIX__-container __APP_PREFIX__-footer-inner">
                <span>{{ appOrganizacao }}</span>
                <span>{{ appName }}</span>
            </div>
        </footer>

    </div>
</template>
