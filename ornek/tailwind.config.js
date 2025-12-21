/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    // DS renklerini kesinlikle derle
    { pattern: /^bg-ds-in-(deepteal|teal|slate|indigo|sky|success|green|destructive|warning|orange|lime|gray|zinc|neutral|stone|amber|cyan|violet|fuchsia|pink|rose)-(50|100|200|300|400|500|600|700|800|900|950)$/ },
    { pattern: /^text-ds-in-(deepteal|teal|slate|indigo|sky|success|green|destructive|warning|orange|lime|gray|zinc|neutral|stone|amber|cyan|violet|fuchsia|pink|rose)-(50|100|200|300|400|500|600|700|800|900|950)$/ },
    { pattern: /^border-ds-in-(deepteal|teal|slate|indigo|sky|success|green|destructive|warning|orange|lime|gray|zinc|neutral|stone|amber|cyan|violet|fuchsia|pink|rose)-(50|100|200|300|400|500|600|700|800|900|950)$/ },
    { pattern: /^bg-ds-(background|card|border|secondary|primary|destructive|warning|success|sidebar-primary|sidebar-border|sidebar-ring|input)(-light|-dark)?$/ },
    { pattern: /^text-ds-(background|card|border|secondary|primary|destructive|warning|success|sidebar-primary|sidebar-border|sidebar-ring|input)(-light|-dark)?$/ },
    { pattern: /^border-ds-(background|card|border|secondary|primary|destructive|warning|success|sidebar-primary|sidebar-border|sidebar-ring|input)(-light|-dark)?$/ },
  ],
  darkMode: 'class', // class-based dark mode
  theme: {
    extend: {
      colors: {
        // Buraya çalışma paletinizi ekleyeceğiz
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        secondary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
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
        'ds-in-slate': {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CAD5E2',
          400: '#90A1B9',
          500: '#62748E',
          600: '#45556C',
          700: '#314158',
          800: '#1D293D',
          900: '#0F172B',
          950: '#020618',
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
        'ds-in-green': {
          50: '#ECFDF5',
          100: '#D0FAE5',
          200: '#A4F4CF',
          300: '#5EE9B5',
          400: '#14DC99',
          500: '#00BC7D',
          600: '#009966',
          700: '#007A55',
          800: '#006045',
          900: '#004F3B',
          950: '#002C22',
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
        'ds-in-lime': {
          50: '#F7FEE7',
          100: '#ECFCCA',
          200: '#D8F999',
          300: '#BBF451',
          400: '#9AE600',
          500: '#7CCF00',
          600: '#5EA500',
          700: '#497D00',
          800: '#3D6300',
          900: '#35530E',
          950: '#192E03',
        },
        'ds-in-gray': {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DC',
          400: '#99A1AF',
          500: '#6A7282',
          600: '#4A5565',
          700: '#364153',
          800: '#1E2939',
          900: '#101828',
          950: '#030712',
        },
        'ds-in-zinc': {
          50: '#FAFAFA',
          100: '#F4F4F5',
          200: '#E4E4E7',
          300: '#D4D4D8',
          400: '#9F9FA9',
          500: '#71717B',
          600: '#52525C',
          700: '#3F3F46',
          800: '#27272A',
          900: '#18181B',
          950: '#09090B',
        },
        'ds-in-neutral': {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A1A1A1',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0A0A0A',
        },
        'ds-in-stone': {
          50: '#FAFAF9',
          100: '#F5F5F4',
          200: '#E7E5E4',
          300: '#D6D3D1',
          400: '#A6A09B',
          500: '#79716B',
          600: '#57534D',
          700: '#44403B',
          800: '#292524',
          900: '#1C1917',
          950: '#0C0A09',
        },
        'ds-in-amber': {
          50: '#FFFBEB',
          100: '#FEF3C6',
          200: '#FEE685',
          300: '#FFD230',
          400: '#FFBA00',
          500: '#FD9A00',
          600: '#E17100',
          700: '#BB4D00',
          800: '#973C00',
          900: '#7B3306',
          950: '#461901',
        },
        'ds-in-cyan': {
          50: '#ECFEFF',
          100: '#CEFAFE',
          200: '#A2F4FD',
          300: '#53EAFD',
          400: '#00D3F2',
          500: '#00B8DB',
          600: '#0092B8',
          700: '#007595',
          800: '#005F78',
          900: '#104E64',
          950: '#053345',
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
        'ds-in-fuchsia': {
          50: '#FDF4FF',
          100: '#FAE8FF',
          200: '#F6CFFF',
          300: '#F4A8FF',
          400: '#ED6BFF',
          500: '#E12AFB',
          600: '#C800DE',
          700: '#A800B7',
          800: '#8A0194',
          900: '#721378',
          950: '#4B004F',
        },
        'ds-in-pink': {
          50: '#FDF2F8',
          100: '#FCE7F3',
          200: '#FCCEE8',
          300: '#FDA5D5',
          400: '#FB64B6',
          500: '#F6339A',
          600: '#E60076',
          700: '#C6005C',
          800: '#A3004C',
          900: '#861043',
          950: '#510424',
        },
        'ds-in-rose': {
          50: '#FFF1F2',
          100: '#FFE4E6',
          200: '#FFCCD3',
          300: '#FFA1AD',
          400: '#FF637E',
          500: '#FF2056',
          600: '#EC003F',
          700: '#C70036',
          800: '#A50036',
          900: '#8B0836',
          950: '#4D0218',
        },
        // Base colors
        'ds-white': '#FFFFFF',
        'ds-black': '#000A0D',
        // Semantic naming - foreground = light mode, normal = dark mode
        'ds-background': {
          light: '#F1F5F9',      // background-foreground (light mode - slate-100)
          dark: '#000A0D',       // background (dark mode)
        },
        'ds-card': {
          light: '#FFFFFF',      // card-foreground (light mode - white)
          dark: '#002830',       // card (dark mode - deepteal-600)
        },
        'ds-popover': {
          light: '#000A0D',      // popover-foreground (light mode - deepteal-950)
          dark: '#15212F',       // popover (dark mode - indigo-800)
        },
        'ds-primary': {
          light: '#F8FAFC',      // primary-foreground (light mode)
          dark: '#00598A',       // primary (dark mode)
        },
        'ds-secondary': {
          light: '#000A0D',      // secondary-foreground (light mode - deepteal-950)
          dark: '#1DE4D4',       // secondary (dark mode - teal-300)
        },
        'ds-muted': {
          light: '#B2C1CE',      // muted-foreground (light mode - indigo-200)
          dark: '#F1F5F9',       // muted (dark mode - slate-100)
        },
        'ds-accent': {
          light: '#0F172B',      // accent-foreground (light mode - slate-900)
          dark: '#1DE4D4',       // accent (dark mode - teal-300)
        },
        'ds-destructive': {
          light: '#F8FAFC',      // destructive-foreground (light mode - slate-50)
          dark: '#EF4749',       // destructive (dark mode - ds-in-destructive-400)
        },
        'ds-border': {
          light: '#E2E8F0',      // border (light mode - slate-200)
          dark: '#274654',       // border (dark mode)
        },
        'ds-input': {
          light: '#E2E8F0',      // input (light mode - slate-200)
          dark: '#274654',       // input (dark mode)
        },
        'ds-ring': {
          light: '#000A0D',      // ring (light mode)
          dark: '#000A0D',       // ring (dark mode - same as light)
        },
        'ds-chart-1': '#E76E50',
        'ds-chart-2': '#2A9D90',
        'ds-chart-3': '#274754',
        'ds-chart-4': '#E8C468',
        'ds-chart-5': '#F4A462',
        'ds-warning': '#F8A435',      // ds-in-warning-400
        'ds-success': '#05DF72',      // ds-in-success-400
        // Sidebar
        'ds-sidebar-primary': {
          light: '#F1F5F9',      // sidebar-primary-foreground (light mode - slate-100)
          dark: '#0F172B',       // sidebar-primary (dark mode - slate-900)
        },
        'ds-sidebar-accent': {
          light: '#0F172B',      // sidebar-accent-foreground (light mode - slate-900)
          dark: '#F1F5F9',       // sidebar-accent (dark mode - slate-100)
        },
        'ds-sidebar-background': {
          light: '#F8FAFC',      // sidebar-background (light mode - slate-50)
          dark: '#0F172B',       // sidebar-background (dark mode - slate-900)
        },
        'ds-sidebar-foreground': {
          light: '#314158',      // sidebar-foreground (light mode - slate-700)
          dark: '#F8FAFC',       // sidebar-foreground (dark mode - slate-50)
        },
        'ds-sidebar-border': {
          light: '#E2E8F0',      // sidebar-border (light mode - slate-200)
          dark: '#274654',       // sidebar-border (dark mode)
        },
        'ds-sidebar-ring': {
          light: '#00598A',      // sidebar-ring (light mode)
          dark: '#00598A',       // sidebar-ring (dark mode)
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'none': '0px',
        'sm': '2px',
        DEFAULT: '4px',
        'md': '6px',
        'lg': '8px',
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
        'full': '9999px',
      },
    },
  },
  plugins: [],
}

