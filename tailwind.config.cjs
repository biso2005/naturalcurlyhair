/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,md,mdx,js,jsx,ts,tsx}'],
  safelist: [
    // md:hidden on the mobile menu button is JS-toggled and gets dropped by JIT
    // without this entry. See CLAUDE.md hard rule 8.
    { pattern: /^hidden$/, variants: ['md'] },
    // hub colour classes — used in HubLanding and SpokeIndex but only
    // appear when a specific-hub article or hub page is rendered.
    'bg-hub-hair-care',    'border-l-hub-hair-care',
    'bg-hub-products',     'border-l-hub-products',
    'bg-hub-parents',      'border-l-hub-parents',
    'bg-hub-hair-problems', 'border-l-hub-hair-problems',
    'bg-hub-reviews',      'border-l-hub-reviews',
  ],
  theme: {
    extend: {
      colors: {
        cream:     '#F8F3EA',
        'cream-2': '#F1E8D9',
        paper:     '#FFFFFF',
        ink:       '#2C1D17',
        plum:      '#3E2230',
        berry: {
          DEFAULT: '#A2384B',
          dark:    '#8A2E3F',
        },
        ochre:     '#B97A2B',
        taupe:     '#6E6056',
        danger:    '#9C3A1A',
        line: {
          DEFAULT: 'rgba(44,29,23,0.14)',
          strong:  'rgba(44,29,23,0.28)',
        },
        hub: {
          '2a': '#93AAAC', '2b': '#6F8E92', '2c': '#4E7176',
          '3a': '#CB987E', '3b': '#A57256', '3c': '#82513A',
          '4a': '#9C7494', '4b': '#765577', '4c': '#553D62',
          'hair-care': '#9DA475',
          products: '#A89042',
          parents: '#7A6B8A',
          'hair-problems': '#A2384B',
          reviews: '#3E2230',
        },
      },
      fontFamily: {
        serif:  ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        prose:  ['"Newsreader"', 'ui-serif', 'Georgia', 'serif'],
        sans:   ['"Public Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono:   ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      fontSize: {
        xs:    ['0.75rem',  { lineHeight: '1.45' }],
        sm:    ['0.875rem', { lineHeight: '1.45' }],
        base:  ['1rem',     { lineHeight: '1.65' }],
        lg:    ['1.125rem', { lineHeight: '1.5'  }],
        xl:    ['1.25rem',  { lineHeight: '1.25' }],
        '2xl': ['1.5rem',   { lineHeight: '1.2'  }],
        '3xl': ['1.875rem', { lineHeight: '1.15' }],
        '4xl': ['2.25rem',  { lineHeight: '1.1'  }],
        '5xl': ['3rem',     { lineHeight: '1.05' }],
      },
      letterSpacing: {
        tighter: '-0.022em',
        tight:   '-0.018em',
        snug:    '-0.012em',
        wide:    '0.05em',
        wider:   '0.10em',
      },
      borderRadius: {
        sm: '4px', md: '8px', lg: '12px', xl: '16px',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(44,29,23,0.06)',
        md: '0 4px 12px rgba(44,29,23,0.10)',
      },
      maxWidth: {
        prose: '720px',
        table: '960px',
        hub:   '1200px',
      },
      typography: {
        ink: {
          css: {
            '--tw-prose-body':       '#2C1D17',
            '--tw-prose-headings':   '#2C1D17',
            '--tw-prose-links':      '#A2384B',
            '--tw-prose-bold':       '#2C1D17',
            '--tw-prose-counters':   '#6E6056',
            '--tw-prose-bullets':    '#6E6056',
            '--tw-prose-hr':         'rgba(44,29,23,0.14)',
            '--tw-prose-quotes':     '#2C1D17',
            '--tw-prose-code':       '#2C1D17',
            '--tw-prose-th-borders': 'rgba(44,29,23,0.28)',
            '--tw-prose-td-borders': 'rgba(44,29,23,0.14)',
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
