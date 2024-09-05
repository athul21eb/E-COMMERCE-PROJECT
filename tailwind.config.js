/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Open Sans', 'Helvetica', 'Arial', 'sans-serif'], // Poppins as default with fallbacks
      },
    },
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem", // Default for mobile
        sm: "2rem",      // Small screens
        lg: "4rem",      // Large screens
        xl: "5rem",      // Extra-large screens
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.hide-scrollbar': {
          /* Hide scrollbar for WebKit browsers */
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          /* Hide scrollbar for IE, Edge, and Firefox */
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
        },
      });
    },
  ],
};
