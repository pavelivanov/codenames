require('@babel/register')({
  presets: [
    '@babel/preset-env',
    '@babel/preset-typescript',
  ],
  ignore: [ /node_modules/ ],
  extensions: [ '.ts', '.jsx', '.js' ],
})

require('./server')
