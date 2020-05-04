import webpack from 'webpack'
import basePath from 'base-path'
import nodeExternals from 'webpack-node-externals'

import webpackConfig from './default'


webpackConfig.target = 'node'
webpackConfig.devtool = 'none'

webpackConfig.entry = {
  'server': basePath('site/server'),
}

webpackConfig.output = {
  path: basePath('build'),
  filename: 'js/[name].js',
  publicPath: '/assets/',
  libraryTarget: 'commonjs2',
}

webpackConfig.resolve.alias['socket'] = basePath('site/socket/server')

webpackConfig.externals = [
  nodeExternals(),
  'react-helmet',
]

webpackConfig.plugins.push(
  new webpack.optimize.LimitChunkCountPlugin({
    maxChunks: 1,
  }),
)


export default webpackConfig
