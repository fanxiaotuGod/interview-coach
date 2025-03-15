/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"], // ✅ Ensure all files are scanned
    theme: {
        extend: {},  // ✅ Extend Tailwind defaults (optional)
    },
    plugins: [],   // ✅ Add Tailwind plugins here if needed
};
