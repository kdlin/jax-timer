// tailwind.config.js — color tokens copied directly from the HTML mockup files
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./src/renderer/**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'on-primary': '#1a1c1c',
        'outline-variant': '#474747',
        'surface-bright': '#393939',
        'on-primary-fixed-variant': '#e2e2e2',
        'secondary-fixed': '#c8c6c5',
        'on-secondary-fixed-variant': '#3c3b3b',
        'tertiary-fixed': '#006d41',
        'surface-tint': '#c6c6c7',
        'surface-dim': '#131313',
        'on-primary-container': '#000000',
        'primary-fixed-dim': '#454747',
        'on-secondary-container': '#e5e2e1',
        'surface-container': '#1f1f1f',
        'secondary-fixed-dim': '#adabaa',
        'surface-container-low': '#1b1b1b',
        'surface-container-highest': '#353535',
        'secondary-container': '#474746',
        'surface-container-lowest': '#0e0e0e',
        'inverse-on-surface': '#303030',
        'tertiary-container': '#00a666',
        'on-secondary': '#1c1b1b',
        'surface-container-high': '#2a2a2a',
        'on-error': '#690005',
        'on-tertiary': '#002110',
        tertiary: '#6bfdaf',
        background: '#131313',
        'inverse-primary': '#5d5f5f',
        'on-surface-variant': '#c6c6c6',
        'on-surface': '#e2e2e2',
        error: '#ffb4ab',
        primary: '#ffffff',
        'primary-container': '#d4d4d4',
        'inverse-surface': '#e2e2e2',
        'primary-fixed': '#5d5f5f',
        'on-secondary-fixed': '#1c1b1b',
        secondary: '#c8c6c5',
        outline: '#919191',
        'on-tertiary-container': '#000000',
        'surface-variant': '#353535',
        'on-primary-fixed': '#ffffff',
        'on-error-container': '#ffdad6',
        surface: '#131313',
        'error-container': '#93000a',
        'on-tertiary-fixed-variant': '#6bfdaf',
        'on-background': '#e2e2e2',
        'tertiary-fixed-dim': '#005230',
        'on-tertiary-fixed': '#ffffff',
        'break-accent': '#f19a8e'
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
        full: '9999px'
      },
      fontFamily: {
        headline: ['Inter'],
        body: ['Inter'],
        label: ['Inter']
      }
    }
  },
  plugins: []
}
