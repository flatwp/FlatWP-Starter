import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      typography: ({ theme }: { theme: (path: string) => string }) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': theme('colors.foreground'),
            '--tw-prose-headings': theme('colors.foreground'),
            '--tw-prose-links': theme('colors.primary.DEFAULT'),
            '--tw-prose-bold': theme('colors.foreground'),
            '--tw-prose-counters': theme('colors.muted.foreground'),
            '--tw-prose-bullets': theme('colors.muted.foreground'),
            '--tw-prose-hr': theme('colors.border'),
            '--tw-prose-quotes': theme('colors.foreground'),
            '--tw-prose-quote-borders': theme('colors.primary.DEFAULT'),
            '--tw-prose-captions': theme('colors.muted.foreground'),
            '--tw-prose-code': theme('colors.primary.DEFAULT'),
            '--tw-prose-pre-code': theme('colors.foreground'),
            '--tw-prose-pre-bg': theme('colors.card.DEFAULT'),
            '--tw-prose-th-borders': theme('colors.border'),
            '--tw-prose-td-borders': theme('colors.border'),
            maxWidth: 'none',
            color: 'var(--tw-prose-body)',
            fontSize: '1.0625rem',
            lineHeight: '1.75',

            // Headings
            h1: {
              color: 'var(--tw-prose-headings)',
              fontWeight: '700',
              fontSize: '2.25rem',
              marginTop: '0',
              marginBottom: '0.875em',
              lineHeight: '1.2',
            },
            h2: {
              color: 'var(--tw-prose-headings)',
              fontWeight: '700',
              fontSize: '1.875rem',
              marginTop: '2em',
              marginBottom: '1em',
              lineHeight: '1.3',
            },
            h3: {
              color: 'var(--tw-prose-headings)',
              fontWeight: '600',
              fontSize: '1.5rem',
              marginTop: '1.6em',
              marginBottom: '0.6em',
              lineHeight: '1.4',
            },
            h4: {
              color: 'var(--tw-prose-headings)',
              fontWeight: '600',
              fontSize: '1.25rem',
              marginTop: '1.5em',
              marginBottom: '0.5em',
            },

            // Paragraphs
            p: {
              marginTop: '1.25em',
              marginBottom: '1.25em',
            },

            // Links
            a: {
              color: 'var(--tw-prose-links)',
              textDecoration: 'none',
              fontWeight: '500',
              '&:hover': {
                textDecoration: 'underline',
              },
            },

            // Lists
            ul: {
              marginTop: '1.25em',
              marginBottom: '1.25em',
              paddingLeft: '1.625em',
            },
            ol: {
              marginTop: '1.25em',
              marginBottom: '1.25em',
              paddingLeft: '1.625em',
            },
            li: {
              marginTop: '0.5em',
              marginBottom: '0.5em',
            },
            'ul > li': {
              paddingLeft: '0.375em',
            },
            'ol > li': {
              paddingLeft: '0.375em',
            },

            // Code
            code: {
              color: 'var(--tw-prose-code)',
              backgroundColor: 'hsl(var(--primary) / 0.1)',
              borderRadius: '0.25rem',
              padding: '0.125rem 0.375rem',
              fontWeight: '500',
              fontSize: '0.875em',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            pre: {
              color: 'var(--tw-prose-pre-code)',
              backgroundColor: 'var(--tw-prose-pre-bg)',
              overflowX: 'auto',
              borderRadius: '0.5rem',
              border: `1px solid ${theme('colors.border')}`,
              padding: '1rem',
              marginTop: '1.75em',
              marginBottom: '1.75em',
            },
            'pre code': {
              backgroundColor: 'transparent',
              borderWidth: '0',
              borderRadius: '0',
              padding: '0',
              fontWeight: 'inherit',
              color: 'inherit',
              fontSize: 'inherit',
              fontFamily: 'inherit',
              lineHeight: 'inherit',
            },

            // Blockquotes
            blockquote: {
              fontWeight: '400',
              fontStyle: 'italic',
              color: 'var(--tw-prose-quotes)',
              borderLeftWidth: '0.25rem',
              borderLeftColor: 'var(--tw-prose-quote-borders)',
              quotes: '"\\201C""\\201D""\\2018""\\2019"',
              marginTop: '1.6em',
              marginBottom: '1.6em',
              paddingLeft: '1em',
            },

            // Images
            img: {
              marginTop: '2em',
              marginBottom: '2em',
              borderRadius: '0.5rem',
            },

            // Horizontal rules
            hr: {
              borderColor: 'var(--tw-prose-hr)',
              marginTop: '3em',
              marginBottom: '3em',
            },

            // Tables
            table: {
              width: '100%',
              tableLayout: 'auto',
              textAlign: 'left',
              marginTop: '2em',
              marginBottom: '2em',
            },
            thead: {
              borderBottomWidth: '1px',
              borderBottomColor: 'var(--tw-prose-th-borders)',
            },
            'thead th': {
              color: 'var(--tw-prose-headings)',
              fontWeight: '600',
              verticalAlign: 'bottom',
              paddingRight: '0.5714286em',
              paddingBottom: '0.5714286em',
              paddingLeft: '0.5714286em',
            },
            'tbody tr': {
              borderBottomWidth: '1px',
              borderBottomColor: 'var(--tw-prose-td-borders)',
            },
            'tbody td': {
              verticalAlign: 'baseline',
              paddingTop: '0.5714286em',
              paddingRight: '0.5714286em',
              paddingBottom: '0.5714286em',
              paddingLeft: '0.5714286em',
            },
          },
        },
      }),
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
  ],
};

export default config;
