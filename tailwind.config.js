/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    base: "/portfolio2/",
    theme: {
        extend: {
            colors: {
                cyan: "#00f3ff",
                purple: "#bd00ff",
                dark: "#0a0a0a",
                darker: "#050505",
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
