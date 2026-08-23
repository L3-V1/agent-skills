// Preset customizado do PrimeVue (Aura) com uma paleta de exemplo (roxo Twitch).
// Copie para resources/js/preset.js.
//
// A paleta (primitive.purple, os hex abaixo) é só um exemplo funcional — ao
// contrário de um design system institucional, aqui a cor é uma escolha de
// projeto, troque livremente. O que pode mudar entre projetos também são os
// overrides de `components` (ajuste conforme os componentes PrimeVue que o
// projeto realmente usa).
import Aura from '@primevue/themes/aura';
import { definePreset } from "@primevue/themes";

const appThemePreset = definePreset(Aura, {
    primitive: {
        gray: {
            0: '#FFFFFF', 50: '#FAFAFA', 100: '#F5F5F5', 200: '#EEEEEE',
            300: '#E0E0E0', 400: '#BDBDBD', 500: '#9E9E9E', 600: '#757575',
            700: '#616161', 800: '#424242', 900: '#212121',
        },
        purple: {
            50: '#f5edff', 100: '#e4d1ff', 200: '#cdb0ff', 300: '#bf94ff',
            400: '#a66fff', 600: '#7c2ef0', 700: '#772ce8', 800: '#5c1fbd',
            900: '#3d1480',
        },
        red: {
            300: '#f44336', // usado em "invalid" — dark
            400: '#f44336', // usado em "invalid" — light
        },
    },
    semantic: {
        primary: {
            0: '{purple.800}',
            50: '{purple.100}', // highlight de Select não-focado
            100: '#a66fff',     // highlight de Select focado
            200: '{purple.800}',
            300: '{purple.800}',
            400: '#a66fff',     // highlight da listbox
            500: '{purple.800}',
            600: '#bf94ff',     // bordas e highlight do DatePicker
            700: '{purple.800}',
            800: '{purple.800}',
            900: '{purple.800}',
        },
        contrastColor: '{primary.600}',
        focusRing: { shadow: '0px 0px 10px 1px {primary.100}' },
        content: { borderRadius: '3px' },
        invalid: { borderColor: '{red.400}' },
        colorScheme: {
            light: {
                primary: { color: '{primary.100}' },
                textColor: '#797b81',
                surface: {
                    0: '{gray.0}', 50: '{gray.50}', 100: '{gray.100}', 200: '{gray.200}',
                    300: '{gray.300}', 400: '{gray.400}', 500: '{gray.500}', 600: '{gray.600}',
                    700: '{gray.700}', 800: '{gray.800}', 900: '{gray.900}', 950: '{gray.950}',
                },
                formField: {
                    focusBorderColor: '{primary.600}',
                    borderColor: '{surface.400}',
                    hoverBorderColor: '{surface.300}',
                    invalid: { borderColor: '{invalid.borderColor}' },
                },
                content: { borderColor: '#dee2e6' },
            },
            dark: {
                primary: {
                    color: '{primary.100}',
                    contrastColor: '#ffffff',
                    hoverColor: '{primary.600}',
                    activeColor: '{primary.700}',
                },
                textColor: '#86847E',
                surface: {
                    0: '{gray.0}', 50: '{gray.50}', 100: '{gray.100}', 200: '{gray.200}',
                    300: '{gray.300}', 400: '{gray.400}', 500: '{gray.500}', 600: '{gray.600}',
                    700: '{gray.700}', 800: '{gray.800}', 900: '{gray.900}', 950: '{gray.950}',
                },
                formField: {
                    focusBorderColor: '{primary.600}',
                    borderColor: '{surface.400}',
                    hoverBorderColor: '{surface.300}',
                    invalid: { borderColor: '{invalid.borderColor}' },
                },
                content: { borderColor: '{surface.800}' },
            },
        },
        formField: { paddingX: '0.4rem', paddingY: '0.4rem' },
        navigation: { item: { padding: '0.5rem 0.5rem' } },
    },
    components: {
        // Ajuste/adicione overrides de componentes conforme o que o projeto usa.
        // Mantenha o padrão: fundo primary.500 + texto branco em cabeçalhos de
        // DataTable/Menubar/Editor — é o que dá consistência visual a esses
        // componentes.
        datatable: {
            header: { color: 'white', background: '{primary.500}', borderWidth: '0', padding: '0.75rem 0.75rem' },
            headerCell: { background: '{primary.500}', color: 'white', padding: '0.75rem 0.75rem' },
            bodyCell: { padding: '0.75rem 0.75rem' },
            footerCell: { padding: '0.75rem 0.75rem' },
            footer: { padding: '0.75rem 0.75rem' },
        },
        button: {
            background: '{primary.500}',
            colorScheme: {
                light: { root: { primary: { background: '{primary.500}', color: 'white' }, contrast: { color: '{primary.100}' } } },
                dark: { root: { primary: { background: '{primary.500}', color: 'white' }, contrast: { color: '{primary.100}' } } },
            },
        },
        menubar: {
            root: { background: '{primary.500}', padding: '0.5rem 0.5rem', gap: '0px' },
            submenu: { background: '{gray.400}', padding: 0, borderRadius: 0 },
            item: {
                color: 'white',
                activeColor: '{primary.500}',
                activeBackground: '{primary.50}',
                icon: { color: 'white' },
                focus: { background: '{primary.50}', color: '{primary.500}' },
                padding: '{navigation.item.padding}',
            },
            mobileButton: { color: 'white', hoverColor: '{primary.500}' },
            baseItem: { padding: '{navigation.item.padding}' },
        },
        inputtext: {
            sm: { paddingX: '0.275rem', paddingY: '0.275rem' },
            lg: { paddingX: '0.525rem', paddingY: '0.525rem' },
        },
    },
});

export default appThemePreset;
