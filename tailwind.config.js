/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                steam: {
                    bg: '#171a21',      // Very dark grey (Global background)
                    card: '#1b2838',    // Dark blue (Card background)
                    accent: '#2a475e',  // Medium blue (Header/Highlight)
                    blue: '#66c0f4',    // Bright blue (Text highlight/Links)
                    text: '#c6d4df',    // Light grey blue (Standard text)
                    green: '#a4d007',   // Steam Green
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
