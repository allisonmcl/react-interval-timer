module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    colors: {
      'green': 'rgb(22,140,111)',
      'darkGreen': 'rgb(0,59,44)',
      'black': 'rgb(0,0,0)',
      'white': 'rgb(255,255,255)',
      'transparentGreen': 'rgba(0,59,44, 0.3)',
    },
    extend: {
      transitionProperty: {
        'width': 'width',
      }
    }
  },
  plugins: [],
}
