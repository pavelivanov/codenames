import webpack from 'webpack'
import basePath from 'base-path'
import HtmlWebpackPlugin from 'html-webpack-plugin'

import rulesMap from './rules'


const globals = {
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
}

const rules = Object.keys(rulesMap)
  .map((k) => rulesMap[k])
  .map((rule) => Array.isArray(rule) ? rule : (rule.default || rule[process.env.NODE_ENV]))
  .reduce((result, rule) => result.concat(rule), [])

const webpackConfig = {
  mode: process.env.NODE_ENV,
  module: {
    rules,
  },
  resolve: {
    modules: [ 'local_modules', 'node_modules', 'app' ],
    extensions: [ '.js', '.ts', '.tsx', '.scss' ],
    plugins: [],
  },
  resolveLoader: {
    modules: [
      'node_modules',
      basePath('local_modules'),
    ],
  },
  plugins: [
    new webpack.DefinePlugin(globals),
    new HtmlWebpackPlugin({
      inject: true,
      filename: 'index.html',
      template: basePath('app/index.html'),
    }),
  ],
}


export default webpackConfig
