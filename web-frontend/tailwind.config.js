/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            keyframes: {
                marquee: {
                    '0%': { transform: 'translateX(0%)' },
                    '100%': { transform: 'translateX(-100%)' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideIn: {
                    '0%': { transform: 'translateX(20px)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                }
            },
            animation: {
                marquee: 'marquee 30s linear infinite',
                'fade-in': 'fadeIn 0.5s ease-out forwards',
                'slide-in': 'slideIn 0.3s ease-out forwards',
            },
            colors: {
              "inverse-on-surface": "#53555a",
              "on-tertiary-container": "#f8f1ff",
              "on-primary-fixed": "#004145",
              "secondary-dim": "#006fef",
              "surface-container-highest": "#23262c",
              "secondary-fixed": "#bfd1ff",
              "on-tertiary-fixed": "#1f0052",
              "tertiary-dim": "#874cff",
              "on-error": "#490006",
              "outline": "#74757a",
              "secondary": "#6a9cff",
              "tertiary": "#ac89ff",
              "background": "#0c0e12",
              "on-background": "#f6f6fc",
              "surface-tint": "#99f7ff",
              "inverse-surface": "#f9f9ff",
              "surface-container-low": "#111318",
              "primary-fixed-dim": "#00e2ee",
              "secondary-fixed-dim": "#aac3ff",
              "on-primary-container": "#00555a",
              "error": "#ff716c",
              "on-tertiary": "#290067",
              "on-error-container": "#ffa8a3",
              "on-surface": "#f6f6fc",
              "on-secondary-container": "#f7f7ff",
              "on-primary-fixed-variant": "#006065",
              "error-dim": "#d7383b",
              "on-secondary-fixed-variant": "#004da9",
              "on-tertiary-fixed-variant": "#4700a7",
              "surface-variant": "#23262c",
              "tertiary-fixed-dim": "#b190ff",
              "error-container": "#9f0519",
              "on-primary": "#005f64",
              "outline-variant": "#46484d",
              "tertiary-fixed": "#bda1ff",
              "on-secondary-fixed": "#003172",
              "surface-dim": "#0c0e12",
              "surface-bright": "#292c33",
              "primary-container": "#00f1fe",
              "on-secondary": "#001e4b",
              "primary-fixed": "#00f1fe",
              "surface-container": "#171a1f",
              "on-surface-variant": "#aaabb0",
              "secondary-container": "#005ac4",
              "tertiary-container": "#7000ff",
              "surface": "#0c0e12",
              "primary-dim": "#00e2ee",
              "surface-container-high": "#1d2025",
              "primary": "#99f7ff",
              "surface-container-lowest": "#000000",
              "inverse-primary": "#006a70"
            },
            fontFamily: {
              "headline": ["Space Grotesk", "sans-serif"],
              "body": ["Inter", "sans-serif"],
              "label": ["Inter", "sans-serif"]
            },
            borderRadius: {"DEFAULT": "0.125rem", "lg": "0.25rem", "xl": "0.5rem", "full": "0.75rem"}
        }
    },
    plugins: [],
}
