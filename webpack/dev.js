import HtmlWebpackPlugin from 'html-webpack-plugin'
import basePath from 'base-path'

import webpackConfig from './default'


webpackConfig.target = 'web'
webpackConfig.devtool = 'cheap-module-source-map'

webpackConfig.entry = {
  client: basePath('site/dev'),
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

webpackConfig.plugins.push(
  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: basePath('site/index.html'),
    inject: 'body',
  }),
)


export default webpackConfig
