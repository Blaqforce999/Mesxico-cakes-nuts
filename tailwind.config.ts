import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        'on-primary': 'var(--color-on-primary)',
        'primary-container': 'var(--color-primary-container)',
        'on-primary-container': 'var(--color-on-primary-container)',
        secondary: 'var(--color-secondary)',
        'on-secondary': 'var(--color-on-secondary)',
        'secondary-container': 'var(--color-secondary-container)',
        'on-secondary-container': 'var(--color-on-secondary-container)',
        background: 'var(--color-background)',
        'on-background': 'var(--color-on-background)',
        surface: 'var(--color-surface)',
        'on-surface': 'var(--color-on-surface)',
        'surface-variant': 'var(--color-surface-variant)',
        'on-surface-variant': 'var(--color-on-surface-variant)',
        outline: 'var(--color-outline)',
        'outline-variant': 'var(--color-outline-variant)',
        error: 'var(--color-error)',
        'on-error': 'var(--color-on-error)',
        'error-container': 'var(--color-error-container)',
        'on-error-container': 'var(--color-on-error-container)',
      },
      fontFamily: {
        display: ['var(--font-family-display)', 'Georgia', 'serif'],
        body: ['var(--font-family-body)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Material Design 3 Complete Typography Scale
        'display-lg': [
          'var(--typography-display-large-font-size, 57px)',
          {
            lineHeight: 'var(--typography-display-large-line-height, 64px)',
            letterSpacing: 'var(--typography-display-large-letter-spacing, -0.25px)',
            fontWeight: 'var(--typography-display-large-font-weight, 700)',
          },
        ],
        'display-md': [
          'var(--typography-display-medium-font-size, 45px)',
          {
            lineHeight: 'var(--typography-display-medium-line-height, 52px)',
            letterSpacing: 'var(--typography-display-medium-letter-spacing, 0px)',
            fontWeight: 'var(--typography-display-medium-font-weight, 600)',
          },
        ],
        'display-sm': [
          'var(--typography-display-small-font-size, 36px)',
          {
            lineHeight: 'var(--typography-display-small-line-height, 44px)',
            letterSpacing: 'var(--typography-display-small-letter-spacing, 0px)',
            fontWeight: 'var(--typography-display-small-font-weight, 600)',
          },
        ],
        'headline-lg': [
          'var(--typography-headline-large-font-size, 32px)',
          {
            lineHeight: 'var(--typography-headline-large-line-height, 40px)',
            letterSpacing: 'var(--typography-headline-large-letter-spacing, 0px)',
            fontWeight: 'var(--typography-headline-large-font-weight, 600)',
          },
        ],
        'headline-md': [
          'var(--typography-headline-medium-font-size, 28px)',
          {
            lineHeight: 'var(--typography-headline-medium-line-height, 36px)',
            letterSpacing: 'var(--typography-headline-medium-letter-spacing, 0px)',
            fontWeight: 'var(--typography-headline-medium-font-weight, 600)',
          },
        ],
        'headline-sm': [
          'var(--typography-headline-small-font-size, 24px)',
          {
            lineHeight: 'var(--typography-headline-small-line-height, 32px)',
            letterSpacing: 'var(--typography-headline-small-letter-spacing, 0px)',
            fontWeight: 'var(--typography-headline-small-font-weight, 500)',
          },
        ],
        'title-lg': [
          'var(--typography-title-large-font-size, 22px)',
          {
            lineHeight: 'var(--typography-title-large-line-height, 28px)',
            letterSpacing: 'var(--typography-title-large-letter-spacing, 0px)',
            fontWeight: 'var(--typography-title-large-font-weight, 600)',
          },
        ],
        'title-md': [
          'var(--typography-title-medium-font-size, 16px)',
          {
            lineHeight: 'var(--typography-title-medium-line-height, 24px)',
            letterSpacing: 'var(--typography-title-medium-letter-spacing, 0.15px)',
            fontWeight: 'var(--typography-title-medium-font-weight, 600)',
          },
        ],
        'title-sm': [
          'var(--typography-title-small-font-size, 14px)',
          {
            lineHeight: 'var(--typography-title-small-line-height, 20px)',
            letterSpacing: 'var(--typography-title-small-letter-spacing, 0.1px)',
            fontWeight: 'var(--typography-title-small-font-weight, 500)',
          },
        ],
        'body-lg': [
          'var(--typography-body-large-font-size, 16px)',
          {
            lineHeight: 'var(--typography-body-large-line-height, 24px)',
            letterSpacing: 'var(--typography-body-large-letter-spacing, 0.5px)',
            fontWeight: 'var(--typography-body-large-font-weight, 400)',
          },
        ],
        'body-md': [
          'var(--typography-body-medium-font-size, 14px)',
          {
            lineHeight: 'var(--typography-body-medium-line-height, 20px)',
            letterSpacing: 'var(--typography-body-medium-letter-spacing, 0.25px)',
            fontWeight: 'var(--typography-body-medium-font-weight, 400)',
          },
        ],
        'body-sm': [
          'var(--typography-body-small-font-size, 12px)',
          {
            lineHeight: 'var(--typography-body-small-line-height, 16px)',
            letterSpacing: 'var(--typography-body-small-letter-spacing, 0.4px)',
            fontWeight: 'var(--typography-body-small-font-weight, 400)',
          },
        ],
        'label-lg': [
          'var(--typography-label-large-font-size, 14px)',
          {
            lineHeight: 'var(--typography-label-large-line-height, 20px)',
            letterSpacing: 'var(--typography-label-large-letter-spacing, 0.1px)',
            fontWeight: 'var(--typography-label-large-font-weight, 600)',
          },
        ],
        'label-md': [
          'var(--typography-label-medium-font-size, 12px)',
          {
            lineHeight: 'var(--typography-label-medium-line-height, 16px)',
            letterSpacing: 'var(--typography-label-medium-letter-spacing, 0.5px)',
            fontWeight: 'var(--typography-label-medium-font-weight, 600)',
          },
        ],
        'label-sm': [
          'var(--typography-label-small-font-size, 11px)',
          {
            lineHeight: 'var(--typography-label-small-line-height, 16px)',
            letterSpacing: 'var(--typography-label-small-letter-spacing, 0.5px)',
            fontWeight: 'var(--typography-label-small-font-weight, 500)',
          },
        ],
      },
      borderRadius: {
        DEFAULT: 'var(--border-radius-md, 8px)',
        sm: 'var(--border-radius-sm, 4px)',
        md: 'var(--border-radius-md, 8px)',
        lg: 'var(--border-radius-lg, 12px)',
        xl: 'var(--border-radius-xl, 16px)',
        '2xl': 'var(--border-radius-2xl, 24px)',
        '3xl': 'var(--border-radius-3xl, 32px)',
        full: '9999px',
      },
      borderWidth: {
        DEFAULT: 'var(--border-width-md, 1px)',
        xs: 'var(--border-width-xs, 0.5px)',
        sm: 'var(--border-width-sm, 0.7px)',
        md: 'var(--border-width-md, 1px)',
        lg: 'var(--border-width-lg, 1.5px)',
        xl: 'var(--border-width-xl, 2px)',
        '2xl': 'var(--border-width-2xl, 3px)',
        '3xl': 'var(--border-width-3xl, 4px)',
      },
      minHeight: {
        touch: '44px',
      },
      minWidth: {
        touch: '44px',
      },
      spacing: {
        section: 'var(--spacing-60, 60px)',
        '60px': 'var(--spacing-60, 60px)',
      },
    },
  },
  plugins: [],
};

export default config;
