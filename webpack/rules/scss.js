import autoprefixer from 'autoprefixer'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import basePath from 'base-path'


const isDev           = process.env.NODE_ENV === 'development'
const onlyLocals      = process.env.WEBPACK === 'build.server'
const localIdentName  = isDev ? '[local]__[hash:base64:3]' : '[hash:base64:6]'
const loaders         = []

if (isDev) {
  loaders.push({
    loader: 'style-loader',
  })
}
else if (process.env.WEBPACK === 'build.client') {
  loaders.push(MiniCssExtractPlugin.loader)
}

loaders.push(
  {
    loader: 'css-loader',
    options: {
      sourceMap: !isDev,
      onlyLocals: onlyLocals,
      importLoaders: 2,
      modules: {
        context: __dirname,
        localIdentName,
      },
    },
  },
  {
    loader: 'postcss-loader',
    options: {
      plugins: () => [
        autoprefixer([
          'Android >= 4',
          'iOS >= 8',
          'Chrome >= 30',
          'Firefox >= 30',
          'Explorer >= 10',
          'Safari >= 8',
          'Opera >= 20',
        ]),
      ],
    },
  },
  {
    loader: 'sass-loader',
    options: {
      data: '@import "./scss/index";',
      includePaths: [
        basePath('site'),
      ],
    },
  }
)


export default [
  {
    test: /\.scss$/,
    use: loaders,
  },
]
