/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        // ── BRAND SYSTEM — matched to logo ────────────────────────
        // Primary  = deep wine/burgundy swooshes in logo
        // Secondary = dark slate/charcoal heads in logo
        primary:             '#8B1A4A',   // deep wine burgundy
        'primary-dark':      '#5E0F30',   // darker pressed state
        'primary-mid':       '#A02057',   // mid hover
        'primary-light':     '#E8B4C8',   // soft tint
        'primary-container': '#F5D6E3',   // card/chip background

        secondary:           '#2D3A4A',   // dark slate (logo heads)
        'secondary-dark':    '#1A2330',   // deeper
        'secondary-light':   '#8A9BAD',   // muted tint
        'secondary-container':'#E8EDF2',  // card background

        // ── SURFACE / NEUTRAL ─────────────────────────────────────
        surface:                  '#FFFFFF',
        'surface-low':            '#FBF5F8',
        'surface-container':      '#F5E8EF',
        'surface-container-low':  '#FAF0F5',
        'surface-container-high': '#EDD0DC',
        'surface-container-lowest':'#FFFFFF',
        'surface-container-highest':'#E5C0D0',
        'surface-bright':         '#FFFFFF',
        'surface-dim':            '#E0C8D4',
        'surface-variant':        '#F5E8EF',

        // ── ON-COLORS ─────────────────────────────────────────────
        'on-primary':            '#FFFFFF',
        'on-primary-container':  '#5E0F30',
        'on-secondary':          '#FFFFFF',
        'on-secondary-container':'#1A2330',
        'on-surface':            '#1A1A1A',
        'on-surface-variant':    '#4A4A4A',
        'on-background':         '#1A1A1A',

        // ── SEMANTIC ──────────────────────────────────────────────
        error:              '#BA1A1A',
        'error-container':  '#FFDAD6',
        'on-error':         '#FFFFFF',
        'on-error-container':'#93000A',

        // ── OUTLINE ───────────────────────────────────────────────
        outline:            '#9A7A88',
        'outline-variant':  '#E5C8D4',

        // ── INVERSE ───────────────────────────────────────────────
        'inverse-surface':     '#2D1520',
        'inverse-on-surface':  '#FDEEF4',
        'inverse-primary':     '#E8B4C8',

        // ── LEGACY ALIASES ────────────────────────────────────────
        tertiary:              '#8B1A4A',
        'tertiary-container':  '#E8B4C8',
        'on-tertiary':         '#FFFFFF',
        'on-tertiary-container':'#5E0F30',

        // ── SHADCN TOKENS ─────────────────────────────────────────
        border:      "hsl(var(--border))",
        input:       "hsl(var(--input))",
        ring:        "hsl(var(--ring))",
        background:  "hsl(var(--background))",
        foreground:  "hsl(var(--foreground))",
      },
      fontFamily: {
        sans:     ['Inter', 'system-ui', 'sans-serif'],
        display:  ['Manrope', 'sans-serif'],
        headline: ['Manrope', 'sans-serif'],
        body:     ['Inter', 'sans-serif'],
        label:    ['Inter', 'sans-serif'],
      },
      borderRadius: {
        clinical: '0.75rem',
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        ambient:   '0 20px 40px rgba(139, 26, 74, 0.08)',
        glass:     '0 4px 30px rgba(139, 26, 74, 0.06)',
        primary:   '0 8px 32px rgba(139, 26, 74, 0.28)',
        secondary: '0 8px 32px rgba(45, 58, 74, 0.22)',
      },
      backdropBlur: { glass: '20px' },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up":   "accordion-up 0.2s ease-out",
        "shine-pulse": "shine-pulse var(--shine-pulse-duration) infinite linear",
        "star-btn": "star-btn calc(var(--duration)*1s) linear infinite",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to:   { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to:   { height: 0 },
        },
        "shine-pulse": {
          "0%": {
            "background-position": "0% 0%",
          },
          "50%": {
            "background-position": "100% 100%",
          },
          to: {
            "background-position": "0% 0%",
          },
        },
        "star-btn": {
          "0%": {
            "offset-distance": "0%",
          },
          "100%": {
            "offset-distance": "100%",
          },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
