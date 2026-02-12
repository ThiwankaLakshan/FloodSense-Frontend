/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0B5ED7',    // Deep Blue
        secondary: '#4FD1C5',  // Aqua Blue
        'risk-low': '#22C55E',       // Green
        'risk-moderate': '#FACC15',  // Yellow
        'risk-high': '#F97316',      // Orange
        'risk-critical': '#EF4444',  // Red
        'soft-white': '#F8FAFC',     // Background
        'dark-navy': '#0F172A',      // Text Primary
        'text-gray': '#64748B',      // Text Secondary
        'light-gray': '#E2E8F0',     // Border
        critical: '#DC2626',
        high: '#F97316',
        moderate: '#EAB308',
        low: '#22C55E',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
