import basePath from 'base-path'

import webpackConfig from './default'


webpackConfig.target = 'web'
webpackConfig.devtool = 'cheap-module-source-map'

webpackConfig.entry = {
  client: basePath('app/dev'),
}

webpackConfig.output = {
  path: basePath('build'),
  filename: '[name].js',
  chunkFilename: '[id].chunk.js',
  publicPath: '/',
}

webpackConfig.devServer = {
  publicPath: '/',
  stats: 'errors-only',
  noInfo: true,
  lazy: false,
}


export default webpackConfig
