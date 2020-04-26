require('@babel/register')({
  presets: [ '@babel/preset-env' ],
  ignore: [ /build\//, /node_modules\// ],
  extensions: [ '.tsx', '.ts', '.jsx', '.js' ],
})
