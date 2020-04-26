import MiniCssExtractPlugin from 'mini-css-extract-plugin'


const loaders = []

if (process.env.WEBPACK === 'build.client') {
  loaders.push(MiniCssExtractPlugin.loader)
}

loaders.push(
  'style-loader',
  'css-loader',
)


export default [
  {
    test: /\.css$/,
    use: loaders,
  },
]
