module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                critical: '#DC2626',
                high: '#F97316',
                moderate: '#EAB308',
                low: '#22C55E',
                primary: '#3B82F6',
                secondary: '#64748B',
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }
        },
    },
    plugins: [],
}