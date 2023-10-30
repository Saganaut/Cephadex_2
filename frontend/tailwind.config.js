/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,jsx,ts,tsx}',
    './src/components/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      extend: {
        display: ['responsive'],
      },
      colors: {
        'dark-color': {
          DEFAULT: '#1A004E',
        },
        'light-color': {
          DEFAULT: '#FFFFFF',
        },
        'color-1': {
          DEFAULT: '#13002A',
        },
        'color-2': {
          DEFAULT: '#10003B',
        },
        'electric-violet': {
          DEFAULT: '#6019FF',
          50: '#DFD1FF',
          100: '#D1BCFF',
          200: '#B593FF',
          300: '#986BFF',
          400: '#7C42FF',
          500: '#6019FF',
          600: '#4500E0',
          700: '#3400A8',
          800: '#220070',
          900: '#110038',
          950: '#09001C'
        },
        'blaze-orange': {  
          DEFAULT: '#FF6700',  
          50: '#FFD4B8',  
          100: '#FFC8A3',  
          200: '#FFB07A',  
          300: '#FF9852',  
          400: '#FF7F29',  
          500: '#FF6700',  
          600: '#C75000',  
          700: '#8F3A00', 
          800: '#572300',  
          900: '#1F0C00',  
          950: '#030100'
        }, 
        'mariana-blue': {  
          DEFAULT: '#27007D',  
          50: '#7436FF',  
          100: '#6621FF',  
          200: '#4D00F7',  
          300: '#4000CF',  
          400: '#3400A6',  
          500: '#27007D',  
          600: '#150045',  
          700: '#04000D',  
          800: '#000000',  
          900: '#000000',  
          950: '#000000'},
    
        'tolopea': {
          DEFAULT: '#10003B',
          50: '#4200F3',
          100: '#3C00DE',
          200: '#3100B5',
          300: '#26008D',
          400: '#1B0064',
          500: '#10003B',
          600: '#010003',
          700: '#000000',
          800: '#000000',
          900: '#000000',
          950: '#000000'
        },
        'aquamarine': {
          DEFAULT: '#54FFF1',
          50: '#FFFFFF',
          100: '#F7FFFE',
          200: '#CEFFFB',
          300: '#A6FFF8',
          400: '#7DFFF4',
          500: '#54FFF1',
          600: '#1CFFEC',
          700: '#00E3D0',
          800: '#00AB9D',
          900: '#007369',
          950: '#00574F'
        },
        'seashell-white': {
          DEFAULT: '#FFFFFF',
          50: '#FFFFFF',
          100: '#FFFFFF',
          200: '#FFFFFF',
          300: '#FFFFFF',
          400: '#FFFFFF',
          500: '#FFFFFF',
          600: '#E3E3E3',
          700: '#C7C7C7',
          800: '#ABABAB',
          900: '#8F8F8F',
          950: '#818181'
        },
  },
},
  plugins: [],
}
}
