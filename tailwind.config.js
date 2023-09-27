const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors")

module.exports = {
  content: ["./public/**/*.{html,css,js}"],
  theme: {
    extend: {
      colors: {
        primary: colors.blue,
        secondary: colors.pink,
      },
      fontSize : {
         tiny : ['10pt','1']
      },
      fontFamily: {
        sans: ["Orbitron",...defaultTheme.fontFamily.sans],
        body: ["IBM Plex Sans"]
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
  darkMode: "class",
};