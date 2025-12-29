module.exports = {
  content: [
    "./index.html",
    "./pages/**/*.html",
    "./src/components/**/*.html",
    "./src/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          500: "#6366F1",
          600: "#4F46E5"
        }
      }
    }
  },
  darkMode: "class",
  plugins: []
};
