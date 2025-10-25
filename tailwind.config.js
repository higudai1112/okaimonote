/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/views/**/*.{html,html.erb,erb,turbo_stream}",
    "./app/helpers/**/*.{rb}",
    "./app/javascript/**/*.{js,ts,jsx,tsx}",
    "./app/assets/stylesheets/**/*.{css,scss}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}