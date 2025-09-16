import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colores corporativos Grupo SHVC
        'primary-dark': '#164E80',    // Azul oscuro institucional
        'primary': '#2C71B8',         // Azul medio
        'primary-light': '#B3CCE6',   // Azul claro
        'accent-blue': '#1E64A2',     // Azul intermedio
        'text-main': '#2D2D2D',       // Gris oscuro
        'neutral-light': '#D6DCE5',   // Gris medio
        'white': '#FFFFFF',           // Blanco
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};

export default config; 