/**
 * EssayFlow design tokens — single source of truth.
 * Consumed by tailwind.config.ts (which also emits the colour CSS variables)
 * and by client components that need motion / layout constants.
 *
 * Rules:
 *  - `ink-3` (#9A9A9A) is for icons, placeholders and disabled text only (contrast < 4.5:1 on white).
 *  - Status colours (success / warning / danger) exist only for task/submission status semantics.
 *  - `accent` is reserved for AI, active/selected state and subtle progress emphasis.
 */

export const palette = {
  light: {
    bg: '#FFFFFF',
    surface: '#F7F7F7',
    muted: '#F2F2F2',
    ink: '#141414',
    'ink-2': '#6B6B6B',
    'ink-3': '#9A9A9A',
    line: '#E8E8E8',
    accent: '#4C5BD4',
    'accent-soft': '#EEF0FD',
    'accent-line': '#D5D9F7',
    'on-accent': '#FFFFFF',
    success: '#187A50',
    'success-soft': '#E7F5EE',
    warning: '#8F5A0E',
    'warning-soft': '#FBF2E2',
    danger: '#B3312A',
    'danger-soft': '#FCEBE9',
  },
  // Defined now so Module 14 (Preferences: Light / Dark) only needs to toggle data-theme="dark".
  dark: {
    bg: '#0E0E0F',
    surface: '#151516',
    muted: '#1C1C1E',
    ink: '#F2F2F2',
    'ink-2': '#A1A1A1',
    'ink-3': '#6B6B6B',
    line: '#2A2A2C',
    accent: '#8F9BFF',
    'accent-soft': '#1D2038',
    'accent-line': '#33385F',
    'on-accent': '#0E0E0F',
    success: '#4CC38A',
    'success-soft': '#12281E',
    warning: '#E0A24A',
    'warning-soft': '#2B2110',
    danger: '#F0776E',
    'danger-soft': '#2E1614',
  },
} as const;

export type ColorToken = keyof typeof palette.light;

export function hexToChannels(hex: string): string {
  const n = parseInt(hex.replace('#', ''), 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}

/** 8 / 12 / 16 / 24 / 32 / 40 / 48 / 64 / 80 / 96 / 120 (+ 20 for the mobile gutter, + 2/4 for micro gaps). */
export const spacing: Record<string, string> = {
  0: '0px',
  px: '1px',
  0.5: '2px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
  30: '120px',
};

export const radius: Record<string, string> = {
  none: '0px',
  DEFAULT: '10px',
  sm: '10px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  full: '9999px',
};

export const shadows: Record<string, string> = {
  none: 'none',
  soft: '0 1px 2px rgba(20,20,20,0.04), 0 8px 24px -12px rgba(20,20,20,0.08)',
  lift: '0 2px 4px rgba(20,20,20,0.04), 0 16px 40px -16px rgba(20,20,20,0.14)',
  panel: '0 1px 2px rgba(20,20,20,0.04), 0 32px 72px -32px rgba(20,20,20,0.2)',
  ai: '0 0 0 4px rgba(76,91,212,0.08)',
};

type FontSizeEntry = [string, { lineHeight: string; letterSpacing?: string; fontWeight?: string }];

export const fontSize: Record<string, FontSizeEntry> = {
  // Large display 64–80px (fluid, tops out at 72px)
  display: ['clamp(2.5rem, 1rem + 3.6vw, 4.5rem)', { lineHeight: '1.04', letterSpacing: '-0.035em', fontWeight: '600' }],
  // Page headings 40–52px
  page: ['clamp(2rem, 1.2rem + 2.4vw, 3.25rem)', { lineHeight: '1.1', letterSpacing: '-0.03em', fontWeight: '600' }],
  // Section headings 30–40px
  section: ['clamp(1.875rem, 1.4rem + 1.4vw, 2.5rem)', { lineHeight: '1.15', letterSpacing: '-0.025em', fontWeight: '600' }],
  // Subheadings 20–24px
  sub: ['clamp(1.25rem, 1.1rem + 0.5vw, 1.5rem)', { lineHeight: '1.3', letterSpacing: '-0.015em', fontWeight: '600' }],
  // Body 15–17px
  'body-lg': ['1.0625rem', { lineHeight: '1.65' }],
  body: ['1rem', { lineHeight: '1.6' }],
  'body-sm': ['0.9375rem', { lineHeight: '1.55' }],
  // Metadata 12–14px
  meta: ['0.8125rem', { lineHeight: '1.45' }],
  caption: ['0.75rem', { lineHeight: '1.4' }],
};

export const screens: Record<string, string> = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1440px',
};

export const layout = {
  contentWidth: 1280,
  marketingWidth: 1400,
  mobileGutter: 20,
} as const;

export const motionTokens = {
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  duration: { fast: 0.18, base: 0.32, slow: 0.6 },
  stagger: 0.08,
} as const;
