import MiniCssExtractPlugin from 'mini-css-extract-plugin'


export default ({ isClient }) => {
  const loaders = []

  if (isClient) {
    loaders.push(MiniCssExtractPlugin.loader)
  }

  loaders.push('css-loader')

  return [
    {
      test: /\.css$/,
      use: loaders,
    },
  ]
}
