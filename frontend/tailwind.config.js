/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}", "./src/components/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				palanquin: ["Palanquin", "sans-serif"],
				montserrat: ["Montserrat", "sans-serif"],
			},
			keyframes: {
				blink: {
					"0%, 100%": { opacity: "1" },
					"50%": { opacity: "0" },
				},
			},
			animation: {
				blink: "blink 1s step-end infinite",
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
}
