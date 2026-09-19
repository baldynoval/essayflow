import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';
import { fontSize, hexToChannels, palette, radius, screens, shadows, spacing, type ColorToken } from './src/design/tokens';

const colorKeys = Object.keys(palette.light) as ColorToken[];

const colors = Object.fromEntries(
  colorKeys.map((key) => [key, `rgb(var(--ef-${key}) / <alpha-value>)`]),
) as Record<string, string>;

const cssVars = (mode: 'light' | 'dark') =>
  Object.fromEntries(colorKeys.map((key) => [`--ef-${key}`, hexToChannels(palette[mode][key])]));

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    screens,
    spacing,
    borderRadius: radius,
    boxShadow: shadows,
    fontSize,
    colors: { transparent: 'transparent', current: 'currentColor', ...colors },
    extend: {
      fontFamily: {
        sans: ['"Inter Variable"', 'Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      maxWidth: {
        content: '1280px',
        marketing: '1400px',
        copy: '36rem',
        'copy-lg': '44rem',
      },
      transitionTimingFunction: {
        'ef-out': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [
    plugin(({ addBase }) => {
      addBase({
        ':root': cssVars('light'),
        '[data-theme="dark"]': cssVars('dark'),
      });
    }),
  ],
};

export default config;
