const { fontFamily } = require("tailwindcss/defaultTheme")

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{html,js,jsx,ts,tsx}", // Đảm bảo các tệp nguồn của bạn được bao gồm
    "./components/ui/**/*.{js,ts,jsx,tsx}", // Thêm dòng này
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
        mono: ["var(--font-geist-mono)", ...fontFamily.mono],
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
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
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
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
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
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(20%)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-6px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(6px)" },
        },
        // Custom animations for scroll effects
        flyInLeft: {
          from: {
            opacity: "0",
            transform: "translateX(-100px) rotate(-5deg)",
          },
          to: {
            opacity: "1",
            transform: "translateX(0) rotate(0deg)",
          },
        },
        flyInRight: {
          from: {
            opacity: "0",
            transform: "translateX(100px) rotate(5deg)",
          },
          to: {
            opacity: "1",
            transform: "translateX(0) rotate(0deg)",
          },
        },
        flyInUp: {
          from: {
            opacity: "0",
            transform: "translateY(80px) scale(0.9)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0) scale(1)",
          },
        },
        flyInDown: {
          from: {
            opacity: "0",
            transform: "translateY(-80px) scale(0.9)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0) scale(1)",
          },
        },
        zoomIn: {
          from: {
            opacity: "0",
            transform: "scale(0.5) rotate(10deg)",
          },
          to: {
            opacity: "1",
            transform: "scale(1) rotate(0deg)",
          },
        },
        bounceIn: {
          "0%": {
            opacity: "0",
            transform: "scale(0.3) translateY(-50px)",
          },
          "50%": {
            opacity: "1",
            transform: "scale(1.05) translateY(-10px)",
          },
          "70%": {
            transform: "scale(0.95) translateY(0)",
          },
          "100%": {
            opacity: "1",
            transform: "scale(1) translateY(0)",
          },
        },
        flipIn: {
          from: {
            opacity: "0",
            transform: "perspective(400px) rotateY(90deg)",
          },
          to: {
            opacity: "1",
            transform: "perspective(400px) rotateY(0deg)",
          },
        },
        float: {
          "0%, 100%": {
            transform: "translateY(0px)",
          },
          "50%": {
            transform: "translateY(-20px)",
          },
        },
        pulseGlow: {
          "0%, 100%": {
            boxShadow: "0 0 20px hsl(var(--primary) / 0.3)",
          },
          "50%": {
            boxShadow: "0 0 40px hsl(var(--primary) / 0.6)",
          },
        },
        slideInDiagonal: {
          from: {
            opacity: "0",
            transform: "translate(-50px, -50px) rotate(-10deg)",
          },
          to: {
            opacity: "1",
            transform: "translate(0, 0) rotate(0deg)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        "fade-in": "fade-in 0.3s ease-out forwards",
        shake: "shake 0.4s ease-in-out",
        // Custom scroll animations
        "fly-in-left": "flyInLeft 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards",
        "fly-in-right": "flyInRight 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards",
        "fly-in-up": "flyInUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards",
        "fly-in-down": "flyInDown 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards",
        "zoom-in": "zoomIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards",
        "bounce-in": "bounceIn 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards",
        "flip-in": "flipIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards",
        float: "float 3s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "slide-diagonal": "slideInDiagonal 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/container-queries"), require("tailwind-scrollbar")],
}
