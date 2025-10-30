/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/views/**/*.{html,html.erb,erb,turbo_stream}",
    "./app/helpers/**/*.rb",
    "./app/javascript/**/*.{js,ts,jsx,tsx}",
    "./app/assets/stylesheets/**/*.{css,scss}"
  ],
  theme: {
    extend: {
      colors: {
        base: "#FFF9F3",  //背景色
        brand: "#F97316",  //メインオレンジ
      },
      boxShadow: {
        card: "0 4px 8px rgba(0, 0, 0, 0.05)",  //柔らかめの影
      },
    },
  },
  plugins: [],
}