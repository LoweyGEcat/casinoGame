/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      width: {
        '26rem': '26rem',
        '78': '78%',
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'custom-dark': '#002838',
        'custom-light': '#7AD2AF',

      },
      fontFamily: {
        jaro: ['Jaro', 'sans-serif'], 
        robotoSans: ['Roboto', 'sans-serif'], 
        jainiPurva: ['Jaini Purva', 'sans-serif'], 
      },
      backgroundImage: {
        'Button-gradient': 'linear-gradient(to bottom, #B4C5FB, #180CFF)',
        'text-gradient': 'linear-gradient(to right, #E88345, #AEAF6C)',
        'user-name': 'linear-gradient(to right, #DC2424, #999999)',
        'rightBar-Button': 'linear-gradient(to right, #EB4C3D, #1664AD)',
        'deck-background': 'linear-gradient(to bottom, #002838, #7AD2AF)',
        'custom-gradient': 'linear-gradient(to right, rgba(78,106,99, 1), rgba(6,100,167, 1), rgba(16,0,224, 0.04), rgba(16,0,224, 0.04),rgba(6,100,167, 1), rgba(78,106,99, 1))',
      },
      textStroke: {
        DEFAULT: '2px #201F17', // Default stroke color and width
        thin: '1px black', // Thin stroke
        thick: '1px black', // Thick stroke
      },
      spacing: {
        'left-3.2': '3.2rem',
        '1.5': '4.5rem', 
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.text-stroke': {
          '-webkit-text-stroke': '1px black', // Default stroke
        },
        '.text-stroke-thin': {
          '-webkit-text-stroke': '1px black', // Thin stroke
        },
        '.text-stroke-thick': {
          '-webkit-text-stroke': '1px black', // Thick stroke
        },
      });
    },
  ],
};

export default config;
