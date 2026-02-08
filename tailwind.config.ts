import type { Config } from "tailwindcss";

const config: Config = {
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
    theme: {
        extend: {
            colors: {
                canvas: "#f8fafc",
                "canvas-alt": "#f0f4f9",
                surface: "#ffffff",
                "surface-muted": "#f8fafc",
                "surface-glass": "rgb(255 255 255 / 0.3)",
                ink: "#000000",
                "ink-hover": "#1f2937",
                "on-ink": "#ffffff",
                "text-primary": "#0f172a",
                "text-secondary": "#334155",
                "text-muted": "#475569",
                "text-subtle": "#64748b",
                "text-faint": "#94a3b8",
                "border-soft": "#f1f5f9",
                "border-subtle": "#e2e8f0",
                "fill-soft": "#f1f5f9",
                "fill-muted": "#f8fafc",
                success: "#16a34a",
                "success-bg": "#dcfce7",
                danger: "#ef4444",
                "danger-hover": "#dc2626",
                "danger-bg": "#fef2f2",
                info: "#3b82f6",
                "focus-ring": "#cbd5e1",
            },
            boxShadow: {
                lift: "0 16px 30px rgb(15 23 42 / 0.12)",
            },
            borderRadius: {
                hero: "2.5rem",
                pill: "999px",
            },
            fontFamily: {
                sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
                display: ["Abhaya Libre", "ui-serif", "serif"],
            },
            fontSize: {
                meta: "0.625rem",
            },
        },
    },
    plugins: [],
};

export default config;
