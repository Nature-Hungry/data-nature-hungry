/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Palette lifted from naturehungry.sg (Wild Singapore) for visual consistency.
      colors: {
        primary: { DEFAULT: "#aa002b", hover: "#CC0033" },
        accent: { DEFAULT: "#EF8354", hover: "#d9693d" },
        rose: "#CC6666",
        leaf: "#3d7a00",
        navy: { DEFAULT: "#336699", hover: "#264d73" },
        cream: "#fffbf6",
        surface: "#F5F5F0",
        line: "#DDDDCC",
        ink: "#484855",
        "ink-muted": "#666666",
        // Exact colors used in the naturehungry.sg "Nature.Hungry" wordmark.
        "logo-green": "#007319",
        "logo-orange": "#E36600",
      },
      fontFamily: {
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        heading: ["var(--font-heading)", "serif"],
      },
      borderRadius: {
        DEFAULT: "8px",
      },
    },
  },
  plugins: [],
};
