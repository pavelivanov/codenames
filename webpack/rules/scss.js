import path from 'path'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'


export default ({ isClient }) => {
  const isDev = process.env.NODE_ENV === 'development'
  const loaders = []

  let localIdentName = isDev ? '[local]_[hash:base64:4]' : '[hash:base64:6]'
  let exportOnlyLocals = !isClient

  if (isClient) {
    loaders.push({
      loader: MiniCssExtractPlugin.loader,
      options: {
        publicPath: process.env.ASSETS_PATH,
      },
    })
  }

  loaders.push(
    {
      loader: 'css-loader',
      options: {
        modules: {
          localIdentName,
          exportOnlyLocals,
        },
        importLoaders: 2,
        sourceMap: true,
      },
    },
    {
      loader: 'postcss-loader',
      options: {
        sourceMap: true,
      },
    },
    {
      loader: 'sass-loader',
      options: {
        additionalData: '@import "scss/index";',
        sassOptions: {
          includePaths: [
            path.resolve('src'),
          ],
        },
        sourceMap: true,
      },
    }
  )

  return [
    {
      test: /\.scss$/,
      use: loaders,
    },
  ]
}

