import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['Open Sans', 'Lato', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['Inter', 'Poppins', 'system-ui', '-apple-system', 'sans-serif'],
        body: ['Open Sans', 'Lato', 'system-ui', '-apple-system', 'sans-serif'],
        accent: ['Crimson Text', 'Georgia', 'serif'],
      },
      fontSize: {
        'h1': ['48px', { lineHeight: '1.2', fontWeight: '700' }],
        'h1-mobile': ['32px', { lineHeight: '1.2', fontWeight: '700' }],
        'h2': ['40px', { lineHeight: '1.2', fontWeight: '600' }],
        'h2-mobile': ['28px', { lineHeight: '1.2', fontWeight: '600' }],
        'h3': ['32px', { lineHeight: '1.2', fontWeight: '600' }],
        'h3-mobile': ['24px', { lineHeight: '1.2', fontWeight: '600' }],
        'h4': ['24px', { lineHeight: '1.2', fontWeight: '500' }],
        'h4-mobile': ['20px', { lineHeight: '1.2', fontWeight: '500' }],
        'body-lg': ['18px', { lineHeight: '1.6', fontWeight: '400' }],
        'body': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '1.6', fontWeight: '400' }],
      },
      spacing: {
        'section': '80px',
        'section-mobile': '48px',
        'component': '24px',
      },
			colors: {
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
					light: "hsl(var(--primary-light))",
					dark: "hsl(var(--primary-dark))",
				},
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        coral: {
          DEFAULT: "hsl(var(--coral))",
          foreground: "hsl(var(--coral-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        'button': '8px',
        'card': '12px',
        'image': '8px',
      },
      boxShadow: {
        'card': 'var(--shadow-card)',
        'card-hover': 'var(--shadow-card-hover)',
        'button-hover': 'var(--shadow-button-hover)',
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "fade-up": {
          from: {
            opacity: "0",
            transform: "translateY(20px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "fade-in": {
          from: {
            opacity: "0",
          },
          to: {
            opacity: "1",
          },
        },
        "slide-in": {
          from: {
            transform: "translateX(100%)",
          },
          to: {
            transform: "translateX(0)",
          },
        },
        "ken-burns": {
          "0%": {
            transform: "scale(1)",
          },
          "100%": {
            transform: "scale(1.1)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 0.6s ease-out forwards",
        "fade-in": "fade-in 0.4s ease-out forwards",
        "slide-in": "slide-in 0.3s ease-out",
        "ken-burns": "ken-burns 20s ease-out infinite alternate",
      },
      backgroundImage: {
        "gradient-hero": "linear-gradient(135deg, hsl(var(--primary-light)), hsl(var(--primary-dark)))",
        "gradient-teal": "linear-gradient(135deg, hsl(var(--primary-light)), hsl(var(--primary)))",
        "gradient-subtle": "var(--gradient-subtle)",
      },
      boxShadow: {
        "card": "var(--shadow-card)",
        "card-hover": "var(--shadow-card-hover)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
