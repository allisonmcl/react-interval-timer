module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    colors: {
      'green': 'rgb(45 246 181)',
      'darkGreen': 'rgb(0,59,44)',
      'black': 'rgb(0,0,0)',
      'white': 'rgb(255,255,255)',
      'transparentGreen': 'rgba(0,59,44, 0.3)',
      
    },
    backgroundSize: {
      sizelines: '100% 2em',
    },
    extend: {
      transitionProperty: {
        'width': 'width',
      },
      backgroundImage: {
        'lines': 'linear-gradient(180deg, rgba(255,255,255,0) 98%, rgba(9,9,121,1) 99%)'
      }
    }
  },
  plugins: [],
}
