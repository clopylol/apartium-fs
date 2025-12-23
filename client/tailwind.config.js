/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./routes/**/*.{js,ts,jsx,tsx}",
    ],
    safelist: [
        { pattern: /^bg-ds-(background|card|border|secondary|primary|destructive|warning|success|action|action-hover|sidebar-primary|sidebar-border|sidebar-ring|input)(-light|-dark)?$/ },
        'bg-ds-action',
        'bg-ds-action-hover',
        'hover:bg-ds-action-hover',
        { pattern: /^bg-ds-in-(violet|sky)-[\d]+$/ },
        { pattern: /^border-ds-in-(violet|sky)-[\d]+$/ },
        { pattern: /^text-ds-(background|card|border|secondary|primary|destructive|warning|success|action|action-hover|sidebar-primary|sidebar-border|sidebar-ring|input)(-light|-dark)?$/ },
        { pattern: /^border-ds-(background|card|border|secondary|primary|destructive|warning|success|action|action-hover|sidebar-primary|sidebar-border|sidebar-ring|input)(-light|-dark)?$/ },
        { pattern: /^shadow-ds-action(\/[\d]+)?$/ },
        'shadow-ds-action',
        'shadow-ds-action/20',
        'shadow-ds-action/30',
        'bg-ds-in-violet-500',
        'border-ds-in-violet-500',
        'bg-ds-in-sky-400',
        'border-ds-in-sky-400',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Manrope', 'sans-serif'],
                heading: ['Lexend', 'sans-serif'],
            },
            colors: {
                // Existing custom colors from index.html
                slate: {
                    850: '#1e293b',
                    900: '#0f172a',
                    950: '#020617',
                },
                // DS System Colors
                'ds-background': {
                    light: '#F8FAFC', // slate-50
                    dark: '#020617',  // slate-950 (Existing Body BG)
                },
                'ds-card': {
                    light: '#FFFFFF', // white
                    dark: '#0f172a',  // slate-900 (Existing Card/Scrollbar Track)
                },
                'ds-primary': {
                    light: '#0f172a', // slate-900
                    dark: '#e2e8f0',  // slate-200 (Existing Body Text)
                },
                'ds-secondary': {
                    light: '#64748b', // slate-500
                    dark: '#94a3b8',  // slate-400
                },
                'ds-muted': {
                    light: '#94a3b8', // slate-400
                    dark: '#334155',  // slate-700 (Existing Scrollbar Thumb)
                },
                'ds-accent': {
                    light: '#e2e8f0', // slate-200
                    dark: '#1e293b',  // slate-850
                },
                'ds-border': {
                    light: '#e2e8f0', // slate-200
                    dark: '#1e293b',  // slate-850
                },
                'ds-input': {
                    light: '#e2e8f0', // slate-200
                    dark: '#1e293b',  // slate-850
                },
                'ds-ring': {
                    light: '#0f172a', // slate-900
                    dark: '#e2e8f0',  // slate-200
                },
                // Sidebar specific
                'ds-sidebar-background': {
                    light: '#FFFFFF',
                    dark: '#020617', // slate-950
                },
                'ds-sidebar-foreground': {
                    light: '#0f172a',
                    dark: '#e2e8f0',
                },
                'ds-sidebar-border': {
                    light: '#e2e8f0',
                    dark: '#1e293b',
                },
                // Status colors
                'ds-success': '#10b981', // emerald-500
                'ds-warning': '#f59e0b', // amber-500
                'ds-destructive': '#ef4444', // red-500
                // Action colors - Primary action buttons (modals, forms, CTAs)
                'ds-action': '#4f46e5', // indigo-600
                'ds-action-hover': '#4338ca', // indigo-700

                // Extended Palette
                'ds-in-deepteal': {
                    50: '#06778E',
                    100: '#025B6D',
                    200: '#013843',
                    300: '#003641',
                    400: '#002F38',
                    500: '#002D36',
                    600: '#002830',
                    700: '#00252C',
                    800: '#001F25',
                    900: '#00181D',
                    950: '#000A0D',
                },
                'ds-in-teal': {
                    50: '#F0FDFA',
                    100: '#CBFBF1',
                    200: '#96F7E4',
                    300: '#1DE4D4',
                    400: '#00D5BE',
                    500: '#00BBA7',
                    600: '#009689',
                    700: '#00786F',
                    800: '#274654',
                    900: '#203947',
                    950: '#022F2E',
                },
                'ds-in-indigo': {
                    50: '#DFEDF9',
                    100: '#C8D8E6',
                    200: '#B2C1CE',
                    300: '#7A8FA1',
                    400: '#4F677D',
                    500: '#253A4C',
                    600: '#1D2E3E',
                    700: '#182836',
                    800: '#15212F',
                    900: '#161C29',
                    950: '#0E131F',
                },
                'ds-in-sky': {
                    50: '#F0F9FF',
                    100: '#DFF2FE',
                    200: '#B8E6FE',
                    300: '#74D4FF',
                    400: '#00BCFF',
                    500: '#00A6F4',
                    600: '#0084D1',
                    700: '#0069A8',
                    800: '#00598A',
                    900: '#024A70',
                    950: '#052F4A',
                },
                'ds-in-success': {
                    50: '#F0FDF4',
                    100: '#DCFCE7',
                    200: '#B9F8CF',
                    300: '#60EF97',
                    400: '#05DF72',
                    500: '#00C951',
                    600: '#00A63E',
                    700: '#008236',
                    800: '#016630',
                    900: '#0D542B',
                    950: '#052E16',
                },
                'ds-in-destructive': {
                    50: '#FEF2F2',
                    100: '#FFE2E2',
                    200: '#FFC9C9',
                    300: '#FFA2A2',
                    400: '#EF4749',
                    500: '#F21F13',
                    600: '#E7000B',
                    700: '#C10007',
                    800: '#9F0712',
                    900: '#82181A',
                    950: '#460809',
                },
                'ds-in-warning': {
                    50: '#FEFCE8',
                    100: '#FEF9C2',
                    200: '#FFF085',
                    300: '#FFDF20',
                    400: '#F8A435',
                    500: '#EC9116',
                    600: '#D08700',
                    700: '#A65F00',
                    800: '#894B00',
                    900: '#733E0A',
                    950: '#432004',
                },
                'ds-in-orange': {
                    50: '#FFF7ED',
                    100: '#FFEDD4',
                    200: '#FFD6A8',
                    300: '#FFB86A',
                    400: '#FB7B40',
                    500: '#F35F1B',
                    600: '#F54A00',
                    700: '#CA3500',
                    800: '#9F2D00',
                    900: '#7E2A0C',
                    950: '#441306',
                },
                'ds-in-violet': {
                    50: '#F5F3FF',
                    100: '#EDE9FE',
                    200: '#DDD6FF',
                    300: '#C4B4FF',
                    400: '#A684FF',
                    500: '#8E51FF',
                    600: '#7F22FE',
                    700: '#7008E7',
                    800: '#5D0EC0',
                    900: '#4D179A',
                    950: '#2E1065',
                },
            }
        },
    },
    plugins: [],
}
